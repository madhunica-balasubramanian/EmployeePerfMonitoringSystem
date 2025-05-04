import { cookies } from 'next/headers'

export type UserRole = 'supervisor' | 'employee'

export interface User {
  id: string
  role: UserRole
  name: string
  email: string
}

export interface AuthResponse {
  user: User
  token: string
}

export async function getCurrentUser(): Promise<{ role: UserRole } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')
  
  if (!token) {
    return null
  }

  try {
    // TODO: Replace with actual API call to validate token and get user role
    // This is a placeholder implementation
    const response = await fetch('http://localhost:3001/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })

    if (!response.ok) {
      return null
    }

    const user = await response.json()
    return {
      role: user.role as UserRole,
    }
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

export function requireAuth(role?: UserRole) {
  return async function authMiddleware() {
    const user = await getCurrentUser()
    
    if (!user) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      }
    }

    if (role && user.role !== role) {
      return {
        redirect: {
          destination: '/unauthorized',
          permanent: false,
        },
      }
    }

    return { user }
  }
} 