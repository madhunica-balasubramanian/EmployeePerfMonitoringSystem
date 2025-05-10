"use client"

import { useState, useEffect } from "react"
import { Bell, BarChart as BarChartIcon, Settings, Filter, PieChart, FileText, AlertCircle } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import ProtectedRoute from "../../components/ProtectedRoute"
import metricHistoryService, {
  type MetricRecord,
  type AggregatedMetric,
  type MetricFilter,
} from "../../services/metric-history.service"

import EmployeeSidebar from "../../components/EmployeeSidebar"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts"

// Chart color palette - enhanced for better contrast and accessibility
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8", 
  "#82ca9d",
  "#ffc658",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
]

export default function MetricsHistoryPage() {
  const [activeTab, setActiveTab] = useState("history")
  const { user, logout } = useAuth()

  const [filterType, setFilterType] = useState<string | undefined>(undefined)
  const [startDate, setStartDate] = useState<string | undefined>(undefined)
  const [endDate, setEndDate] = useState<string | undefined>(undefined)
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(undefined)
  const [selectedYear, setSelectedYear] = useState<number | undefined>(new Date().getFullYear())

  const [metrics, setMetrics] = useState<MetricRecord[]>([])
  const [aggregatedMetrics, setAggregatedMetrics] = useState<AggregatedMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"list" | "aggregated" | "chart">("chart")

  // Separate metrics by type and data format
  const [performanceMetrics, setPerformanceMetrics] = useState<AggregatedMetric[]>([])
  const [wellnessMetrics, setWellnessMetrics] = useState<AggregatedMetric[]>([])
  const [numericPerformanceMetrics, setNumericPerformanceMetrics] = useState<AggregatedMetric[]>([])
  const [numericWellnessMetrics, setNumericWellnessMetrics] = useState<AggregatedMetric[]>([])
  const [textPerformanceMetrics, setTextPerformanceMetrics] = useState<AggregatedMetric[]>([])
  const [textWellnessMetrics, setTextWellnessMetrics] = useState<AggregatedMetric[]>([])

  useEffect(() => {
    fetchMetrics()
  }, [filterType, startDate, endDate, selectedMonth, selectedYear, viewMode])

  // Separate numeric and text-based metrics
  useEffect(() => {
    if (performanceMetrics.length > 0) {
      const numeric = performanceMetrics.filter(metric => 
        metric.latest_value !== null && 
        metric.latest_value !== undefined && 
        !isNaN(Number(metric.latest_value))
      )
      const text = performanceMetrics.filter(metric => 
        metric.latest_value === null || 
        metric.latest_value === undefined || 
        isNaN(Number(metric.latest_value))
      )
      setNumericPerformanceMetrics(numeric)
      setTextPerformanceMetrics(text)
    }

    if (wellnessMetrics.length > 0) {
      const numeric = wellnessMetrics.filter(metric => 
        metric.latest_value !== null && 
        metric.latest_value !== undefined && 
        !isNaN(Number(metric.latest_value))
      )
      const text = wellnessMetrics.filter(metric => 
        metric.latest_value === null || 
        metric.latest_value === undefined || 
        isNaN(Number(metric.latest_value))
      )
      setNumericWellnessMetrics(numeric)
      setTextWellnessMetrics(text)
    }
  }, [performanceMetrics, wellnessMetrics])

  const fetchMetrics = async () => {
    setLoading(true)

    const filters: MetricFilter = {
      metric_type: filterType,
      start_date: startDate,
      end_date: endDate,
      month: selectedMonth,
      year: selectedYear,
    }

    try {
      if (viewMode === "list") {
        const data = await metricHistoryService.getMyMetrics(filters)
        setMetrics(data)
      } else {
        // For both aggregated and chart views, we need aggregated data
        const data = await metricHistoryService.getMyAggregatedMetrics(filters)
        setAggregatedMetrics(data)

        // Filter performance and wellness metrics
        setPerformanceMetrics(
          data.filter((metric) => metric.metric_type && metric.metric_type.toUpperCase() === "PERFORMANCE"),
        )
        setWellnessMetrics(
          data.filter((metric) => metric.metric_type && metric.metric_type.toUpperCase() === "WELLNESS"),
        )
      }
    } catch (error) {
      console.error("Failed to fetch metrics:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFilterType(undefined)
    setStartDate(undefined)
    setEndDate(undefined)
    setSelectedMonth(undefined)
    setSelectedYear(new Date().getFullYear())
  }

  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Determine metric display value based on type
  const getMetricDisplayValue = (metric: AggregatedMetric) => {
    // For checkbox/boolean metrics (1/0 values with no unit)
    if (
      (metric.latest_value === 1 || metric.latest_value === 0) &&
      !metric.unit &&
      (metric.metric_name.toLowerCase().includes('completed') || 
       metric.metric_name.toLowerCase().includes('done') ||
       metric.metric_name.toLowerCase().includes('checked'))
    ) {
      return metric.latest_value === 1 ? "Yes" : "No"
    }
    
    // For numeric metrics
    if (metric.latest_value !== null && !isNaN(Number(metric.latest_value))) {
      return `${metric.latest_value}${metric.unit ? ` ${metric.unit}` : ''}`
    }
    
    // For text-based metrics
    return metric.latest_text_value || "N/A"
  }

  const prepareChartData = (data: AggregatedMetric[]) => {
    if (!data || data.length === 0) {
      return []
    }

    // Filter out text-based metrics for charts
    const numericMetrics = data.filter(metric => 
      metric.latest_value !== null && 
      metric.latest_value !== undefined && 
      !isNaN(Number(metric.latest_value))
    )

    return numericMetrics.map((metric) => {
      return {
        name: formatMetricName(metric.metric_name),
        value: metric.latest_value || 0,
        avg: metric.avg_value || 0,
        min: metric.min_value || 0,
        max: metric.max_value || 0,
        latest: metric.latest_value || 0,
        count: metric.count,
        unit: metric.unit || "",
        fullName: metric.metric_name, // Keep the full name for tooltips
      }
    })
  }

  // Format metric names to be more readable
  const formatMetricName = (name: string) => {
    // Replace underscores with spaces
    let formattedName = name.replace(/_/g, " ")

    // Capitalize first letter of each word
    formattedName = formattedName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")

    // Truncate if too long
    if (formattedName.length > 20) {
      formattedName = formattedName.substring(0, 18) + "..."
    }

    return formattedName
  }

  // Create chart components
  const renderBarChart = (data: AggregatedMetric[], title: string) => {
    const chartData = prepareChartData(data)

    return (
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4 text-gray-800">{title}</h3>
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
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fill: "#4b5563", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#4b5563", fontSize: 12 }} />
                <Tooltip
                  formatter={(value, name, props) => {
                    const metric = props.payload
                    return [`${value}${metric.unit}`, name === "latest" ? "Latest Value" : "Average Value"]
                  }}
                  labelFormatter={(label, items) => {
                    // Use the full name in tooltip
                    return items[0]?.payload?.fullName || label
                  }}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "4px",
                    border: "1px solid #e5e7eb",
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: "10px" }} />
                <Bar dataKey="latest" fill="#0088FE" name="Latest Value" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avg" fill="#00C49F" name="Average Value" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-lg">
            <BarChartIcon size={40} className="text-gray-300 mb-2" />
            <p className="text-gray-500">No numeric {title.toLowerCase()} available for charting</p>
          </div>
        )}
      </div>
    )
  }

  const renderPieChart = (data: AggregatedMetric[], title: string) => {
    const chartData = prepareChartData(data)

    return (
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4 text-gray-800">{title}</h3>
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
                  label={({ name, value, unit }) => `${name}: ${value}${unit}`}
                  labelLine={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => {
                    const metric = props.payload
                    return [`${value}${metric.unit}`, metric.fullName]
                  }}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "4px",
                    border: "1px solid #e5e7eb",
                  }}
                />
                <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: "12px" }} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-lg">
            <PieChart size={40} className="text-gray-300 mb-2" />
            <p className="text-gray-500">No numeric {title.toLowerCase()} available for charting</p>
          </div>
        )}
      </div>
    )
  }

  // Render the text-based and categorical metrics that can't be shown in charts
  const renderTextMetrics = (data: AggregatedMetric[], title: string) => {
    // Filter for text-based metrics or non-chartable metrics (like choices)
    const textMetrics = data.filter(metric => 
      metric.latest_value === null || 
      metric.latest_value === undefined || 
      isNaN(Number(metric.latest_value)) ||
      metric.latest_text_value !== null
    )
    
    if (textMetrics.length === 0) return null
    
    return (
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4 text-gray-800">{title} - Text & Categorical Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {textMetrics.map(metric => (
            <div key={metric.metric_id} className="border rounded-lg p-4 bg-gray-50 hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900">{formatMetricName(metric.metric_name)}</h4>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {metric.count} entries
                </span>
              </div>
              
              <div className="mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Latest Response:</span>
                  <span className="font-medium text-gray-900 bg-white px-3 py-1 rounded-md border">
                    {metric.latest_text_value || getMetricDisplayValue(metric)}
                  </span>
                </div>
                
                {/* Replace common_values section with something more useful */}
                {metric.latest_text_value && (
                <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-gray-600 mb-2">Response History:</p>
                    <div className="flex items-center justify-between">
                    <button className="text-xs bg-teal-50 text-teal-700 border border-teal-200 px-3 py-1 rounded-md hover:bg-teal-100 transition-colors">
                        View All Responses
                    </button>
                    <span className="text-xs text-gray-500">
                        {metric.count} total responses
                    </span>
                    </div>
                </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Render metric summary with counts
  const renderMetricSummary = () => {
    return (
      <div className="mb-6 p-4 bg-blue-50 rounded-lg text-sm">
        <div className="flex flex-col md:flex-row md:justify-between space-y-2 md:space-y-0">
          <div>
            <h3 className="font-medium text-blue-800">Performance Metrics</h3>
            <p className="text-blue-600">
              {numericPerformanceMetrics.length} numeric metrics 
              {textPerformanceMetrics.length > 0 && ` | ${textPerformanceMetrics.length} text/categorical metrics`}
            </p>
          </div>
          <div>
            <h3 className="font-medium text-blue-800">Wellness Metrics</h3>
            <p className="text-blue-600">
              {numericWellnessMetrics.length} numeric metrics 
              {textWellnessMetrics.length > 0 && ` | ${textWellnessMetrics.length} text/categorical metrics`}
            </p>
          </div>
        </div>
        
        {/* Information about data types */}
        {(textPerformanceMetrics.length > 0 || textWellnessMetrics.length > 0) && (
          <div className="mt-2 flex items-start gap-2 pt-2 border-t border-blue-100">
            <AlertCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-blue-700">
              Text-based and categorical metrics (e.g., dropdown selections, checkbox values) are displayed separately below the charts.
            </p>
          </div>
        )}
      </div>
    )
  }

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
                    {user?.first_name?.[0]}
                    {user?.last_name?.[0]}
                  </span>
                </div>
                <span className="font-medium">
                  {user?.first_name} {user?.last_name}
                </span>
              </div>
              <button onClick={logout} className="p-2 text-gray-600 hover:text-gray-900">
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
                    onClick={() => setViewMode("chart")}
                    className={`px-3 py-1 rounded ${viewMode === "chart" ? "bg-teal-500 text-white" : "bg-gray-100"}`}
                  >
                    Chart View
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-1 rounded ${viewMode === "list" ? "bg-teal-500 text-white" : "bg-gray-100"}`}
                  >
                    Detailed List
                  </button>
                  <button
                    onClick={() => setViewMode("aggregated")}
                    className={`px-3 py-1 rounded ${viewMode === "aggregated" ? "bg-teal-500 text-white" : "bg-gray-100"}`}
                  >
                    Aggregated View
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Metric Type</label>
                  <select
                    value={filterType || ""}
                    onChange={(e) => setFilterType(e.target.value || undefined)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">All Types</option>
                    <option value="PERFORMANCE">Performance</option>
                    <option value="WELLNESS">Wellness</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate || ""}
                    onChange={(e) => setStartDate(e.target.value || undefined)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate || ""}
                    onChange={(e) => setEndDate(e.target.value || undefined)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                  <select
                    value={selectedMonth || ""}
                    onChange={(e) => setSelectedMonth(e.target.value ? Number.parseInt(e.target.value) : undefined)}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="number"
                    value={selectedYear || ""}
                    onChange={(e) => setSelectedYear(e.target.value ? Number.parseInt(e.target.value) : undefined)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    min="2020"
                    max="2030"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleReset}
                  className="mr-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
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
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
              </div>
            ) : viewMode === "chart" ? (
              // Chart view with both numeric and text data
              <div>
                {/* Summary section */}
                {renderMetricSummary()}

                {/* Performance Metrics Section */}
                <div className="mb-8">
                  {renderBarChart(numericPerformanceMetrics, "Performance Metrics")}
                  {renderPieChart(numericPerformanceMetrics, "Performance Metrics Distribution")}
                  {textPerformanceMetrics.length > 0 && renderTextMetrics(textPerformanceMetrics, "Performance Metrics")}
                </div>

                {/* Wellness Metrics Section */}
                <div>
                  {renderBarChart(numericWellnessMetrics, "Wellness Metrics")}
                  {renderPieChart(numericWellnessMetrics, "Wellness Metrics Distribution")}
                  {textWellnessMetrics.length > 0 && renderTextMetrics(textWellnessMetrics, "Wellness Metrics")}
                </div>
              </div>
            ) : viewMode === "list" ? (
              // Detailed list view
              <div className="bg-white rounded-lg shadow-sm p-6">
                {metrics.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Metric Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Value
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {metrics.map((metric) => (
                          <tr key={metric.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {formatDate(metric.recorded_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {formatMetricName(metric.metric_name)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${metric.metric_type === "PERFORMANCE" ? "bg-teal-100 text-teal-800" : "bg-blue-100 text-blue-800"}`}
                              >
                                {metric.metric_type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {metric.value_numeric !== null
                                ? `${metric.value_numeric}${metric.unit ? ` ${metric.unit}` : ""}`
                                : metric.value_text || "-"}
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
                )}
              </div>
            ) : (
              // Aggregated view
              <div className="bg-white rounded-lg shadow-sm p-6">
                {aggregatedMetrics.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Aggregated Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {aggregatedMetrics.map((metric) => (
                        <div key={metric.metric_id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium">{formatMetricName(metric.metric_name)}</h4>
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${metric.metric_type === "PERFORMANCE" ? "bg-teal-100 text-teal-800" : "bg-blue-100 text-blue-800"}`}
                              >
                                {metric.metric_type}
                              </span>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">{metric.count} entries</span>
                            </div>
                          </div>

                          {/* For numeric metrics */}
                          {metric.avg_value !== null && !isNaN(Number(metric.avg_value)) ? (
                            <div className="mt-4 space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Latest Value:</span>
                                <span className="font-medium">
                                  {metric.latest_value !== null
                                    ? `${metric.latest_value}${metric.unit ? ` ${metric.unit}` : ""}`
                                    : metric.latest_text_value || "-"}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Average:</span>
                                <span className="font-medium">
                                  {metric.avg_value.toFixed(2)}
                                  {metric.unit ? ` ${metric.unit}` : ""}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Minimum:</span>
                                <span className="font-medium">
                                  {metric.min_value}
                                  {metric.unit ? ` ${metric.unit}` : ""}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Maximum:</span>
                                <span className="font-medium">
                                  {metric.max_value}
                                  {metric.unit ? ` ${metric.unit}` : ""}
                                </span>
                              </div>

                              {/* Progress bar for range visualization */}
                              <div className="mt-2">
                                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-teal-500 rounded-full"
                                    style={{
                                      width: `${
                                        metric.min_value !== null &&
                                        metric.max_value !== null &&
                                        metric.max_value !== metric.min_value
                                          ? (
                                              (metric.avg_value - metric.min_value) /
                                                (metric.max_value - metric.min_value)
                                            ) * 100
                                          : 50
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                  <span>{metric.min_value}</span>
                                  <span>{metric.max_value}</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* For text-based or categorical metrics */
                            <div className="mt-4">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Latest Value:</span>
                                <span className="font-medium bg-gray-50 px-3 py-1 rounded-md">
                                  {getMetricDisplayValue(metric)}
                                </span>
                              </div>
                              
                              {/* If it's a boolean/checkbox metric */}
                              {(metric.latest_value === 1 || metric.latest_value === 0) && 
                               !metric.unit &&
                               (metric.metric_name.toLowerCase().includes('completed') || 
                                metric.metric_name.toLowerCase().includes('done') ||
                                metric.metric_name.toLowerCase().includes('checked')) ? (
                                <div className="mt-3 flex items-center text-sm text-gray-600">
                                  <div className={`w-4 h-4 rounded ${metric.latest_value === 1 ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                                  <span>This is a yes/no metric</span>
                                </div>
                              ) : (
                                <div className="mt-2 text-sm text-gray-500">
                                  {metric.latest_text_value ? "Text-based metric" : "Categorical metric"} - no numeric aggregation available
                                </div>
                              )}
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
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}