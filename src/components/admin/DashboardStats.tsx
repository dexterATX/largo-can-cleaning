'use client'

import { motion } from 'motion/react'
import {
  FileText,
  Eye,
  FolderOpen,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
} from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ReactNode
  color: string
  delay?: number
}

function StatCard({ title, value, change, icon, color, delay = 0 }: StatCardProps) {
  const isPositive = change !== undefined && change >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 rounded-2xl p-6 hover:border-[var(--steel-gray)]/40 transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
        {change !== undefined && (
          <div
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              isPositive
                ? 'bg-green-500/10 text-green-400'
                : 'bg-red-500/10 text-red-400'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-[var(--slate-gray)]">{title}</p>
    </motion.div>
  )
}

interface DashboardStatsProps {
  stats: {
    totalPosts: number
    publishedPosts: number
    draftPosts: number
    totalViews: number
    totalCategories: number
    totalMedia: number
  }
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Posts"
        value={stats.totalPosts}
        icon={<FileText className="w-6 h-6" />}
        color="#FF6B00"
        delay={0}
      />
      <StatCard
        title="Published"
        value={stats.publishedPosts}
        change={12}
        icon={<ArrowUpRight className="w-6 h-6" />}
        color="#22C55E"
        delay={0.1}
      />
      <StatCard
        title="Total Views"
        value={stats.totalViews.toLocaleString()}
        change={8}
        icon={<Eye className="w-6 h-6" />}
        color="#3B82F6"
        delay={0.2}
      />
      <StatCard
        title="Categories"
        value={stats.totalCategories}
        icon={<FolderOpen className="w-6 h-6" />}
        color="#A855F7"
        delay={0.3}
      />
    </div>
  )
}
