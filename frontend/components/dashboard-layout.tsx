import type { ReactNode } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

interface DashboardLayoutProps {
  children: ReactNode
  role: "supervisor" | "employee"
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar role={role} />
      <div className="flex-1 flex flex-col">
        <header className="border-b bg-background">
          <div className="container flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-bold">
              {role === "supervisor" ? "Supervisor Dashboard" : "Employee Dashboard"}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {role === "supervisor" ? "Logged in as Supervisor" : "Logged in as Employee"}
              </span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
