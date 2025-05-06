// app/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AuthService, { UserProfile } from '../services/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = AuthService.getToken();
    if (token) {
      setIsAuthenticated(true);
      loadUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await AuthService.getProfile();
      setUser(profile);
      setIsAuthenticated(true);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      setError('Failed to load user profile');
      setIsAuthenticated(false);
      setLoading(false);
      AuthService.logout();
    }
  };

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await AuthService.login({ username, password });
      const profile = await AuthService.getProfile();
      setUser(profile);
      setIsAuthenticated(true);
      setLoading(false);
  
      // ✅ Use the new profile object directly
      if (profile.role === 'EMPLOYEE') {
        router.push('/employee/dashboard');
      } else if (profile.role === 'SUPERVISOR') {
        router.push('/supervisor/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Invalid username or password');
      setLoading(false);
    }
  };
  

  const logout = () => {
    AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };