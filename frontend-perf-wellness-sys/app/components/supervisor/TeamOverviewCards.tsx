"use client";

import { useState, useEffect } from "react";
import { BarChart, FileText, Users } from "lucide-react";
import apiService from "../../services/api.service";
import { useAuth } from "../../contexts/AuthContext";

interface Metric {
  metric_id: number;
  metric_name: string;
  metric_type: string;
  value_numeric: number | null;
  value_text: string | null;
  recorded_at: string;
  unit: string | null;
}

interface Employee {
  employee_id: string;
  first_name: string;
  last_name: string;
  metrics: Metric[];
}

// Simplified Team Overview component for Supervisor Dashboard
export const TeamOverviewCards = () => {
  const [teamStats, setTeamStats] = useState({
    totalEmployees: 0,
    totalPerformanceMetrics: 0,
    totalWellnessMetrics: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTeamStats = async () => {
      setLoading(true);
      try {
        // Get the current year
        const now = new Date();
        const currentYear = now.getFullYear();
        
        console.log(`Fetching metrics for year: ${currentYear}`);
        
        // Fetch employee metrics for the department
        const response = await apiService.get(
          `/metric-records/department/employee-metrics?year=${currentYear}`
        );
        
        console.log('API Response:', response);
        
        const employees = response;
        
        if (employees && employees.length > 0) {
          console.log('Employees data:', employees);
          console.log('Number of employees:', employees.length);
          
          // Count total employees
          const totalEmployees = employees.length;
          
          // Collect all metrics from all employees
          const allMetrics = [];
          employees.forEach(employee => {
            if (employee.metrics && Array.isArray(employee.metrics)) {
              allMetrics.push(...employee.metrics);
            }
          });
          
          console.log(`Total metrics collected: ${allMetrics.length}`);
          
          // Count performance and wellness metrics
          const performanceMetrics = allMetrics.filter(
            metric => metric.metric_type.toLowerCase() === "performance"
          );
          
          const wellnessMetrics = allMetrics.filter(
            metric => metric.metric_type.toLowerCase() === "wellness"
          );
          
          console.log(`Found ${performanceMetrics.length} performance metrics`);
          console.log(`Found ${wellnessMetrics.length} wellness metrics`);
          
          // Set the simplified stats
          setTeamStats({
            totalEmployees,
            totalPerformanceMetrics: performanceMetrics.length,
            totalWellnessMetrics: wellnessMetrics.length
          });
        } else {
          console.log('No data returned from API');
          // Set default values if no data
          setTeamStats({
            totalEmployees: 0,
            totalPerformanceMetrics: 0,
            totalWellnessMetrics: 0
          });
        }
      } catch (err) {
        console.error("Error fetching team stats:", err);
        //setError(err.message || "Failed to load team statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamStats();
  }, []);

  // Show loading state while data is being fetched
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((_, i) => (
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
        <p className="text-sm text-gray-500">Total active team members</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-gray-500 text-sm">Performance Records</p>
            <h3 className="text-3xl font-bold mt-1">{teamStats.totalPerformanceMetrics}</h3>
          </div>
          <div className="p-2 bg-teal-50 rounded-md text-teal-500">
            <BarChart size={20} />
          </div>
        </div>
        <p className="text-sm text-gray-500">Total performance metrics submitted</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-gray-500 text-sm">Wellness Records</p>
            <h3 className="text-3xl font-bold mt-1">{teamStats.totalWellnessMetrics}</h3>
          </div>
          <div className="p-2 bg-purple-50 rounded-md text-purple-500">
            <FileText size={20} />
          </div>
        </div>
        <p className="text-sm text-gray-500">Total wellness metrics submitted</p>
      </div>
    </div>
  );
};