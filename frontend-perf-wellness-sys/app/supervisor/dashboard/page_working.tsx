"use client";

import { useState, useEffect } from "react";
import { BarChart, Bell, Building, Calendar, FileText, Home, Users } from "lucide-react";
import apiService from "../../services/api.service"; // Assume you have an API service

// Team Overview component for Supervisor Dashboard
export const TeamOverviewCards = () => {
  const [teamStats, setTeamStats] = useState({
    totalEmployees: 0,
    avgPerformance: 0,
    avgWellness: 0,
    flaggedIssues: 0,
    performanceTrend: 0,
    wellnessTrend: 0,
    newHires: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamStats = async () => {
      setLoading(true);
      try {
        // Get the current year and month
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        
        // Fetch employee metrics for the department
        const response = await apiService.get(
          `/api/v1/metric-records/department/employee-metrics?year=${currentYear}`
        );
        
        if (response && response.data) {
          // Process the data to calculate team statistics
          const employees = response.data;
          
          // Calculate total unique employees
          const uniqueEmployees = new Set(employees.map(emp => emp.employee_id));
          
          // Calculate average performance and wellness scores
          const performanceMetrics = employees.filter(
            record => record.metric_type === "PERFORMANCE" && record.value_numeric !== null
          );
          
          const wellnessMetrics = employees.filter(
            record => record.metric_type === "WELLNESS" && record.value_numeric !== null
          );
          
          // Calculate averages if metrics exist
          const avgPerformance = performanceMetrics.length > 0 
            ? performanceMetrics.reduce((sum, record) => sum + record.value_numeric, 0) / performanceMetrics.length
            : 0;
            
          const avgWellness = wellnessMetrics.length > 0
            ? wellnessMetrics.reduce((sum, record) => sum + record.value_numeric, 0) / wellnessMetrics.length
            : 0;
          
          // Get previous month's data to calculate trends
          const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
          const prevMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;
          
          const prevMonthResponse = await apiService.get(
            `/api/v1/metric-records/department/employee-metrics?year=${prevMonthYear}&month=${prevMonth}`
          );
          
          let performanceTrend = 0;
          let wellnessTrend = 0;
          
          if (prevMonthResponse && prevMonthResponse.data) {
            const prevPerformanceMetrics = prevMonthResponse.data.filter(
              record => record.metric_type === "PERFORMANCE" && record.value_numeric !== null
            );
            
            const prevWellnessMetrics = prevMonthResponse.data.filter(
              record => record.metric_type === "WELLNESS" && record.value_numeric !== null
            );
            
            const prevAvgPerformance = prevPerformanceMetrics.length > 0
              ? prevPerformanceMetrics.reduce((sum, record) => sum + record.value_numeric, 0) / prevPerformanceMetrics.length
              : 0;
              
            const prevAvgWellness = prevWellnessMetrics.length > 0
              ? prevWellnessMetrics.reduce((sum, record) => sum + record.value_numeric, 0) / prevWellnessMetrics.length
              : 0;
            
            // Calculate percentage change
            performanceTrend = prevAvgPerformance > 0 
              ? ((avgPerformance - prevAvgPerformance) / prevAvgPerformance) * 100
              : 0;
              
            wellnessTrend = prevAvgWellness > 0
              ? ((avgWellness - prevAvgWellness) / prevAvgWellness) * 100
              : 0;
          }
          
          // Get flagged issues (this would depend on your business logic)
          // For example, wellness scores below 60 or performance below 70 could be flagged
          const flaggedIssues = employees.filter(
            emp => (emp.metric_type === "WELLNESS" && emp.value_numeric < 60) ||
                  (emp.metric_type === "PERFORMANCE" && emp.value_numeric < 70)
          ).length;
          
          // Set the stats
          setTeamStats({
            totalEmployees: uniqueEmployees.size,
            avgPerformance: Math.round(avgPerformance),
            avgWellness: Math.round(avgWellness),
            flaggedIssues,
            performanceTrend: parseFloat(performanceTrend.toFixed(1)),
            wellnessTrend: parseFloat(wellnessTrend.toFixed(1)),
            newHires: 0 // This would require additional API data
          });
        }
      } catch (err) {
        console.error("Error fetching team stats:", err);
        setError(err.message || "Failed to load team statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamStats();
  }, []);

  // Show loading state while data is being fetched
  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6">
            <div className="animate-pulse flex flex-col">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Show error state if something went wrong
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-8">
        <p className="font-medium">Error loading team statistics</p>
        <p className="text-sm">{error}</p>
        <button 
          className="mt-2 text-sm bg-red-100 px-3 py-1 rounded-md hover:bg-red-200"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-gray-500 text-sm">Team Members</p>
            <h3 className="text-3xl font-bold mt-1">{teamStats.totalEmployees}</h3>
          </div>
          <div className="p-2 bg-blue-50 rounded-md text-blue-500">
            <Users size={20} />
          </div>
        </div>
        <p className="text-sm text-gray-500">
          {teamStats.newHires > 0 
            ? `${teamStats.newHires} new ${teamStats.newHires === 1 ? 'hire' : 'hires'} this month` 
            : "No new hires this month"}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-gray-500 text-sm">Avg. Performance</p>
            <h3 className="text-3xl font-bold mt-1">
              {teamStats.avgPerformance}<span className="text-lg text-gray-500">/100</span>
            </h3>
          </div>
          <div className="p-2 bg-teal-50 rounded-md text-teal-500">
            <BarChart size={20} />
          </div>
        </div>
        {teamStats.performanceTrend !== 0 && (
          <p className={`text-sm ${teamStats.performanceTrend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {teamStats.performanceTrend > 0 ? '↑' : '↓'} {Math.abs(teamStats.performanceTrend)}% from last month
          </p>
        )}
        {teamStats.performanceTrend === 0 && (
          <p className="text-sm text-gray-500">No change from last month</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-gray-500 text-sm">Avg. Wellness Score</p>
            <h3 className="text-3xl font-bold mt-1">
              {teamStats.avgWellness}<span className="text-lg text-gray-500">/100</span>
            </h3>
          </div>
          <div className="p-2 bg-purple-50 rounded-md text-purple-500">
            <FileText size={20} />
          </div>
        </div>
        {teamStats.wellnessTrend !== 0 && (
          <p className={`text-sm ${teamStats.wellnessTrend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {teamStats.wellnessTrend > 0 ? '↑' : '↓'} {Math.abs(teamStats.wellnessTrend)}% from last month
          </p>
        )}
        {teamStats.wellnessTrend === 0 && (
          <p className="text-sm text-gray-500">No change from last month</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-gray-500 text-sm">Flagged Issues</p>
            <h3 className="text-3xl font-bold mt-1">{teamStats.flaggedIssues}</h3>
          </div>
          <div className="p-2 bg-red-50 rounded-md text-red-500">
            <Bell size={20} />
          </div>
        </div>
        <p className="text-sm text-gray-500">
          {teamStats.flaggedIssues === 0 
            ? "No issues requiring attention" 
            : `${teamStats.flaggedIssues} ${teamStats.flaggedIssues === 1 ? 'issue requires' : 'issues require'} your attention`}
        </p>
      </div>
    </div>
  );
};