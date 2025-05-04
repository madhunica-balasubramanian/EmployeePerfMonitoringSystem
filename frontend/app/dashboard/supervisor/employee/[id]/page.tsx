"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"

// Mock employee data
const mockEmployeeData = {
  id: "EMP001",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  departmentRole: "USPS_MAIL_CARRIER",
  departmentId: 1,
  isActive: true,
  performance: {
    parcelsDeliveredOnTime: 45,
    parcelsDeliveredLate: 3,
    parcelsUndelivered: 2,
    redeliveryAttempts: 5,
  },
  wellness: {
    distanceCovered: 12.5,
    injuryReport: "None",
    weatherExposure: "extreme heat",
    sickDaysTaken: 2,
    stressLevel: 6,
    jobSatisfaction: 8,
  },
}

export default function EmployeeDetailsPage() {
  const params = useParams()
  const employeeId = params.id as string
  const { toast } = useToast()

  const [employee, setEmployee] = useState(mockEmployeeData)
  const [isUpdating, setIsUpdating] = useState(false)

  // Performance data state
  const [performanceData, setPerformanceData] = useState({
    parcelsDeliveredOnTime: employee.performance.parcelsDeliveredOnTime,
    parcelsDeliveredLate: employee.performance.parcelsDeliveredLate,
    parcelsUndelivered: employee.performance.parcelsUndelivered,
    redeliveryAttempts: employee.performance.redeliveryAttempts,
  })

  // Wellness data state
  const [wellnessData, setWellnessData] = useState({
    distanceCovered: employee.wellness.distanceCovered,
    injuryReport: employee.wellness.injuryReport,
    weatherExposure: employee.wellness.weatherExposure,
    sickDaysTaken: employee.wellness.sickDaysTaken,
    stressLevel: employee.wellness.stressLevel,
    jobSatisfaction: employee.wellness.jobSatisfaction,
  })

  const handlePerformanceChange = (field: string, value: any) => {
    setPerformanceData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleWellnessChange = (field: string, value: any) => {
    setWellnessData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleUpdateMetrics = () => {
    setIsUpdating(true)

    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false)

      // Update employee data
      setEmployee((prev) => ({
        ...prev,
        performance: performanceData,
        wellness: wellnessData,
      }))

      toast({
        title: "Success",
        description: "Employee metrics updated successfully",
      })
    }, 1000)
  }

  // Render performance form based on department role
  const renderPerformanceForm = () => {
    if (employee.departmentRole === "USPS_MAIL_CARRIER") {
      return (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="parcelsDeliveredOnTime">Parcels Delivered On Time</Label>
              <Input
                id="parcelsDeliveredOnTime"
                type="number"
                value={performanceData.parcelsDeliveredOnTime}
                onChange={(e) => handlePerformanceChange("parcelsDeliveredOnTime", Number.parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parcelsDeliveredLate">Parcels Delivered Late</Label>
              <Input
                id="parcelsDeliveredLate"
                type="number"
                value={performanceData.parcelsDeliveredLate}
                onChange={(e) => handlePerformanceChange("parcelsDeliveredLate", Number.parseInt(e.target.value))}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="parcelsUndelivered">Parcels Undelivered</Label>
              <Input
                id="parcelsUndelivered"
                type="number"
                value={performanceData.parcelsUndelivered}
                onChange={(e) => handlePerformanceChange("parcelsUndelivered", Number.parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="redeliveryAttempts">Redelivery Attempts</Label>
              <Input
                id="redeliveryAttempts"
                type="number"
                value={performanceData.redeliveryAttempts}
                onChange={(e) => handlePerformanceChange("redeliveryAttempts", Number.parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>
      )
    }

    // Add other role-specific forms here
    return <p>No performance metrics available for this role</p>
  }

  // Render wellness form based on department role
  const renderWellnessForm = () => {
    if (employee.departmentRole === "USPS_MAIL_CARRIER") {
      return (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="distanceCovered">Distance Covered (miles)</Label>
              <Input
                id="distanceCovered"
                type="number"
                step="0.1"
                value={wellnessData.distanceCovered}
                onChange={(e) => handleWellnessChange("distanceCovered", Number.parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="injuryReport">Injury Report</Label>
              <Select
                value={wellnessData.injuryReport === "None" ? "no" : "yes"}
                onValueChange={(value) => {
                  if (value === "no") {
                    handleWellnessChange("injuryReport", "None")
                  } else {
                    handleWellnessChange("injuryReport", "")
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                </SelectContent>
              </Select>
              {wellnessData.injuryReport !== "None" && (
                <Textarea
                  className="mt-2"
                  placeholder="Describe the injury"
                  value={wellnessData.injuryReport}
                  onChange={(e) => handleWellnessChange("injuryReport", e.target.value)}
                />
              )}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="weatherExposure">Weather Exposure</Label>
              <Select
                value={wellnessData.weatherExposure}
                onValueChange={(value) => handleWellnessChange("weatherExposure", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select weather condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rain">Rain</SelectItem>
                  <SelectItem value="extreme heat">Extreme Heat</SelectItem>
                  <SelectItem value="extreme cold">Extreme Cold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sickDaysTaken">Sick Days Taken</Label>
              <Input
                id="sickDaysTaken"
                type="number"
                min="0"
                max="30"
                value={wellnessData.sickDaysTaken}
                onChange={(e) => handleWellnessChange("sickDaysTaken", Number.parseInt(e.target.value))}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="stressLevel">Stress Level (1-10)</Label>
              <div className="pt-2">
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={[wellnessData.stressLevel]}
                  onValueChange={(value) => handleWellnessChange("stressLevel", value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobSatisfaction">Job Satisfaction (1-10)</Label>
              <div className="pt-2">
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={[wellnessData.jobSatisfaction]}
                  onValueChange={(value) => handleWellnessChange("jobSatisfaction", value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Add other role-specific forms here
    return <p>No wellness metrics available for this role</p>
  }

  return (
    <DashboardLayout role="supervisor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Employee Details</h1>
          <p className="text-muted-foreground">View and update employee information</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Employee Information</CardTitle>
            <CardDescription>Basic information about the employee</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-medium">Employee ID</h3>
                <p>{employee.id}</p>
              </div>
              <div>
                <h3 className="font-medium">Name</h3>
                <p>
                  {employee.firstName} {employee.lastName}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Email</h3>
                <p>{employee.email}</p>
              </div>
              <div>
                <h3 className="font-medium">Department Role</h3>
                <p>
                  {employee.departmentRole === "USPS_MAIL_CARRIER"
                    ? "Mail Carrier"
                    : employee.departmentRole === "USPS_OFFICE_ADMIN"
                      ? "Office Admin"
                      : employee.departmentRole === "HEALTHCARE_NURSE"
                        ? "Nurse"
                        : employee.departmentRole}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Status</h3>
                <p>{employee.isActive ? "Active" : "Inactive"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="performance">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
            <TabsTrigger value="wellness">Wellness Metrics</TabsTrigger>
          </TabsList>
          <TabsContent value="performance" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>View and update employee performance data</CardDescription>
              </CardHeader>
              <CardContent>{renderPerformanceForm()}</CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="wellness" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Wellness Metrics</CardTitle>
                <CardDescription>View and update employee wellness data</CardDescription>
              </CardHeader>
              <CardContent>{renderWellnessForm()}</CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={handleUpdateMetrics} disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update Metrics"}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
