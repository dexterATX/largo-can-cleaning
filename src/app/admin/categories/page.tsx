'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  FolderOpen,
  X,
  Save,
  GripVertical,
} from 'lucide-react'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import type { Category, CategoryInsert } from '@/types/admin'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(null)

  // Form state
  const [formData, setFormData] = useState<CategoryInsert>({
    name: '',
    slug: '',
    description: '',
    color: '#FF6B00',
  })

  // Refresh key for re-fetching categories
  const [refreshKey, setRefreshKey] = useState(0)

  // Character limits
  const NAME_MAX_LENGTH = 50
  const SLUG_MAX_LENGTH = 50
  const DESCRIPTION_MAX_LENGTH = 200

  // Refs for AbortControllers
  const saveControllerRef = useRef<AbortController | null>(null)
  const deleteControllerRef = useRef<AbortController | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveControllerRef.current) {
        saveControllerRef.current.abort()
      }
      if (deleteControllerRef.current) {
        deleteControllerRef.current.abort()
      }
    }
  }, [])

  // Fetch categories
  useEffect(() => {
    const controller = new AbortController()

    const fetchCategories = async () => {
      setIsLoading(true)
      try {
        const res = await fetch('/api/admin/categories', { signal: controller.signal })
        const data = await res.json()
        if (res.ok) {
          setCategories(data.data || [])
        } else {
          setError(data.error || 'Failed to fetch categories')
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return // Component unmounted, ignore
        }
        console.error('Failed to fetch categories:', error instanceof Error ? error.message : error)
        setError('Failed to connect to server')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()

    return () => controller.abort()
  }, [refreshKey])

  // Trigger refresh of categories
  const refreshCategories = () => setRefreshKey((k) => k + 1)

  // Open modal for new or edit
  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        color: category.color,
      })
    } else {
      setEditingCategory(null)
      setFormData({
        name: '',
        slug: '',
        description: '',
        color: '#FF6B00',
      })
    }
    setIsModalOpen(true)
  }

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false)
    setEditingCategory(null)
    setError('')
    setFormData({
      name: '',
      slug: '',
      description: '',
      color: '#FF6B00',
    })
  }

  // Auto-generate slug
  useEffect(() => {
    if (formData.name && !editingCategory) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData((prev) => ({ ...prev, slug }))
    }
  }, [formData.name, editingCategory])

  // Handle Escape key to close modal
  const handleEscapeKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen && !isSaving) {
        closeModal()
      }
    },
    [isModalOpen, isSaving]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleEscapeKey)
    return () => document.removeEventListener('keydown', handleEscapeKey)
  }, [handleEscapeKey])

  // Save category
  const handleSave = async () => {
    // Trim inputs
    const trimmedName = formData.name.trim()
    const trimmedSlug = formData.slug.trim()
    const trimmedDescription = formData.description?.trim() || ''

    if (!trimmedName) {
      setError('Name is required')
      return
    }

    if (trimmedName.length > NAME_MAX_LENGTH) {
      setError(`Name must be ${NAME_MAX_LENGTH} characters or less`)
      return
    }

    if (trimmedSlug.length > SLUG_MAX_LENGTH) {
      setError(`Slug must be ${SLUG_MAX_LENGTH} characters or less`)
      return
    }

    if (trimmedDescription.length > DESCRIPTION_MAX_LENGTH) {
      setError(`Description must be ${DESCRIPTION_MAX_LENGTH} characters or less`)
      return
    }

    // Abort any existing save request
    if (saveControllerRef.current) {
      saveControllerRef.current.abort()
    }

    const controller = new AbortController()
    saveControllerRef.current = controller

    setIsSaving(true)
    setError('')

    try {
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : '/api/admin/categories'
      const method = editingCategory ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          name: trimmedName,
          slug: trimmedSlug,
          description: trimmedDescription,
        }),
        signal: controller.signal,
      })

      if (controller.signal.aborted) return

      const data = await res.json()

      if (res.ok) {
        closeModal()
        refreshCategories()
      } else {
        setError(data.error || 'Failed to save category')
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return // Request was aborted, ignore
      }
      console.error('Failed to save category:', error instanceof Error ? error.message : error)
      setError('Failed to save category')
    } finally {
      if (!controller.signal.aborted) {
        setIsSaving(false)
      }
    }
  }

  // Open delete confirmation dialog
  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete({ id: category.id, name: category.name })
    setDeleteDialogOpen(true)
  }

  // Delete category after confirmation
  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return

    // Abort any existing delete request
    if (deleteControllerRef.current) {
      deleteControllerRef.current.abort()
    }

    const controller = new AbortController()
    deleteControllerRef.current = controller

    setIsDeleting(categoryToDelete.id)
    try {
      const res = await fetch(`/api/admin/categories/${categoryToDelete.id}`, {
        method: 'DELETE',
        signal: controller.signal,
      })

      if (controller.signal.aborted) return

      if (res.ok) {
        setCategories(categories.filter((c) => c.id !== categoryToDelete.id))
        setDeleteDialogOpen(false)
        setCategoryToDelete(null)
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to delete category')
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return // Request was aborted, ignore
      }
      console.error('Failed to delete category:', error instanceof Error ? error.message : error)
      setError('Failed to delete category')
    } finally {
      if (!controller.signal.aborted) {
        setIsDeleting(null)
      }
    }
  }

  const colorPresets = [
    '#FF6B00', '#22C55E', '#3B82F6', '#A855F7',
    '#EF4444', '#F59E0B', '#10B981', '#6366F1',
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="text-sm text-[var(--slate-gray)] mt-1">
            Organize your blog posts with categories
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--safety-orange)] text-white font-medium rounded-xl hover:bg-[var(--safety-orange-dark)] transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Category
        </button>
      </div>

      {/* Error */}
      {error && !isModalOpen && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Categories List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[var(--safety-orange)] animate-spin" />
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 rounded-2xl p-12 text-center">
          <FolderOpen className="w-12 h-12 text-[var(--steel-gray)] mx-auto mb-4" />
          <p className="text-[var(--slate-gray)] mb-4">No categories yet</p>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--safety-orange)] text-white text-sm font-medium rounded-lg hover:bg-[var(--safety-orange-dark)] transition-colors"
          >
            Create your first category
          </button>
        </div>
      ) : (
        <div className="bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 rounded-2xl overflow-hidden">
          <div className="divide-y divide-[var(--steel-gray)]/10">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="flex items-center justify-between p-4 hover:bg-[var(--asphalt-dark)]/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-[var(--steel-gray)] cursor-grab">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <div>
                    <h3 className="font-medium text-white">{category.name}</h3>
                    <p className="text-xs text-[var(--slate-gray)]">
                      /{category.slug} · {category.post_count || 0} posts
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openModal(category)}
                    className="p-2 rounded-lg text-[var(--slate-gray)] hover:text-[var(--safety-orange)] hover:bg-[var(--safety-orange)]/10 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(category)}
                    disabled={isDeleting === category.id}
                    className="p-2 rounded-lg text-[var(--slate-gray)] hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                  >
                    {isDeleting === category.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-[var(--concrete-gray)] border border-[var(--steel-gray)]/30 rounded-2xl overflow-hidden shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-[var(--steel-gray)]/20">
                <h2 className="text-lg font-semibold text-white">
                  {editingCategory ? 'Edit Category' : 'New Category'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-lg text-[var(--slate-gray)] hover:text-white hover:bg-[var(--steel-gray)]/30 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-5 space-y-4">
                {error && isModalOpen && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-[var(--light-gray)] mb-2">
                    Name *
                    <span className="text-[var(--slate-gray)] text-xs ml-2">
                      ({formData.name.length}/{NAME_MAX_LENGTH})
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Category name..."
                    maxLength={NAME_MAX_LENGTH}
                    className="w-full px-4 py-2.5 bg-[var(--asphalt-dark)] border border-[var(--steel-gray)]/20 rounded-xl text-white placeholder-[var(--steel-gray)] focus:outline-none focus:border-[var(--safety-orange)]/50 transition-colors"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-[var(--light-gray)] mb-2">
                    Slug
                    <span className="text-[var(--slate-gray)] text-xs ml-2">
                      ({formData.slug.length}/{SLUG_MAX_LENGTH})
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="category-slug"
                    maxLength={SLUG_MAX_LENGTH}
                    className="w-full px-4 py-2.5 bg-[var(--asphalt-dark)] border border-[var(--steel-gray)]/20 rounded-xl text-white placeholder-[var(--steel-gray)] focus:outline-none focus:border-[var(--safety-orange)]/50 transition-colors"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-[var(--light-gray)] mb-2">
                    Description
                    <span className="text-[var(--slate-gray)] text-xs ml-2">
                      ({(formData.description || '').length}/{DESCRIPTION_MAX_LENGTH})
                    </span>
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description..."
                    rows={2}
                    maxLength={DESCRIPTION_MAX_LENGTH}
                    className="w-full px-4 py-2.5 bg-[var(--asphalt-dark)] border border-[var(--steel-gray)]/20 rounded-xl text-white placeholder-[var(--steel-gray)] focus:outline-none focus:border-[var(--safety-orange)]/50 transition-colors resize-none"
                  />
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-[var(--light-gray)] mb-2">
                    Color
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      {colorPresets.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setFormData({ ...formData, color })}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            formData.color === color
                              ? 'border-white scale-110'
                              : 'border-transparent hover:scale-105'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-5 border-t border-[var(--steel-gray)]/20 bg-[var(--asphalt-dark)]/50">
                <button
                  onClick={closeModal}
                  className="px-4 py-2.5 text-[var(--slate-gray)] font-medium rounded-xl hover:text-white hover:bg-[var(--steel-gray)]/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2.5 bg-[var(--safety-orange)] text-white font-medium rounded-xl hover:bg-[var(--safety-orange-dark)] transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false)
          setCategoryToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${categoryToDelete?.name}"? Posts in this category will become uncategorized.`}
        confirmText="Delete Category"
        variant="danger"
        isLoading={isDeleting !== null}
      />
    </div>
  )
}
