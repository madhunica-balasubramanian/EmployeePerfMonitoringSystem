import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DepartmentMetricsPage() {
  return (
    <DashboardLayout role="supervisor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Department Metrics</h1>
            <p className="text-muted-foreground">
              View aggregated performance and wellness metrics for your department
            </p>
          </div>
          <div className="w-[180px]">
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="mail-carrier">Mail Carriers</SelectItem>
                <SelectItem value="office-admin">Office Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="performance">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
            <TabsTrigger value="wellness">Wellness Metrics</TabsTrigger>
          </TabsList>
          <TabsContent value="performance" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Department Performance Summary</CardTitle>
                <CardDescription>Aggregated performance metrics for all employees in your department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="bg-muted rounded-lg p-4">
                      <h3 className="font-medium mb-2">Average On-Time Rate</h3>
                      <p className="text-3xl font-bold">92%</p>
                      <p className="text-sm text-muted-foreground">Department average</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <h3 className="font-medium mb-2">Average Completion Rate</h3>
                      <p className="text-3xl font-bold">95%</p>
                      <p className="text-sm text-muted-foreground">Department average</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <h3 className="font-medium mb-2">Total Parcels Delivered</h3>
                      <p className="text-3xl font-bold">28,450</p>
                      <p className="text-sm text-muted-foreground">This year</p>
                    </div>
                  </div>

                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-medium mb-4">Performance by Employee</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Employee ID</th>
                            <th className="text-left p-2">Name</th>
                            <th className="text-left p-2">Role</th>
                            <th className="text-right p-2">On-Time Rate</th>
                            <th className="text-right p-2">Completion Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { id: "EMP001", name: "John Doe", role: "Mail Carrier", onTime: "94%", completion: "97%" },
                            {
                              id: "EMP002",
                              name: "Jane Smith",
                              role: "Office Admin",
                              onTime: "92%",
                              completion: "95%",
                            },
                            {
                              id: "EMP003",
                              name: "Michael Johnson",
                              role: "Mail Carrier",
                              onTime: "90%",
                              completion: "93%",
                            },
                            {
                              id: "EMP004",
                              name: "Sarah Williams",
                              role: "Office Admin",
                              onTime: "95%",
                              completion: "98%",
                            },
                            {
                              id: "EMP005",
                              name: "Robert Brown",
                              role: "Mail Carrier",
                              onTime: "89%",
                              completion: "92%",
                            },
                          ].map((employee) => (
                            <tr key={employee.id} className="border-b">
                              <td className="p-2">{employee.id}</td>
                              <td className="p-2">{employee.name}</td>
                              <td className="p-2">{employee.role}</td>
                              <td className="text-right p-2">{employee.onTime}</td>
                              <td className="text-right p-2">{employee.completion}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-medium mb-4">Monthly Performance Trend</h3>
                    <div className="h-64 flex items-center justify-center border rounded-md bg-background">
                      <p className="text-muted-foreground">Department performance chart would be displayed here</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="wellness" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Department Wellness Summary</CardTitle>
                <CardDescription>Aggregated wellness metrics for all employees in your department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="bg-muted rounded-lg p-4">
                      <h3 className="font-medium mb-2">Average Stress Level</h3>
                      <p className="text-3xl font-bold">6.2/10</p>
                      <p className="text-sm text-muted-foreground">Department average</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <h3 className="font-medium mb-2">Average Job Satisfaction</h3>
                      <p className="text-3xl font-bold">7.5/10</p>
                      <p className="text-sm text-muted-foreground">Department average</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <h3 className="font-medium mb-2">Sick Days Used</h3>
                      <p className="text-3xl font-bold">124</p>
                      <p className="text-sm text-muted-foreground">Total this year</p>
                    </div>
                  </div>

                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-medium mb-4">Wellness by Employee</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Employee ID</th>
                            <th className="text-left p-2">Name</th>
                            <th className="text-left p-2">Role</th>
                            <th className="text-right p-2">Stress Level</th>
                            <th className="text-right p-2">Job Satisfaction</th>
                            <th className="text-right p-2">Sick Days</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            {
                              id: "EMP001",
                              name: "John Doe",
                              role: "Mail Carrier",
                              stress: "6/10",
                              satisfaction: "8/10",
                              sickDays: 5,
                            },
                            {
                              id: "EMP002",
                              name: "Jane Smith",
                              role: "Office Admin",
                              stress: "5/10",
                              satisfaction: "7/10",
                              sickDays: 3,
                            },
                            {
                              id: "EMP003",
                              name: "Michael Johnson",
                              role: "Mail Carrier",
                              stress: "7/10",
                              satisfaction: "6/10",
                              sickDays: 8,
                            },
                            {
                              id: "EMP004",
                              name: "Sarah Williams",
                              role: "Office Admin",
                              stress: "4/10",
                              satisfaction: "9/10",
                              sickDays: 2,
                            },
                            {
                              id: "EMP005",
                              name: "Robert Brown",
                              role: "Mail Carrier",
                              stress: "8/10",
                              satisfaction: "7/10",
                              sickDays: 6,
                            },
                          ].map((employee) => (
                            <tr key={employee.id} className="border-b">
                              <td className="p-2">{employee.id}</td>
                              <td className="p-2">{employee.name}</td>
                              <td className="p-2">{employee.role}</td>
                              <td className="text-right p-2">{employee.stress}</td>
                              <td className="text-right p-2">{employee.satisfaction}</td>
                              <td className="text-right p-2">{employee.sickDays}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-medium mb-4">Wellness Trends</h3>
                    <div className="h-64 flex items-center justify-center border rounded-md bg-background">
                      <p className="text-muted-foreground">Department wellness chart would be displayed here</p>
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
