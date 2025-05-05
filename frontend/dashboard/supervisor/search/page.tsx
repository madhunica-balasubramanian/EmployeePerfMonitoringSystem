"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

// Mock employee data
const mockEmployees = [
  {
    id: "EMP001",
    firstName: "John",
    lastName: "Doe",
    departmentRole: "USPS_MAIL_CARRIER",
    departmentId: 1,
  },
  {
    id: "EMP002",
    firstName: "Jane",
    lastName: "Smith",
    departmentRole: "USPS_OFFICE_ADMIN",
    departmentId: 1,
  },
  {
    id: "EMP003",
    firstName: "Michael",
    lastName: "Johnson",
    departmentRole: "HEALTHCARE_NURSE",
    departmentId: 2,
  },
]

export default function SearchEmployeePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [employeeId, setEmployeeId] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<(typeof mockEmployees)[0] | null>(null)
  const [notFound, setNotFound] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    setNotFound(false)
    setSearchResult(null)

    // Simulate API call
    setTimeout(() => {
      setIsSearching(false)

      // Mock search - in a real app, this would query the backend
      const employee = mockEmployees.find(
        (emp) => emp.id === employeeId && emp.departmentId === 1, // Only find employees in supervisor's department
      )

      if (employee) {
        setSearchResult(employee)
        setNotFound(false)
      } else {
        setSearchResult(null)
        setNotFound(true)
        toast({
          title: "Employee not found",
          description: "No employee with that ID in your department",
          variant: "destructive",
        })
      }
    }, 1000)
  }

  const viewEmployeeDetails = () => {
    if (searchResult) {
      router.push(`/dashboard/supervisor/employee/${searchResult.id}`)
    }
  }

  return (
    <DashboardLayout role="supervisor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Search Employees</h1>
          <p className="text-muted-foreground">Find employees in your department by their Employee ID</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Employee Search</CardTitle>
            <CardDescription>Enter an employee ID to search for an employee in your department</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <div className="flex gap-2">
                  <Input
                    id="employeeId"
                    placeholder="e.g. EMP001"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    required
                  />
                  <Button type="submit" disabled={isSearching}>
                    {isSearching ? "Searching..." : "Search"}
                  </Button>
                </div>
              </div>
            </form>

            {searchResult && (
              <div className="mt-6 space-y-4">
                <h3 className="font-medium">Search Result</h3>
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm font-medium">Employee ID</p>
                          <p className="text-sm">{searchResult.id}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Name</p>
                          <p className="text-sm">
                            {searchResult.firstName} {searchResult.lastName}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Department Role</p>
                        <p className="text-sm">
                          {searchResult.departmentRole === "USPS_MAIL_CARRIER"
                            ? "Mail Carrier"
                            : searchResult.departmentRole === "USPS_OFFICE_ADMIN"
                              ? "Office Admin"
                              : searchResult.departmentRole === "HEALTHCARE_NURSE"
                                ? "Nurse"
                                : searchResult.departmentRole}
                        </p>
                      </div>
                      <Button onClick={viewEmployeeDetails} className="w-full">
                        View Employee Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {notFound && (
              <div className="mt-6 p-4 border rounded-md bg-muted">
                <p className="text-center">No employee found with that ID in your department.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
