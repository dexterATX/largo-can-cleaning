import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://largocancleaning.com'

// Revalidate sitemap every hour for fresh content
export const revalidate = 3600

// Deployment/build timestamp - falls back to a reasonable default
// In production, this captures when the app was last deployed
const DEPLOYMENT_DATE = new Date(process.env.BUILD_TIMESTAMP || '2025-01-15')

/**
 * Safely create Supabase client only if env vars are available
 */
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    return null
  }

  try {
    return createClient(url, key)
  } catch {
    return null
  }
}

/**
 * Fetch blog post data for sitemap
 * Returns posts with their slugs and update dates, plus the most recent update
 */
async function getBlogData(): Promise<{
  posts: Array<{ slug: string; updated_at: string }>
  latestUpdate: Date | null
}> {
  const supabase = getSupabaseClient()

  if (!supabase) {
    return { posts: [], latestUpdate: null }
  }

  try {
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, published_at')
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .order('updated_at', { ascending: false })

    if (error || !posts || posts.length === 0) {
      return { posts: [], latestUpdate: null }
    }

    // The first post has the most recent update
    const latestUpdate = new Date(posts[0].updated_at)

    return { posts, latestUpdate }
  } catch (error) {
    console.error('Sitemap: Error fetching blog posts:', error)
    return { posts: [], latestUpdate: null }
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch blog data
  const { posts, latestUpdate } = await getBlogData()

  // Determine last modified dates
  // For static pages: use deployment date (when code/content was last updated)
  // For blog listing: use the most recent post update or deployment date
  // For individual posts: use their actual updated_at
  const staticLastMod = DEPLOYMENT_DATE
  const blogListingLastMod = latestUpdate || DEPLOYMENT_DATE

  // Static pages with appropriate priorities and change frequencies
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: staticLastMod,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: staticLastMod,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: staticLastMod,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: staticLastMod,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: staticLastMod,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: staticLastMod,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: blogListingLastMod,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/gallery`,
      lastModified: staticLastMod,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: staticLastMod,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: staticLastMod,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Blog post pages with real lastModified dates
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...blogPages]
}
