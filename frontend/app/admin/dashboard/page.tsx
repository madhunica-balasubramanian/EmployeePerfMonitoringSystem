"use client"

import { useState } from "react"
import Link from "next/link"
import { User, LogOut, Plus, Building, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddDepartmentDialog } from "@/components/admin/add-department-dialog"
import { AddSupervisorDialog } from "@/components/admin/add-supervisor-dialog"
import { DepartmentsList } from "@/components/admin/departments-list"
import { SupervisorsList } from "@/components/admin/supervisors-list"

// Mock data
const initialDepartments = [
  { id: "DEPT001", name: "Engineering", description: "Software development and engineering teams" },
  { id: "DEPT002", name: "Marketing", description: "Marketing and brand management" },
  { id: "DEPT003", name: "Human Resources", description: "Employee management and recruitment" },
  { id: "DEPT004", name: "Finance", description: "Financial planning and accounting" },
]

const initialSupervisors = [
  {
    id: "SUP001",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "555-1234",
    departmentId: "DEPT001",
    position: "Engineering Manager",
  },
  {
    id: "SUP002",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "555-5678",
    departmentId: "DEPT002",
    position: "Marketing Director",
  },
  {
    id: "SUP003",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "555-9012",
    departmentId: "DEPT003",
    position: "HR Manager",
  },
]

export default function AdminDashboard() {
  const [departments, setDepartments] = useState(initialDepartments)
  const [supervisors, setSupervisors] = useState(initialSupervisors)
  const [isDepartmentDialogOpen, setIsDepartmentDialogOpen] = useState(false)
  const [isSupervisorDialogOpen, setIsSupervisorDialogOpen] = useState(false)

  const handleAddDepartment = (department: any) => {
    // Generate a new ID
    const newId = `DEPT${String(departments.length + 1).padStart(3, "0")}`
    const newDepartment = {
      ...department,
      id: newId,
    }
    setDepartments([...departments, newDepartment])
    setIsDepartmentDialogOpen(false)
  }

  const handleAddSupervisor = (supervisor: any) => {
    // Generate a new ID
    const newId = `SUP${String(supervisors.length + 1).padStart(3, "0")}`
    const newSupervisor = {
      ...supervisor,
      id: newId,
    }
    setSupervisors([...supervisors, newSupervisor])
    setIsSupervisorDialogOpen(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-bold">
              PerformanceTrack
            </Link>
            <span className="rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground">Admin</span>
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
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage departments and supervisors</p>
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            <Button onClick={() => setIsDepartmentDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Department
            </Button>
            <Button onClick={() => setIsSupervisorDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Supervisor
            </Button>
          </div>

          <Tabs defaultValue="departments">
            <TabsList>
              <TabsTrigger value="departments">
                <Building className="mr-2 h-4 w-4" />
                Departments
              </TabsTrigger>
              <TabsTrigger value="supervisors">
                <Users className="mr-2 h-4 w-4" />
                Supervisors
              </TabsTrigger>
            </TabsList>
            <TabsContent value="departments">
              <Card>
                <CardHeader>
                  <CardTitle>Departments</CardTitle>
                  <CardDescription>List of all departments in the organization</CardDescription>
                </CardHeader>
                <CardContent>
                  <DepartmentsList departments={departments} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="supervisors">
              <Card>
                <CardHeader>
                  <CardTitle>Supervisors</CardTitle>
                  <CardDescription>List of all supervisors in the organization</CardDescription>
                </CardHeader>
                <CardContent>
                  <SupervisorsList supervisors={supervisors} departments={departments} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <AddDepartmentDialog
        open={isDepartmentDialogOpen}
        onOpenChange={setIsDepartmentDialogOpen}
        onSubmit={handleAddDepartment}
      />

      <AddSupervisorDialog
        open={isSupervisorDialogOpen}
        onOpenChange={setIsSupervisorDialogOpen}
        onSubmit={handleAddSupervisor}
        departments={departments}
      />
    </div>
  )
}
