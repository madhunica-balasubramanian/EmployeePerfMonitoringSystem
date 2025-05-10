'use client';

import { useState, useEffect } from 'react';
import { Bell, Settings, BarChart, Filter } from 'lucide-react';
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../contexts/AuthContext"; 
import apiService from "../../services/api.service";
import {
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

// Define types for better type safety
interface Metric {
  metric_id: number;
  metric_name: string;
  metric_type: string;
  value_numeric: number;
  value_text: string | null;
  recorded_at: string;
  unit: string;
}

interface Employee {
  employee_id: string;
  first_name: string;
  last_name: string;
  metrics: Metric[];
}

interface AggregatedMetric {
  employee_name: string;
  avg_value: number;
  latest_value: number;
}

export default function SupervisorPerformancePage() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [metricTypes, setMetricTypes] = useState<string[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<string>('');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await apiService.get('/metric-records/department/employee-metrics?metric_type=PERFORMANCE');
        
        // Extract all unique metric names
        let allMetricNames: string[] = [];
        response.forEach((employee: Employee) => {
          employee.metrics.forEach((metric) => {
            if (!allMetricNames.includes(metric.metric_name)) {
              allMetricNames.push(metric.metric_name);
            }
          });
        });
        
        setMetricTypes(allMetricNames);
        
        // Set default selected metric to the first one
        if (allMetricNames.length > 0 && !selectedMetric) {
          setSelectedMetric(allMetricNames[0]);
        }
        
        // Process metrics data for visualization
        const processedData = processMetricsData(response, selectedMetric || allMetricNames[0]);
        setMetrics(processedData);
      } catch (error) {
        console.error('Failed to fetch department performance metrics:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchMetrics();
  }, [selectedMetric]);
  
  // Function to process metrics data based on selected metric type
  const processMetricsData = (data: Employee[], metricName: string) => {
    // Get all unique dates
    const allDates: string[] = [];
    data.forEach((employee) => {
      employee.metrics
        .filter(m => m.metric_name === metricName)
        .forEach((metric) => {
          if (!allDates.includes(metric.recorded_at)) {
            allDates.push(metric.recorded_at);
          }
        });
    });
    
    // Sort dates from oldest to newest
    allDates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    
    // Create data points for each date
    return allDates.map(date => {
      const dailyData: any = {
        date: formatDate(date)
      };
      
      // Add values for each employee on this date
      data.forEach((employee) => {
        const employeeName = `${employee.first_name} ${employee.last_name}`;
        const metric = employee.metrics.find(
          m => m.metric_name === metricName && m.recorded_at === date
        );
        
        dailyData[employeeName] = metric ? metric.value_numeric : 0;
      });
      
      return dailyData;
    });
  };
  
  // Helper function to format dates
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Handle metric selection change
  const handleMetricChange = (metricName: string) => {
    setSelectedMetric(metricName);
  };
  
  return (
    <ProtectedRoute requiredRole="SUPERVISOR">
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold text-teal-600">EmpWell System</h2>
            <p className="text-sm text-gray-500">Supervisor Portal</p>
          </div>
          {/* If you have a shared sidebar component for supervisor, use it here */}
          {/* <SupervisorSidebar activeTab="performance" /> */}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">Performance Reports</h1>
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Department Performance Overview</h2>
              
              {/* Metric Selector */}
              {metricTypes.length > 0 && (
                <div className="flex items-center gap-2">
                  <label htmlFor="metric-select" className="font-medium text-gray-700">
                    Metric:
                  </label>
                  <select
                    id="metric-select"
                    value={selectedMetric}
                    onChange={(e) => handleMetricChange(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md bg-white"
                  >
                    {metricTypes.map((metricName) => (
                      <option key={metricName} value={metricName}>
                        {metricName}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading metrics...</div>
            ) : metrics.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No performance data found for your department.</div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-gray-600">
                    This chart shows the {selectedMetric} metrics for each employee over time.
                  </p>
                </div>
                <div className="h-96 w-full bg-white p-4 rounded-lg shadow">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart 
                      data={metrics}
                      margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        height={60}
                      />
                      <YAxis />
                      <Tooltip formatter={(value: number) => Math.round(value * 10) / 10} />
                      <Legend />
                      {/* Dynamically create bars for each employee */}
                      {Object.keys(metrics[0] || {})
                        .filter(key => key !== 'date')
                        .map((employee, index) => (
                          <Bar 
                            key={employee} 
                            dataKey={employee} 
                            fill={getEmployeeColor(index)} 
                            name={employee} 
                          />
                        ))}
                    </ReBarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

// Helper function to generate colors for different employees
const getEmployeeColor = (index: number) => {
  const colors = [
    '#0088FE', // blue
    '#00C49F', // green
    '#FFBB28', // yellow
    '#FF8042', // orange
    '#8884d8', // purple
    '#82ca9d', // light green
    '#ffc658', // light orange
    '#8dd1e1', // light blue
  ];
  return colors[index % colors.length];
};