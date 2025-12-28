'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import {
  PlusCircle,
  Upload,
  FolderPlus,
  Settings,
} from 'lucide-react'

const actions = [
  {
    label: 'New Post',
    description: 'Create a new blog article',
    href: '/admin/posts/new',
    icon: PlusCircle,
    color: '#FF6B00',
  },
  {
    label: 'Upload Media',
    description: 'Add images to library',
    href: '/admin/media',
    icon: Upload,
    color: '#3B82F6',
  },
  {
    label: 'Add Category',
    description: 'Create new category',
    href: '/admin/categories',
    icon: FolderPlus,
    color: '#A855F7',
  },
  {
    label: 'Settings',
    description: 'Configure site settings',
    href: '/admin/settings',
    icon: Settings,
    color: '#6B7280',
  },
]

export default function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 rounded-2xl p-5"
    >
      <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.href}
              href={action.href}
              className="group flex items-center gap-3 p-3 rounded-xl bg-[var(--asphalt-dark)]/50 hover:bg-[var(--asphalt-dark)] border border-transparent hover:border-[var(--steel-gray)]/20 transition-all"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${action.color}20` }}
              >
                <Icon className="w-5 h-5" style={{ color: action.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white group-hover:text-[var(--safety-orange)] transition-colors">
                  {action.label}
                </p>
                <p className="text-[10px] text-[var(--slate-gray)] truncate">
                  {action.description}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </motion.div>
  )
}
