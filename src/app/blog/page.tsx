import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { isCategoryRelation } from '@/lib/validation'
import BlogPageContent from '@/components/pages/BlogPageContent'
import {
  BUSINESS_INFO,
  generateBlogSchema,
  generateBreadcrumbSchema,
  generateCollectionPageSchema
} from '@/lib/schema'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://largocancleaning.com'

// Revalidate every 60 seconds for stable crawler HTML
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Trash Can Cleaning Tips & Guides',
  description: 'Expert tips on trash can cleaning, home hygiene, pest prevention, and maintaining a clean outdoor space. Stay informed with Largo Can Cleaning.',
  keywords: [
    // Informational/how-to keywords (Blog owns these)
    'how to clean trash cans',
    'trash can odor removal tips',
    'prevent maggots in garbage cans',
    'Florida outdoor bin hygiene',
    'when to clean wheelie bins',
    'trash can bacteria facts',
    'DIY bin cleaning vs professional',
    'summer trash can odor prevention',
  ],
  alternates: {
    canonical: `${BUSINESS_INFO.url}/blog`,
  },
  openGraph: {
    title: 'Trash Can Cleaning Tips & Guides',
    description: 'Expert tips on trash can cleaning, home hygiene, and pest prevention.',
    type: 'website',
    url: `${BUSINESS_INFO.url}/blog`,
    siteName: BUSINESS_INFO.name,
    locale: 'en_US',
    images: [
      {
        url: `${BASE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `${BUSINESS_INFO.name} Blog`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trash Can Cleaning Tips & Guides',
    description: 'Expert tips on trash can cleaning, home hygiene, and pest prevention.',
  },
}

// Server-side data fetching for SSR
async function getBlogData() {
  try {
    const supabase = await createClient()

    // Fetch published posts
    const { data: posts, error: postsError } = await supabase
      .from('blog_posts')
      .select(`
        id,
        slug,
        title,
        excerpt,
        category_id,
        featured_image_url,
        read_time,
        featured,
        published_at,
        meta_title,
        meta_description,
        categories (
          id,
          slug,
          name,
          color
        )
      `)
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })
      .limit(50)

    if (postsError) {
      console.error('Error fetching posts:', postsError)
      return null
    }

    // Get categories with post counts
    const { data: categories } = await supabase
      .from('categories')
      .select(`
        id,
        slug,
        name,
        color,
        blog_posts!inner(count)
      `, { count: 'exact' })
      .eq('blog_posts.status', 'published')
      .not('blog_posts.published_at', 'is', null)
      .order('sort_order')

    // Get all categories (including those with 0 posts)
    const { data: allCategories } = await supabase
      .from('categories')
      .select('id, slug, name, color')
      .order('sort_order')

    // Build count map
    const countMap: Record<string, number> = {}
    categories?.forEach(cat => {
      const postCount = Array.isArray(cat.blog_posts) && cat.blog_posts.length > 0
        ? (cat.blog_posts[0] as { count: number }).count
        : 0
      countMap[cat.id] = postCount
    })

    // Merge counts with all categories
    const categoriesWithCounts = allCategories?.map(cat => ({
      id: cat.id,
      slug: cat.slug,
      name: cat.name,
      color: cat.color,
      count: countMap[cat.id] || 0
    })) || []

    // Calculate total
    const totalPublished = Object.values(countMap).reduce((sum, count) => sum + count, 0)

    // Transform posts for frontend
    const transformedPosts = posts?.map(post => {
      const category = isCategoryRelation(post.categories) ? post.categories : null
      return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt || '',
        category: category?.slug || 'uncategorized',
        categoryLabel: category?.name || 'Uncategorized',
        categoryColor: category?.color || '#666',
        readTime: post.read_time || 5,
        date: post.published_at || new Date().toISOString(),
        featured: post.featured || false,
        image: post.featured_image_url || '/opengraph-image',
      }
    }) || []

    return {
      posts: transformedPosts,
      categories: categoriesWithCounts,
      total: totalPublished,
    }
  } catch (error) {
    console.error('Blog SSR error:', error)
    return null
  }
}

export default async function BlogPage() {
  const blogUrl = `${BASE_URL}/blog`

  // Fetch blog data server-side for SSR
  const blogData = await getBlogData()

  // Generate Blog schema
  const blogSchema = generateBlogSchema({
    name: `${BUSINESS_INFO.name} Blog`,
    description: 'Expert tips on trash can cleaning, home hygiene, pest prevention, and maintaining a clean outdoor space.',
    url: blogUrl,
  })

  // Generate Breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Blog', url: blogUrl },
  ])

  // Generate CollectionPage schema
  const collectionPageSchema = generateCollectionPageSchema({
    title: `${BUSINESS_INFO.name} Blog`,
    description: 'Expert tips on trash can cleaning, home hygiene, pest prevention, and maintaining a clean outdoor space.',
    url: blogUrl,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <BlogPageContent
        initialPosts={blogData?.posts || []}
        initialCategories={blogData?.categories || []}
        initialTotal={blogData?.total || 0}
      />
    </>
  )
}
