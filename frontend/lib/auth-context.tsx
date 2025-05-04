'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, UserRole } from './auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  error: Error | null
  login: (token: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        setUser(null)
        return
      }

      const response = await fetch('http://localhost:3001/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Authentication failed')
      }

      const userData = await response.json()
      setUser(userData)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Authentication failed'))
      setUser(null)
      localStorage.removeItem('auth_token')
    } finally {
      setLoading(false)
    }
  }

  async function login(token: string) {
    try {
      localStorage.setItem('auth_token', token)
      await checkAuth()
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Login failed'))
      localStorage.removeItem('auth_token')
      throw err
    }
  }

  function logout() {
    localStorage.removeItem('auth_token')
    setUser(null)
    setError(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 