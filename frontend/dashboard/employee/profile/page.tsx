import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Mock employee data
const employeeData = {
  id: "EMP001",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  username: "johndoe",
  departmentRole: "USPS_MAIL_CARRIER",
  departmentName: "USPS",
  isActive: true,
}

export default function EmployeeProfilePage() {
  return (
    <DashboardLayout role="employee">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">View your personal information</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your basic information and employment details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-medium">Employee ID</h3>
                <p>{employeeData.id}</p>
              </div>
              <div>
                <h3 className="font-medium">Full Name</h3>
                <p>
                  {employeeData.firstName} {employeeData.lastName}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Email</h3>
                <p>{employeeData.email}</p>
              </div>
              <div>
                <h3 className="font-medium">Username</h3>
                <p>{employeeData.username}</p>
              </div>
              <div>
                <h3 className="font-medium">Department</h3>
                <p>{employeeData.departmentName}</p>
              </div>
              <div>
                <h3 className="font-medium">Department Role</h3>
                <p>
                  {employeeData.departmentRole === "USPS_MAIL_CARRIER"
                    ? "Mail Carrier"
                    : employeeData.departmentRole === "USPS_OFFICE_ADMIN"
                      ? "Office Admin"
                      : employeeData.departmentRole === "HEALTHCARE_NURSE"
                        ? "Nurse"
                        : employeeData.departmentRole}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Status</h3>
                <p>{employeeData.isActive ? "Active" : "Inactive"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-sm text-muted-foreground">
          <p>
            Note: If you need to update any of your personal information, please contact your supervisor or the HR
            department.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
