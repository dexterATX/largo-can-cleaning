'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import {
  Eye,
  Users,
  Clock,
  TrendingUp,
  TrendingDown,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Loader2,
  RefreshCw,
} from 'lucide-react'

interface AnalyticsData {
  totalViews: number
  uniqueVisitors: number
  avgReadTime: number
  avgScrollDepth: number
  viewsByDay: { date: string; views: number }[]
  topPages: { path: string; title: string; views: number }[]
  topReferrers: { domain: string; count: number }[]
  deviceBreakdown: { mobile: number; tablet: number; desktop: number }
  browsers: { browser: string; count: number }[]
  trends: { views: number; visitors: number }
}

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState('7d')
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchAnalytics = async () => {
    // Abort any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const controller = new AbortController()
    abortControllerRef.current = controller

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/analytics?range=${dateRange}`, {
        signal: controller.signal,
      })
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }
      const data = await response.json()
      // Only update state if this request wasn't aborted
      if (!controller.signal.aborted) {
        setAnalytics(data)
      }
    } catch (err) {
      // Ignore abort errors
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }
      if (!controller.signal.aborted) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics')
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    fetchAnalytics()

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [dateRange])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  // Calculate max views for chart scaling
  const maxViews = analytics?.viewsByDay
    ? Math.max(...analytics.viewsByDay.map((d) => d.views), 1)
    : 1

  if (isLoading && !analytics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[var(--safety-orange)] animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-sm text-[var(--slate-gray)] mt-1">
            Track your website performance and visitor insights
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          <button
            onClick={fetchAnalytics}
            disabled={isLoading}
            className="p-2.5 bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 rounded-xl text-[var(--slate-gray)] hover:text-white hover:border-[var(--safety-orange)]/50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {/* Date Range Selector */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2.5 bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 rounded-xl text-white focus:outline-none focus:border-[var(--safety-orange)]/50 transition-colors"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {analytics && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-400" />
                </div>
                {analytics.trends.views !== 0 && (
                  <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                    analytics.trends.views > 0
                      ? 'text-green-400 bg-green-500/10'
                      : 'text-red-400 bg-red-500/10'
                  }`}>
                    {analytics.trends.views > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {Math.abs(analytics.trends.views)}%
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold text-white">{analytics.totalViews.toLocaleString()}</p>
              <p className="text-sm text-[var(--slate-gray)]">Total Page Views</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{analytics.uniqueVisitors.toLocaleString()}</p>
              <p className="text-sm text-[var(--slate-gray)]">Unique Visitors</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{formatDuration(analytics.avgReadTime)}</p>
              <p className="text-sm text-[var(--slate-gray)]">Avg. Time on Site</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{analytics.avgScrollDepth}%</p>
              <p className="text-sm text-[var(--slate-gray)]">Avg. Scroll Depth</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Views Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 rounded-2xl p-6"
            >
              <h3 className="font-semibold text-white mb-6">Page Views Over Time</h3>
              {analytics.viewsByDay.length > 0 ? (
                <div className="h-64 flex items-end gap-1">
                  {analytics.viewsByDay.slice(-14).map((day) => (
                    <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full bg-[var(--safety-orange)]/20 rounded-t-lg relative group cursor-pointer hover:bg-[var(--safety-orange)]/30 transition-colors min-h-[4px]"
                        style={{ height: `${Math.max((day.views / maxViews) * 100, 2)}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-[var(--asphalt-dark)] px-2 py-1 rounded text-xs text-white whitespace-nowrap z-10">
                          {day.views} views
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--safety-orange)] to-[var(--safety-orange)]/50 rounded-t-lg" />
                      </div>
                      <span className="text-[10px] text-[var(--slate-gray)]">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-[var(--slate-gray)]">
                  No data available for this period
                </div>
              )}
            </motion.div>

            {/* Device Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 rounded-2xl p-6"
            >
              <h3 className="font-semibold text-white mb-6">Device Breakdown</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white">Mobile</span>
                      <span className="text-sm text-[var(--slate-gray)]">{analytics.deviceBreakdown.mobile}%</span>
                    </div>
                    <div className="h-2 bg-[var(--asphalt-dark)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${analytics.deviceBreakdown.mobile}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Monitor className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white">Desktop</span>
                      <span className="text-sm text-[var(--slate-gray)]">{analytics.deviceBreakdown.desktop}%</span>
                    </div>
                    <div className="h-2 bg-[var(--asphalt-dark)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all duration-500"
                        style={{ width: `${analytics.deviceBreakdown.desktop}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Tablet className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white">Tablet</span>
                      <span className="text-sm text-[var(--slate-gray)]">{analytics.deviceBreakdown.tablet}%</span>
                    </div>
                    <div className="h-2 bg-[var(--asphalt-dark)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${analytics.deviceBreakdown.tablet}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Pages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 rounded-2xl p-6"
            >
              <h3 className="font-semibold text-white mb-4">Top Pages</h3>
              {analytics.topPages.length > 0 ? (
                <div className="space-y-3">
                  {analytics.topPages.map((page, index) => (
                    <div key={page.path} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-[var(--safety-orange)]/20 text-[var(--safety-orange)] text-xs font-medium flex items-center justify-center">
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm text-white truncate">{page.title || page.path}</p>
                          <p className="text-xs text-[var(--slate-gray)] truncate">{page.path}</p>
                        </div>
                      </div>
                      <span className="text-sm text-[var(--slate-gray)] ml-2">{page.views.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--slate-gray)] text-center py-8">No page views recorded yet</p>
              )}
            </motion.div>

            {/* Top Referrers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 rounded-2xl p-6"
            >
              <h3 className="font-semibold text-white mb-4">Top Referrers</h3>
              {analytics.topReferrers.length > 0 ? (
                <div className="space-y-3">
                  {analytics.topReferrers.map((referrer) => (
                    <div key={referrer.domain} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[var(--asphalt-dark)] flex items-center justify-center">
                          <Globe className="w-4 h-4 text-[var(--slate-gray)]" />
                        </div>
                        <span className="text-sm text-white">{referrer.domain}</span>
                      </div>
                      <span className="text-sm text-[var(--slate-gray)]">{referrer.count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--slate-gray)] text-center py-8">No referrer data yet</p>
              )}
            </motion.div>
          </div>

          {/* Empty State Notice */}
          {analytics.totalViews === 0 && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 text-center">
              <Eye className="w-12 h-12 text-blue-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">No Analytics Data Yet</h3>
              <p className="text-sm text-[var(--slate-gray)]">
                Analytics tracking is active. Visit your website to start collecting data.
                Page views, scroll depth, and time on page will be recorded automatically.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
