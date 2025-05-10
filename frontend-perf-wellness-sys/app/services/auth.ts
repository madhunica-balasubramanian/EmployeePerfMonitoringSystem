// app/services/auth.ts

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface Department {
  id: number;
  name: string;
  type?: string;
  description?: string;
};

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface UserProfile {
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  department_role: string;
  department_id: number;
  employee_id: string;
  department?: {
    id: number;
    name: string;
    type?: string;
    description?: string;
  };
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    try {
      const response = await axios.post<AuthResponse>(
        `${API_URL}/auth/login`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      // Store the token in localStorage
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async getProfile(): Promise<UserProfile> {
    try {
      const response = await axios.get<UserProfile>(
        `${API_URL}/profile/me`,
        {
          headers: {
            'Authorization': `Bearer ${this.getToken()}`
          }
        }
      );
      console.log("User from backend:", response.data);
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    // If you're using Next.js, you might want to redirect to the login page
    window.location.href = '/';
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default new AuthService();
