"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../contexts/AuthContext";
import apiService from "../../../services/api.service";

export default function EmployeeDetailsPage() {
  const { id } = useParams();
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEmployeeData() {
      try {
        setLoading(true);
        // Use the ID from the URL to fetch the specific employee's data
        const response = await apiService.get(`/metric-records/employee/search-by-id/${id}`);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!employeeData) return <div>No employee data found</div>;

  return (
    <div>
      <h1>Employee Details: {id}</h1>
      {/* Display the employee data here */}
      <pre>{JSON.stringify(employeeData, null, 2)}</pre>
      <Link href="/supervisor/dashboard">Back to Dashboard</Link>
    </div>
  );
}