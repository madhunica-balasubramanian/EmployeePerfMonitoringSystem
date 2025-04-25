"use client"

import { useState } from "react"
import { Search, User, LogOut } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { EmployeePerformance } from "@/components/employee-performance"
import { EmployeeWellness } from "@/components/employee-wellness"
import { EmployeeMetrics } from "@/components/employee-metrics"

// Mock data
const mockEmployees = [
  { id: "EMP001", name: "John Doe", department: "Engineering" },
  { id: "EMP002", name: "Jane Smith", department: "Marketing" },
  { id: "EMP003", name: "Robert Johnson", department: "Engineering" },
  { id: "EMP004", name: "Emily Davis", department: "HR" },
  { id: "EMP005", name: "Michael Wilson", department: "Engineering" },
]

export default function DashboardPage() {
  const [searchId, setSearchId] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)

  const handleSearch = () => {
    const employee = mockEmployees.find((emp) => emp.id === searchId)
    setSelectedEmployee(employee || null)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-bold">
              PerformanceTrack
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Button>
            <Link href="/">
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Supervisor Dashboard</h1>
            <p className="text-muted-foreground">Monitor and manage your team's performance and wellness</p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Employee Search</CardTitle>
              <CardDescription>Search for an employee by their ID</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Enter employee ID (e.g., EMP001)"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                />
                <Button type="submit" onClick={handleSearch}>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {selectedEmployee ? (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Left Window: Performance and Wellness Data */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance & Wellness Data</CardTitle>
                  <CardDescription>
                    {selectedEmployee.name} ({selectedEmployee.id}) - {selectedEmployee.department}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Performance Data</h3>
                      <EmployeePerformance employeeId={selectedEmployee.id} />
                    </div>

                    <Separator className="my-6" />

                    <div>
                      <h3 className="text-lg font-medium mb-4">Wellness Data</h3>
                      <EmployeeWellness employeeId={selectedEmployee.id} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Right Window: Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Employee Metrics</CardTitle>
                  <CardDescription>Performance and wellness metrics for {selectedEmployee.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <EmployeeMetrics employeeId={selectedEmployee.id} />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <h3 className="text-lg font-medium">No employee selected</h3>
              <p className="text-sm text-muted-foreground">
                Search for an employee by ID to view their performance and wellness data
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
