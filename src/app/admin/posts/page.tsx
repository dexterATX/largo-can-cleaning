'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import {
  Plus,
  Search,
  Filter,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import PostsTable from '@/components/admin/PostsTable'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import type { BlogPost, Category } from '@/types/admin'

export default function PostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [categoriesError, setCategoriesError] = useState('')

  // Confirm dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<{ id: string; title: string } | null>(null)

  // Debounced search query
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch posts and categories
  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    const fetchPosts = async () => {
      if (isMounted) {
        setIsLoading(true)
        setError('')
      }

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: '10',
          ...(statusFilter !== 'all' && { status: statusFilter }),
          ...(categoryFilter && { category: categoryFilter }),
          ...(debouncedSearchQuery && { search: debouncedSearchQuery }),
        })

        const res = await fetch(`/api/admin/posts?${params}`, { signal: controller.signal })
        const data = await res.json()

        if (isMounted) {
          if (res.ok) {
            setPosts(data.data || [])
            setTotalPages(data.totalPages || 1)
          } else {
            setError(data.error || 'Failed to fetch posts')
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return // Component unmounted, ignore
        }
        if (isMounted) {
          setError('Failed to connect to server')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    const fetchCategories = async () => {
      if (isMounted) {
        setCategoriesError('')
      }
      try {
        const res = await fetch('/api/admin/categories', { signal: controller.signal })
        const data = await res.json()
        if (isMounted) {
          if (res.ok) {
            setCategories(data.data || [])
          } else {
            setCategoriesError(data.error || 'Failed to fetch categories')
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return // Component unmounted, ignore
        }
        console.error('Failed to fetch categories:', err)
        if (isMounted) {
          setCategoriesError('Failed to load categories')
        }
      }
    }

    fetchPosts()
    fetchCategories()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [page, statusFilter, categoryFilter, debouncedSearchQuery])

  // Reset pagination when filters change
  useEffect(() => {
    setPage(1)
  }, [statusFilter, categoryFilter, debouncedSearchQuery])

  // Open delete confirmation dialog
  const handleDeleteClick = (post: BlogPost) => {
    setPostToDelete({ id: post.id, title: post.title })
    setDeleteDialogOpen(true)
  }

  // Delete post after confirmation with optimistic update and rollback
  const handleConfirmDelete = async () => {
    if (!postToDelete) return

    setIsDeleting(postToDelete.id)

    // Store original posts for rollback
    const originalPosts = [...posts]

    // Optimistic update - remove post immediately
    setPosts(posts.filter((p) => p.id !== postToDelete.id))

    try {
      const res = await fetch(`/api/admin/posts/${postToDelete.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        // Success - close dialog
        setDeleteDialogOpen(false)
        setPostToDelete(null)
      } else {
        // Rollback on server error
        setPosts(originalPosts)
        const data = await res.json()
        setError(data.error || 'Failed to delete post')
      }
    } catch (err) {
      // Rollback on network error
      setPosts(originalPosts)
      setError('Failed to delete post')
    } finally {
      setIsDeleting(null)
    }
  }

  // Legacy handler for PostsTable compatibility
  const handleDelete = (id: string) => {
    const post = posts.find((p) => p.id === id)
    if (post) {
      handleDeleteClick(post)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
          <p className="text-sm text-[var(--slate-gray)] mt-1">
            Manage your blog articles
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--safety-orange)] text-white font-medium rounded-xl hover:bg-[var(--safety-orange-dark)] transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--steel-gray)]" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 rounded-xl text-white placeholder-[var(--steel-gray)] focus:outline-none focus:border-[var(--safety-orange)]/50 transition-colors"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 rounded-xl text-white focus:outline-none focus:border-[var(--safety-orange)]/50 transition-colors"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            disabled={!!categoriesError}
            className={`px-4 py-2.5 bg-[var(--concrete-gray)]/30 border rounded-xl text-white focus:outline-none focus:border-[var(--safety-orange)]/50 transition-colors ${
              categoriesError
                ? 'border-red-500/30 opacity-75 cursor-not-allowed'
                : 'border-[var(--steel-gray)]/20'
            }`}
          >
            <option value="">{categoriesError ? 'Categories unavailable' : 'All Categories'}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {categoriesError && (
            <div className="absolute -bottom-5 left-0 text-xs text-red-400">
              {categoriesError}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[var(--safety-orange)] animate-spin" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      ) : (
        <PostsTable
          posts={posts}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--concrete-gray)]/50 transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-[var(--slate-gray)]">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--concrete-gray)]/50 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false)
          setPostToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Post"
        message={`Are you sure you want to delete "${postToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete Post"
        variant="danger"
        isLoading={isDeleting !== null}
      />
    </div>
  )
}
