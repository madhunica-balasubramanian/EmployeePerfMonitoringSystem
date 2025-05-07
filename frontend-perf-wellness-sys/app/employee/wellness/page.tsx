// app/employee/wellness/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Bell, Calendar, Home, FileText, BarChart, Settings, User, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import MetricService, { Metric, MetricSubmission } from "../../services/metric.service";
import EmployeeSidebar from "../../components/EmployeeSidebar";
import { DROPDOWN_OPTIONS, CHECKBOX_METRICS, RADIO_METRICS, RADIO_OPTIONS, CHECKBOX_OPTIONS, NUMERIC_METRICS } from "../../services/metricUtils";

const TEXT_INPUT_METRICS = [""];

export default function WellnessDataPage() {
  const [activeTab, setActiveTab] = useState("wellness");
  const { user, logout } = useAuth();
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [metricValues, setMetricValues] = useState<{ [key: number]: any }>({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const wellnessMetrics = await MetricService.getWellnessMetrics();
        setMetrics(wellnessMetrics);
        
        // Initialize metric values
        const initialValues: { [key: number]: any } = {};
        wellnessMetrics.forEach(metric => {
          initialValues[metric.id] = null;
        });
        setMetricValues(initialValues);
        
        setLoading(false);
      } catch (error) {
        console.error("Failed to load metrics:", error);
        setMessage({ type: 'error', text: 'Failed to load wellness metrics' });
        setLoading(false);
      }
    };

    loadMetrics();
  }, []);

  const getInputType = (metric: Metric) => {
    // Determine input type based on metric properties
    const metricName = metric.metric_name.toLowerCase();

    console.log("trying to match metric name to input type ",metricName);
    console.log("All dropdown options:", DROPDOWN_OPTIONS);
    console.log ("All checkbox options", CHECKBOX_METRICS);
    console.log ("All radio options", RADIO_METRICS);
    // If it's in the dropdown options map
    if (Object.keys(DROPDOWN_OPTIONS).some(key => {
      const match = metricName.includes(key);
      console.log(`[MATCH CHECK] metricName: "${metricName}" | key: "${key}" → ${match}`);
      return match;
    })) {
      console.log("✅ Matched a dropdown option for:", metricName);
      return "dropdown";
    }
    // Checkbox
    if (CHECKBOX_METRICS.some(name => metricName.includes(name.toLowerCase()))) {
      console.log(`[TYPE DETECT] "${metricName}" → checkbox`);
      return 'checkbox';
    }
     // Radio
    if (RADIO_METRICS.some(name => metricName.includes(name.toLowerCase()))) {
      console.log(`[TYPE DETECT] "${metricName}" → radio`);
      return 'radio';
    }

    // Text input
    if (TEXT_INPUT_METRICS.some(name => metricName.includes(name.toLowerCase()))) {
      console.log(`[TYPE DETECT] "${metricName}" → text`);
      return 'text';
    }

    
    // If it's numeric
    if (NUMERIC_METRICS.some(name => metricName.includes(name)) || 
        (metric.unit && ['%', 'hours', 'ml', 'kg', 'steps'].some(unit => metric.unit?.includes(unit)))) {
      return "number";
    }
    
    // Default to text
    // Fallback to number input
  console.log(`[TYPE DETECT] "${metricName}" → number (default)`);
    return 'number';
    //return "text";
  };
  
  const getDropdownOptions = (metric: Metric) => {
    const metricName = metric.metric_name.toLowerCase();
    
    // Find the matching dropdown options
    for (const [key, options] of Object.entries(DROPDOWN_OPTIONS)) {
      if (metricName.includes(key)) {
        return options;
      }
    }
    
    return [];
  };

  const getRadioOptions = (metric: Metric): string[] => {
    const metricName = metric.metric_name.toLowerCase();
  
    for (const [key, options] of Object.entries(RADIO_OPTIONS)) {
      if (metricName.includes(key.toLowerCase())) {
        return options;
      }
    }
  
    return [];
  };

  const getCheckboxOptions = (metric: Metric): string[] => {
    const metricName = metric.metric_name.toLowerCase();
  
    for (const [key, options] of Object.entries(CHECKBOX_OPTIONS)) {
      if (metricName.includes(key.toLowerCase())) {
        return options;
      }
    }
  
    return [];
  };
  

  const handleMetricChange = (metricId: number, value: any) => {
    // Clear error for this metric
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[metricId];
      return newErrors;
    });
    
    setMetricValues(prev => ({
      ...prev,
      [metricId]: value
    }));
  };
  
  const validateForm = () => {
    const newErrors: { [key: number]: string } = {};
    let isValid = true;
    
    metrics.forEach(metric => {
      const value = metricValues[metric.id];
      const inputType = getInputType(metric);
      
      // Skip validation for empty optional fields
      if (value === null || value === "") {
        return;
      }
      
      if (inputType === "number") {
        if (isNaN(Number(value))) {
          newErrors[metric.id] = "Please enter a valid number";
          isValid = false;
        } else if (metric.metric_name.toLowerCase().includes("sleep_hours") && (Number(value) < 0 || Number(value) > 24)) {
          newErrors[metric.id] = "Sleep hours must be between 0 and 24";
          isValid = false;
        }
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Please fix the errors in the form' });
      return;
    }
    
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // Create submission array
      const metricsToSubmit: MetricSubmission[] = [];
      
      for (const [metricId, value] of Object.entries(metricValues)) {
        if (value !== null && value !== '') {
          const metric = metrics.find(m => m.id === parseInt(metricId));
          const inputType = metric ? getInputType(metric) : "text";
          
          // Skip if no value entered
          if (!value) continue;
          
          const submission: MetricSubmission = {
            metric_id: parseInt(metricId)
          };
          
          // Handle different input types
          if (inputType === "checkbox") {
            submission.value_numeric = value === true ? 1 : 0;
          } else if (inputType === "number") {
            submission.value_numeric = Number(value);
          } else {
            submission.value_text = String(value);
          }
          
          metricsToSubmit.push(submission);
        }
      }
      
      if (metricsToSubmit.length === 0) {
        setMessage({ type: 'error', text: 'Please enter at least one metric value' });
        setSubmitting(false);
        return;
      }
      
      // Submit metrics
      await MetricService.submitMetrics({
        date,
        metrics: metricsToSubmit
      });
      
      setMessage({ type: 'success', text: 'Wellness metrics submitted successfully' });
      
      // Reset form
      const resetValues: { [key: number]: any } = {};
      metrics.forEach(metric => {
        resetValues[metric.id] = null;
      });
      setMetricValues(resetValues);
      
    } catch (error) {
      console.error("Failed to submit metrics:", error);
      setMessage({ type: 'error', text: 'Failed to submit metrics. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const renderInput = (metric: Metric) => {
    const inputType = getInputType(metric); // e.g., "dropdown", "checkbox", "radio", etc.
    const metricId = metric.id;
    const value = metricValues[metricId];
    const error = errors[metricId];
  
    switch (inputType) {
      case "dropdown": {
        const options = getDropdownOptions(metric);
        return (
          <div>
            <select
              id={`metric-${metricId}`}
              value={value || ""}
              onChange={(e) => handleMetricChange(metricId, e.target.value)}
              className={`w-full p-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select...</option>
              {options.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );
      }
  
      case "checkbox": {
        const options = getCheckboxOptions(metric);
        if (options.length > 0) {
          // Multi-checkbox group
          return (
            <div className="space-y-2">
              {options.map((option, index) => (
                <label key={index} className="flex items-center space-x-2 text-gray-700">
                  <input
                    type="checkbox"
                    checked={Array.isArray(value) ? value.includes(option) : false}
                    onChange={(e) => {
                      const newValue = Array.isArray(value) ? [...value] : [];
                      if (e.target.checked) {
                        newValue.push(option);
                      } else {
                        const i = newValue.indexOf(option);
                        if (i > -1) newValue.splice(i, 1);
                      }
                      handleMetricChange(metricId, newValue);
                    }}
                    className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <span>{option}</span>
                </label>
              ))}
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
          );
        } else {
          // Single boolean checkbox
          return (
            <div className="flex items-center">
              <input
                type="checkbox"
                id={`metric-${metricId}`}
                checked={value === true}
                onChange={(e) => handleMetricChange(metricId, e.target.checked)}
                className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <label htmlFor={`metric-${metricId}`} className="ml-2 text-gray-700">
                {value === true ? 'Yes' : 'No'}
              </label>
            </div>
          );
        }
      }
  
      case "radio": {
        const options = getRadioOptions(metric);
        return (
          <div className="space-y-2">
            {options.map((option, index) => (
              <label key={index} className="flex items-center space-x-2 text-gray-700">
                <input
                  type="radio"
                  name={`metric-${metricId}`}
                  value={option}
                  checked={value === option}
                  onChange={() => handleMetricChange(metricId, option)}
                  className="w-5 h-5 text-teal-600 border-gray-300 focus:ring-teal-500"
                />
                <span>{option}</span>
              </label>
            ))}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );
      }
  
      case "number":
        return (
          <div>
            <input
              type="number"
              id={`metric-${metricId}`}
              value={value || ""}
              onChange={(e) => handleMetricChange(metricId, e.target.value)}
              className={`w-full p-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
              placeholder={metric.unit || 'Enter number'}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );
  
      case "text":
      default:
        return (
          <div>
            <input
              type="text"
              id={`metric-${metricId}`}
              value={value || ""}
              onChange={(e) => handleMetricChange(metricId, e.target.value)}
              className={`w-full p-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
              placeholder={metric.unit || 'Enter value'}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );
    }
  };
  

  return (
    <ProtectedRoute requiredRole="EMPLOYEE">
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold text-teal-600">EmpWell System</h2>
            <p className="text-sm text-gray-500">Employee Portal</p>
          </div>
          <EmployeeSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">Wellness Tracking</h1>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="text-teal-700 font-medium">
                    {user?.first_name?.[0]}{user?.last_name?.[0]}
                  </span>
                </div>
                <span className="font-medium">{user?.first_name} {user?.last_name}</span>
              </div>
              <button 
                onClick={logout}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <Settings size={20} />
              </button>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Submit Wellness Data</h2>
              <p className="text-gray-600">Track your daily wellness metrics to monitor your health and wellbeing</p>
            </div>

            {message.text && (
              <div className={`mb-6 p-4 rounded-lg ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                <div className="flex items-center gap-2">
                  {message.type === 'error' ? (
                    <AlertCircle size={20} />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  )}
                  <span>{message.text}</span>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="mb-6">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full md:w-64 p-2 border border-gray-300 rounded-md"
                />
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                </div>
              ) : metrics.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No wellness metrics available for your role.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-medium mb-4">Wellness Metrics</h3>
                  <div className="space-y-6">
                    {metrics.map(metric => (
                      <div key={metric.id} className="border-b pb-4">
                        <div className="flex flex-wrap justify-between items-start mb-2">
                          <div className="mb-2 md:mb-0">
                            <label htmlFor={`metric-${metric.id}`} className="block font-medium">
                              {metric.metric_name}
                            </label>
                            <p className="text-sm text-gray-500">
                              {metric.metric_description || `Enter value ${metric.unit ? `in ${metric.unit}` : ''}`}
                            </p>
                          </div>
                          <div className="w-full md:w-1/3">
                            {renderInput(metric)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Submit Wellness Data'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}