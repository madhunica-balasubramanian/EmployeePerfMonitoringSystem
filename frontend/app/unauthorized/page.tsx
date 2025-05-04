'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto max-w-md space-y-4 p-6 text-center">
        <h1 className="text-2xl font-bold text-foreground">Unauthorized Access</h1>
        <p className="text-muted-foreground">
          You don't have permission to access this page.
        </p>
        <button
          onClick={() => router.push('/')}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Go to Home
        </button>
      </div>
    </div>
  )
} 