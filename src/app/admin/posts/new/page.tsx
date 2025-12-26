'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import {
  Save,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Eye,
  Settings,
  Star,
  Clock,
} from 'lucide-react'
import PostEditor from '@/components/admin/PostEditor'
import type { Category, BlogPostInsert } from '@/types/admin'

export default function NewPostPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [showSeoPanel, setShowSeoPanel] = useState(false)

  // Form state
  const [formData, setFormData] = useState<BlogPostInsert>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category_id: '',
    read_time: 5,
    featured: false,
    status: 'draft',
    meta_title: '',
    meta_description: '',
    meta_keywords: [],
  })

  // Ref for AbortController
  const abortControllerRef = useRef<AbortController | null>(null)

  // Fetch categories
  useEffect(() => {
    const controller = new AbortController()

    async function fetchCategories() {
      try {
        const res = await fetch('/api/admin/categories', { signal: controller.signal })
        const data = await res.json()
        if (res.ok && !controller.signal.aborted) {
          setCategories(data.data || [])
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return // Component unmounted, ignore
        }
        console.error('Failed to fetch categories:', error instanceof Error ? error.message : error)
      }
    }
    fetchCategories()

    return () => controller.abort()
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !formData.slug) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData((prev) => ({ ...prev, slug }))
    }
  }, [formData.title])

  // Constants
  const TITLE_MAX_LENGTH = 200

  // Handle form submission
  const handleSubmit = async (status: 'draft' | 'published') => {
    if (isSaving) return  // Prevent double submission

    // Trim whitespace from inputs
    const trimmedTitle = formData.title.trim()
    const trimmedSlug = formData.slug.trim()
    const trimmedExcerpt = formData.excerpt?.trim() || ''
    const trimmedContent = formData.content?.trim() || ''

    if (!trimmedTitle) {
      setError('Title is required')
      return
    }

    if (trimmedTitle.length > TITLE_MAX_LENGTH) {
      setError(`Title must be ${TITLE_MAX_LENGTH} characters or less`)
      return
    }

    if (!trimmedContent) {
      setError('Content is required')
      return
    }

    if (trimmedSlug && !/^[a-z0-9-]+$/.test(trimmedSlug)) {
      setError('Slug can only contain lowercase letters, numbers, and hyphens')
      return
    }

    // Abort any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const controller = new AbortController()
    abortControllerRef.current = controller

    setIsSaving(true)
    setError('')

    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          title: trimmedTitle,
          slug: trimmedSlug,
          excerpt: trimmedExcerpt,
          content: trimmedContent,
          status,
          category_id: formData.category_id || null,
        }),
        signal: controller.signal,
      })

      if (controller.signal.aborted) return

      const data = await res.json()

      if (res.ok) {
        router.push('/admin/posts')
      } else {
        setError(data.error || 'Failed to create post')
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return // Request was aborted, ignore
      }
      console.error('Failed to save post:', error instanceof Error ? error.message : error)
      setError('Failed to save post')
    } finally {
      if (!controller.signal.aborted) {
        setIsSaving(false)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg text-[var(--slate-gray)] hover:text-white hover:bg-[var(--steel-gray)]/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">New Post</h1>
            <p className="text-sm text-[var(--slate-gray)] mt-0.5">
              Create a new blog article
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSeoPanel(!showSeoPanel)}
            className={`px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 ${
              showSeoPanel
                ? 'bg-[var(--safety-orange)] text-white'
                : 'bg-[var(--concrete-gray)]/30 text-[var(--slate-gray)] hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            SEO
          </button>
          <button
            onClick={() => handleSubmit('draft')}
            disabled={isSaving}
            className="px-4 py-2.5 bg-[var(--concrete-gray)]/30 text-white font-medium rounded-xl hover:bg-[var(--concrete-gray)]/50 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Draft
          </button>
          <button
            onClick={() => handleSubmit('published')}
            disabled={isSaving}
            className="px-4 py-2.5 bg-[var(--safety-orange)] text-white font-medium rounded-xl hover:bg-[var(--safety-orange-dark)] transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
            Publish
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[var(--light-gray)] mb-2">
              Title *
              <span className="text-[var(--slate-gray)] text-xs ml-2">
                ({formData.title.length}/{TITLE_MAX_LENGTH})
              </span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter post title..."
              disabled={isSaving}
              maxLength={TITLE_MAX_LENGTH}
              className="w-full px-4 py-3 bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 rounded-xl text-white text-lg placeholder-[var(--steel-gray)] focus:outline-none focus:border-[var(--safety-orange)]/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-[var(--light-gray)] mb-2">
              Slug
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[var(--slate-gray)]">/blog/</span>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="post-url-slug"
                disabled={isSaving}
                className="flex-1 px-4 py-2.5 bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 rounded-xl text-white placeholder-[var(--steel-gray)] focus:outline-none focus:border-[var(--safety-orange)]/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-[var(--light-gray)] mb-2">
              Excerpt
            </label>
            <textarea
              value={formData.excerpt || ''}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="A short summary of the post..."
              rows={3}
              disabled={isSaving}
              className="w-full px-4 py-3 bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 rounded-xl text-white placeholder-[var(--steel-gray)] focus:outline-none focus:border-[var(--safety-orange)]/50 transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Content Editor */}
          <div className={isSaving ? 'opacity-50 pointer-events-none' : ''}>
            <label className="block text-sm font-medium text-[var(--light-gray)] mb-2">
              Content
            </label>
            <PostEditor
              content={formData.content || ''}
              onChange={(content) => setFormData({ ...formData, content })}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Post Settings */}
          <div className="bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 rounded-xl p-5">
            <h3 className="font-semibold text-white mb-4">Post Settings</h3>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--light-gray)] mb-2">
                Category
              </label>
              <select
                value={formData.category_id || ''}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                disabled={isSaving}
                className="w-full px-4 py-2.5 bg-[var(--asphalt-dark)] border border-[var(--steel-gray)]/20 rounded-xl text-white focus:outline-none focus:border-[var(--safety-orange)]/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Read Time */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--light-gray)] mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Read Time (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={formData.read_time}
                onChange={(e) => setFormData({ ...formData, read_time: parseInt(e.target.value) || 5 })}
                disabled={isSaving}
                className="w-full px-4 py-2.5 bg-[var(--asphalt-dark)] border border-[var(--steel-gray)]/20 rounded-xl text-white focus:outline-none focus:border-[var(--safety-orange)]/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Featured Toggle */}
            <label className={`flex items-center gap-3 ${isSaving ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
              <div
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  formData.featured ? 'bg-[var(--safety-orange)]' : 'bg-[var(--steel-gray)]'
                }`}
                onClick={() => !isSaving && setFormData({ ...formData, featured: !formData.featured })}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    formData.featured ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </div>
              <div className="flex items-center gap-2">
                <Star className={`w-4 h-4 ${formData.featured ? 'text-[var(--safety-orange)]' : 'text-[var(--slate-gray)]'}`} />
                <span className="text-sm text-[var(--light-gray)]">Featured Post</span>
              </div>
            </label>
          </div>

          {/* SEO Settings */}
          {showSeoPanel && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 rounded-xl p-5"
            >
              <h3 className="font-semibold text-white mb-4">SEO Settings</h3>

              {/* Meta Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[var(--light-gray)] mb-2">
                  Meta Title
                  <span className="text-[var(--slate-gray)] text-xs ml-2">
                    ({(formData.meta_title || '').length}/60)
                  </span>
                </label>
                <input
                  type="text"
                  maxLength={60}
                  value={formData.meta_title || ''}
                  onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                  placeholder="SEO title for search engines..."
                  disabled={isSaving}
                  className="w-full px-4 py-2.5 bg-[var(--asphalt-dark)] border border-[var(--steel-gray)]/20 rounded-xl text-white placeholder-[var(--steel-gray)] focus:outline-none focus:border-[var(--safety-orange)]/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Meta Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[var(--light-gray)] mb-2">
                  Meta Description
                  <span className="text-[var(--slate-gray)] text-xs ml-2">
                    ({(formData.meta_description || '').length}/160)
                  </span>
                </label>
                <textarea
                  maxLength={160}
                  value={formData.meta_description || ''}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  placeholder="Brief description for search results..."
                  rows={3}
                  disabled={isSaving}
                  className="w-full px-4 py-2.5 bg-[var(--asphalt-dark)] border border-[var(--steel-gray)]/20 rounded-xl text-white placeholder-[var(--steel-gray)] focus:outline-none focus:border-[var(--safety-orange)]/50 transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-sm font-medium text-[var(--light-gray)] mb-2">
                  Keywords
                </label>
                <input
                  type="text"
                  value={(formData.meta_keywords || []).join(', ')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      meta_keywords: e.target.value.split(',').map((k) => k.trim()).filter(Boolean),
                    })
                  }
                  placeholder="keyword1, keyword2, keyword3..."
                  disabled={isSaving}
                  className="w-full px-4 py-2.5 bg-[var(--asphalt-dark)] border border-[var(--steel-gray)]/20 rounded-xl text-white placeholder-[var(--steel-gray)] focus:outline-none focus:border-[var(--safety-orange)]/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-[var(--slate-gray)] mt-1">
                  Separate keywords with commas
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
