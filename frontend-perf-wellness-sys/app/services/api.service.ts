// services/api.service.ts

// Base API URL from environment variables (configure in .env file)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * API Service to handle communication with the backend
 */
class ApiService {
  /**
   * Get the stored authentication token
   * @returns The auth token or null if not present
   */
  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      //console.log ("I am going to print token" ,localStorage.getItem('token') );
      return localStorage.getItem('token');
    }
    return null;
  }

  /**
   * Create headers for API requests including auth token
   * @returns Headers object with auth token if available
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Handle API response and error checking
   * @param response Fetch response object
   * @returns Parsed response data
   */
  private async handleResponse(response: Response) {
    if (!response.ok) {
      // Try to parse error message from response
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.detail || `API Error: ${response.status}`);
      } catch (error) {
        // If can't parse error JSON, throw generic error
        if (error instanceof Error) throw error;
        throw new Error(`API Error: ${response.status}`);
      }
    }

    // Check if response is empty
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  }

  /**
   * Make a GET request to the API
   * @param endpoint API endpoint path (without base URL)
   * @param queryParams Optional query parameters
   * @returns Promise with response data
   */
  async get(endpoint: string, queryParams?: Record<string, string | number | boolean | undefined>) {
    let url = `${API_URL}${endpoint}`;
    
    // Add query parameters if provided
    if (queryParams) {
      const params = new URLSearchParams();
      
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
      
      const queryString = params.toString();
      if (queryString) {
        url += `${url.includes('?') ? '&' : '?'}${queryString}`;
      }
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  /**
   * Make a POST request to the API
   * @param endpoint API endpoint path (without base URL)
   * @param data Request body data
   * @returns Promise with response data
   */
  async post(endpoint: string, data: any) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    
    return this.handleResponse(response);
  }

  /**
   * Make a PUT request to the API
   * @param endpoint API endpoint path (without base URL)
   * @param data Request body data
   * @returns Promise with response data
   */
  async put(endpoint: string, data: any) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    
    return this.handleResponse(response);
  }

  /**
   * Make a DELETE request to the API
   * @param endpoint API endpoint path (without base URL)
   * @returns Promise with response data
   */
  async delete(endpoint: string) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  /**
   * Get department metrics with filtering options
   * @param filters Optional filter parameters
   * @returns Promise with department metrics data
   */
  async getDepartmentMetrics(filters: {
    year?: number;
    month?: number;
    metric_type?: string;
    start_date?: string;
    end_date?: string;
  } = {}) {
    return this.get('/metric-records/department/employee-metrics', filters);
  }

  /**
   * Search for employee by ID
   * @param employeeId The employee ID to search for
   * @returns Promise with employee data
   */
  async searchEmployeeById(employeeId: string) {
    return this.get(`/metric-records/employee/search-by-id/${employeeId}`);
  }

  /**
   * Get detailed metrics for a specific employee
   * @param employeeId Employee ID
   * @param filters Optional filter parameters
   * @returns Promise with employee metrics data
   */
  async getEmployeeMetrics(employeeId: string, filters: {
    year?: number;
    month?: number;
    metric_type?: string;
    start_date?: string;
    end_date?: string;
  } = {}) {
    return this.get(`/metric-records/employee/${employeeId}/metrics`, filters);
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
