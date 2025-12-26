import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifySession } from '@/lib/auth/session'
import { isValidDeviceType } from '@/lib/validation'

export async function GET(request: NextRequest) {
  // Verify authentication
  const isValid = await verifySession()
  if (!isValid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const searchParams = request.nextUrl.searchParams
  const range = searchParams.get('range') || '7d'

  // Calculate date range
  const now = new Date()
  let startDate: Date
  switch (range) {
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    case '90d':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      break
    case '7d':
    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
  }

  const startDateStr = startDate.toISOString()

  try {
    // Use parallel queries with aggregation instead of fetching all records
    // This dramatically reduces memory usage and improves performance for large datasets

    // Query 1: Get total count and aggregates in one query
    const [
      totalCountResult,
      uniqueVisitorsResult,
      avgMetricsResult,
      viewsByDayResult,
      topPagesResult,
      topReferrersResult,
      deviceBreakdownResult,
      browserBreakdownResult,
      previousCountResult
    ] = await Promise.all([
      // Total page views count
      supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDateStr),

      // Unique visitors - get distinct session_ids with limit to avoid memory issues
      // Note: For true unique count, a database function would be more efficient
      supabase
        .from('page_views')
        .select('session_id')
        .gte('created_at', startDateStr)
        .limit(10000),

      // Average metrics - only fetch the columns we need for aggregation
      supabase
        .from('page_views')
        .select('read_time, scroll_depth')
        .gte('created_at', startDateStr)
        .not('read_time', 'is', null)
        .gt('read_time', 0)
        .limit(5000),

      // Views by day - fetch only created_at for date grouping
      supabase
        .from('page_views')
        .select('created_at')
        .gte('created_at', startDateStr)
        .limit(10000),

      // Top pages - fetch only what we need
      supabase
        .from('page_views')
        .select('page_path')
        .gte('created_at', startDateStr)
        .limit(10000),

      // Top referrers
      supabase
        .from('page_views')
        .select('referrer')
        .gte('created_at', startDateStr)
        .limit(10000),

      // Device breakdown
      supabase
        .from('page_views')
        .select('device_type')
        .gte('created_at', startDateStr)
        .limit(10000),

      // Browser breakdown
      supabase
        .from('page_views')
        .select('browser')
        .gte('created_at', startDateStr)
        .limit(10000),

      // Previous period count for trends
      supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(startDate.getTime() - (now.getTime() - startDate.getTime())).toISOString())
        .lt('created_at', startDateStr)
    ])

    // Check for errors
    if (totalCountResult.error) {
      console.error('Error fetching page views count:', totalCountResult.error)
      return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
    }

    // Calculate total page views from count query (much more efficient)
    const totalViews = totalCountResult.count || 0

    // Calculate unique visitors
    const uniqueSessions = new Set(uniqueVisitorsResult.data?.map(v => v.session_id) || [])
    const uniqueVisitors = uniqueSessions.size

    // Calculate average read time and scroll depth
    const metricsData = avgMetricsResult.data || []
    const viewsWithReadTime = metricsData.filter(v => v.read_time && v.read_time > 0)
    const avgReadTime = viewsWithReadTime.length > 0
      ? Math.round(viewsWithReadTime.reduce((sum, v) => sum + (v.read_time || 0), 0) / viewsWithReadTime.length)
      : 0

    const viewsWithScrollDepth = metricsData.filter(v => v.scroll_depth && v.scroll_depth > 0)
    const avgScrollDepth = viewsWithScrollDepth.length > 0
      ? Math.round(viewsWithScrollDepth.reduce((sum, v) => sum + (v.scroll_depth || 0), 0) / viewsWithScrollDepth.length)
      : 0

    // Views by day
    const viewsByDayMap: Record<string, number> = {}
    viewsByDayResult.data?.forEach(view => {
      const date = new Date(view.created_at).toISOString().split('T')[0]
      viewsByDayMap[date] = (viewsByDayMap[date] || 0) + 1
    })

    // Generate all dates in range
    const viewsByDay: { date: string; views: number }[] = []
    const currentDate = new Date(startDate)
    while (currentDate <= now) {
      const dateStr = currentDate.toISOString().split('T')[0]
      viewsByDay.push({
        date: dateStr,
        views: viewsByDayMap[dateStr] || 0
      })
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Top pages
    const pageCountMap: Record<string, { path: string; title: string; views: number }> = {}
    topPagesResult.data?.forEach(view => {
      const path = view.page_path || '/'
      if (!pageCountMap[path]) {
        pageCountMap[path] = {
          path,
          title: path,
          views: 0
        }
      }
      pageCountMap[path].views++
    })
    const topPages = Object.values(pageCountMap)
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    // Top referrers
    const referrerCountMap: Record<string, number> = {}
    topReferrersResult.data?.forEach(view => {
      let domain = 'direct'
      if (view.referrer) {
        try {
          const url = new URL(view.referrer)
          domain = url.hostname
        } catch {
          domain = view.referrer
        }
      }
      referrerCountMap[domain] = (referrerCountMap[domain] || 0) + 1
    })
    const topReferrers = Object.entries(referrerCountMap)
      .map(([domain, count]) => ({ domain, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Device breakdown with proper type validation
    const deviceCounts = { mobile: 0, tablet: 0, desktop: 0 }
    deviceBreakdownResult.data?.forEach(view => {
      const device = view.device_type
      if (isValidDeviceType(device)) {
        deviceCounts[device]++
      }
    })
    const totalDevices = deviceCounts.mobile + deviceCounts.tablet + deviceCounts.desktop
    const deviceBreakdown = {
      mobile: totalDevices > 0 ? Math.round((deviceCounts.mobile / totalDevices) * 100) : 0,
      tablet: totalDevices > 0 ? Math.round((deviceCounts.tablet / totalDevices) * 100) : 0,
      desktop: totalDevices > 0 ? Math.round((deviceCounts.desktop / totalDevices) * 100) : 0,
    }

    // Browser breakdown
    const browserCountMap: Record<string, number> = {}
    browserBreakdownResult.data?.forEach(view => {
      const browser = view.browser || 'Unknown'
      browserCountMap[browser] = (browserCountMap[browser] || 0) + 1
    })
    const browsers = Object.entries(browserCountMap)
      .map(([browser, count]) => ({ browser, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Calculate trends using count from previous period query
    const previousTotal = previousCountResult.count || 0
    const viewsTrend = previousTotal > 0
      ? Math.round(((totalViews - previousTotal) / previousTotal) * 100)
      : 0

    return NextResponse.json({
      totalViews,
      uniqueVisitors,
      avgReadTime,
      avgScrollDepth,
      viewsByDay,
      topPages,
      topReferrers,
      deviceBreakdown,
      browsers,
      trends: {
        views: viewsTrend,
        visitors: 0, // Would need session tracking for accurate comparison
      }
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
