'use client'

import { useState, useRef, useEffect, useMemo, memo } from 'react'
import { motion } from 'motion/react'
import Link from 'next/link'
import {
  Clock,
  Calendar,
  ArrowRight,
  Search,
  Tag,
  TrendingUp,
  Sparkles,
  BookOpen,
  ChevronRight,
} from 'lucide-react'
import Container from '@/components/ui/Container'
import { cn } from '@/lib/utils'

// ============================================
// TYPES
// ============================================

interface BlogPost {
  id: string | number
  slug: string
  title: string
  linkText?: string // Short anchor text for SEO (2-5 words)
  excerpt: string
  category: string
  categoryLabel?: string
  readTime: number
  date: string
  featured: boolean
  image: string
}

interface Category {
  id: string
  slug?: string
  name?: string
  label?: string
  count: number
}

// ============================================
// FALLBACK DATA (used when Supabase is not configured)
// ============================================

const fallbackCategories = [
  { id: 'tips', label: 'Tips & How-To', count: 3 },
  { id: 'health', label: 'Health & Safety', count: 2 },
  { id: 'news', label: 'Company News', count: 2 },
  { id: 'sustainability', label: 'Eco-Friendly', count: 1 },
]

const fallbackPosts: BlogPost[] = [
  {
    id: 1,
    slug: 'why-clean-trash-cans-matter',
    title: 'Why Clean Trash Cans Matter More Than You Think',
    linkText: 'Why Clean Bins Matter',
    excerpt: 'Discover the hidden health risks lurking in your dirty bins and why regular cleaning is essential for your family\'s wellbeing.',
    category: 'health',
    categoryLabel: 'Health & Safety',
    readTime: 5,
    date: '2025-01-15',
    featured: true,
    image: '/opengraph-image',
  },
  {
    id: 2,
    slug: 'diy-vs-professional-cleaning',
    title: 'DIY vs Pro Bin Cleaning Comparison',
    linkText: 'DIY vs Pro Cleaning',
    excerpt: 'We break down the costs, effectiveness, and time investment of both approaches to help you make the right choice.',
    category: 'tips',
    categoryLabel: 'Tips & How-To',
    readTime: 7,
    date: '2025-01-10',
    featured: true,
    image: '/opengraph-image',
  },
  {
    id: 3,
    slug: 'prevent-pests-trash-bins',
    title: '5 Ways to Keep Pests Out of Trash Bins',
    linkText: 'Prevent Trash Bin Pests',
    excerpt: 'Keep raccoons, flies, and rodents away with these proven prevention strategies that actually work.',
    category: 'tips',
    categoryLabel: 'Tips & How-To',
    readTime: 4,
    date: '2025-01-05',
    featured: false,
    image: '/opengraph-image',
  },
  {
    id: 4,
    slug: 'bacteria-in-garbage-bins',
    title: 'Bacteria in Your Trash Cans: The Facts',
    linkText: 'Bin Bacteria Facts',
    excerpt: 'Lab tests reveal what\'s really growing in the average household trash can—and it\'s not pretty.',
    category: 'health',
    categoryLabel: 'Health & Safety',
    readTime: 6,
    date: '2024-12-28',
    featured: false,
    image: '/opengraph-image',
  },
  {
    id: 5,
    slug: 'eco-friendly-bin-cleaning',
    title: 'Eco-Friendly Bin Cleaning Explained',
    linkText: 'Eco-Friendly Cleaning',
    excerpt: 'Learn about our sustainable cleaning process, biodegradable solutions, and zero-runoff water capture system.',
    category: 'sustainability',
    categoryLabel: 'Eco-Friendly',
    readTime: 5,
    date: '2024-12-20',
    featured: false,
    image: '/opengraph-image',
  },
  {
    id: 6,
    slug: 'summer-bin-odor-tips',
    title: 'Summer Bin Odor Prevention Tips',
    linkText: 'Summer Odor Prevention',
    excerpt: 'Hot weather makes bin odors worse. Here\'s how to keep your outdoor area smelling fresh all summer long.',
    category: 'tips',
    categoryLabel: 'Tips & How-To',
    readTime: 4,
    date: '2024-12-15',
    featured: false,
    image: '/opengraph-image',
  },
  {
    id: 7,
    slug: 'cleancan-pro-expansion-2025',
    title: 'Largo Can Cleaning Expands Service to All of Pinellas County',
    linkText: 'Pinellas County Expansion',
    excerpt: 'We\'re excited to announce our expanded coverage area, now serving more communities across the region.',
    category: 'news',
    categoryLabel: 'Company News',
    readTime: 3,
    date: '2024-12-10',
    featured: false,
    image: '/opengraph-image',
  },
  {
    id: 8,
    slug: 'commercial-bin-cleaning-benefits',
    title: 'Why Restaurants Choose Pro Bin Cleaning',
    linkText: 'Commercial Bin Cleaning',
    excerpt: 'Health codes, customer perception, and pest control—discover why commercial cleaning pays for itself.',
    category: 'news',
    categoryLabel: 'Company News',
    readTime: 6,
    date: '2024-12-05',
    featured: false,
    image: '/opengraph-image',
  },
]

