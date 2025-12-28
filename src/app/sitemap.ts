import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://largocancleaning.com'

// Static date for pages that don't change frequently
// Update this date when making significant content changes to static pages
const SITE_LAST_UPDATED = new Date('2025-01-01')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages - use fixed lastModified date per Google guidelines
  // Google ignores lastmod if it changes too frequently or isn't verifiably accurate
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: SITE_LAST_UPDATED,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: SITE_LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: SITE_LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: SITE_LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: SITE_LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: SITE_LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: SITE_LAST_UPDATED,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/gallery`,
      lastModified: SITE_LAST_UPDATED,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: SITE_LAST_UPDATED,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: SITE_LAST_UPDATED,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Fetch published blog posts
  let blogPages: MetadataRoute.Sitemap = []
  try {
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (posts) {
      blogPages = posts.map((post) => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error)
  }

  return [...staticPages, ...blogPages]
}
