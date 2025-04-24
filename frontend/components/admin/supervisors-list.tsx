"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Department {
  id: string
  name: string
  description: string
}

interface Supervisor {
  id: string
  name: string
  email: string
  phone: string
  departmentId: string
  position: string
}

interface SupervisorsListProps {
  supervisors: Supervisor[]
  departments: Department[]
}

export function SupervisorsList({ supervisors, departments }: SupervisorsListProps) {
  // Function to get department name by ID
  const getDepartmentName = (departmentId: string) => {
    const department = departments.find((dept) => dept.id === departmentId)
    return department ? department.name : "Unknown Department"
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead className="hidden md:table-cell">Phone</TableHead>
            <TableHead>Department</TableHead>
            <TableHead className="hidden md:table-cell">Position</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {supervisors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No supervisors found.
              </TableCell>
            </TableRow>
          ) : (
            supervisors.map((supervisor) => (
              <TableRow key={supervisor.id}>
                <TableCell className="font-medium">{supervisor.id}</TableCell>
                <TableCell>{supervisor.name}</TableCell>
                <TableCell className="hidden md:table-cell">{supervisor.email}</TableCell>
                <TableCell className="hidden md:table-cell">{supervisor.phone}</TableCell>
                <TableCell>{getDepartmentName(supervisor.departmentId)}</TableCell>
                <TableCell className="hidden md:table-cell">{supervisor.position}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
