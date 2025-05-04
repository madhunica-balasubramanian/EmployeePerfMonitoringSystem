'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../lib/auth-context'
import { Loading } from './loading'
import { UserRole } from '../lib/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (!loading && requiredRole && user?.role !== requiredRole) {
      router.push('/unauthorized')
    }
  }, [user, loading, requiredRole, router])

  if (loading) {
    return <Loading />
  }

  if (!user || (requiredRole && user.role !== requiredRole)) {
    return null
  }

  return <>{children}</>
} 