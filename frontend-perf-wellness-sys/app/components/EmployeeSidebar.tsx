// Updated EmployeeSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, BarChart, Activity, History } from 'lucide-react';

export default function EmployeeSidebar() {
  const pathname = usePathname();

  const navLinks = [
    {
      href: '/employee/dashboard',
      label: 'Overview',
      icon: <Home size={18} />,
    },
    {
      href: '/employee/profile',
      label: 'My Profile',
      icon: <User size={18} />,
    },
    {
      href: '/employee/performance',
      label: 'Performance Data',
      icon: <BarChart size={18} />,
    },
    {
      href: '/employee/wellness',
      label: 'Wellness Tracking',
      icon: <Activity size={18} />, // Changed to Activity icon for better distinction
    },
    {
      href: '/employee/history',
      label: 'Metrics History',
      icon: <History size={18} />, // Changed to History icon for better distinction
    }
  ];
  
  return (
    <nav className="p-4 space-y-1 overflow-auto w-full md:w-64">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
            pathname === link.href
              ? 'bg-teal-50 text-teal-600'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {link.icon}
          <span>{link.label}</span>
        </Link>
      ))}
    </nav>
  );
}