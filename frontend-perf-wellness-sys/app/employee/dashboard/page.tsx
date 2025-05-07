// app/employee/dashboard/page.tsx (updated)
"use client";

import { usePathname } from 'next/navigation';

import { BarChart, Bell, Calendar, FileText, Home, Settings, User } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import MetricService, { Metric } from "../../services/metric.service";
import EmployeeSidebar from "../../components/EmployeeSidebar";


export default function EmployeeDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { user, logout } = useAuth();
  const [performanceMetrics, setPerformanceMetrics] = useState<Metric[]>([]);
  const [wellnessMetrics, setWellnessMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Fetch performance metrics
        const performanceResponse = await MetricService.getPerformanceMetrics();
        
        // Fetch wellness metrics
        const wellnessResponse = await MetricService.getWellnessMetrics();
        
        setPerformanceMetrics(performanceResponse);
        setWellnessMetrics(wellnessResponse);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching metrics:', error);
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

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
            <h1 className="text-xl font-semibold">Employee Dashboard</h1>
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
              <h2 className="text-2xl font-bold mb-2">Welcome, {user?.first_name || 'Employee'}!</h2>
              <p className="text-gray-600">Here's your wellness and performance summary.</p>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm">Performance Metrics Available</p>
                    <h3 className="text-3xl font-bold mt-1">{loading ? '-' : performanceMetrics.length}</h3>
                  </div>
                  <span className="bg-teal-50 p-2 rounded-md text-teal-600">
                    <BarChart size={20} />
                  </span>
                </div>
                <div className="mt-4">
                  <Link 
                    href="/employee/performance" 
                    className="text-teal-600 font-medium hover:underline"
                  >
                    Submit Performance Data →
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm">Wellness Metrics Available</p>
                    <h3 className="text-3xl font-bold mt-1">{loading ? '-' : wellnessMetrics.length}</h3>
                  </div>
                  <span className="bg-blue-50 p-2 rounded-md text-blue-600">
                    <FileText size={20} />
                  </span>
                </div>
                <div className="mt-4">
                  <Link 
                    href="/employee/wellness" 
                    className="text-teal-600 font-medium hover:underline"
                  >
                    Submit Wellness Data →
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm">My Information</p>
                    <h3 className="text-xl font-bold mt-1">
                      {user?.first_name} {user?.last_name}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                  {user?.department_role
                  ?.toLowerCase()
                  .split('_')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ') || 'Employee'}
                  </p>
                    
                  </div>
                  <span className="bg-purple-50 p-2 rounded-md text-purple-600">
                    <User size={20} />
                  </span>
                </div>
                <div className="mt-4">
                  <Link 
                    href="/employee/profile" 
                    className="text-teal-600 font-medium hover:underline"
                  >
                    View Profile →
                  </Link>
                </div>
              </div>
            </div>

            {/* Available Metrics */}
<div className="bg-white rounded-2xl shadow-md p-6 mb-10">
  <h3 className="text-2xl font-semibold text-teal-700 mb-6">Your Available Metrics</h3>

  {loading ? (
    <div className="flex justify-center items-center py-10">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-500 border-t-transparent"></div>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Performance Metrics */}
      <div>
        <h4 className="text-lg font-medium text-teal-800 mb-4">Performance Metrics</h4>
        {performanceMetrics.length > 0 ? (
          <ul className="space-y-3">
            {performanceMetrics.slice(0, 5).map((metric) => (
              <li
                key={metric.id}
                className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-md"
              >
                <span className="text-gray-800">{metric.metric_name}</span>
                <span className="text-gray-500 text-sm">{metric.unit || 'N/A'}</span>
              </li>
            ))}
            {performanceMetrics.length > 5 && (
            <li className="mt-4 text-center">
            <Link
              href="/employee/performance"
              className="inline-block px-4 py-2 text-sm font-medium text-teal-700 bg-teal-50 rounded-md hover:bg-teal-100 transition-colors"
            >
              View All Performance Metrics →
            </Link>
          </li>
          )}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No performance metrics available</p>
        )}
      </div>

      {/* Wellness Metrics */}
      <div>
        <h4 className="text-lg font-medium text-teal-800 mb-4">Wellness Metrics</h4>
        {wellnessMetrics.length > 0 ? (
          <ul className="space-y-3">
            {wellnessMetrics.slice(0, 5).map((metric) => (
              <li
                key={metric.id}
                className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-md"
              >
                <span className="text-gray-800">{metric.metric_name}</span>
                <span className="text-gray-500 text-sm">{metric.unit || 'N/A'}</span>
              </li>
            ))}
            {wellnessMetrics.length > 5 && (
              <li className="text-center mt-3">
                <Link
                  href="/employee/wellness"
                  className="text-teal-600 font-medium hover:underline"
                >
                  View all Wellness metrics →
                </Link>
              </li>
            )}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No wellness metrics available</p>
        )}
      </div>
    </div>
  )}
</div>
        </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
