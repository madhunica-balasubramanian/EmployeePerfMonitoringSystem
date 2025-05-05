import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ClipboardList, User, BarChart } from "lucide-react"
import Link from "next/link"

export default function EmployeeDashboard() {
  return (
    <DashboardLayout role="employee">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Employee Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your employee dashboard. View your information and record your daily performance.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">My Profile</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">John Doe</div>
              <p className="text-xs text-muted-foreground">Employee ID: EMP001</p>
              <Button asChild className="w-full mt-4" variant="outline" size="sm">
                <Link href="/dashboard/employee/profile">View Profile</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Record Performance</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Today</div>
              <p className="text-xs text-muted-foreground">Record your daily metrics</p>
              <Button asChild className="w-full mt-4" size="sm">
                <Link href="/dashboard/employee/record-performance">Record Now</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">My Metrics</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">View Stats</div>
              <p className="text-xs text-muted-foreground">Performance and wellness data</p>
              <Button asChild className="w-full mt-4" variant="outline" size="sm">
                <Link href="/dashboard/employee/metrics">View Metrics</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Summary</CardTitle>
            <CardDescription>Your performance and wellness overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-2">Performance Highlights</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-sm font-medium">Parcels Delivered</p>
                    <p className="text-2xl font-bold">45</p>
                    <p className="text-xs text-muted-foreground">Last recorded day</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-sm font-medium">On-Time Rate</p>
                    <p className="text-2xl font-bold">90%</p>
                    <p className="text-xs text-muted-foreground">Last recorded day</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-sm font-medium">Redelivery Attempts</p>
                    <p className="text-2xl font-bold">5</p>
                    <p className="text-xs text-muted-foreground">Last recorded day</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Wellness Insights</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-sm font-medium">Stress Level</p>
                    <p className="text-2xl font-bold">6/10</p>
                    <p className="text-xs text-muted-foreground">Last recorded day</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-sm font-medium">Job Satisfaction</p>
                    <p className="text-2xl font-bold">8/10</p>
                    <p className="text-xs text-muted-foreground">Last recorded day</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-sm font-medium">Distance Covered</p>
                    <p className="text-2xl font-bold">12.5 mi</p>
                    <p className="text-xs text-muted-foreground">Last recorded day</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
