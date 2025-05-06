// app/employee/performance/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Bell, Calendar, Home, FileText, BarChart, Settings, User, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import MetricService, { Metric, MetricSubmission } from "../../services/metric.service";

export default function PerformanceDataPage() {
  const [activeTab, setActiveTab] = useState("performance");
  const { user, logout } = useAuth();
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [metricValues, setMetricValues] = useState<{ [key: number]: any }>({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const performanceMetrics = await MetricService.getPerformanceMetrics();
        setMetrics(performanceMetrics);
        
        // Initialize metric values
        const initialValues: { [key: number]: any } = {};
        performanceMetrics.forEach(metric => {
          initialValues[metric.id] = null;
        });
        setMetricValues(initialValues);
        
        setLoading(false);
      } catch (error) {
        console.error("Failed to load metrics:", error);
        setMessage({ type: 'error', text: 'Failed to load performance metrics' });
        setLoading(false);
      }
    };

    loadMetrics();
  }, []);

  const handleMetricChange = (metricId: number, value: any) => {
    setMetricValues(prev => ({
      ...prev,
      [metricId]: value
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // Create submission array
      const metricsToSubmit: MetricSubmission[] = [];
      
      for (const [metricId, value] of Object.entries(metricValues)) {
        if (value !== null && value !== '') {
          const metric = metrics.find(m => m.id === parseInt(metricId));
          
          // Skip if no value entered
          if (!value) continue;
          
          const submission: MetricSubmission = {
            metric_id: parseInt(metricId)
          };
          
          // Determine whether to use numeric or text value
          if (typeof value === 'number' || !isNaN(Number(value))) {
            submission.value_numeric = Number(value);
          } else {
            submission.value_text = value;
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
      
      setMessage({ type: 'success', text: 'Performance metrics submitted successfully' });
      
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

  return (
    <ProtectedRoute requiredRole="EMPLOYEE">
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold text-teal-600">EmpWell System</h2>
            <p className="text-sm text-gray-500">Employee Portal</p>
          </div>
          <nav className="p-4 space-y-1">
            <Link 
              href="/employee/dashboard" 
              className={`flex items-center gap-3 px-4 py-3 rounded-md ${activeTab === 'overview' ? 'bg-teal-50 text-teal-600' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('overview')}
            >
              <Home size={18} />
              <span>Overview</span>
            </Link>
            <Link 
              href="/employee/profile" 
              className={`flex items-center gap-3 px-4 py-3 rounded-md ${activeTab === 'profile' ? 'bg-teal-50 text-teal-600' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={18} />
              <span>My Profile</span>
            </Link>
            <Link 
              href="/employee/performance" 
              className={`flex items-center gap-3 px-4 py-3 rounded-md ${activeTab === 'performance' ? 'bg-teal-50 text-teal-600' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('performance')}
            >
              <BarChart size={18} />
              <span>Performance Data</span>
            </Link>
            <Link 
              href="/employee/wellness" 
              className={`flex items-center gap-3 px-4 py-3 rounded-md ${activeTab === 'wellness' ? 'bg-teal-50 text-teal-600' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('wellness')}
            >
              <FileText size={18} />
              <span>Wellness Tracking</span>
            </Link>
            <Link 
              href="/employee/calendar" 
              className={`flex items-center gap-3 px-4 py-3 rounded-md ${activeTab === 'calendar' ? 'bg-teal-50 text-teal-600' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('calendar')}
            >
              <Calendar size={18} />
              <span>Calendar</span>
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">Performance Data</h1>
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
              <h2 className="text-2xl font-bold mb-2">Submit Performance Data</h2>
              <p className="text-gray-600">Track your daily performance metrics</p>
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
                  <p className="text-gray-500">No performance metrics available for your role.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-medium mb-4">Performance Metrics</h3>
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
                            <input
                              type="text"
                              id={`metric-${metric.id}`}
                              value={metricValues[metric.id] ?? ''}
                              onChange={(e) => handleMetricChange(metric.id, e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md"
                              placeholder={metric.unit || 'Enter value'}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Submit Performance Data'}
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
