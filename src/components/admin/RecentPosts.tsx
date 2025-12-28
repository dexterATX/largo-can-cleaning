'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { FileText, Edit, Clock, Calendar } from 'lucide-react'
import type { BlogPost } from '@/types/admin'

interface RecentPostsProps {
  posts: BlogPost[]
}

export default function RecentPosts({ posts }: RecentPostsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-[var(--steel-gray)]/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--safety-orange)]/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-[var(--safety-orange)]" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Recent Posts</h3>
            <p className="text-xs text-[var(--slate-gray)]">Latest blog articles</p>
          </div>
        </div>
        <Link
          href="/admin/posts"
          className="text-sm text-[var(--safety-orange)] hover:underline"
        >
          View All
        </Link>
      </div>

      {/* Posts List */}
      {posts.length > 0 ? (
        <div className="divide-y divide-[var(--steel-gray)]/10">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between p-4 hover:bg-[var(--asphalt-dark)]/30 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-white truncate">{post.title}</h4>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                      post.status === 'published'
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-yellow-500/10 text-yellow-400'
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-[var(--slate-gray)]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(post.created_at)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.read_time} min read
                  </span>
                </div>
              </div>
              <Link
                href={`/admin/posts/${post.id}`}
                className="p-2 rounded-lg text-[var(--slate-gray)] hover:text-[var(--safety-orange)] hover:bg-[var(--safety-orange)]/10 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center">
          <FileText className="w-10 h-10 text-[var(--steel-gray)] mx-auto mb-3" />
          <p className="text-[var(--slate-gray)] mb-3">No posts yet</p>
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--safety-orange)] text-white text-sm font-medium rounded-lg hover:bg-[var(--safety-orange-dark)] transition-colors"
          >
            Create your first post
          </Link>
        </div>
      )}
    </motion.div>
  )
}
