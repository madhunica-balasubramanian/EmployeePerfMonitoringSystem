"use client";

import { FormEvent, useState } from 'react';
import { Users } from "lucide-react";
import Link from "next/link";
import { useAuth } from './contexts/AuthContext';
import { AuthProvider } from './provider/auth-provider';
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login, error, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white">
            <span className="text-sm">?</span>
          </div>
          <h1 className="text-teal-600 text-xl font-medium">
            Federal Employee Wellness & Performance Monitoring System
          </h1>
        </div>
        <nav className="flex items-center gap-6">
          <Link href="/about" className="text-gray-700 hover:text-gray-900">
            About
          </Link>
          <Link href="/features" className="text-gray-700 hover:text-gray-900">
            Features
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-gray-900">
            Contact
          </Link>
          <button className="rounded-full w-8 h-8 bg-gray-100 flex items-center justify-center">
            <span className="text-lg">?</span>
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-r from-teal-400 to-blue-500">
        <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row h-full">
          {/* Left Side */}
          <div className="w-full md:w-1/2 text-white flex flex-col justify-center mb-8 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Employee Performance & Wellness Monitoring
            </h2>
            <p className="text-xl mb-8">
              Track performance metrics, monitor wellness indicators, and
              support your team's growth and wellbeing.
            </p>
            <div className="space-y-4">
              <button className="bg-white/20 backdrop-blur-sm text-white py-3 px-6 rounded-full flex items-center gap-2 hover:bg-white/30 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18"></path>
                  <path d="M18.4 9.4l-4.2 4.2-2.3-2.3-4.2 4.2"></path>
                </svg>
                Performance Tracking
              </button>
              <button className="bg-white/20 backdrop-blur-sm text-white py-3 px-6 rounded-full flex items-center gap-2 hover:bg-white/30 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Team Wellness
              </button>
              <button className="bg-white/20 backdrop-blur-sm text-white py-3 px-6 rounded-full flex items-center gap-2 hover:bg-white/30 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                </svg>
                Smart Alerts
              </button>
            </div>
          </div>

          {/* Right Side - Login Card */}
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-teal-500" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-center mb-4">Welcome Back</h2>
              <p className="text-center text-gray-600 mb-8">
                Login to access the employee wellness monitoring system
              </p>
              
              {/* Login Form */}
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                <div className="mb-4">
                  <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-1">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-500 text-white py-3 rounded-md font-medium mb-4 hover:bg-teal-600 transition disabled:opacity-50"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>

              <div className="mt-12 text-center">
                <p className="text-gray-600">
                  EmpWell Performance & Wellness System v1.0
                </p>
                <p className="text-gray-500 text-sm">
                  © 2025 EmpWell Technologies
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}