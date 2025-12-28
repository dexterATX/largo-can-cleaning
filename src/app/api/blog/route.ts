import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isCategoryRelation } from '@/lib/validation'

// GET - Get published blog posts (public)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')

    // Validate and sanitize pagination parameters to prevent DoS
    const rawLimit = parseInt(searchParams.get('limit') || '50')
    const rawOffset = parseInt(searchParams.get('offset') || '0')
    const limit = isNaN(rawLimit) ? 50 : Math.min(100, Math.max(1, rawLimit))
    const offset = isNaN(rawOffset) ? 0 : Math.max(0, rawOffset)

    let query = supabase
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
      .range(offset, offset + limit - 1)

    // Filter by category
    if (category && category !== 'all') {
      // Get category by slug first
      const { data: cat } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category)
        .single()

      if (cat) {
        query = query.eq('category_id', cat.id)
      }
    }

    // Filter featured
    if (featured === 'true') {
      query = query.eq('featured', true)
    }

    // Search - escape special LIKE characters to prevent injection
    if (search) {
      const escapedSearch = search.replace(/[%_\\]/g, '\\$&')
      query = query.or(`title.ilike.%${escapedSearch}%,excerpt.ilike.%${escapedSearch}%`)
    }

    const { data: posts, error } = await query

    if (error) {
      console.error('Error fetching posts:', error)
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
    }

    // Get categories with post counts in a single query using Supabase's count feature
    // This avoids the N+1 pattern of fetching categories then all posts separately
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

    // Also get categories with no posts (the inner join above excludes them)
    const { data: allCategories } = await supabase
      .from('categories')
      .select('id, slug, name, color')
      .order('sort_order')

    // Build a map of category counts from the filtered query
    const countMap: Record<string, number> = {}
    categories?.forEach(cat => {
      const postCount = Array.isArray(cat.blog_posts) && cat.blog_posts.length > 0
        ? (cat.blog_posts[0] as { count: number }).count
        : 0
      countMap[cat.id] = postCount
    })

    // Merge counts with all categories (including those with 0 posts)
    const categoriesWithCounts = allCategories?.map(cat => ({
      id: cat.id,
      slug: cat.slug,
      name: cat.name,
      color: cat.color,
      count: countMap[cat.id] || 0
    })) || []

    // Calculate total from count map
    const totalPublished = Object.values(countMap).reduce((sum, count) => sum + count, 0)

    // Transform posts to match frontend structure
    const transformedPosts = posts?.map(post => {
      const category = isCategoryRelation(post.categories) ? post.categories : null
      return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        category: category?.slug || 'uncategorized',
        categoryLabel: category?.name || 'Uncategorized',
        categoryColor: category?.color || '#666',
        readTime: post.read_time || 5,
        date: post.published_at,
        featured: post.featured,
        image: post.featured_image_url || '/opengraph-image',
        metaTitle: post.meta_title,
        metaDescription: post.meta_description,
      }
    }) || []

    return NextResponse.json({
      posts: transformedPosts,
      categories: categoriesWithCounts,
      total: totalPublished,
    })
  } catch (error) {
    console.error('Blog API error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
