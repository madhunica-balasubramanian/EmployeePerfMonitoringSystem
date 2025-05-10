"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, Mail, Phone, MapPin, Calendar, Users, Award, Briefcase } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import apiService from "../../../services/api.service";

export default function EmployeeDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  
  useEffect(() => {
    async function fetchEmployeeData() {
      try {
        setLoading(true);
        // Fetch employee profile from the correct endpoint
        const response = await apiService.get(`/users/employees/${id}`);
        setEmployeeData(response);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching employee data:', err);
        setError('Failed to load employee data');
        setLoading(false);
      }
    }
    
    if (id) {
      fetchEmployeeData();
    }
  }, [id]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-t-teal-500 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading employee details...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="text-red-500 text-5xl mb-4">!</div>
        <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
        <p className="text-gray-600 mb-4">{error}</p>
        <Link 
          href="/supervisor/dashboard" 
          className="inline-block px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
  
  if (!employeeData) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="text-yellow-500 text-5xl mb-4">?</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">No Data Found</h1>
        <p className="text-gray-600 mb-4">No employee data found for this ID.</p>
        <Link 
          href="/supervisor/dashboard" 
          className="inline-block px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );

  // Destructure employee data for easier access
  const {
    username,
    email,
    first_name,
    last_name,
    role,
    department_id,
    department_role,
    is_active,
    employee_id,
    department,
    created_at
  } = employeeData;

  // Format date from ISO string
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-8">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employee Profile</h1>
            <p className="text-gray-600">{employee_id} • {department?.name || 'Department'}</p>
          </div>
          <Link
            href="/supervisor/dashboard"
            className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 inline-flex items-center"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left sidebar */}
          <div className="md:w-1/3">
            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
              {/* Employee profile card */}
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 text-center">
                <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-teal-600 text-3xl font-bold">
                    {first_name?.charAt(0)}{last_name?.charAt(0)}
                  </span>
                </div>
                <h2 className="text-white text-2xl font-bold">
                  {first_name} {last_name}
                </h2>
                <p className="text-teal-100">{department_role?.replace('_', ' ')}</p>
                
                <div className="mt-4 inline-block bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm text-white">
                  {is_active ? 'Active Employee' : 'Inactive Employee'}
                </div>
              </div>
              
              {/* Contact info */}
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-600">
                    <Mail size={18} className="mr-3 text-teal-500" />
                    <span>{email}</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <Phone size={18} className="mr-3 text-teal-500" />
                    <span>{employeeData.phone_number || 'Not provided'}</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <MapPin size={18} className="mr-3 text-teal-500" />
                    <span>{employeeData.address || 'Not provided'}</span>
                  </li>
                </ul>
              </div>
              
              {/* Department info */}
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Department Information</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-600">
                    <Users size={18} className="mr-3 text-teal-500" />
                    <span>{department?.name || 'Not assigned'}</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <Briefcase size={18} className="mr-3 text-teal-500" />
                    <span>{department_role?.replace('_', ' ') || 'Not assigned'}</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <Calendar size={18} className="mr-3 text-teal-500" />
                    <span>
                      {employeeData.hire_date 
                        ? formatDate(employeeData.hire_date) 
                        : 'Hire date not available'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="md:w-2/3">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Tabs */}
              <div className="border-b">
                <nav className="flex">
                  <button
                    onClick={() => handleTabChange('profile')}
                    className={`px-6 py-4 text-sm font-medium ${
                      activeTab === 'profile'
                        ? 'text-teal-600 border-b-2 border-teal-500'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Profile Details
                  </button>
                  <button
                    onClick={() => handleTabChange('performance')}
                    className={`px-6 py-4 text-sm font-medium ${
                      activeTab === 'performance'
                        ? 'text-teal-600 border-b-2 border-teal-500'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Performance
                  </button>
                  <button
                    onClick={() => handleTabChange('wellness')}
                    className={`px-6 py-4 text-sm font-medium ${
                      activeTab === 'wellness'
                        ? 'text-teal-600 border-b-2 border-teal-500'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Wellness
                  </button>
                </nav>
              </div>

              {/* Tab content */}
              <div className="p-6">
                {activeTab === 'profile' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Employee Profile</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Username</h4>
                        <p className="text-gray-900">{username}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Employee ID</h4>
                        <p className="text-gray-900">{employee_id}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                        <p className="text-gray-900">{email}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
                        <p className="text-gray-900">
                          <span 
                            className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                              is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {is_active ? 'Active' : 'Inactive'}
                          </span>
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Department</h4>
                        <p className="text-gray-900">{department?.name || 'Not assigned'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Role</h4>
                        <p className="text-gray-900">{department_role?.replace('_', ' ') || 'Not assigned'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Emergency Contact</h4>
                        <p className="text-gray-900">
                          {employeeData.emergency_contact_name ? (
                            <>
                              {employeeData.emergency_contact_name} 
                              {employeeData.emergency_contact_phone && ` • ${employeeData.emergency_contact_phone}`}
                            </>
                          ) : (
                            'Not provided'
                          )}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Employee Since</h4>
                        <p className="text-gray-900">{formatDate(created_at)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'performance' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold">Performance Metrics</h3>
                      <Link
                        href={`/supervisor/performance/${id}`}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                      >
                        View Detailed Performance
                      </Link>
                    </div>
                    <p className="text-gray-600">
                      View detailed performance metrics for this employee on the performance dashboard.
                    </p>
                  </div>
                )}

                {activeTab === 'wellness' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold">Wellness Metrics</h3>
                      <Link
                        href={`/supervisor/wellness/${id}`}
                        className="px-3 py-1 bg-teal-500 text-white text-sm rounded hover:bg-teal-600"
                      >
                        View Wellness Data
                      </Link>
                    </div>
                    <p className="text-gray-600">
                      View detailed wellness metrics for this employee on the wellness dashboard.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}