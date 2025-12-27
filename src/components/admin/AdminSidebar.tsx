'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Image,
  BarChart3,
  Settings,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Posts',
    href: '/admin/posts',
    icon: FileText,
  },
  {
    label: 'Categories',
    href: '/admin/categories',
    icon: FolderOpen,
  },
  {
    label: 'Media',
    href: '/admin/media',
    icon: Image,
  },
  {
    label: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[var(--asphalt-black)] border-r border-[var(--steel-gray)]/20 z-40 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[var(--steel-gray)]/20">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--safety-orange)] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Largo Can Cleaning</h1>
            <p className="text-[10px] text-[var(--slate-gray)] uppercase tracking-wider">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            const Icon = item.icon

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all relative',
                    isActive
                      ? 'text-white bg-[var(--safety-orange)]'
                      : 'text-[var(--slate-gray)] hover:text-white hover:bg-[var(--concrete-gray)]/50'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-[var(--safety-orange)] rounded-xl"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className={cn('w-5 h-5 relative z-10', isActive && 'text-white')} />
                  <span className="relative z-10">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[var(--steel-gray)]/20">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--concrete-gray)]/30 text-[var(--slate-gray)] text-sm hover:text-white hover:bg-[var(--concrete-gray)]/50 transition-all"
        >
          <span>View Website</span>
          <span className="text-[10px]">&rarr;</span>
        </Link>
      </div>
    </aside>
  )
}
