// ============================================
// Admin Panel TypeScript Types
// ============================================

// Blog Post
export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string | null
  category_id: string | null
  featured_image_id: string | null
  read_time: number
  featured: boolean
  status: 'draft' | 'published' | 'scheduled'
  published_at: string | null
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string[] | null
  og_image_id: string | null
  author: string
  created_at: string
  updated_at: string
  // Joined relations
  category?: Category | null
  featured_image?: Media | null
}

export interface BlogPostInsert {
  slug: string
  title: string
  excerpt?: string | null
  content?: string | null
  category_id?: string | null
  featured_image_id?: string | null
  read_time?: number
  featured?: boolean
  status?: 'draft' | 'published' | 'scheduled'
  published_at?: string | null
  meta_title?: string | null
  meta_description?: string | null
  meta_keywords?: string[] | null
  og_image_id?: string | null
  author?: string
}

export interface BlogPostUpdate extends Partial<BlogPostInsert> {}

// Category
export interface Category {
  id: string
  slug: string
  name: string
  description: string | null
  color: string
  sort_order: number
  created_at: string
  updated_at: string
  // Computed
  post_count?: number
}

export interface CategoryInsert {
  slug: string
  name: string
  description?: string | null
  color?: string
  sort_order?: number
}

export interface CategoryUpdate extends Partial<CategoryInsert> {}

// Media
export interface Media {
  id: string
  filename: string
  original_filename: string
  file_path: string
  file_url: string
  file_size: number | null
  mime_type: string | null
  width: number | null
  height: number | null
  alt_text: string | null
  caption: string | null
  folder: string
  created_at: string
  updated_at: string
}

export interface MediaInsert {
  filename: string
  original_filename: string
  file_path: string
  file_url: string
  file_size?: number | null
  mime_type?: string | null
  width?: number | null
  height?: number | null
  alt_text?: string | null
  caption?: string | null
  folder?: string
}

// Site Settings
export interface SiteSetting {
  id: string
  key: string
  value: Record<string, unknown>
  category: 'general' | 'seo' | 'social' | 'contact'
  updated_at: string
}

// Page View Analytics
export interface PageView {
  id: string
  page_path: string
  page_title: string | null
  referrer: string | null
  referrer_domain: string | null
  user_agent: string | null
  device_type: 'mobile' | 'tablet' | 'desktop' | null
  browser: string | null
  os: string | null
  country: string | null
  city: string | null
  session_id: string | null
  visitor_id: string | null
  read_time: number
  scroll_depth: number
  created_at: string
}

// SEO Keyword
export interface SeoKeyword {
  id: string
  keyword: string
  page_path: string | null
  position: number | null
  impressions: number
  clicks: number
  ctr: number | null
  source: 'manual' | 'search_console'
  tracked_at: string
  created_at: string
}

// Admin Session
export interface AdminSession {
  id: string
  session_token: string
  ip_address: string | null
  user_agent: string | null
  expires_at: string
  created_at: string
}

// Dashboard Stats
export interface DashboardStats {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalViews: number
  viewsToday: number
  totalCategories: number
  totalMedia: number
  topPages: Array<{
    path: string
    title: string
    views: number
  }>
  recentPosts: BlogPost[]
}

// Analytics Summary
export interface AnalyticsSummary {
  totalViews: number
  uniqueVisitors: number
  avgReadTime: number
  avgScrollDepth: number
  viewsByDay: Array<{
    date: string
    views: number
  }>
  topPages: Array<{
    path: string
    title: string
    views: number
  }>
  topReferrers: Array<{
    domain: string
    count: number
  }>
  deviceBreakdown: {
    mobile: number
    tablet: number
    desktop: number
  }
  browserBreakdown: Array<{
    browser: string
    count: number
  }>
}

// API Response Types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
