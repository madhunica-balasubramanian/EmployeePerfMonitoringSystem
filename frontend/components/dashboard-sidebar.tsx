"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserPlus, Search, BarChart, User, LogOut, Home, ClipboardList } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardSidebarProps {
  role: "supervisor" | "employee"
}

export function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname()

  const supervisorLinks = [
    {
      title: "Dashboard",
      href: "/dashboard/supervisor",
      icon: Home,
    },
    {
      title: "Add Employee",
      href: "/dashboard/supervisor/add-employee",
      icon: UserPlus,
    },
    {
      title: "Search Employees",
      href: "/dashboard/supervisor/search",
      icon: Search,
    },
    {
      title: "Department Metrics",
      href: "/dashboard/supervisor/department-metrics",
      icon: BarChart,
    },
    {
      title: "Logout",
      href: "/",
      icon: LogOut,
    },
  ]

  const employeeLinks = [
    {
      title: "Dashboard",
      href: "/dashboard/employee",
      icon: Home,
    },
    {
      title: "My Profile",
      href: "/dashboard/employee/profile",
      icon: User,
    },
    {
      title: "Record Performance",
      href: "/dashboard/employee/record-performance",
      icon: ClipboardList,
    },
    {
      title: "My Metrics",
      href: "/dashboard/employee/metrics",
      icon: BarChart,
    },
    {
      title: "Logout",
      href: "/",
      icon: LogOut,
    },
  ]

  const links = role === "supervisor" ? supervisorLinks : employeeLinks

  return (
    <div className="w-64 border-r bg-background hidden md:block">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <h2 className="text-lg font-semibold">Employee Management</h2>
        </div>
        <nav className="flex-1 px-4 pb-4">
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                    pathname === link.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}