// ============================================
// HELPER FUNCTIONS
// ============================================

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function getCategoryLabel(categoryId: string, categories: Category[]): string {
  const category = categories.find(c => c.id === categoryId || c.slug === categoryId)
  return category?.label || category?.name || categoryId
}

// Generate unique, SEO-friendly anchor text from title if linkText not provided
function getAnchorText(post: BlogPost): string {
  if (post.linkText) return post.linkText
  // Create short anchor from title: "Why Clean Trash Cans Matter" → "Read: Clean Trash Cans"
  const words = post.title.split(' ').slice(0, 4).join(' ')
  return `Read: ${words}`
}

// ============================================
// COMPONENTS
// ============================================

// Featured Post Card - Mobile First - Memoized to prevent re-renders
const FeaturedPostCard = memo(function FeaturedPostCard({ post, categories }: { post: BlogPost; categories: Category[] }) {
  return (
    <article
      className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[var(--concrete-gray)]/60 to-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 transition-transform duration-200 hover:scale-[1.01] group"
    >
      {/* Overlay link for full card clickability with SEO-friendly anchor text */}
      <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-10" tabIndex={-1}>
        <span className="sr-only">{getAnchorText(post)}</span>
      </Link>

      {/* Image Placeholder */}
      <div className="aspect-[16/10] sm:aspect-[16/8] lg:aspect-[16/7] bg-gradient-to-br from-[var(--safety-orange)]/20 to-[var(--safety-orange)]/5 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-[var(--safety-orange)]/30" />
        </div>
        {/* Featured Badge */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--safety-orange)] text-white text-[10px] sm:text-xs font-semibold">
            <TrendingUp className="w-3 h-3" />
            Featured
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* Meta */}
        <div className="flex items-center gap-3 mb-3">
          <span className="px-2 py-0.5 rounded-md bg-[var(--safety-orange)]/10 text-[var(--safety-orange)] text-[10px] sm:text-xs font-medium">
            {post.categoryLabel || getCategoryLabel(post.category, categories)}
          </span>
          <span className="flex items-center gap-1 text-[10px] sm:text-xs text-[var(--slate-gray)]">
            <Clock className="w-3 h-3" />
            {post.readTime} min read
          </span>
        </div>

        {/* Title */}
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 group-hover:text-[var(--safety-orange)] transition-colors leading-tight">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-sm sm:text-base text-[var(--slate-gray)] leading-relaxed mb-4 line-clamp-2">
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs sm:text-sm text-[var(--steel-gray)]">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(post.date)}
          </span>
          <Link href={`/blog/${post.slug}`} className="relative z-20 flex items-center gap-1 text-sm font-medium text-[var(--safety-orange)] hover:gap-2 transition-all">
            {getAnchorText(post)}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  )
})

