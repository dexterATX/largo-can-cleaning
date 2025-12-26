import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isCategoryRelation } from '@/lib/validation'

// GET - Get single blog post by slug (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const supabase = await createClient()

    const { data: post, error } = await supabase
      .from('blog_posts')
      .select(`
        id,
        slug,
        title,
        excerpt,
        content,
        category_id,
        featured_image_url,
        read_time,
        featured,
        published_at,
        meta_title,
        meta_description,
        meta_keywords,
        created_at,
        updated_at,
        categories (
          id,
          slug,
          name,
          color
        )
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .single()

    if (error || !post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Get related posts (same category, excluding current post)
    const { data: relatedPosts } = await supabase
      .from('blog_posts')
      .select(`
        id,
        slug,
        title,
        excerpt,
        featured_image_url,
        read_time,
        published_at,
        categories (
          slug,
          name
        )
      `)
      .eq('status', 'published')
      .eq('category_id', post.category_id)
      .neq('id', post.id)
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })
      .limit(3)

    // Get category info (Supabase returns object for single relation)
    const category = isCategoryRelation(post.categories) ? post.categories : null

    // Transform post
    const transformedPost = {
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: category?.slug || 'uncategorized',
      categoryLabel: category?.name || 'Uncategorized',
      categoryColor: category?.color || '#666',
      readTime: post.read_time || 5,
      date: post.published_at,
      featured: post.featured,
      image: post.featured_image_url || '/images/blog/default.jpg',
      metaTitle: post.meta_title || post.title,
      metaDescription: post.meta_description || post.excerpt,
      metaKeywords: post.meta_keywords || [],
      createdAt: post.created_at,
      updatedAt: post.updated_at,
    }

    // Transform related posts
    const transformedRelated = relatedPosts?.map(p => {
      const cat = isCategoryRelation(p.categories) ? p.categories : null
      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        image: p.featured_image_url || '/images/blog/default.jpg',
        readTime: p.read_time || 5,
        date: p.published_at,
        category: cat?.slug || 'uncategorized',
        categoryLabel: cat?.name || 'Uncategorized',
      }
    }) || []

    return NextResponse.json({
      post: transformedPost,
      related: transformedRelated,
    })
  } catch (error) {
    console.error('Blog post API error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
