import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock metrics data
const performanceData = {
  parcelsDeliveredOnTime: 1250,
  parcelsDeliveredLate: 85,
  parcelsUndelivered: 45,
  redeliveryAttempts: 120,
  onTimeRate: "93%",
  completionRate: "97%",
}

const wellnessData = {
  averageDistanceCovered: 12.3,
  totalSickDays: 5,
  averageStressLevel: 6.2,
  averageJobSatisfaction: 7.8,
  weatherExposureBreakdown: {
    rain: "25%",
    extremeHeat: "40%",
    extremeCold: "35%",
  },
}

export default function EmployeeMetricsPage() {
  return (
    <DashboardLayout role="employee">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Metrics</h1>
          <p className="text-muted-foreground">View your aggregated performance and wellness metrics for the year</p>
        </div>

        <Tabs defaultValue="performance">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
            <TabsTrigger value="wellness">Wellness Metrics</TabsTrigger>
          </TabsList>
          <TabsContent value="performance" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Annual Performance Summary</CardTitle>
                <CardDescription>Your performance metrics aggregated for the current year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="bg-muted rounded-lg p-4">
                      <h3 className="font-medium mb-2">Parcels Delivered On Time</h3>
                      <p className="text-3xl font-bold">{performanceData.parcelsDeliveredOnTime}</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <h3 className="font-medium mb-2">Parcels Delivered Late</h3>
                      <p className="text-3xl font-bold">{performanceData.parcelsDeliveredLate}</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <h3 className="font-medium mb-2">Parcels Undelivered</h3>
                      <p className="text-3xl font-bold">{performanceData.parcelsUndelivered}</p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="bg-muted rounded-lg p-4">
                      <h3 className="font-medium mb-2">Redelivery Attempts</h3>
                      <p className="text-3xl font-bold">{performanceData.redeliveryAttempts}</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <h3 className="font-medium mb-2">On-Time Delivery Rate</h3>
                      <p className="text-3xl font-bold">{performanceData.onTimeRate}</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <h3 className="font-medium mb-2">Completion Rate</h3>
                      <p className="text-3xl font-bold">{performanceData.completionRate}</p>
                    </div>
                  </div>

                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-medium mb-4">Monthly Performance Trend</h3>
                    <div className="h-64 flex items-center justify-center border rounded-md bg-background">
                      <p className="text-muted-foreground">Performance chart would be displayed here</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="wellness" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Annual Wellness Summary</CardTitle>
                <CardDescription>Your wellness metrics aggregated for the current year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="bg-muted rounded-lg p-4">
                      <h3 className="font-medium mb-2">Average Distance Covered</h3>
                      <p className="text-3xl font-bold">{wellnessData.averageDistanceCovered} mi</p>
                      <p className="text-sm text-muted-foreground">Per workday</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <h3 className="font-medium mb-2">Total Sick Days</h3>
                      <p className="text-3xl font-bold">{wellnessData.totalSickDays}</p>
                      <p className="text-sm text-muted-foreground">This year</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <h3 className="font-medium mb-2">Average Stress Level</h3>
                      <p className="text-3xl font-bold">{wellnessData.averageStressLevel}/10</p>
                      <p className="text-sm text-muted-foreground">Self-reported</p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="bg-muted rounded-lg p-4">
                      <h3 className="font-medium mb-2">Average Job Satisfaction</h3>
                      <p className="text-3xl font-bold">{wellnessData.averageJobSatisfaction}/10</p>
                      <p className="text-sm text-muted-foreground">Self-reported</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <h3 className="font-medium mb-2">Weather Exposure Breakdown</h3>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <div>
                          <p className="text-sm font-medium">Rain</p>
                          <p className="text-lg font-bold">{wellnessData.weatherExposureBreakdown.rain}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Extreme Heat</p>
                          <p className="text-lg font-bold">{wellnessData.weatherExposureBreakdown.extremeHeat}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Extreme Cold</p>
                          <p className="text-lg font-bold">{wellnessData.weatherExposureBreakdown.extremeCold}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-medium mb-4">Wellness Trends</h3>
                    <div className="h-64 flex items-center justify-center border rounded-md bg-background">
                      <p className="text-muted-foreground">Wellness chart would be displayed here</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
