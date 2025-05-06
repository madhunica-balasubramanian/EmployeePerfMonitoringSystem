// app/employee/performance/page.tsx
"use client";

import { Bell, Calendar, ChevronLeft, ChevronRight, FileText, Home, LineChart, Plus, Settings, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function EmployeePerformance() {
  const [activeTab, setActiveTab] = useState("performance");
  const [showAddForm, setShowAddForm] = useState(false);

  // Mock performance data
  const performanceEntries = [
    { id: 1, date: "May 2, 2025", type: "Task Completion", metric: "Code Review", value: 95, notes: "Completed code review for the new API module ahead of schedule." },
    { id: 2, date: "Apr 28, 2025", type: "Project Milestone", metric: "Frontend Implementation", value: 85, notes: "Delivered the frontend implementation for the dashboard module." },
    { id: 3, date: "Apr 15, 2025", type: "Skill Assessment", metric: "React Proficiency", value: 92, notes: "Annual assessment of React development skills." },
    { id: 4, date: "Apr 10, 2025", type: "Task Completion", metric: "Bug Fixes", value: 88, notes: "Fixed critical bugs in the authentication system." },
    { id: 5, date: "Mar 25, 2025", type: "Project Milestone", metric: "Database Design", value: 90, notes: "Completed database schema design for the new module." },
  ];

  return (
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
            <LineChart size={18} />
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
          <h1 className="text-xl font-semibold">Performance Data</h1>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-600 hover:text-gray-900">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                <span className="text-teal-700 font-medium">JD</span>
              </div>
              <span className="font-medium">John Doe</span>
            </div>
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-1">Performance Tracking</h2>
              <p className="text-gray-600">Record and monitor your performance metrics</p>
            </div>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600"
            >
              <Plus size={16} />
              Add New Entry
            </button>
          </div>

          {/* Add Performance Entry Form */}
          {showAddForm && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Add Performance Entry</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Entry Type</label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option>Task Completion</option>
                    <option>Project Milestone</option>
                    <option>Skill Assessment</option>
                    <option>Training Completion</option>
                    <option>Peer Review</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" className="w-full p-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Metric Name</label>
                  <input type="text" className="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g. Code Review, Project Completion" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Score/Value (0-100)</label>
                  <input type="number" min="0" max="100" className="w-full p-2 border border-gray-300 rounded-md" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea className="w-full p-2 border border-gray-300 rounded-md" rows={3} placeholder="Add details about this performance entry"></textarea>
                </div>
                <div className="col-span-2 flex justify-end gap-3">
                  <button 
                    onClick={() => setShowAddForm(false)} 
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600">
                    Save Entry
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Performance Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
            <div className="grid grid-cols-4 gap-6">
              <div className="bg-teal-50 rounded-lg p-4">
                <p className="text-sm text-teal-700 mb-1">Current Average</p>
                <p className="text-3xl font-bold text-teal-800">88<span className="text-lg">/100</span></p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-700 mb-1">Last Month</p>
                <p className="text-3xl font-bold text-blue-800">86<span className="text-lg">/100</span></p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-purple-700 mb-1">Highest Score</p>
                <p className="text-3xl font-bold text-purple-800">95<span className="text-lg">/100</span></p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-700 mb-1">Trend</p>
                <p className="text-3xl font-bold text-green-800">+2.3%</p>
              </div>
            </div>

            {/* Chart placeholder - in a real app, you'd use a charting library */}
            <div className="mt-6 bg-gray-50 h-64 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Performance Trend Chart</p>
            </div>
          </div>

          {/* Performance Entries Table */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Recent Performance Entries</h3>
              <div className="flex items-center">
                <button className="p-1 rounded hover:bg-gray-100">
                  <ChevronLeft size={20} />
                </button>
                <span className="mx-3 text-sm">Page 1 of 3</span>
                <button className="p-1 rounded hover:bg-gray-100">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {performanceEntries.map(entry => (
                    <tr key={entry.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{entry.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{entry.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{entry.metric}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-20 h-2 bg-gray-100 rounded-full mr-2">
                            <div className="h-2 bg-teal-500 rounded-full" style={{ width: `${entry.value}%` }}></div>
                          </div>
                          <span className="text-sm text-gray-700">{entry.value}/100</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{entry.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}