'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { RefreshCw, Loader2 } from 'lucide-react'
import DashboardStats from '@/components/admin/DashboardStats'
import RecentPosts from '@/components/admin/RecentPosts'
import QuickActions from '@/components/admin/QuickActions'
import type { BlogPost } from '@/types/admin'

interface DashboardData {
  stats: {
    totalPosts: number
    publishedPosts: number
    draftPosts: number
    totalViews: number
    totalCategories: number
    totalMedia: number
  }
  recentPosts: BlogPost[]
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    const fetchDashboardData = async () => {
      if (isMounted) {
        setIsLoading(true)
        setError(null)
      }

      try {
        // Fetch all data concurrently using Promise.allSettled for resilience
        const results = await Promise.allSettled([
          fetch('/api/admin/posts?page=1&pageSize=5', { signal: controller.signal }),
          fetch('/api/admin/categories', { signal: controller.signal }),
          fetch('/api/admin/media?pageSize=1', { signal: controller.signal }),
          fetch('/api/admin/analytics?range=30d', { signal: controller.signal }),
        ])

        if (!isMounted) return

        // Extract responses, handling failures gracefully
        const [postsResult, categoriesResult, mediaResult, analyticsResult] = results

        let postsData = { data: [], total: 0 }
        let categoriesData = { data: [] }
        let mediaData = { total: 0 }
        let analyticsData = { totalViews: 0 }

        if (postsResult.status === 'fulfilled' && postsResult.value.ok) {
          postsData = await postsResult.value.json()
        }
        if (categoriesResult.status === 'fulfilled' && categoriesResult.value.ok) {
          categoriesData = await categoriesResult.value.json()
        }
        if (mediaResult.status === 'fulfilled' && mediaResult.value.ok) {
          mediaData = await mediaResult.value.json()
        }
        if (analyticsResult.status === 'fulfilled' && analyticsResult.value.ok) {
          analyticsData = await analyticsResult.value.json()
        }

        if (!isMounted) return

        const posts = postsData.data || []
        const categories = categoriesData?.data || []
        const publishedPosts = posts.filter((p: BlogPost) => p.status === 'published').length
        const totalPosts = postsData.total || 0

        // Calculate draft count from total
        const draftCount = totalPosts - publishedPosts

        if (isMounted) {
          setData({
            stats: {
              totalPosts: totalPosts,
              publishedPosts: publishedPosts,
              draftPosts: draftCount > 0 ? draftCount : 0,
              totalViews: analyticsData.totalViews || 0,
              totalCategories: Array.isArray(categories) ? categories.length : 0,
              totalMedia: mediaData.total || 0,
            },
            recentPosts: posts.slice(0, 5),
          })
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return // Component unmounted, ignore
        }
        console.error('Failed to fetch dashboard data:', error instanceof Error ? error.message : error)
        if (isMounted) {
          setError('Failed to load dashboard data')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchDashboardData()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [refreshKey])

  const handleRefresh = () => setRefreshKey((k) => k + 1)

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[var(--safety-orange)] animate-spin" />
      </div>
    )
  }

  const stats = data?.stats || {
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0,
    totalCategories: 0,
    totalMedia: 0,
  }

  const recentPosts = data?.recentPosts || []

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[var(--safety-orange)]/20 to-[var(--safety-orange)]/5 border border-[var(--safety-orange)]/20 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              Welcome back!
            </h2>
            <p className="text-[var(--slate-gray)]">
              Here&apos;s what&apos;s happening with your blog today.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--safety-orange)] text-white text-sm font-medium rounded-xl hover:bg-[var(--safety-orange-dark)] disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </motion.div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Stats Grid */}
      <DashboardStats stats={stats} />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Posts - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentPosts posts={recentPosts} />
        </div>

        {/* Quick Actions - Takes 1 column */}
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
