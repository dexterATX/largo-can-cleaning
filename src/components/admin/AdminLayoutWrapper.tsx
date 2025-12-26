'use client'

import { usePathname } from 'next/navigation'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

interface AdminLayoutWrapperProps {
  children: React.ReactNode
}

export default function AdminLayoutWrapper({ children }: AdminLayoutWrapperProps) {
  const pathname = usePathname()

  // Don't show sidebar/header on login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-[var(--asphalt-dark)]">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <AdminHeader />

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
