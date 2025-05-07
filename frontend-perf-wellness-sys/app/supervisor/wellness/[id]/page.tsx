"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Heart,
  Activity,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import apiService from "../../../services/api.service";
import {
  mapTextToNumericValue,
  getMetricType,
  dropdownValueMappings,
  radioValueMappings,
  checkboxValueMappings
} from "../../../services/metricUtils";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  employee_id: string;
}

interface WellnessMetric {
  metric_name: string;
  metric_type: string;
  value_numeric: number | null;
  value_text: string | null;
  recorded_at: string;
}

interface MetricDataPoint {
  date: string;
  value: number | null;
  originalText: string | null;
}

interface ApiResponse {
  wellness_metrics: WellnessMetric[];
  employee_id?: string;
  full_name?: string;
}

export default function EmployeeWellnessPage() {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [wellnessData, setWellnessData] = useState<Record<string, MetricDataPoint[]>>({});
  const [metricNames, setMetricNames] = useState<string[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [textValueMapping, setTextValueMapping] = useState<Record<string, Record<string, number>>>({});
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch the employee details
        const employeeResponse = await apiService.get(`/users/employees/${id}`);
        setEmployee(employeeResponse);
        
        // Fetch the employee's wellness metrics
         // Fetch the employee's wellness metrics
         const metricsResponse = await apiService.get(`/metric-records/employee/search-by-id/${id}`);
        
        //const metricsResponse = await apiService.get<ApiResponse>(`/metric-records/employee/search-by-id/${id}`);
        
        // Process the metrics data
        const { processedData, uniqueMetricNames, mappings } = processMetricsData(metricsResponse);
        
        setWellnessData(processedData);
        setMetricNames(uniqueMetricNames);
        setTextValueMapping(mappings);
        
        // Set the first metric as selected by default
        if (uniqueMetricNames.length > 0 && !selectedMetric) {
          setSelectedMetric(uniqueMetricNames[0]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load employee wellness data');
        setLoading(false);
      }
    }
    
    if (id) {
      fetchData();
    }
  }, [id, selectedMetric]);
  
  const processMetricsData = (data: ApiResponse): { 
    processedData: Record<string, MetricDataPoint[]>;
    uniqueMetricNames: string[];
    mappings: Record<string, Record<string, number>>;
  } => {
    if (!data || !data.wellness_metrics || !Array.isArray(data.wellness_metrics)) {
      console.log("No wellness data returned");
      return { 
        processedData: {}, 
        uniqueMetricNames: [], 
        mappings: {} 
      };
    }
    
    // Extract all unique metric names
    const uniqueMetricNames = data.wellness_metrics
      .map(m => m.metric_name)
      .filter((name): name is string => typeof name === 'string');
    
    // Remove duplicates
    const distinctMetricNames = [...new Set(uniqueMetricNames)];
    
    // Create mappings for text-based metrics
    const mappings: Record<string, Record<string, number>> = {};
    
    for (const metricName of distinctMetricNames) {
      const textBasedMetrics = data.wellness_metrics.filter(
        m => m.metric_name === metricName && m.value_text !== null && m.value_text !== ''
      );
      
      if (textBasedMetrics.length > 0) {
        // Create a mapping object for this metric
        const metricMapping: Record<string, number> = {};
        
        // Get unique text values for this metric
        const uniqueTextValues = textBasedMetrics
          .map(m => m.value_text)
          .filter((value): value is string => value !== null);
        
        // Remove duplicates
        const distinctTextValues = [...new Set(uniqueTextValues)];
        
        // Try to find existing mappings from our utility functions
        for (const textValue of distinctTextValues) {
          try {
            // First check if we have a predefined mapping
            const metricType = getMetricType(metricName);
            let found = false;
            
            if (metricType === 'dropdown') {
              // Look for a matching dropdown mapping
              for (const key of Object.keys(dropdownValueMappings)) {
                if (metricName.toLowerCase().includes(key.toLowerCase()) && 
                    dropdownValueMappings[key][textValue] !== undefined) {
                  metricMapping[textValue] = dropdownValueMappings[key][textValue];
                  found = true;
                  break;
                }
              }
            }
            
            if (!found && metricType === 'radio') {
              // Look for a matching radio mapping
              for (const key of Object.keys(radioValueMappings)) {
                if (metricName.toLowerCase().includes(key.toLowerCase()) && 
                    radioValueMappings[key][textValue] !== undefined) {
                  metricMapping[textValue] = radioValueMappings[key][textValue];
                  found = true;
                  break;
                }
              }
            }
            
            if (!found && metricType === 'checkbox') {
              // Look for a matching checkbox mapping
              for (const key of Object.keys(checkboxValueMappings)) {
                if (metricName.toLowerCase().includes(key.toLowerCase()) && 
                    checkboxValueMappings[key][textValue] !== undefined) {
                  metricMapping[textValue] = checkboxValueMappings[key][textValue];
                  found = true;
                  break;
                }
              }
            }
            
            // If we still haven't found a mapping, use the utility function
            if (!found) {
              try {
                const mappedValue = mapTextToNumericValue(metricName, textValue);
                if (mappedValue !== 0) {
                  metricMapping[textValue] = mappedValue;
                  found = true;
                }
              } catch (e) {
                // Ignore errors from the mapping function
              }
            }
            
            // If no mapping found and the text looks like a number, use that
            if (!found && !isNaN(parseFloat(textValue))) {
              metricMapping[textValue] = parseFloat(textValue);
              found = true;
            }
            
            // If still no mapping found, create a sequential one
            if (!found) {
              // For unmapped values, use a generic scale (higher = better by default)
              if (textValue.toLowerCase().includes('none')) {
                metricMapping[textValue] = 5;
              } else if (textValue.toLowerCase().includes('minor')) {
                metricMapping[textValue] = 3;
              } else if (textValue.toLowerCase().includes('major') || textValue.toLowerCase().includes('severe')) {
                metricMapping[textValue] = 1;
              } else {
                // Last resort, just assign sequential values
                const sortedValues = [...distinctTextValues].sort();
                const index = sortedValues.indexOf(textValue);
                if (index !== -1) {
                  metricMapping[textValue] = sortedValues.length - index;
                }
              }
            }
          } catch (error) {
            console.error(`Error mapping value for ${metricName}:`, error);
          }
        }
        
        if (Object.keys(metricMapping).length > 0) {
          mappings[metricName] = metricMapping;
        }
      }
    }
    
    // Group metrics by name
    const groupedData: Record<string, MetricDataPoint[]> = {};
    
    for (const metricName of distinctMetricNames) {
      groupedData[metricName] = [];
      
      // Get all metrics for this metric name
      const metricsForName = data.wellness_metrics.filter(m => m.metric_name === metricName);
      
      // Get all unique dates for this metric
      const dates = metricsForName
        .map(m => m.recorded_at)
        .filter((date): date is string => date !== null);
      
      // Remove duplicates and sort chronologically
      const distinctDates = [...new Set(dates)].sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      );
      
      // For each date, create a data point
      for (const date of distinctDates) {
        const metric = metricsForName.find(m => m.recorded_at === date);
        
        if (metric) {
          const formattedDate = new Date(date).toLocaleDateString();
          let value = metric.value_numeric;
          
          // If this is a text-based metric, use the mapping
          if (metric.value_text && metric.value_text !== '') {
            if (mappings[metricName] && mappings[metricName][metric.value_text] !== undefined) {
              value = mappings[metricName][metric.value_text];
            } else if (!isNaN(parseFloat(metric.value_text))) {
              value = parseFloat(metric.value_text);
            }
          }
          
          groupedData[metricName].push({
            date: formattedDate,
            value: value,
            originalText: metric.value_text
          });
        }
      }
    }
    
    return {
      processedData: groupedData,
      uniqueMetricNames: distinctMetricNames,
      mappings
    };
  };

  const handleMetricChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMetric(event.target.value);
  };

  // Helper function to get color for status indicators
  const getStatusColor = (value: number | null, metricName = ''): string => {
    if (value === null) return 'bg-gray-100 text-gray-800';
    
    const name = metricName.toLowerCase();
    
    // For injury/stress related metrics (where lower is better)
    if (name.includes('injury') || name.includes('stress') || name.includes('strain')) {
      if (value <= 1) return 'bg-red-100 text-red-800';     // Severe/High - Bad
      if (value <= 2) return 'bg-yellow-100 text-yellow-800'; // Moderate/Medium
      if (value <= 3) return 'bg-blue-100 text-blue-800';   // Minor/Low
      return 'bg-green-100 text-green-800';                 // None - Good
    }
    
    // For satisfaction/wellness metrics (where higher is better)
    if (value >= 4) return 'bg-green-100 text-green-800';  // Very Good
    if (value >= 3) return 'bg-blue-100 text-blue-800';    // Good
    if (value >= 2) return 'bg-yellow-100 text-yellow-800'; // Fair
    return 'bg-red-100 text-red-800';                      // Poor
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-teal-500 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wellness data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">!</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href={`/supervisor/${id}/employee`}
            className="inline-block px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 mr-2"
          >
            Back to Employee Profile
          </Link>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="text-yellow-500 text-5xl mb-4">?</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Employee Not Found</h1>
          <p className="text-gray-600 mb-4">Could not find employee with ID: {id}</p>
          <Link
            href="/supervisor/dashboard"
            className="inline-block px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Get the data for the selected metric
  const selectedMetricData = selectedMetric ? wellnessData[selectedMetric] || [] : [];
  
  // Check if this is a text-based metric
  const isTextBased = selectedMetric && 
    textValueMapping[selectedMetric] && 
    Object.keys(textValueMapping[selectedMetric]).length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Heart className="mr-2 text-pink-500" /> 
                Wellness Dashboard
              </h1>
              <p className="text-gray-600">
                {employee.first_name} {employee.last_name} • {employee.employee_id}
              </p>
            </div>
            <Link
              href={`/supervisor/${id}/employee`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-teal-700 bg-teal-100 hover:bg-teal-200"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Profile
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {metricNames.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Wellness Data</h2>
            <p className="text-gray-600 mb-4">
              There are no wellness metrics recorded for this employee yet.
            </p>
          </div>
        ) : (
          <>
            {/* Metric selector */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-lg font-semibold text-gray-900">Wellness Metrics</h2>
                  <p className="text-sm text-gray-500">
                    Select a metric to view detailed wellness data
                  </p>
                </div>
                <div className="w-full md:w-64">
                  <select
                    value={selectedMetric || ''}
                    onChange={handleMetricChange}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                  >
                    {metricNames.map((name, index) => (
                      <option key={index} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Current value card */}
            {selectedMetric && selectedMetricData.length > 0 && (
              <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-gray-500 text-sm font-medium truncate mb-1">
                    Current {selectedMetric}
                  </h3>
                  
                  {/* Show the latest value */}
                  {(() => {
                    const latestData = selectedMetricData[selectedMetricData.length - 1];
                    
                    if (isTextBased && latestData.originalText) {
                      // For text-based metrics, show the original text value
                      return (
                        <div className="mt-2">
                          <p className="text-2xl font-semibold text-gray-900">
                            {latestData.originalText}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Recorded on {latestData.date}
                          </p>
                        </div>
                      );
                    } else {
                      // For numeric metrics, show the value
                      return (
                        <div className="mt-2">
                          <p className="text-2xl font-semibold text-gray-900">
                            {latestData.value !== null ? latestData.value.toFixed(1) : 'N/A'}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Recorded on {latestData.date}
                          </p>
                        </div>
                      );
                    }
                  })()}
                </div>
                
                {/* Trend card */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-gray-500 text-sm font-medium truncate mb-1">
                    Trend
                  </h3>
                  
                  {(() => {
                    if (selectedMetricData.length < 2) {
                      return (
                        <div className="mt-2">
                          <p className="text-gray-600">Not enough data to show trend</p>
                        </div>
                      );
                    }
                    
                    const latestValue = selectedMetricData[selectedMetricData.length - 1].value;
                    const previousValue = selectedMetricData[selectedMetricData.length - 2].value;
                    
                    let trend = 0;
                    if (latestValue !== null && previousValue !== null && previousValue !== 0) {
                      trend = ((latestValue - previousValue) / Math.abs(previousValue)) * 100;
                    }
                    
                    return (
                      <div className="mt-2 flex items-center">
                        {trend === 0 ? (
                          <span className="text-gray-600">No change</span>
                        ) : (
                          <>
                            {trend > 0 ? (
                              <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                            ) : (
                              <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
                            )}
                            <span 
                              className={trend > 0 ? 'text-green-600' : 'text-red-600'}
                            >
                              {Math.abs(trend).toFixed(1)}% {trend > 0 ? 'increase' : 'decrease'}
                            </span>
                          </>
                        )}
                      </div>
                    );
                  })()}
                </div>
                
                {/* Legend for text-based metrics */}
                {isTextBased && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-gray-500 text-sm font-medium truncate mb-1">
                      Value Scale
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-2">
                        These values are used for chart visualization:
                      </p>
                      <div className="space-y-1">
                        {Object.entries(textValueMapping[selectedMetric] || {}).map(([text, value], idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <span className="text-sm">{text}</span>
                            <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium">
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Wellness chart */}
            {selectedMetric && selectedMetricData.length > 0 && (
              <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedMetric} Over Time
                  </h2>
                  <p className="text-sm text-gray-500">
                    Historical wellness tracking
                  </p>
                </div>
                <div className="p-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={selectedMetricData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={isTextBased ? [0, 5] : undefined} />
                        <Tooltip 
                          formatter={(value) => {
                            if (isTextBased && selectedMetric && typeof value === 'number') {
                              // Try to find the original text value
                              const originalText = Object.entries(textValueMapping[selectedMetric] || {})
                                .find(([_, v]) => v === value)?.[0];
                              return originalText || value;
                            }
                            return value;
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="value"
                          name={selectedMetric || ''}
                          stroke="#10B981"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* History table */}
            {selectedMetric && selectedMetricData.length > 0 && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Historical Data</h2>
                  <p className="text-sm text-gray-500">
                    Complete history of {selectedMetric} recordings
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {selectedMetric}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedMetricData.slice().reverse().map((data, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {data.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {isTextBased && data.originalText ? (
                              <span 
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(data.value, selectedMetric || '')}`}
                              >
                                {data.originalText}
                              </span>
                            ) : (
                              data.value !== null ? data.value.toFixed(1) : 'N/A'
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}