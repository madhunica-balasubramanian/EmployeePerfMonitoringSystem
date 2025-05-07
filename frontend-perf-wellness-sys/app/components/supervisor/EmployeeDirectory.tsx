"use client";

import { useState, useEffect } from "react";
import { Search, Users } from "lucide-react";
import apiService from "../../services/api.service";
import { useAuth } from "../../contexts/AuthContext";



interface Employee {
  id: string;
  name: string;
  department: string;
  first_name: string;
  last_name: string;
  performanceMetricsCount: number;
  wellnessMetricsCount: number;
}

// Simplified Employee Directory component for Supervisor Dashboard
export const EmployeeDirectory = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        // Get the current year
        const currentYear = new Date().getFullYear();
        
        // Fetch employee metrics for the department
        const response = await apiService.get(
          `/metric-records/department/employee-metrics?year=${currentYear}`
        );
        
        console.log('EmployeeDirectory API Response:', response);
        
        if (response && Array.isArray(response)) {
          // Process the data to get employees with metric counts
          const employeeMap = new Map<string, Employee>();
          
          response.forEach(emp => {
            const employeeId = emp.employee_id;
            const fullName = `${emp.first_name} ${emp.last_name}`;
            
            if (!employeeMap.has(employeeId)) {
              employeeMap.set(employeeId, {
                id: employeeId,
                name: fullName,
                first_name: emp.first_name,
                last_name: emp.last_name,
                department: "Your Department", // You might want to get this from the API
                performanceMetricsCount: 0,
                wellnessMetricsCount: 0
              });
            }
            
            // Count metrics by type
            const employee = employeeMap.get(employeeId);
            if (employee && emp.metrics) {
              const performanceCount = emp.metrics.filter(
                metric => metric.metric_type.toLowerCase() === "performance"
              ).length;
              
              const wellnessCount = emp.metrics.filter(
                metric => metric.metric_type.toLowerCase() === "wellness"
              ).length;
              
              employee.performanceMetricsCount = performanceCount;
              employee.wellnessMetricsCount = wellnessCount;
            }
          });
          
          const employeeList = Array.from(employeeMap.values());
          setEmployees(employeeList);
          setFilteredEmployees(employeeList);
        } else {
          console.log('No employee data returned from API');
          setEmployees([]);
          setFilteredEmployees([]);
        }
      } catch (err) {
        console.error("Error fetching employees:", err);
        //setError(err.message || "Failed to load employee data");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Handle search input changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEmployees(employees);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = employees.filter(emp => 
        emp.name.toLowerCase().includes(query) || 
        emp.id.toLowerCase().includes(query)
      );
      setFilteredEmployees(filtered);
    }
  }, [searchQuery, employees]);

  // Search for a specific employee by ID
  const handleEmployeeSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      // Use the search by ID endpoint
      const response = await apiService.get(
        `/metric-records/employee/search-by-id/${searchQuery}`
      );
      
      if (response) {
        // Process the employee data
        const employeeData = response;
        
        // Create a new employee object with the returned data
        const employee = {
          id: employeeData.employee_id,
          name: employeeData.full_name,
          first_name: employeeData.full_name.split(' ')[0],
          last_name: employeeData.full_name.split(' ')[1] || '',
          department: "Your Department",
          performanceMetricsCount: employeeData.performance_metrics?.length || 0,
          wellnessMetricsCount: employeeData.wellness_metrics?.length || 0
        };
        
        // Set this as the only filtered employee
        setFilteredEmployees([employee]);
      } else {
        // If no employee found, show empty results
        setFilteredEmployees([]);
      }
    } catch (err) {
      console.error("Error searching for employee:", err);
      setError(`No employee found with ID: ${searchQuery}`);
      setFilteredEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  // Reset search
  const handleResetSearch = () => {
    setSearchQuery("");
    setFilteredEmployees(employees);
    setError(null);
  };

  // Show loading state
  if (loading && employees.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Employee Metrics Directory</h3>
          <div className="animate-pulse w-64 h-10 bg-gray-200 rounded-md"></div>
        </div>
        <div className="animate-pulse">
          {[1, 2, 3, 4, 5].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 py-4 border-b border-gray-100">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/5"></div>
              </div>
              <div className="w-24 h-3 bg-gray-200 rounded"></div>
              <div className="w-24 h-3 bg-gray-200 rounded"></div>
              <div className="w-20 h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h3 className="text-lg font-semibold">Employee Metrics Directory</h3>
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative flex-1 md:flex-none">
            <input
              type="text"
              placeholder="Search by name or ID..."
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-md w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEmployeeSearch()}
            />
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button 
            onClick={handleEmployeeSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Search
          </button>
          {filteredEmployees.length !== employees.length && (
            <button 
              onClick={handleResetSearch}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {filteredEmployees.length === 0 && !loading && !error ? (
        <div className="text-center py-8">
          <Users size={48} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500">No employees found matching your search criteria.</p>
          <button 
            onClick={handleResetSearch}
            className="mt-2 text-blue-500 hover:underline"
          >
            View all employees
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance Records</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wellness Records</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map(employee => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600">{employee.name.charAt(0)}</span>
                      </div>
                      <span className="font-medium">{employee.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{employee.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {employee.performanceMetricsCount} records
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {employee.wellnessMetricsCount} records
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                  <a
                  href={`/supervisor/${employee.id}/employee`}
                  className="text-blue-600 hover:text-blue-800"
                  >
                  View Details
                </a>
                </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};