"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  BarChart2,
  Activity,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import apiService from "../../../services/api.service";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
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

interface PerformanceMetric {
  metric_id: number;
  metric_name: string;
  metric_type: string;
  value_numeric: number | null;
  value_text: string | null;
  recorded_at: string;
  unit: string;
}

interface ApiResponse {
  performance_metrics: PerformanceMetric[];
  employee_id?: string;
  full_name?: string;
}

interface MetricDataPoint {
  date: string;
  [key: string]: string | number | null;
}

export default function EmployeePerformancePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [performanceData, setPerformanceData] = useState<MetricDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch the employee details
        const employeeResponse = await apiService.get(`/users/employees/${id}`);
        setEmployee(employeeResponse);
        
        // Fetch the employee's performance metrics
        const metricsResponse = await apiService.get(`/metric-records/employee/search-by-id/${id}`);
        
        // Process the metrics data for visualization
        const processedData = processMetricsData(metricsResponse);
        setPerformanceData(processedData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load employee performance data');
        setLoading(false);
      }
    }
    
    if (id) {
      fetchData();
    }
  }, [id]);
  
  // Function to process metrics data for visualization
  const processMetricsData = (data: any): MetricDataPoint[] => {
    if (!data || !data.performance_metrics || !Array.isArray(data.performance_metrics)) {
      console.log("No performance data returned");
      return [];
    }
    
    // Group metrics by date and name
    const metricsByDate: Record<string, Record<string, number | null>> = {};
    
    // Process performance metrics
    data.performance_metrics.forEach((metric: PerformanceMetric) => {
      if (metric && metric.recorded_at) {
        const date = new Date(metric.recorded_at).toLocaleDateString();
        
        if (!metricsByDate[date]) {
          metricsByDate[date] = {};
        }
        
        if (metric.metric_name) {
          metricsByDate[date][metric.metric_name] = metric.value_numeric;
        }
      }
    });
    
    // Convert to array format for charts
    return Object.keys(metricsByDate)
      .map(date => ({
        date,
        ...metricsByDate[date]
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-teal-500 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading performance data...</p>
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

  // Get all unique metric names
  const metricNames: string[] = [];
  performanceData.forEach(item => {
    if (item) {
      Object.keys(item).forEach(key => {
        if (key !== 'date' && !metricNames.includes(key)) {
          metricNames.push(key);
        }
      });
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <BarChart2 className="mr-2" /> 
                Performance Dashboard
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
        {performanceData.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Performance Data</h2>
            <p className="text-gray-600 mb-4">
              There are no performance metrics recorded for this employee yet.
            </p>
          </div>
        ) : (
          <>
            {/* Performance summary cards */}
            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
              {metricNames.map((metricName, index) => {
                // Calculate latest value and trend
                const latestData = performanceData.length > 0 ? 
                  performanceData[performanceData.length - 1] : null;
                
                const previousData = performanceData.length > 1 ? 
                  performanceData[performanceData.length - 2] : null;
                
                const latestValue = latestData && latestData[metricName] !== undefined ? 
                  latestData[metricName] : null;
                
                const previousValue = previousData && previousData[metricName] !== undefined ? 
                  previousData[metricName] : null;
                
                let trend = 0;
                if (latestValue !== null && previousValue !== null && 
                    typeof latestValue === 'number' && typeof previousValue === 'number' &&
                    previousValue !== 0) {
                  trend = ((latestValue - previousValue) / Math.abs(previousValue)) * 100;
                }
                
                return (
                  <div key={index} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-gray-500 text-sm font-medium truncate">
                        {metricName}
                      </h3>
                      {trend !== 0 && (
                        <span 
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            trend > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {trend > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                          {Math.abs(trend).toFixed(1)}%
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">
                        {latestValue !== null && latestValue !== undefined && typeof latestValue === 'number' ? 
                          latestValue.toFixed(1) : 'N/A'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Performance charts */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Performance Trends</h2>
                <p className="text-sm text-gray-500">
                  Historical performance metrics over time
                </p>
              </div>
              <div className="p-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={performanceData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: any) => {
                          return value !== null && value !== undefined && typeof value === 'number' ? 
                            value.toFixed(1) : 'N/A';
                        }} 
                      />
                      <Legend />
                      {metricNames.map((metricName, index) => (
                        <Line
                          key={index}
                          type="monotone"
                          dataKey={metricName}
                          name={metricName}
                          stroke={getLineColor(index)}
                          activeDot={{ r: 8 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent metrics table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Metrics</h2>
                <p className="text-sm text-gray-500">
                  Latest performance data recorded
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      {metricNames.map((name, index) => (
                        <th
                          key={index}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {performanceData.slice(-5).reverse().map((data, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {data.date}
                        </td>
                        {metricNames.map((name, nameIndex) => (
                          <td key={nameIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {data[name] !== undefined && data[name] !== null && typeof data[name] === 'number' ? 
                              (data[name] as number).toFixed(1) : '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// Helper function to get a color for chart lines
function getLineColor(index: number): string {
  const colors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // yellow
    '#EF4444', // red
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#06B6D4', // cyan
    '#F97316', // orange
  ];
  return colors[index % colors.length];
}