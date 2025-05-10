// app/services/metric.service.ts
import axios from 'axios';
import AuthService from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface Metric {
  id: number;
  metric_name: string;
  metric_type: string;
  unit: string | null;
  metric_description?: string;
}

export interface MetricSubmission {
  metric_id: number;
  value_numeric?: number | null;
  value_text?: string | null;
  value_json?: any | null;
}

export interface BulkMetricSubmission {
  date: string;
  metrics: MetricSubmission[];
}

class MetricService {
  async getAvailableMetrics() {
    try {
      const response = await axios.get<Metric[]>(
        `${API_URL}/metric-records/employee/available-metrics`,
        {
          headers: {
            'Authorization': `Bearer ${AuthService.getToken()}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching available metrics:', error);
      throw error;
    }
  }

  async getPerformanceMetrics() {
    try {
      const response = await axios.get<Metric[]>(
        `${API_URL}/metric-records/employee/performance-metrics`,
        {
          headers: {
            'Authorization': `Bearer ${AuthService.getToken()}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      throw error;
    }
  }

  async getWellnessMetrics() {
    try {
      const response = await axios.get<Metric[]>(
        `${API_URL}/metric-records/employee/wellness-metrics`,
        {
          headers: {
            'Authorization': `Bearer ${AuthService.getToken()}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching wellness metrics:', error);
      throw error;
    }
  }

  async submitMetrics(data: BulkMetricSubmission) {
    try {
      const response = await axios.post(
        `${API_URL}/metric-records/employee-submit-metrics`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${AuthService.getToken()}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error submitting metrics:', error);
      throw error;
    }
  }
}

export default new MetricService();
