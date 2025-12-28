'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import {
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock,
  Star,
} from 'lucide-react'
import type { BlogPost } from '@/types/admin'

interface PostsTableProps {
  posts: BlogPost[]
  onDelete: (id: string) => void
  isDeleting?: string | null
}

export default function PostsTable({ posts, onDelete, isDeleting }: PostsTableProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      published: 'bg-green-500/10 text-green-400 border-green-500/20',
      draft: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      scheduled: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    }
    return styles[status as keyof typeof styles] || styles.draft
  }

  if (posts.length === 0) {
    return (
      <div className="bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 rounded-2xl p-12 text-center">
        <p className="text-[var(--slate-gray)] mb-4">No posts found</p>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--safety-orange)] text-white text-sm font-medium rounded-lg hover:bg-[var(--safety-orange-dark)] transition-colors"
        >
          Create your first post
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 rounded-2xl overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[var(--steel-gray)]/20 text-xs font-medium text-[var(--slate-gray)] uppercase tracking-wider">
        <div className="col-span-5">Title</div>
        <div className="col-span-2">Category</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Date</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-[var(--steel-gray)]/10">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-[var(--asphalt-dark)]/30 transition-colors"
          >
            {/* Title */}
            <div className="col-span-5">
              <div className="flex items-start gap-3">
                {post.featured && (
                  <Star className="w-4 h-4 text-[var(--safety-orange)] flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <Link
                    href={`/admin/posts/${post.id}`}
                    className="font-medium text-white hover:text-[var(--safety-orange)] transition-colors line-clamp-1"
                  >
                    {post.title}
                  </Link>
                  <p className="text-xs text-[var(--slate-gray)] mt-0.5 line-clamp-1">
                    /{post.slug}
                  </p>
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="col-span-2">
              {post.category ? (
                <span
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `${post.category.color}20`,
                    color: post.category.color,
                  }}
                >
                  {post.category.name}
                </span>
              ) : (
                <span className="text-[var(--slate-gray)] text-sm">-</span>
              )}
            </div>

            {/* Status */}
            <div className="col-span-2">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(post.status)}`}
              >
                {post.status}
              </span>
            </div>

            {/* Date */}
            <div className="col-span-2">
              <div className="flex items-center gap-1.5 text-sm text-[var(--slate-gray)]">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(post.published_at || post.created_at)}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[var(--steel-gray)] mt-0.5">
                <Clock className="w-3 h-3" />
                {post.read_time} min read
              </div>
            </div>

            {/* Actions */}
            <div className="col-span-1 flex items-center justify-end gap-1">
              <Link
                href={`/blog/${post.slug}`}
                target="_blank"
                className="p-2 rounded-lg text-[var(--slate-gray)] hover:text-white hover:bg-[var(--steel-gray)]/30 transition-colors"
                title="View"
              >
                <Eye className="w-4 h-4" />
              </Link>
              <Link
                href={`/admin/posts/${post.id}`}
                className="p-2 rounded-lg text-[var(--slate-gray)] hover:text-[var(--safety-orange)] hover:bg-[var(--safety-orange)]/10 transition-colors"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </Link>
              <button
                onClick={() => onDelete(post.id)}
                disabled={isDeleting === post.id}
                className="p-2 rounded-lg text-[var(--slate-gray)] hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
