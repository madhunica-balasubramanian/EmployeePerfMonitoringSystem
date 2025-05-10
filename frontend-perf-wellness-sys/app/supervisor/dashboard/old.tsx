// app/supervisor/dashboard/page.tsx
"use client";

import { BarChart, Bell, Building, Calendar, FileText, Home, Search, Settings, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SupervisorDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock employee data
  const employees = [
    { id: 1, name: "John Doe", department: "IT", performanceScore: 87, wellnessScore: 72 },
    { id: 2, name: "Jane Smith", department: "HR", performanceScore: 92, wellnessScore: 85 },
    { id: 3, name: "Robert Johnson", department: "IT", performanceScore: 79, wellnessScore: 65 },
    { id: 4, name: "Emily Davis", department: "Finance", performanceScore: 94, wellnessScore: 89 },
    { id: 5, name: "Michael Brown", department: "IT", performanceScore: 81, wellnessScore: 77 },
  ];

  const filteredEmployees = searchQuery 
    ? employees.filter(emp => 
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        emp.department.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : employees;

  return (
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
            href="/supervisor/employees" 
            className={`flex items-center gap-3 px-4 py-3 rounded-md ${activeTab === 'employees' ? 'bg-teal-50 text-teal-600' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('employees')}
          >
            <Users size={18} />
            <span>Employees</span>
          </Link>
          <Link 
            href="/supervisor/departments" 
            className={`flex items-center gap-3 px-4 py-3 rounded-md ${activeTab === 'departments' ? 'bg-teal-50 text-teal-600' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('departments')}
          >
            <Building size={18} />
            <span>Departments</span>
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
          <Link 
            href="/supervisor/calendar" 
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
          <h1 className="text-xl font-semibold">Supervisor Dashboard</h1>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-600 hover:text-gray-900">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-700 font-medium">SK</span>
              </div>
              <span className="font-medium">Sarah Kim</span>
            </div>
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Team Overview</h2>
            <p className="text-gray-600">Monitor your team's performance and wellness metrics.</p>
          </div>

          {/* Department Summary Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-500 text-sm">Team Members</p>
                  <h3 className="text-3xl font-bold mt-1">15</h3>
                </div>
                <div className="p-2 bg-blue-50 rounded-md text-blue-500">
                  <Users size={20} />
                </div>
              </div>
              <p className="text-sm text-gray-500">2 new hires this month</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-500 text-sm">Avg. Performance</p>
                  <h3 className="text-3xl font-bold mt-1">86<span className="text-lg text-gray-500">/100</span></h3>
                </div>
                <div className="p-2 bg-teal-50 rounded-md text-teal-500">
                  <BarChart size={20} />
                </div>
              </div>
              <p className="text-sm text-green-500">↑ 3.2% from last month</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-500 text-sm">Avg. Wellness Score</p>
                  <h3 className="text-3xl font-bold mt-1">78<span className="text-lg text-gray-500">/100</span></h3>
                </div>
                <div className="p-2 bg-purple-50 rounded-md text-purple-500">
                  <FileText size={20} />
                </div>
              </div>
              <p className="text-sm text-red-500">↓ 1.5% from last month</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-500 text-sm">Flagged Issues</p>
                  <h3 className="text-3xl font-bold mt-1">3</h3>
                </div>
                <div className="p-2 bg-red-50 rounded-md text-red-500">
                  <Bell size={20} />
                </div>
              </div>
              <p className="text-sm text-gray-500">Requires your attention</p>
            </div>
          </div>

          {/* Employee Search */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Employee Directory</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-md w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wellness</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map(employee => (
                    <tr key={employee.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-gray-600">{employee.name.charAt(0)}</span>
                          </div>
                          <span className="font-medium">{employee.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{employee.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-24 h-2 bg-gray-100 rounded-full mr-2">
                            <div className="h-2 bg-teal-500 rounded-full" style={{ width: `${employee.performanceScore}%` }}></div>
                          </div>
                          <span className="text-gray-700">{employee.performanceScore}/100</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-24 h-2 bg-gray-100 rounded-full mr-2">
                            <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${employee.wellnessScore}%` }}></div>
                          </div>
                          <span className="text-gray-700">{employee.wellnessScore}/100</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-blue-600 hover:text-blue-800">View Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Alerts Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Alerts</h3>
            <div className="space-y-4">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex justify-between">
                  <div className="flex">
                    <Bell size={20} className="text-red-500 mr-2" />
                    <p className="font-medium text-red-800">Michael Brown has missed 3 consecutive wellness check-ins</p>
                  </div>
                  <span className="text-sm text-gray-500">2 hours ago</span>
                </div>
              </div>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
  <div className="flex justify-between">
    <div className="flex">
      <Bell size={20} className="text-yellow-500 mr-2" />
      <p className="font-medium text-yellow-800">Jane Smith's performance score dropped by 8% this week</p>
    </div>
    <span className="text-sm text-gray-500">Yesterday</span>
  </div>
</div>

<div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
  <div className="flex justify-between">
    <div className="flex">
      <Bell size={20} className="text-blue-500 mr-2" />
      <p className="font-medium text-blue-800">Quarterly department performance report is ready for review</p>
    </div>
    <span className="text-sm text-gray-500">3 days ago</span>
  </div>
</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}