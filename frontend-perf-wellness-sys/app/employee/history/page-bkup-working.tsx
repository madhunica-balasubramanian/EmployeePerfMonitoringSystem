// app/employee/history/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Bell, Calendar, Home, FileText, BarChart as BarChartIcon, 
  Settings, User, Filter, PieChart, LineChart, BarChart4 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import metricHistoryService, { MetricRecord, AggregatedMetric, MetricFilter } from "../../services/metric-history.service";
import { DROPDOWN_OPTIONS, CHECKBOX_METRICS, RADIO_METRICS, RADIO_OPTIONS, CHECKBOX_OPTIONS, NUMERIC_METRICS } from "../../services/metricUtils";

import EmployeeSidebar from "../../components/EmployeeSidebar";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, LineChart as RechartsLineChart,
  Line, PieChart as RechartsPieChart, Pie, Cell, Radar, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";

// Chart color palette
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function MetricsHistoryPage() {
  const [activeTab, setActiveTab] = useState("history");
  const { user, logout } = useAuth();
  
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(undefined);
  const [selectedYear, setSelectedYear] = useState<number | undefined>(new Date().getFullYear());
  
  const [metrics, setMetrics] = useState<MetricRecord[]>([]);
  const [aggregatedMetrics, setAggregatedMetrics] = useState<AggregatedMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'aggregated' | 'chart'>('chart');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'radar'>('bar');
  
  // Separate metrics by type for easier visualization
  const [performanceMetrics, setPerformanceMetrics] = useState<AggregatedMetric[]>([]);
  const [wellnessMetrics, setWellnessMetrics] = useState<AggregatedMetric[]>([]);
  
  useEffect(() => {
    fetchMetrics();
  }, [filterType, startDate, endDate, selectedMonth, selectedYear, viewMode]);
  
  const fetchMetrics = async () => {
    setLoading(true);
    
    const filters: MetricFilter = {
      metric_type: filterType,
      start_date: startDate,
      end_date: endDate,
      month: selectedMonth,
      year: selectedYear
    };
    
    try {
      if (viewMode === 'list') {
        const data = await metricHistoryService.getMyMetrics(filters);
        setMetrics(data);
      } else {
        // For both aggregated and chart views, we need aggregated data
        const data = await metricHistoryService.getMyAggregatedMetrics(filters);
        setAggregatedMetrics(data);
     
       
       // Try different filter approaches
       //const perfMetrics1 = data.filter(metric => metric.metric_type === 'PERFORMANCE');
       const perfMetrics2 = data.filter(metric => metric.metric_type && metric.metric_type.toUpperCase() === 'PERFORMANCE');
       //const perfMetrics3 = data.filter(metric => String(metric.metric_type).includes('PERFORM'));
       const wellnessMetrics2 = data.filter(metric => metric.metric_type && metric.metric_type.toUpperCase() === 'WELLNESS');

       
       //console.log(`Filter approach 1 (exact match): ${perfMetrics1.length} performance metrics`);
       console.log(`Filter approach 2 (uppercase): ${perfMetrics2.length} performance metrics`);
       //console.log(`Filter approach 3 (includes): ${perfMetrics3.length} performance metrics`);
       console.log(`Filter approach 2 Wellness (uppercase): ${wellnessMetrics2.length} wellness metrics`);


      // Try one of the alternate filter methods if needed
      const performanceData = perfMetrics2.length;
      const wellnessData = wellnessMetrics2.length;
      
      console.log(`Final performance metrics count: ${performanceData}`);
      console.log(`Final wellness metrics count: ${wellnessData}`);

        
        setPerformanceMetrics((data.filter(metric => metric.metric_type && metric.metric_type.toUpperCase() === 'PERFORMANCE')));
        setWellnessMetrics(data.filter(metric => metric.metric_type && metric.metric_type.toUpperCase() === 'WELLNESS'));
      }
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleReset = () => {
    setFilterType(undefined);
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedMonth(undefined);
    setSelectedYear(new Date().getFullYear());
  };
  
  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  

  const prepareChartData = (data: AggregatedMetric[]) => {
    console.log("Starting prepareChartData with data:", data);
    
    if (!data || data.length === 0) {
      console.warn("No data provided to prepareChartData!");
      return [];
    }
    
    const chartData = data.map(metric => {
      console.log(`Processing metric: ${metric.metric_name}`, {
        avg_value: metric.avg_value,
        min_value: metric.min_value,
        max_value: metric.max_value,
        latest_value: metric.latest_value
      });
      
      return {
        name: metric.metric_name,
        value: metric.avg_value || 0,
        avg: metric.avg_value || 0,
        min: metric.min_value || 0,
        max: metric.max_value || 0,
        latest: metric.latest_value || 0,
        count: metric.count,
        unit: metric.unit || '',
      };
    });
    
    console.log("Prepared chart data:", chartData);
    return chartData;
  };
  // Create chart components
  const renderBarChart = (data: AggregatedMetric[], title: string) => {
    const chartData = prepareChartData(data);
    console.error("Preapring chart data...")
    
    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">{title}</h3>
        {chartData.length > 0 ? (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value, name, props) => {
                    const metric = props.payload;
                    return [`${value}${metric.unit}`, name];
                  }}
                />
                <Legend />
                <Bar dataKey="latest" fill="#0088FE" name="Latest Value" />
                <Bar dataKey="avg" fill="#00C49F" name="Average Value" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No {title.toLowerCase()} available</p>
        )}
      </div>
    );
  };

  const renderLineChart = (data: AggregatedMetric[], title: string) => {
    const chartData = prepareChartData(data);
    
    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">{title}</h3>
        {chartData.length > 0 ? (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value, name, props) => {
                    const metric = props.payload;
                    return [`${value}${metric.unit}`, name];
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="latest" stroke="#0088FE" activeDot={{ r: 8 }} name="Latest Value" />
                <Line type="monotone" dataKey="avg" stroke="#00C49F" name="Average Value" />
                <Line type="monotone" dataKey="min" stroke="#FFBB28" name="Minimum Value" />
                <Line type="monotone" dataKey="max" stroke="#FF8042" name="Maximum Value" />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No {title.toLowerCase()} available</p>
        )}
      </div>
    );
  };

  const renderPieChart = (data: AggregatedMetric[], title: string) => {
    const chartData = prepareChartData(data);
    
    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">{title}</h3>
        {chartData.length > 0 ? (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={chartData}
                  dataKey="latest"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label={({name, value, unit}) => `${name}: ${value}${unit}`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => {
                    const metric = props.payload;
                    return [`${value}${metric.unit}`, name];
                  }}
                />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No {title.toLowerCase()} available</p>
        )}
      </div>
    );
  };

  const renderRadarChart = (data: AggregatedMetric[], title: string) => {
    const chartData = prepareChartData(data);
    
    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">{title}</h3>
        {chartData.length > 0 ? (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis />
                <Radar name="Latest Value" dataKey="latest" stroke="#0088FE" fill="#0088FE" fillOpacity={0.6} />
                <Radar name="Average Value" dataKey="avg" stroke="#00C49F" fill="#00C49F" fillOpacity={0.6} />
                <Legend />
                <Tooltip 
                  formatter={(value, name, props) => {
                    const metric = props.payload;
                    return [`${value}${metric.unit}`, name];
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No {title.toLowerCase()} available</p>
        )}
      </div>
    );
  };

  const renderMetricCharts = () => {
    switch (chartType) {
      case 'bar':
        return (
          <>
            {renderBarChart(performanceMetrics, "Performance Metrics")}
            {renderBarChart(wellnessMetrics, "Wellness Metrics")}
          </>
        );
      case 'line':
        return (
          <>
            {renderLineChart(performanceMetrics, "Performance Metrics")}
            {renderLineChart(wellnessMetrics, "Wellness Metrics")}
          </>
        );
      case 'pie':
        return (
          <>
            {renderPieChart(performanceMetrics, "Performance Metrics")}
            {renderPieChart(wellnessMetrics, "Wellness Metrics")}
          </>
        );
      case 'radar':
        return (
          <>
            {renderRadarChart(performanceMetrics, "Performance Metrics")}
            {renderRadarChart(wellnessMetrics, "Wellness Metrics")}
          </>
        );
      default:
        return null;
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
            <h1 className="text-xl font-semibold">Metrics History</h1>
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
              <h2 className="text-2xl font-bold mb-2">Metrics History</h2>
              <p className="text-gray-600">View your historical performance and wellness data</p>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Filter size={20} />
                  Filter Options
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('chart')}
                    className={`px-3 py-1 rounded ${viewMode === 'chart' ? 'bg-teal-500 text-white' : 'bg-gray-100'}`}
                  >
                    Chart View
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-teal-500 text-white' : 'bg-gray-100'}`}
                  >
                    Detailed List
                  </button>
                  <button
                    onClick={() => setViewMode('aggregated')}
                    className={`px-3 py-1 rounded ${viewMode === 'aggregated' ? 'bg-teal-500 text-white' : 'bg-gray-100'}`}
                  >
                    Aggregated View
                  </button>
                </div>
              </div>
              
              {/* Chart Type Selection (only visible in chart view) */}
              {viewMode === 'chart' && (
                <div className="flex justify-center gap-4 mb-4 border-b pb-4">
                  <button
                    onClick={() => setChartType('bar')}
                    className={`flex items-center gap-2 px-3 py-1 rounded ${chartType === 'bar' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                  >
                    <BarChartIcon size={18} />
                    Bar Chart
                  </button>
                  <button
                    onClick={() => setChartType('line')}
                    className={`flex items-center gap-2 px-3 py-1 rounded ${chartType === 'line' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                  >
                    <LineChart size={18} />
                    Line Chart
                  </button>
                  <button
                    onClick={() => setChartType('pie')}
                    className={`flex items-center gap-2 px-3 py-1 rounded ${chartType === 'pie' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                  >
                    <PieChart size={18} />
                    Pie Chart
                  </button>
                  <button
                    onClick={() => setChartType('radar')}
                    className={`flex items-center gap-2 px-3 py-1 rounded ${chartType === 'radar' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                  >
                    <BarChart4 size={18} />
                    Radar Chart
                  </button>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Metric Type
                  </label>
                  <select
                    value={filterType || ''}
                    onChange={(e) => setFilterType(e.target.value || undefined)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">All Types</option>
                    <option value="PERFORMANCE">Performance</option>
                    <option value="WELLNESS">Wellness</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate || ''}
                    onChange={(e) => setStartDate(e.target.value || undefined)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate || ''}
                    onChange={(e) => setEndDate(e.target.value || undefined)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Month
                  </label>
                  <select
                    value={selectedMonth || ''}
                    onChange={(e) => setSelectedMonth(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">All Months</option>
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    value={selectedYear || ''}
                    onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    min="2020"
                    max="2030"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleReset}
                  className="mr-2 px-4 py-2 border border-gray-300 rounded-md"
                >
                  Reset Filters
                </button>
                <button
                  onClick={fetchMetrics}
                  className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
                >
                  Apply Filters
                </button>
              </div>
            </div>

            {/* Data Display */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                </div>
              ) : viewMode === 'chart' ? (
                // Chart view
                renderMetricCharts()
              ) : viewMode === 'list' ? (
                // Detailed list view
                metrics.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {metrics.map((metric) => (
                          <tr key={metric.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {formatDate(metric.recorded_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {metric.metric_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${metric.metric_type === 'PERFORMANCE' ? 'bg-teal-100 text-teal-800' : 'bg-blue-100 text-blue-800'}`}>
                                {metric.metric_type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {metric.value_numeric !== null 
                                ? `${metric.value_numeric}${metric.unit ? ` ${metric.unit}` : ''}`
                                : metric.value_text || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No metrics found for the selected filters.</p>
                  </div>
                )
              ) : (
                // Aggregated view
                aggregatedMetrics.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Aggregated Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {aggregatedMetrics.map((metric) => (
                        <div key={metric.metric_id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium">{metric.metric_name}</h4>
                              <span className={`px-2 py-1 text-xs rounded-full ${metric.metric_type === 'PERFORMANCE' ? 'bg-teal-100 text-teal-800' : 'bg-blue-100 text-blue-800'}`}>
                                {metric.metric_type}
                              </span>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">
                                {metric.count} entries
                              </span>
                            </div>
                          </div>
                          
                          {metric.avg_value !== null ? (
                            <div className="mt-4 space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Latest Value:</span>
                                <span className="font-medium">
                                  {metric.latest_value !== null 
                                    ? `${metric.latest_value}${metric.unit ? ` ${metric.unit}` : ''}` 
                                    : metric.latest_text_value || '-'}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Average:</span>
                                <span className="font-medium">{metric.avg_value.toFixed(2)}{metric.unit ? ` ${metric.unit}` : ''}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Minimum:</span>
                                <span className="font-medium">{metric.min_value}{metric.unit ? ` ${metric.unit}` : ''}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Maximum:</span>
                                <span className="font-medium">{metric.max_value}{metric.unit ? ` ${metric.unit}` : ''}</span>
                              </div>
                              
                              {/* Progress bar for range visualization */}
                              <div className="mt-2">
                                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                  <div className="h-full bg-teal-500 rounded-full" 
                                      style={{ 
                                        width: `${metric.min_value !== null && metric.max_value !== null && metric.max_value !== metric.min_value ? 
                                          ((metric.avg_value - metric.min_value) / (metric.max_value - metric.min_value) * 100) : 50}%` 
                                      }}>
                                  </div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                  <span>{metric.min_value}</span>
                                  <span>{metric.max_value}</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="mt-4">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Latest Value:</span>
                                <span className="font-medium">{metric.latest_text_value || '-'}</span>
                              </div>
                              <div className="mt-2 text-sm text-gray-500">
                                Text-based metric - no numeric aggregation available
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No metrics found for the selected filters.</p>
                  </div>
                )
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
