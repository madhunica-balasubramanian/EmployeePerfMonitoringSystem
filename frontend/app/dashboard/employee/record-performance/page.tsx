"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

// Mock employee data
const mockEmployeeData = {
  id: "EMP001",
  firstName: "John",
  lastName: "Doe",
  departmentRole: "USPS_MAIL_CARRIER",
  departmentId: 1,
}

export default function RecordPerformancePage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [employee] = useState(mockEmployeeData)

  // Performance data state
  const [performanceData, setPerformanceData] = useState({
    parcelsDeliveredOnTime: 0,
    parcelsDeliveredLate: 0,
    parcelsUndelivered: 0,
    redeliveryAttempts: 0,
    // USPS_OFFICE_ADMIN fields
    customerTicketsOpened: 0,
    customerTicketsResolved: 0,
    documentsProcessed: 0,
    // HEALTHCARE_ADMIN fields
    patientsRecordsProcessed: 0,
    patientCallsHandled: 0,
    recordsReturnedForReview: 0,
    // HEALTHCARE_NURSE fields
    appointmentsScheduled: 0,
    patientsSeen: 0,
    vaccinationsAdministered: 0,
  })

  // Wellness data state
  const [wellnessData, setWellnessData] = useState({
    // USPS_MAIL_CARRIER fields
    distanceCovered: 0,
    injuryReport: "None",
    hasInjury: "no",
    weatherExposure: "rain",
    sickDaysTaken: 0,
    stressLevel: 5,
    jobSatisfaction: 5,
    // USPS_OFFICE_ADMIN & HEALTHCARE fields
    hoursSitting: "8",
    nightShiftWorked: "no",
    hoursWorked: "8",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)

      toast({
        title: "Success",
        description: "Your performance data has been recorded",
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
                min="0"
                value={performanceData.parcelsDeliveredOnTime}
                onChange={(e) => handlePerformanceChange("parcelsDeliveredOnTime", Number.parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parcelsDeliveredLate">Parcels Delivered Late</Label>
              <Input
                id="parcelsDeliveredLate"
                type="number"
                min="0"
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
                min="0"
                value={performanceData.parcelsUndelivered}
                onChange={(e) => handlePerformanceChange("parcelsUndelivered", Number.parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="redeliveryAttempts">Redelivery Attempts</Label>
              <Input
                id="redeliveryAttempts"
                type="number"
                min="0"
                value={performanceData.redeliveryAttempts}
                onChange={(e) => handlePerformanceChange("redeliveryAttempts", Number.parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>
      )
    } else if (employee.departmentRole === "USPS_OFFICE_ADMIN") {
      return (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="customerTicketsOpened">Customer Tickets Opened</Label>
              <Input
                id="customerTicketsOpened"
                type="number"
                min="0"
                value={performanceData.customerTicketsOpened}
                onChange={(e) => handlePerformanceChange("customerTicketsOpened", Number.parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerTicketsResolved">Customer Tickets Handled and Resolved</Label>
              <Input
                id="customerTicketsResolved"
                type="number"
                min="0"
                value={performanceData.customerTicketsResolved}
                onChange={(e) => handlePerformanceChange("customerTicketsResolved", Number.parseInt(e.target.value))}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="documentsProcessed">Documents Processed</Label>
              <Input
                id="documentsProcessed"
                type="number"
                min="0"
                value={performanceData.documentsProcessed}
                onChange={(e) => handlePerformanceChange("documentsProcessed", Number.parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerSatisfactionScore">Customer Satisfaction Score</Label>
              <Input id="customerSatisfactionScore" type="number" min="1" max="5" disabled value="3" />
              <p className="text-xs text-muted-foreground">This field is updated by your supervisor</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerFeedback">Customer Feedback</Label>
            <Textarea id="customerFeedback" disabled value="This field is updated by your supervisor" />
            <p className="text-xs text-muted-foreground">This field is updated by your supervisor</p>
          </div>
        </div>
      )
    }

    // Add other role-specific forms here
    return <p>No performance metrics available for your role</p>
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
                min="0"
                value={wellnessData.distanceCovered}
                onChange={(e) => handleWellnessChange("distanceCovered", Number.parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="injuryReport">Injury Report</Label>
              <Select
                value={wellnessData.hasInjury}
                onValueChange={(value) => {
                  handleWellnessChange("hasInjury", value)
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
              {wellnessData.hasInjury === "yes" && (
                <Textarea
                  className="mt-2"
                  placeholder="Describe the injury"
                  value={wellnessData.injuryReport === "None" ? "" : wellnessData.injuryReport}
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
              <Label htmlFor="sickDaysTaken">Sick Days Taken for the Month</Label>
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
    } else if (employee.departmentRole === "USPS_OFFICE_ADMIN") {
      return (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sickDaysTaken">Sick Days Taken for the Month</Label>
              <Input
                id="sickDaysTaken"
                type="number"
                min="0"
                max="30"
                value={wellnessData.sickDaysTaken}
                onChange={(e) => handleWellnessChange("sickDaysTaken", Number.parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hoursSitting">Hours Sitting</Label>
              <Select
                value={wellnessData.hoursSitting}
                onValueChange={(value) => handleWellnessChange("hoursSitting", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select hours" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 hours</SelectItem>
                  <SelectItem value="6">6 hours</SelectItem>
                  <SelectItem value="7">7 hours</SelectItem>
                  <SelectItem value="8">8 hours</SelectItem>
                  <SelectItem value="9">{">"} 8 hours</SelectItem>
                </SelectContent>
              </Select>
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
    return <p>No wellness metrics available for your role</p>
  }

  return (
    <DashboardLayout role="employee">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Record Daily Performance</h1>
          <p className="text-muted-foreground">Record your performance and wellness data for today</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="performance">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="performance">Performance Data</TabsTrigger>
              <TabsTrigger value="wellness">Wellness Data</TabsTrigger>
            </TabsList>
            <TabsContent value="performance" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Data</CardTitle>
                  <CardDescription>Record your performance metrics for today</CardDescription>
                </CardHeader>
                <CardContent>{renderPerformanceForm()}</CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="wellness" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Wellness Data</CardTitle>
                  <CardDescription>Record your wellness metrics for today</CardDescription>
                </CardHeader>
                <CardContent>{renderWellnessForm()}</CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Data"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
