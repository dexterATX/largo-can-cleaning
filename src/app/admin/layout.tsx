import AuthGuard from '@/components/admin/AuthGuard'
import AdminLayoutWrapper from '@/components/admin/AdminLayoutWrapper'

export const metadata = {
  title: 'Admin Panel | CleanCan Pro',
  description: 'CleanCan Pro Admin Dashboard',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <AdminLayoutWrapper>
        {children}
      </AdminLayoutWrapper>
    </AuthGuard>
  )
}