// Regular Post Card - Mobile First (Compact) - Memoized to prevent re-renders
const PostCard = memo(function PostCard({ post, categories, index = 0 }: { post: BlogPost; categories: Category[]; index?: number }) {
  return (
    <article
      className="relative h-full rounded-xl overflow-hidden bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 active:border-[var(--safety-orange)]/30 lg:hover:border-[var(--safety-orange)]/30 transition-all group"
    >
      {/* Overlay link for full card clickability with SEO-friendly anchor text */}
      <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-10" tabIndex={-1}>
        <span className="sr-only">{getAnchorText(post)}</span>
      </Link>

      {/* Image Placeholder - Shorter on mobile */}
      <div className="aspect-[4/3] lg:aspect-[16/9] bg-gradient-to-br from-[var(--concrete-gray)]/60 to-[var(--concrete-gray)]/30 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen className="w-6 h-6 lg:w-8 lg:h-8 text-[var(--steel-gray)]/50" />
        </div>
        {/* Category Badge - On image for mobile */}
        <div className="absolute bottom-2 left-2 lg:hidden">
          <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[var(--safety-orange)] text-[8px] font-medium">
            {post.categoryLabel || getCategoryLabel(post.category, categories)}
          </span>
        </div>
      </div>

      {/* Content - Compact on mobile */}
      <div className="p-2.5 lg:p-4">
        {/* Meta - Desktop only full version */}
        <div className="hidden lg:flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded-md bg-[var(--safety-orange)]/10 text-[var(--safety-orange)] text-[10px] font-medium">
            {post.categoryLabel || getCategoryLabel(post.category, categories)}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-[var(--slate-gray)]">
            <Clock className="w-3 h-3" />
            {post.readTime} min
          </span>
        </div>

        {/* Title - Smaller on mobile */}
        <h3 className="text-[13px] lg:text-base font-semibold text-white mb-1 lg:mb-2 group-active:text-[var(--safety-orange)] lg:group-hover:text-[var(--safety-orange)] transition-colors leading-snug line-clamp-2">
          {post.title}
        </h3>

        {/* Read time - Mobile */}
        <div className="flex items-center gap-1 text-[9px] text-[var(--slate-gray)] lg:hidden">
          <Clock className="w-2.5 h-2.5" />
          {post.readTime} min read
        </div>

        {/* Excerpt - Desktop only */}
        <p className="hidden lg:block text-sm text-[var(--slate-gray)] leading-relaxed mb-3 line-clamp-2">
          {post.excerpt}
        </p>

        {/* Date and Link - Desktop only */}
        <div className="hidden lg:flex items-center justify-between pt-2 border-t border-[var(--steel-gray)]/10">
          <span className="text-xs text-[var(--steel-gray)]">
            {formatDate(post.date)}
          </span>
          <Link href={`/blog/${post.slug}`} className="relative z-20 flex items-center gap-1 text-xs font-medium text-[var(--safety-orange)] hover:gap-2 transition-all">
            {getAnchorText(post)}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  )
})

// Category Filter Pills
function CategoryFilter({
  activeCategory,
  onCategoryChange,
  categories,
  totalPosts,
}: {
  activeCategory: string
  onCategoryChange: (category: string) => void
  categories: Category[]
  totalPosts: number
}) {
  // Build category list with "All" as the first option
  // Filter out any existing 'all' category to avoid duplicates
  const allCategories = [
    { id: 'all', label: 'All Posts', count: totalPosts },
    ...categories
      .filter(c => c.id !== 'all' && c.slug !== 'all')
      .map(c => ({
        id: c.slug || c.id,
        label: c.name || c.label || c.id,
        count: c.count,
      })),
  ]

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
      {allCategories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={cn(
            'flex-shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all',
            activeCategory === category.id
              ? 'bg-[var(--safety-orange)] text-white'
              : 'bg-[var(--concrete-gray)]/30 text-[var(--slate-gray)] hover:bg-[var(--concrete-gray)]/50 hover:text-white'
          )}
        >
          {category.label}
          <span className="ml-1.5 opacity-60">({category.count})</span>
        </button>
      ))}
    </div>
  )
}

