'use client';

import { useState, useEffect } from 'react';
import { Bell, Settings, Activity } from 'lucide-react';
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../contexts/AuthContext"; 
import apiService from "../../services/api.service";
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

export default function SupervisorWellnessPage() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [metricTypes, setMetricTypes] = useState<string[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<string>('');
  const [viewMode, setViewMode] = useState<'line' | 'area'>('line');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await apiService.get('/metric-records/department/employee-metrics?metric_type=WELLNESS');
        
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
        console.error('Failed to fetch department wellness metrics:', error);
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
      
      // Calculate department average for this date and metric
      const employeeValues = Object.entries(dailyData)
        .filter(([key]) => key !== 'date')
        .map(([_, value]) => value as number);
        
      if (employeeValues.length > 0) {
        const avg = employeeValues.reduce((sum, val) => sum + val, 0) / employeeValues.length;
        dailyData['Department Average'] = Math.round(avg * 10) / 10;
      }
      
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
  
  // Get appropriate color for each employee/line
  const getLineColor = (index: number) => {
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
          {/* <SupervisorSidebar activeTab="wellness" /> */}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">Wellness Monitoring</h1>
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
              <h2 className="text-2xl font-bold">Department Wellness Trends</h2>
              
              <div className="flex items-center gap-4">
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
                
                {/* Chart Type Selector */}
                <div className="flex items-center gap-2">
                  <label htmlFor="view-mode" className="font-medium text-gray-700">
                    View:
                  </label>
                  <select
                    id="view-mode"
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value as 'line' | 'area')}
                    className="p-2 border border-gray-300 rounded-md bg-white"
                  >
                    <option value="line">Line Chart</option>
                    <option value="area">Area Chart</option>
                  </select>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading wellness metrics...</div>
            ) : metrics.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No wellness data found for your department.</div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-gray-600">
                    This chart shows {selectedMetric} trends for each employee over time, with the department average indicated by the dashed line.
                  </p>
                </div>
                <div className="h-96 w-full bg-white p-4 rounded-lg shadow">
                  <ResponsiveContainer width="100%" height="100%">
                    {viewMode === 'line' ? (
                      <LineChart
                        data={metrics}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value: number) => Math.round(value * 10) / 10} />
                        <Legend />
                        {/* Dynamically create lines for each employee */}
                        {Object.keys(metrics[0] || {})
                          .filter(key => key !== 'date' && key !== 'Department Average')
                          .map((employee, index) => (
                            <Line
                              key={employee}
                              type="monotone"
                              dataKey={employee}
                              stroke={getLineColor(index)}
                              name={employee}
                              strokeWidth={2}
                              activeDot={{ r: 6 }}
                            />
                          ))}
                        {/* Department Average Line */}
                        {metrics[0] && 'Department Average' in metrics[0] && (
                          <Line
                            type="monotone"
                            dataKey="Department Average"
                            stroke="#FF0000"
                            strokeDasharray="5 5"
                            strokeWidth={2}
                            name="Department Average"
                          />
                        )}
                      </LineChart>
                    ) : (
                      <AreaChart
                        data={metrics}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value: number) => Math.round(value * 10) / 10} />
                        <Legend />
                        {/* Dynamically create areas for each employee */}
                        {Object.keys(metrics[0] || {})
                          .filter(key => key !== 'date' && key !== 'Department Average')
                          .map((employee, index) => (
                            <Area
                              key={employee}
                              type="monotone"
                              dataKey={employee}
                              stackId="1"
                              stroke={getLineColor(index)}
                              fill={getLineColor(index)}
                              name={employee}
                              fillOpacity={0.6}
                            />
                          ))}
                        {/* Department Average Line */}
                        {metrics[0] && 'Department Average' in metrics[0] && (
                          <Line
                            type="monotone"
                            dataKey="Department Average"
                            stroke="#FF0000"
                            strokeDasharray="5 5"
                            strokeWidth={2}
                            name="Department Average"
                          />
                        )}
                      </AreaChart>
                    )}
                  </ResponsiveContainer>
                </div>
                
                {/* Tips based on selected wellness metric */}
                <div className="mt-8 bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-2">Wellness Insights</h3>
                  <p className="text-gray-700 mb-4">
                    {getWellnessInsight(selectedMetric)}
                  </p>
                  <h4 className="font-medium text-gray-800 mb-2">Suggested Actions:</h4>
                  <ul className="list-disc pl-6 text-gray-700">
                    {getWellnessActions(selectedMetric).map((action, index) => (
                      <li key={index} className="mb-1">{action}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

// Helper functions for wellness insights and actions
function getWellnessInsight(metricName: string): string {
  const insights: Record<string, string> = {
    'Stress Level': 'High stress levels can negatively impact employee performance and overall well-being. Monitor trends to identify potential burnout risks.',
    'Sleep Hours': 'Adequate sleep is essential for cognitive function and overall health. Consistent patterns below 7 hours may indicate increased risks.',
    'Activity Level': 'Regular physical activity helps maintain energy levels and reduce stress. Look for consistent patterns rather than occasional spikes.',
    'Job Satisfaction': 'Job satisfaction directly correlates with productivity and retention. Sudden drops may indicate workplace issues that need attention.',
    // Add more insights for other wellness metrics
  };
  
  return insights[metricName] || 
    'Monitoring this wellness metric can help identify trends and potential areas for intervention to support employee wellbeing.';
}

function getWellnessActions(metricName: string): string[] {
  const actions: Record<string, string[]> = {
    'Stress Level': [
      'Schedule one-on-one check-ins with employees showing consistently high stress levels',
      'Review workload distribution across the team',
      'Consider offering stress management workshops or resources',
      'Evaluate if there are systemic workplace stressors that can be addressed'
    ],
    'Sleep Hours': [
      'Share educational resources about sleep hygiene',
      'Consider adjusting schedules for employees with persistent sleep issues',
      'Encourage regular breaks throughout the workday',
      'Review overtime patterns to ensure adequate rest periods'
    ],
    'Activity Level': [
      'Promote walking meetings or standing desks',
      'Consider team fitness challenges to encourage movement',
      'Ensure adequate break times for physical movement',
      'Share resources about incorporating activity into daily routines'
    ],
    'Job Satisfaction': [
      'Conduct informal feedback sessions to identify improvement areas',
      'Recognize and celebrate team achievements',
      'Explore professional development opportunities for team members',
      'Review job roles and responsibilities for potential adjustments'
    ],
    // Add more actions for other wellness metrics
  };
  
  return actions[metricName] || [
    'Monitor trends and identify any concerning patterns',
    'Have open conversations with team members about their wellbeing',
    'Connect employees with appropriate resources when needed',
    'Consider workplace adjustments that could positively impact this metric'
  ];
}