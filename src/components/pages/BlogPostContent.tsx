'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import {
  Clock,
  Calendar,
  ArrowLeft,
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  Check,
  BookOpen,
  Tag,
  ChevronRight,
  Building2,
} from 'lucide-react'
import { useState, useMemo } from 'react'
import DOMPurify from 'dompurify'
import Container from '@/components/ui/Container'

// Sanitize content for both client and server-side rendering
const sanitizeContent = (content: string): string => {
  if (typeof window !== 'undefined') {
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr',
        'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'a', 'strong',
        'em', 'b', 'i', 'u', 's', 'strike', 'img', 'figure', 'figcaption',
        'table', 'thead', 'tbody', 'tr', 'th', 'td', 'span', 'div'],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel'],
      ALLOW_DATA_ATTR: false,
    })
  }
  // For SSR, strip dangerous content
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
}

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  categoryLabel: string
  categoryColor?: string
  readTime: number
  date: string
  featured?: boolean
  image: string
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string[]
}

interface RelatedPost {
  id: string
  slug: string
  title: string
  excerpt: string
  image: string
  readTime: number
  date: string
  category: string
  categoryLabel: string
}

interface BlogPostContentProps {
  post: BlogPost
  related: RelatedPost[]
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== 'undefined' ? window.location.href : url

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-[var(--slate-gray)] mr-2">Share:</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg bg-[var(--concrete-gray)]/30 text-[var(--slate-gray)] hover:text-[var(--safety-orange)] hover:bg-[var(--concrete-gray)]/50 transition-colors"
        aria-label="Share on Twitter"
      >
        <Twitter className="w-4 h-4" />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg bg-[var(--concrete-gray)]/30 text-[var(--slate-gray)] hover:text-[var(--safety-orange)] hover:bg-[var(--concrete-gray)]/50 transition-colors"
        aria-label="Share on Facebook"
      >
        <Facebook className="w-4 h-4" />
      </a>
      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg bg-[var(--concrete-gray)]/30 text-[var(--slate-gray)] hover:text-[var(--safety-orange)] hover:bg-[var(--concrete-gray)]/50 transition-colors"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
      </a>
      <button
        onClick={handleCopy}
        className="p-2 rounded-lg bg-[var(--concrete-gray)]/30 text-[var(--slate-gray)] hover:text-[var(--safety-orange)] hover:bg-[var(--concrete-gray)]/50 transition-colors"
        aria-label="Copy link"
      >
        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  )
}