// Mobile Featured Carousel - Memoized
const MobileTrendingCarousel = memo(function MobileTrendingCarousel({ posts, categories }: { posts: BlogPost[]; categories: Category[] }) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [dragWidth, setDragWidth] = useState(0)
  const [canScrollRight, setCanScrollRight] = useState(true)

  useEffect(() => {
    if (carouselRef.current) {
      setDragWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth)
    }
  }, [posts])

  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20)
    }
  }

  // Get featured posts first, then fill with others
  const featuredFirst = useMemo(() =>
    [...posts].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)),
    [posts]
  )

  return (
    <div className="lg:hidden mb-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[var(--safety-orange)] flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-white">Top Picks</span>
        </div>
        <div
          className={cn(
            "flex items-center gap-1 text-[10px] text-[var(--slate-gray)] transition-opacity duration-200",
            canScrollRight ? "opacity-100" : "opacity-0"
          )}
        >
          <span>Swipe</span>
          <ChevronRight className="w-4 h-4 text-[var(--safety-orange)]" />
        </div>
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* Right Fade */}
        <div
          className={cn(
            "absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[var(--asphalt-dark)] to-transparent z-10 pointer-events-none transition-opacity duration-200",
            canScrollRight ? "opacity-100" : "opacity-0"
          )}
        />

        <motion.div
          ref={carouselRef}
          drag="x"
          dragConstraints={{ right: 0, left: -dragWidth }}
          dragElastic={0.1}
          dragTransition={{ bounceDamping: 30 }}
          onDrag={handleScroll}
          className="flex gap-3 px-4 cursor-grab active:cursor-grabbing"
        >
          {featuredFirst.slice(0, 5).map((post, index) => (
            <div
              key={post.id}
              className="flex-shrink-0 w-[280px] group relative"
              draggable={false}
            >
              {/* Overlay link for full card clickability with SEO-friendly anchor text */}
              <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-10" tabIndex={-1}>
                <span className="sr-only">{getAnchorText(post)}</span>
              </Link>

              <div
                className="relative rounded-xl overflow-hidden bg-gradient-to-br from-[var(--concrete-gray)]/60 to-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 active:border-[var(--safety-orange)]/40 transition-colors"
              >
                {/* Image Area */}
                <div className="aspect-[16/9] bg-gradient-to-br from-[var(--safety-orange)]/20 to-[var(--safety-orange)]/5 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-[var(--safety-orange)]/30" />
                  </div>
                  {/* Featured Badge */}
                  {post.featured && (
                    <div className="absolute top-2 left-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--safety-orange)] text-white text-[9px] font-semibold">
                        <TrendingUp className="w-2.5 h-2.5" />
                        Featured
                      </span>
                    </div>
                  )}
                  {/* Read Time */}
                  <div className="absolute bottom-2 right-2">
                    <span className="px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-sm text-white text-[9px]">
                      {post.readTime} min read
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3">
                  <span className="text-[9px] text-[var(--safety-orange)] font-medium uppercase tracking-wide">
                    {post.categoryLabel || getCategoryLabel(post.category, categories)}
                  </span>
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 mt-1 group-active:text-[var(--safety-orange)] transition-colors">
                    {post.title}
                  </h3>
                  <Link href={`/blog/${post.slug}`} className="relative z-20 text-[11px] text-[var(--safety-orange)] font-medium mt-2 inline-flex items-center gap-1">
                    {getAnchorText(post)}
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
})

// ============================================
// MAIN COMPONENT
// ============================================

export default function BlogPageContent() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(fallbackPosts)
  const [categories, setCategories] = useState<Category[]>(fallbackCategories)
  const [totalPosts, setTotalPosts] = useState(fallbackPosts.length)

  // Fetch posts from API - no loading state to avoid flicker, fallback data shows immediately
  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    async function fetchPosts() {
      try {
        const res = await fetch('/api/blog', { signal: controller.signal })
        if (isMounted && res.ok) {
          const data = await res.json()
          if (isMounted && data.posts && data.posts.length > 0) {
            setBlogPosts(data.posts)
            setTotalPosts(data.total || data.posts.length)
            if (data.categories && data.categories.length > 0) {
              setCategories(data.categories)
            }
          }
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return // Component unmounted, ignore
        }
        // Use fallback data if API fails - already set as initial state
      }
    }

    fetchPosts()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [])

  // Filter posts - memoized for performance
  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesCategory = activeCategory === 'all' || post.category === activeCategory
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [blogPosts, activeCategory, searchQuery])

  const featuredPosts = useMemo(() => {
    return filteredPosts.filter((post) => post.featured)
  }, [filteredPosts])

  const regularPosts = useMemo(() => {
    return filteredPosts.filter((post) => !post.featured)
  }, [filteredPosts])

  return (
    <div className="relative bg-[var(--asphalt-dark)] min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-28 pb-8 sm:pt-36 sm:pb-12 overflow-hidden bg-gradient-dark">
        {/* BLOG PAGE: Clean gradient background */}

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -left-16 md:-left-32 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-rose-500/12 rounded-full blur-[60px] md:blur-[80px]" />
        <div className="absolute -top-20 right-0 w-72 h-72 sm:w-96 sm:h-96 lg:w-[450px] lg:h-[450px] bg-[var(--safety-orange)]/20 rounded-full blur-[80px] md:blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 sm:w-64 sm:h-64 bg-amber-500/12 rounded-full blur-[50px] md:blur-[60px]" />

        {/* Dark frosty overlay */}
        <div className="absolute inset-0 bg-black/15 backdrop-blur-[1px]" />

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-[var(--safety-orange)]/10 border border-[var(--safety-orange)]/20"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--safety-orange)] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--safety-orange)]" />
              </span>
              <span className="text-xs sm:text-sm font-medium text-[var(--safety-orange)]">
                Tips, Insights & Updates
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
            >
              <span className="text-white">Trash Can Cleaning </span>
              <span className="text-gradient-orange">Tips & Insights</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="text-base sm:text-lg text-[var(--light-gray)] max-w-xl mx-auto mb-8"
            >
              Expert tips on bin cleaning, home hygiene, and keeping your outdoor space fresh and pest-free.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className="max-w-md mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--steel-gray)]" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 sm:py-3.5 bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 rounded-xl text-white placeholder-[var(--steel-gray)] focus:outline-none focus:border-[var(--safety-orange)]/50 focus:ring-2 focus:ring-[var(--safety-orange)]/10 transition-all text-sm sm:text-base"
                />
              </div>
            </motion.div>
          </div>
        </Container>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--asphalt-dark)] to-transparent" />
      </section>

      {/* Blog Content */}
      <section className="pt-8 pb-8 sm:pt-12 sm:pb-10 lg:pt-16 bg-[var(--asphalt-dark)]">
        <Container>
          {/* Category Filters - No animation delay */}
          <div className="mb-8">
            <CategoryFilter
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              categories={categories}
              totalPosts={totalPosts}
            />
          </div>

          {/* Mobile Trending Carousel - At Top */}
          {activeCategory === 'all' && !searchQuery && (
            <MobileTrendingCarousel posts={blogPosts} categories={categories} />
          )}

          {/* Results Count */}
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <p className="text-xs lg:text-sm text-[var(--slate-gray)]">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs lg:text-sm text-[var(--safety-orange)] hover:underline"
              >
                Clear search
              </button>
            )}
          </div>

          {/* Featured Posts - Desktop Only */}
          {featuredPosts.length > 0 && activeCategory === 'all' && !searchQuery && (
            <div className="hidden lg:block mb-10 sm:mb-12">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-[var(--safety-orange)]" />
                <h2 className="text-sm font-semibold text-white uppercase tracking-wide">
                  Featured Articles
                </h2>
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                {featuredPosts.map((post) => (
                  <FeaturedPostCard key={post.id} post={post} categories={categories} />
                ))}
              </div>
            </div>
          )}

          {/* Posts Grid */}
          {filteredPosts.length > 0 ? (
            <div>
              {activeCategory === 'all' && !searchQuery && regularPosts.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-4 h-4 text-[var(--safety-orange)]" />
                  <h2 className="text-sm font-semibold text-white uppercase tracking-wide">
                    All Articles
                  </h2>
                </div>
              )}

              {/* Mobile: 2-column compact grid - show all filtered posts */}
              <div className="grid gap-3 grid-cols-2 lg:hidden">
                {filteredPosts.map((post, index) => (
                  <PostCard key={post.id} post={post} categories={categories} index={index} />
                ))}
              </div>

              {/* Desktop: Normal grid - show regular posts (featured shown above) */}
              <div className="hidden lg:grid gap-6 grid-cols-3">
                {(activeCategory !== 'all' || searchQuery ? filteredPosts : regularPosts.length > 0 ? regularPosts : filteredPosts).map((post, index) => (
                  <PostCard key={post.id} post={post} categories={categories} index={index} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-[var(--steel-gray)] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No articles found</h3>
              <p className="text-sm text-[var(--slate-gray)]">
                Try adjusting your search or filter to find what you&apos;re looking for.
              </p>
            </div>
          )}

          {/* Pagination hint - shows when there are many posts */}
          {filteredPosts.length > 6 && (
            <div className="mt-6 text-center">
              <p className="text-sm text-[var(--slate-gray)]">
                Showing all {filteredPosts.length} articles
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* CTA Section */}
      <section className="pb-8 sm:pb-10 bg-[var(--asphalt-dark)]">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <div className="p-6 sm:p-10 rounded-2xl bg-gradient-to-br from-[var(--safety-orange)]/20 to-[var(--safety-orange)]/5 border border-[var(--safety-orange)]/20">
              <Sparkles className="w-8 h-8 text-[var(--safety-orange)] mx-auto mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Get Your Free Cleaning Quote
              </h2>
              <p className="text-sm sm:text-base text-[var(--slate-gray)] mb-6">
                Get a free quote for professional trash can cleaning in Pinellas County.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--safety-orange)] text-white font-semibold rounded-xl hover:bg-[var(--safety-orange-dark)] transition-colors text-sm"
                >
                  Get Free Quote
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="tel:+13528433425"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 text-white font-semibold rounded-xl hover:bg-[var(--concrete-gray)]/50 transition-colors text-sm"
                >
                  Call (352) 843-3425
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
