// app/employee/dashboard/page.tsx
"use client";

import { BarChart, Bell, Calendar, FileText, Home, Settings, User } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export default function EmployeeDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { user, logout } = useAuth();
  const [performanceMetrics, setPerformanceMetrics] = useState([]);
  const [wellnessMetrics, setWellnessMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch performance metrics
        const performanceResponse = await axios.get(
          `${API_URL}/metric-records/employee/performance-metrics`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        // Fetch wellness metrics
        const wellnessResponse = await axios.get(
          `${API_URL}/metric-records/employee/wellness-metrics`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        setPerformanceMetrics(performanceResponse.data);
        setWellnessMetrics(wellnessResponse.data);
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
                    <p className="text-gray-500 text-sm">Current Performance Rating</p>
                    <h3 className="text-3xl font-bold mt-1">87<span className="text-lg text-gray-500">/100</span></h3>
                  </div>
                  <span className="text-green-500 font-semibold bg-green-50 px-2 py-1 rounded text-sm">+4.2%</span>
                </div>
                <div className="mt-4 h-2 bg-gray-100 rounded-full">
                  <div className="h-2 bg-teal-500 rounded-full" style={{ width: '87%' }}></div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm">Wellness Score</p>
                    <h3 className="text-3xl font-bold mt-1">72<span className="text-lg text-gray-500">/100</span></h3>
                  </div>
                  <span className="text-red-500 font-semibold bg-red-50 px-2 py-1 rounded text-sm">-2.1%</span>
                </div>
                <div className="mt-4 h-2 bg-gray-100 rounded-full">
                  <div className="h-2 bg-blue-500 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm">Tasks Completed</p>
                    <h3 className="text-3xl font-bold mt-1">23<span className="text-lg text-gray-500">/30</span></h3>
                  </div>
                  <span className="text-gray-500 font-semibold bg-gray-50 px-2 py-1 rounded text-sm">76%</span>
                </div>
                <div className="mt-4 h-2 bg-gray-100 rounded-full">
                  <div className="h-2 bg-purple-500 rounded-full" style={{ width: '76%' }}></div>
                </div>
              </div>
            </div>

            {/* Available Metrics */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Your Available Metrics</h3>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Performance Metrics</h4>
                    {performanceMetrics.length > 0 ? (
                      <ul className="space-y-2">
                        {performanceMetrics.map((metric: any) => (
                          <li key={metric.id} className="p-2 bg-gray-50 rounded flex justify-between">
                            <span>{metric.metric_name}</span>
                            <span className="text-gray-500 text-sm">{metric.unit || 'N/A'}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No performance metrics available</p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Wellness Metrics</h4>
                    {wellnessMetrics.length > 0 ? (
                      <ul className="space-y-2">
                        {wellnessMetrics.map((metric: any) => (
                          <li key={metric.id} className="p-2 bg-gray-50 rounded flex justify-between">
                            <span>{metric.metric_name}</span>
                            <span className="text-gray-500 text-sm">{metric.unit || 'N/A'}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No wellness metrics available</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Activity Form */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Submit Today's Metrics</h3>
              <p className="text-gray-500 mb-4">
                Track your daily performance and wellness metrics to help monitor your progress.
              </p>
              <Link 
                href="/employee/performance"
                className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 inline-block mr-4"
              >
                Submit Performance Metrics
              </Link>
              <Link 
                href="/employee/wellness"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 inline-block"
              >
                Submit Wellness Metrics
              </Link>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}