function RelatedPostCard({ post }: { post: RelatedPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <article className="h-full rounded-xl overflow-hidden bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 hover:border-[var(--safety-orange)]/30 transition-all">
        <div className="aspect-[16/9] bg-gradient-to-br from-[var(--concrete-gray)]/60 to-[var(--concrete-gray)]/30 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-[var(--steel-gray)]/50" />
          </div>
        </div>
        <div className="p-4">
          <span className="text-xs text-[var(--safety-orange)] font-medium uppercase tracking-wide">
            {post.categoryLabel}
          </span>
          <h3 className="text-base font-semibold text-white mt-1 mb-2 group-hover:text-[var(--safety-orange)] transition-colors line-clamp-2">
            {post.title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-[var(--slate-gray)]">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readTime} min
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default function BlogPostContent({ post, related }: BlogPostContentProps) {
  return (
    <div className="relative bg-[var(--asphalt-dark)] min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-28 pb-8 sm:pt-36 sm:pb-12 overflow-hidden bg-gradient-dark">
        {/* Background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-50" />
        <div className="absolute top-1/4 -left-32 w-64 h-64 sm:w-96 sm:h-96 bg-[var(--safety-orange)]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 sm:w-96 sm:h-96 bg-[var(--safety-orange)]/5 rounded-full blur-[100px]" />

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-sm text-[var(--slate-gray)] mb-6"
            >
              <Link href="/blog" className="hover:text-[var(--safety-orange)] transition-colors flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" />
                Blog
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-[var(--safety-orange)]">{post.categoryLabel}</span>
            </motion.div>

            {/* Category Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-[var(--safety-orange)]/10 border border-[var(--safety-orange)]/20"
            >
              <Tag className="w-3 h-3 text-[var(--safety-orange)]" />
              <span className="text-xs font-medium text-[var(--safety-orange)]">
                {post.categoryLabel}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-4 leading-tight"
            >
              {post.title}
            </motion.h1>

            {/* Excerpt */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-base sm:text-lg text-[var(--light-gray)] mb-6"
            >
              {post.excerpt}
            </motion.p>

            {/* Meta */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 text-sm text-[var(--slate-gray)]"
            >
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readTime} min read
              </span>
            </motion.div>
          </div>
        </Container>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--asphalt-dark)] to-transparent" />
      </section>

      {/* Content Section */}
      <section className="py-8 sm:py-12 lg:py-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            {/* Featured Image Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-br from-[var(--safety-orange)]/20 to-[var(--safety-orange)]/5 mb-8 sm:mb-12 flex items-center justify-center"
            >
              <BookOpen className="w-16 h-16 text-[var(--safety-orange)]/30" />
            </motion.div>

            {/* Article Content */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="prose prose-invert prose-orange max-w-none
                prose-headings:text-white prose-headings:font-bold
                prose-h2:text-xl prose-h2:sm:text-2xl prose-h2:mt-8 prose-h2:mb-4
                prose-h3:text-lg prose-h3:sm:text-xl prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-[var(--light-gray)] prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-[var(--safety-orange)] prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white prose-strong:font-semibold
                prose-ul:text-[var(--light-gray)] prose-ul:my-4
                prose-ol:text-[var(--light-gray)] prose-ol:my-4
                prose-li:my-1
                prose-blockquote:border-l-[var(--safety-orange)] prose-blockquote:text-[var(--slate-gray)]
                prose-code:text-[var(--safety-orange)] prose-code:bg-[var(--concrete-gray)]/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-[var(--asphalt-black)] prose-pre:border prose-pre:border-[var(--steel-gray)]/20"
              dangerouslySetInnerHTML={{
                __html: sanitizeContent(post.content)
              }}
            />

            {/* Author Info Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="mt-10 p-6 rounded-xl bg-[var(--concrete-gray)]/20 border border-[var(--steel-gray)]/20"
            >
              <div className="flex items-start gap-4">
                {/* Author Avatar/Logo */}
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--safety-orange)] to-[var(--safety-orange-dark)] flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-white" />
                </div>

                {/* Author Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[var(--slate-gray)] uppercase tracking-wide mb-1">Written by</p>
                  <h4 className="text-lg font-semibold text-white mb-1">
                    Largo Can Cleaning
                  </h4>
                  <p className="text-sm text-[var(--slate-gray)] leading-relaxed">
                    Professional trash can cleaning service in Pinellas County, Florida.
                    We help keep your home clean, hygienic, and pest-free with our eco-friendly cleaning solutions.
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[var(--slate-gray)]">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[var(--safety-orange)]" />
                      {post.readTime} min read
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[var(--safety-orange)]" />
                      Published {formatDate(post.date)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Share Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-12 pt-8 border-t border-[var(--steel-gray)]/20"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <ShareButtons title={post.title} url={`/blog/${post.slug}`} />
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm text-[var(--safety-orange)] hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Blog
                </Link>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Related Posts */}
      {related.length > 0 && (
        <section className="py-12 sm:py-16 bg-[var(--asphalt-black)]/50">
          <Container>
            <div className="max-w-5xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-8 text-center">
                Related Articles
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((relatedPost) => (
                  <RelatedPostCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-[var(--asphalt-dark)]">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <div className="p-6 sm:p-10 rounded-2xl bg-gradient-to-br from-[var(--safety-orange)]/20 to-[var(--safety-orange)]/5 border border-[var(--safety-orange)]/20">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                Ready for Spotless Bins?
              </h2>
              <p className="text-sm sm:text-base text-[var(--slate-gray)] mb-6">
                Get a free quote for professional trash can cleaning in Pinellas County.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--safety-orange)] text-white font-semibold rounded-xl hover:bg-[var(--safety-orange-dark)] transition-colors"
                >
                  Get Free Quote
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <a
                  href="tel:+13528433425"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 text-white font-semibold rounded-xl hover:bg-[var(--concrete-gray)]/50 transition-colors"
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
