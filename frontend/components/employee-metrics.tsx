"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data - in a real app, this would come from an API
const getEmployeeMetricsData = (employeeId: string) => {
  // Performance metrics
  const performanceData = [
    { name: "Productivity", value: 75 },
    { name: "Quality", value: 82 },
    { name: "Deadlines", value: 90 },
    { name: "Goals", value: 70 },
  ]

  // Wellness metrics
  const wellnessData = [
    { name: "Work-Life", value: 65 },
    { name: "Stress", value: 40 },
    { name: "Satisfaction", value: 75 },
    { name: "Engagement", value: 80 },
  ]

  // Trend data (last 6 months)
  const trendData = [
    { month: "Jan", performance: 65, wellness: 60 },
    { month: "Feb", performance: 68, wellness: 62 },
    { month: "Mar", performance: 72, wellness: 65 },
    { month: "Apr", performance: 75, wellness: 70 },
    { month: "May", performance: 78, wellness: 72 },
    { month: "Jun", performance: 82, wellness: 75 },
  ]

  return {
    performanceData,
    wellnessData,
    trendData,
    overallPerformance: 82,
    overallWellness: 65,
  }
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export function EmployeeMetrics({ employeeId }: { employeeId: string }) {
  const [metricsData, setMetricsData] = useState<any>(null)

  useEffect(() => {
    // In a real app, this would be an API call
    setMetricsData(getEmployeeMetricsData(employeeId))
  }, [employeeId])

  if (!metricsData) {
    return <div>Loading metrics...</div>
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="performance">
        <TabsList className="mb-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="wellness">Wellness</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Overall Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metricsData.overallPerformance}%</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Projects Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                </CardContent>
              </Card>
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metricsData.performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8">
                    {metricsData.performanceData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="wellness">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Overall Wellness</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metricsData.overallWellness}%</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Absence Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3%</div>
                </CardContent>
              </Card>
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metricsData.wellnessData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {metricsData.wellnessData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metricsData.trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="performance" name="Performance" fill="#8884d8" />
                <Bar dataKey="wellness" name="Wellness" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
