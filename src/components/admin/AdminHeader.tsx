'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import {
  LogOut,
  User,
  Bell,
  Search,
  ChevronDown,
  Loader2,
} from 'lucide-react'

// Map paths to page titles
const pageTitles: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/posts': 'Blog Posts',
  '/admin/posts/new': 'New Post',
  '/admin/categories': 'Categories',
  '/admin/media': 'Media Library',
  '/admin/analytics': 'Analytics',
  '/admin/settings': 'Settings',
}

export default function AdminHeader() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Get current page title
  const getPageTitle = () => {
    // Check for exact match first
    if (pageTitles[pathname]) {
      return pageTitles[pathname]
    }
    // Check for post edit page
    if (pathname.startsWith('/admin/posts/') && pathname !== '/admin/posts/new') {
      return 'Edit Post'
    }
    return 'Admin'
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const res = await fetch('/api/admin/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })

      if (res.ok) {
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="h-16 bg-[var(--asphalt-dark)] border-b border-[var(--steel-gray)]/20 flex items-center justify-between px-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-semibold text-white">{getPageTitle()}</h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <button className="p-2 rounded-lg text-[var(--slate-gray)] hover:text-white hover:bg-[var(--concrete-gray)]/50 transition-colors">
          <Search className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-[var(--slate-gray)] hover:text-white hover:bg-[var(--concrete-gray)]/50 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--safety-orange)] rounded-full" />
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-[var(--steel-gray)]/30" />

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[var(--concrete-gray)]/50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--safety-orange)]/20 flex items-center justify-center">
              <User className="w-4 h-4 text-[var(--safety-orange)]" />
            </div>
            <span className="text-sm font-medium text-white">Admin</span>
            <ChevronDown className={`w-4 h-4 text-[var(--slate-gray)] transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {showUserMenu && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                {/* Menu */}
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-[var(--concrete-gray)] border border-[var(--steel-gray)]/30 rounded-xl shadow-xl overflow-hidden z-50"
                >
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left text-red-400 hover:bg-[var(--asphalt-dark)]/50 transition-colors disabled:opacity-50"
                  >
                    {isLoggingOut ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <LogOut className="w-4 h-4" />
                    )}
                    <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
