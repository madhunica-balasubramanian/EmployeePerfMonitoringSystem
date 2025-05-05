import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus, Search, BarChart, ClipboardList } from "lucide-react"

export default function SupervisorDashboard() {
  return (
    <DashboardLayout role="supervisor">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Supervisor Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the supervisor dashboard. Manage employees and view department metrics.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">25</div>
              <p className="text-xs text-muted-foreground">In your department</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Performance Rating</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.2/5</div>
              <p className="text-xs text-muted-foreground">Department average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Wellness Score</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7.8/10</div>
              <p className="text-xs text-muted-foreground">Department average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Pending reviews</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks for department management</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center gap-4 rounded-md border p-4">
                <UserPlus className="h-5 w-5" />
                <div>
                  <h3 className="font-medium">Add New Employee</h3>
                  <p className="text-sm text-muted-foreground">Register a new employee to your department</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-md border p-4">
                <Search className="h-5 w-5" />
                <div>
                  <h3 className="font-medium">Search Employees</h3>
                  <p className="text-sm text-muted-foreground">Find employees by ID in your department</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-md border p-4">
                <BarChart className="h-5 w-5" />
                <div>
                  <h3 className="font-medium">View Department Metrics</h3>
                  <p className="text-sm text-muted-foreground">See aggregated performance and wellness data</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div>
                      <p className="text-sm">
                        {i === 1
                          ? "Employee EMP025 updated performance data"
                          : i === 2
                            ? "New employee added to department"
                            : i === 3
                              ? "Updated wellness metrics for EMP013"
                              : "Department performance report generated"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {i === 1
                          ? "2 hours ago"
                          : i === 2
                            ? "Yesterday at 4:30 PM"
                            : i === 3
                              ? "Yesterday at 2:15 PM"
                              : "2 days ago"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
