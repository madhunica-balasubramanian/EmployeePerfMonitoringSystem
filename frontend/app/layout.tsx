import React from 'react'
import { ThemeProvider } from '../components/theme-provider'
import { AuthProvider } from '../lib/auth-context'
import './globals.css'

export const metadata = {
  title: 'Employee Performance Monitoring System',
  description: 'A system for monitoring and managing employee performance',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
