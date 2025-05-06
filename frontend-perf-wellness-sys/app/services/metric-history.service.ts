// app/services/metric-history.service.ts
import axios from 'axios';
import AuthService from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface MetricRecord {
  id: number;
  metric_id: number;
  metric_name: string;
  metric_type: string;
  value_numeric: number | null;
  value_text: string | null;
  recorded_at: string;
  unit: string | null;
}

export interface AggregatedMetric {
  metric_id: number;
  metric_name: string;
  metric_type: string;
  avg_value: number | null;
  min_value: number | null;
  max_value: number | null;
  count: number;
  unit: string | null;
  latest_value: number | null;
  latest_text_value: string | null;
}

export interface MetricFilter {
  metric_type?: string;
  start_date?: string;
  end_date?: string;
  month?: number;
  year?: number;
}

class MetricHistoryService {
  async getMyMetrics(filters: MetricFilter = {}): Promise<MetricRecord[]> {
    try {
      // Construct query parameters
      const params = new URLSearchParams();
      
      if (filters.metric_type) {
        params.append('metric_type', filters.metric_type);
      }
      if (filters.start_date) {
        params.append('start_date', filters.start_date);
      }
      if (filters.end_date) {
        params.append('end_date', filters.end_date);
      }
      if (filters.month) {
        params.append('month', filters.month.toString());
      }
      if (filters.year) {
        params.append('year', filters.year.toString());
      }
      
      const response = await axios.get<MetricRecord[]>(
        `${API_URL}/metrics/employee/my-metrics?${params.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${AuthService.getToken()}`
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching metrics history:', error);
      throw error;
    }
  }

  async getMyAggregatedMetrics(filters: MetricFilter = {}): Promise<AggregatedMetric[]> {
    try {
      // Construct query parameters
      const params = new URLSearchParams();
      
      if (filters.metric_type) {
        params.append('metric_type', filters.metric_type);
      }
      if (filters.start_date) {
        params.append('start_date', filters.start_date);
      }
      if (filters.end_date) {
        params.append('end_date', filters.end_date);
      }
      if (filters.month) {
        params.append('month', filters.month.toString());
      }
      if (filters.year) {
        params.append('year', filters.year.toString());
      }
      
      const response = await axios.get<AggregatedMetric[]>(
        `${API_URL}/metrics/employee/my-aggregated-metrics?${params.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${AuthService.getToken()}`
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching aggregated metrics:', error);
      throw error;
    }
  }

  async getMetricsByDate(date: string, metric_type?: string): Promise<MetricRecord[]> {
    try {
      const params = new URLSearchParams();
      if (metric_type) {
        params.append('metric_type', metric_type);
      }
      
      const response = await axios.get<MetricRecord[]>(
        `${API_URL}/metrics/employee/metrics-by-date/${date}?${params.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${AuthService.getToken()}`
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching metrics for date:', error);
      throw error;
    }
  }
}

// Create an instance and export it - this is the key fix
const metricHistoryService = new MetricHistoryService();
export default metricHistoryService;