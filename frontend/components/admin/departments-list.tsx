"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Department {
  id: string
  name: string
  description: string
}

interface DepartmentsListProps {
  departments: Department[]
}

export function DepartmentsList({ departments }: DepartmentsListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                No departments found.
              </TableCell>
            </TableRow>
          ) : (
            departments.map((department) => (
              <TableRow key={department.id}>
                <TableCell className="font-medium">{department.id}</TableCell>
                <TableCell>{department.name}</TableCell>
                <TableCell className="hidden md:table-cell">{department.description}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
