// app/supervisor/dashboard/page.tsx
"use client";

import { useState } from "react";
import { BarChart, Bell, Building, Calendar, FileText, Home, Settings, Users } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext"; 
import ProtectedRoute from "../../components/ProtectedRoute";
import { TeamOverviewCards } from "../../components/supervisor/TeamOverviewCards";
import { EmployeeDirectory } from "../../components/supervisor/EmployeeDirectory";
import { AlertsSection } from "../../components/supervisor/AlertsSection";

export default function SupervisorDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute requiredRole="SUPERVISOR">
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold text-teal-600">EmpWell System</h2>
            <p className="text-sm text-gray-500">Supervisor Portal</p>
          </div>
          <nav className="p-4 space-y-1">
            <Link 
              href="/supervisor/dashboard" 
              className={`flex items-center gap-3 px-4 py-3 rounded-md ${activeTab === 'overview' ? 'bg-teal-50 text-teal-600' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('overview')}
            >
              <Home size={18} />
              <span>Dashboard</span>
            </Link>
            <Link 
              href="/supervisor/performance" 
              className={`flex items-center gap-3 px-4 py-3 rounded-md ${activeTab === 'performance' ? 'bg-teal-50 text-teal-600' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('performance')}
            >
              <BarChart size={18} />
              <span>Performance Reports</span>
            </Link>
            <Link 
              href="/supervisor/wellness" 
              className={`flex items-center gap-3 px-4 py-3 rounded-md ${activeTab === 'wellness' ? 'bg-teal-50 text-teal-600' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('wellness')}
            >
              <FileText size={18} />
              <span>Wellness Reports</span>
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-auto">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">Supervisor Dashboard</h1>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-700 font-medium">
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
          <main className="flex-1 p-6 overflow-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Team Overview</h2>
              <p className="text-gray-600">Monitor your team's performance and wellness metrics.</p>
            </div>

            {/* Team Overview Cards Component */}
            <TeamOverviewCards />

            {/* Employee Directory Component */}
            <EmployeeDirectory />

            {/* Alerts Section Component */}
            <AlertsSection />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}