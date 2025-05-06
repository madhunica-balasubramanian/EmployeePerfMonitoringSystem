// app/employee/profile/page.tsx
"use client";

import { Bell, Calendar, Edit, FileText, Home, Settings, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function EmployeeProfile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);

  // Mock employee data
  const employee = {
    name: "John Doe",
    id: "EMP-1234",
    email: "john.doe@agency.gov",
    department: "IT",
    position: "Software Developer",
    joinDate: "Jan 15, 2022",
    supervisor: "Sarah Kim",
    phone: "(555) 123-4567",
    location: "Washington, DC Office",
    skills: ["JavaScript", "React", "Node.js", "Python", "AWS"],
    certifications: [
      { name: "AWS Certified Developer", date: "May 2023" },
      { name: "Scrum Master Certification", date: "Jan 2022" }
    ]
  };

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
            <FileText size={18} />
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
          <h1 className="text-xl font-semibold">My Profile</h1>
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
              <h2 className="text-2xl font-bold mb-1">Employee Profile</h2>
              <p className="text-gray-600">View and update your personal information</p>
            </div>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600"
            >
              <Edit size={16} />
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-teal-500 to-blue-500 h-32 p-6">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-white rounded-full border-4 border-white flex items-center justify-center text-2xl font-bold text-teal-600">
                  JD
                </div>
                <div className="text-white">
                  <h3 className="text-2xl font-bold">{employee.name}</h3>
                  <p>{employee.position}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm text-gray-500 mb-1">Employee ID</h4>
                  <p className="font-medium">{employee.id}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-500 mb-1">Department</h4>
                  <p className="font-medium">{employee.department}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-500 mb-1">Email</h4>
                  {isEditing ? (
                    <input 
                      type="email" 
                      defaultValue={employee.email}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  ) : (
                    <p className="font-medium">{employee.email}</p>
                  )}
                </div>
                <div>
                  <h4 className="text-sm text-gray-500 mb-1">Phone</h4>
                  {isEditing ? (
                    <input 
                      type="tel" 
                      defaultValue={employee.phone}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  ) : (
                    <p className="font-medium">{employee.phone}</p>
                  )}
                </div>
                <div>
                  <h4 className="text-sm text-gray-500 mb-1">Location</h4>
                  {isEditing ? (
                    <input 
                      type="text" 
                      defaultValue={employee.location}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  ) : (
                    <p className="font-medium">{employee.location}</p>
                  )}
                </div>
                <div>
                  <h4 className="text-sm text-gray-500 mb-1">Supervisor</h4>
                  <p className="font-medium">{employee.supervisor}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-500 mb-1">Joined</h4>
                  <p className="font-medium">{employee.joinDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Skills and Certifications */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Skills</h3>
              {isEditing ? (
                <div className="space-y-2">
                  {employee.skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input 
                        type="text" 
                        defaultValue={skill}
                        className="flex-1 p-2 border border-gray-300 rounded-md"
                      />
                      <button className="text-red-500">Remove</button>
                    </div>
                  ))}
                  <button className="mt-2 text-teal-600 font-medium">+ Add Skill</button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {employee.skills.map((skill, index) => (
                    <span key={index} className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Certifications</h3>
              {isEditing ? (
                <div className="space-y-3">
                  {employee.certifications.map((cert, index) => (
                    <div key={index} className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" 
                        defaultValue={cert.name}
                        className="p-2 border border-gray-300 rounded-md"
                        placeholder="Certification name"
                      />
                      <div className="flex items-center gap-2">
                        <input 
                          type="text" 
                          defaultValue={cert.date}
                          className="flex-1 p-2 border border-gray-300 rounded-md"
                          placeholder="Date"
                        />
                        <button className="text-red-500">X</button>
                      </div>
                    </div>
                  ))}
                  <button className="mt-2 text-teal-600 font-medium">+ Add Certification</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {employee.certifications.map((cert, index) => (
                    <div key={index} className="flex justify-between items-center pb-2 border-b border-gray-100 last:border-b-0">
                      <span className="font-medium">{cert.name}</span>
                      <span className="text-sm text-gray-500">{cert.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Password Change Section */}
          {isEditing && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Change Password</h3>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Current Password</label>
                  <input type="password" className="w-full p-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">New Password</label>
                  <input type="password" className="w-full p-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Confirm Password</label>
                  <input type="password" className="w-full p-2 border border-gray-300 rounded-md" />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}   
