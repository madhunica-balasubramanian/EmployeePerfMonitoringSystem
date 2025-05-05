"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "employee"
  const { toast } = useToast()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false)

      // Mock login logic - in a real app, this would validate with a backend
      if (username && password) {
        // Redirect based on role
        if (role === "supervisor") {
          toast({
            title: "Login successful",
            description: "Welcome back, Supervisor",
          })
          router.push("/dashboard/supervisor")
        } else {
          toast({
            title: "Login successful",
            description: "Welcome back, Employee",
          })
          router.push("/dashboard/employee")
        }
      } else {
        toast({
          title: "Login failed",
          description: "Please check your credentials and try again",
          variant: "destructive",
        })
      }
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center px-4">
          <h1 className="text-xl font-bold">Employee Management System</h1>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              {role === "supervisor"
                ? "Enter your credentials to access the supervisor dashboard"
                : "Enter your credentials to access your employee dashboard"}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={() => router.push("/")}>
                Back to Home
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  )
}
