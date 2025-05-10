"use client";

import { useState, useEffect } from "react";
import { Bell, FileText, Calendar, Users, AlertCircle } from "lucide-react";
import apiService from "../../services/api.service";
import { useAuth } from "../../contexts/AuthContext";

interface Metric {
  metric_id: number;
  metric_name: string;
  metric_type: string;
  value_numeric: number | null;
  value_text: string | null;
  recorded_at: string;
  unit: string | null;
}

interface Employee {
  employee_id: string;
  first_name: string;
  last_name: string;
  metrics: Metric[];
}

interface ActivityItem {
  employeeId: string;
  employeeName: string;
  activityType: 'performance' | 'wellness' | 'missed';
  metricName?: string;
  date: Date;
  description: string;
}

// Simplified Alerts Section for Supervisor Dashboard
export const AlertsSection = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecentActivity = async () => {
      setLoading(true);
      try {
        // Get the current date and a week ago
        const now = new Date();
        const endDate = now.toISOString().split('T')[0];
        
        // 7 days ago
        const startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        const formattedStartDate = startDate.toISOString().split('T')[0];
        
        // Fetch employee metrics for the last week
        const response = await apiService.get(
          `/metric-records/department/employee-metrics?start_date=${formattedStartDate}&end_date=${endDate}`
        );
        
        console.log('Recent activity response:', response);
        
        if (response && Array.isArray(response)) {
          const employees: Employee[] = response;
          const recentActivities: ActivityItem[] = [];
          
          // Process each employee's recent activities
          employees.forEach(employee => {
            const employeeName = `${employee.first_name} ${employee.last_name}`;
            
            // Track if an employee has any metrics
            let hasMetrics = false;
            
            if (employee.metrics && employee.metrics.length > 0) {
              hasMetrics = true;
              
              // Sort metrics by date (most recent first)
              const sortedMetrics = [...employee.metrics].sort(
                (a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()
              );
              
              // Take the 3 most recent metrics
              const recentMetrics = sortedMetrics.slice(0, 3);
              
              recentMetrics.forEach(metric => {
                const activityDate = new Date(metric.recorded_at);
                const activityType = metric.metric_type.toLowerCase() === 'performance' ? 'performance' : 'wellness';
                
                recentActivities.push({
                  employeeId: employee.employee_id,
                  employeeName,
                  activityType: activityType as 'performance' | 'wellness',
                  metricName: metric.metric_name,
                  date: activityDate,
                  description: `${employeeName} submitted ${metric.metric_name} data`
                });
              });
            }
            
            // Check for employees with no metrics (missing check-ins)
            if (!hasMetrics) {
              recentActivities.push({
                employeeId: employee.employee_id,
                employeeName,
                activityType: 'missed',
                date: now,
                description: `${employeeName} has no recent activity`
              });
            }
          });
          
          // Sort by date (newest first)
          recentActivities.sort((a, b) => b.date.getTime() - a.date.getTime());
          
          // Keep only the 5 most recent activities
          setActivities(recentActivities.slice(0, 5));
        } else {
          setActivities([]);
        }
      } catch (err) {
        console.error("Error fetching recent activity:", err);
        setError(err instanceof Error ? err.message : "Failed to load recent activity");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, []);

  // Format the date for display
  const formatDate = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Less than 24 hours
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000));
      return hours === 0 ? 'Just now' : `${hours} hour${hours === 1 ? '' : 's'} ago`;
    }
    
    // Less than 7 days
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      return `${days} day${days === 1 ? '' : 's'} ago`;
    }
    
    // Format the date
    return date.toLocaleDateString();
  };

  // Get icon based on activity type
  const getActivityIcon = (type: 'performance' | 'wellness' | 'missed') => {
    switch (type) {
      case 'performance':
        return <FileText className="text-teal-500" size={18} />;
      case 'wellness':
        return <Users className="text-blue-500" size={18} />;
      case 'missed':
        return <Calendar className="text-red-500" size={18} />;
      default:
        return <Bell size={18} />;
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Team Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-50 p-4 rounded">
              <div className="flex justify-between">
                <div className="flex">
                  <div className="w-5 h-5 bg-gray-200 rounded-full mr-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-48"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Team Activity</h3>
        <div className="bg-red-50 p-4 rounded-md flex items-start">
          <AlertCircle className="text-red-500 mr-2 flex-shrink-0 mt-1" size={16} />
          <div>
            <p className="text-red-700">Failed to load recent activity</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Team Activity</h3>
      
      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-gray-50 p-6 rounded-md">
          <Bell size={32} className="text-gray-300 mb-2" />
          <p className="text-gray-500">No recent activity</p>
          <p className="text-sm text-gray-400 mt-1">Activity from your team will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border-l-4 ${
                activity.activityType === 'performance' 
                  ? 'bg-teal-50 border-teal-500' 
                  : activity.activityType === 'wellness'
                    ? 'bg-blue-50 border-blue-500'
                    : 'bg-red-50 border-red-500'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <div className="mt-0.5 mr-3">
                    {getActivityIcon(activity.activityType)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{activity.description}</p>
                    {activity.metricName && (
                      <p className="text-sm text-gray-600 mt-1">
                        Metric: {activity.metricName}
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-500">{formatDate(activity.date)}</span>
              </div>
              <div className="mt-2 ml-8">
                <a 
                  href={`/supervisor/employee/${activity.employeeId}`} 
                  className="text-sm text-blue-600 hover:underline"
                >
                  View Employee
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};