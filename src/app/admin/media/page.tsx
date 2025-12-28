'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import {
  Upload,
  Loader2,
  AlertCircle,
  Trash2,
  X,
  Copy,
  Check,
  Grid,
  List,
  CloudUpload,
  RefreshCw,
} from 'lucide-react'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import type { Media } from '@/types/admin'

interface UploadingFile {
  id: string
  name: string
  file: File
  progress: number
  status: 'uploading' | 'success' | 'error'
  error?: string
  retryCount: number
}

const MAX_RETRY_ATTEMPTS = 3

export default function MediaPage() {
  const [media, setMedia] = useState<Media[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isDragging, setIsDragging] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Refs for tracking timeouts
  const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set())
  const deleteControllerRef = useRef<AbortController | null>(null)

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [mediaToDelete, setMediaToDelete] = useState<{ id: string; name: string } | null>(null)

  // Helper to track and create timeout
  const createTrackedTimeout = (callback: () => void, delay: number) => {
    const timeoutId = setTimeout(() => {
      callback()
      timeoutsRef.current.delete(timeoutId)
    }, delay)
    timeoutsRef.current.add(timeoutId)
    return timeoutId
  }

  // Cleanup timeouts and abort controllers on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId))
      timeoutsRef.current.clear()
      if (deleteControllerRef.current) {
        deleteControllerRef.current.abort()
      }
    }
  }, [])

  // Fetch media
  useEffect(() => {
    const controller = new AbortController()

    const fetchMedia = async () => {
      setIsLoading(true)
      try {
        const res = await fetch('/api/admin/media', { signal: controller.signal })
        const data = await res.json()
        if (res.ok) {
          setMedia(data.data || [])
        } else {
          setError(data.error || 'Failed to fetch media')
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return // Component unmounted, ignore
        }
        console.error('Failed to fetch media:', error instanceof Error ? error.message : error)
        setError('Failed to connect to server')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMedia()

    return () => controller.abort()
  }, [])

  // Upload file with progress tracking using XMLHttpRequest
  const uploadFile = async (file: File, existingUploadId?: string, retryCount: number = 0) => {
    const uploadId = existingUploadId || `${Date.now()}-${Math.random().toString(36).substring(2)}`

    // Add to uploading list or update existing
    if (existingUploadId) {
      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.id === uploadId
            ? { ...f, progress: 0, status: 'uploading', error: undefined, retryCount }
            : f
        )
      )
    } else {
      setUploadingFiles((prev) => [
        ...prev,
        { id: uploadId, name: file.name, file, progress: 0, status: 'uploading', retryCount },
      ])
    }

    return new Promise<void>((resolve) => {
      const xhr = new XMLHttpRequest()
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'uploads')

      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100)
          setUploadingFiles((prev) =>
            prev.map((f) =>
              f.id === uploadId ? { ...f, progress } : f
            )
          )
        }
      })

      xhr.addEventListener('load', () => {
        try {
          const result = JSON.parse(xhr.responseText)

          if (xhr.status >= 200 && xhr.status < 300 && result.success) {
            // Update status to success
            setUploadingFiles((prev) =>
              prev.map((f) =>
                f.id === uploadId ? { ...f, progress: 100, status: 'success' } : f
              )
            )
            // Add to media list
            setMedia((prev) => [result.data, ...prev])
            // Remove from uploading after delay
            createTrackedTimeout(() => {
              setUploadingFiles((prev) => prev.filter((f) => f.id !== uploadId))
            }, 2000)
          } else {
            setUploadingFiles((prev) =>
              prev.map((f) =>
                f.id === uploadId
                  ? { ...f, status: 'error', error: result.error || 'Upload failed' }
                  : f
              )
            )
          }
        } catch {
          setUploadingFiles((prev) =>
            prev.map((f) =>
              f.id === uploadId
                ? { ...f, status: 'error', error: 'Invalid server response' }
                : f
            )
          )
        }
        resolve()
      })

      xhr.addEventListener('error', () => {
        console.error('Failed to upload file:', file.name)
        setUploadingFiles((prev) =>
          prev.map((f) =>
            f.id === uploadId
              ? { ...f, status: 'error', error: 'Network error' }
              : f
          )
        )
        resolve()
      })

      xhr.addEventListener('timeout', () => {
        setUploadingFiles((prev) =>
          prev.map((f) =>
            f.id === uploadId
              ? { ...f, status: 'error', error: 'Upload timed out' }
              : f
          )
        )
        resolve()
      })

      xhr.open('POST', '/api/admin/media/upload')
      xhr.timeout = 60000 // 60 second timeout for uploads
      xhr.send(formData)
    })
  }

  // Retry a failed upload
  const retryUpload = (uploadId: string) => {
    const failedUpload = uploadingFiles.find((f) => f.id === uploadId)
    if (failedUpload && failedUpload.retryCount < MAX_RETRY_ATTEMPTS) {
      uploadFile(failedUpload.file, uploadId, failedUpload.retryCount + 1)
    }
  }

  // Handle file selection (SVG removed for security - can contain XSS)
  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

    fileArray.forEach((file) => {
      if (validTypes.includes(file.type)) {
        uploadFile(file)
      } else {
        setError(`Invalid file type: ${file.name}. Allowed: JPG, PNG, GIF, WebP`)
        createTrackedTimeout(() => setError(''), 3000)
      }
    })
  }, [])

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.currentTarget === e.target) {
      setIsDragging(false)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFiles(files)
    }
  }, [handleFiles])

  // Open delete confirmation dialog
  const handleDeleteClick = (item: Media) => {
    setMediaToDelete({ id: item.id, name: item.original_filename || item.filename })
    setDeleteDialogOpen(true)
  }

  // Delete media after confirmation
  const handleConfirmDelete = async () => {
    if (!mediaToDelete) return

    // Abort any existing delete request
    if (deleteControllerRef.current) {
      deleteControllerRef.current.abort()
    }

    const controller = new AbortController()
    deleteControllerRef.current = controller

    setIsDeleting(mediaToDelete.id)
    try {
      const res = await fetch(`/api/admin/media/${mediaToDelete.id}`, {
        method: 'DELETE',
        signal: controller.signal,
      })

      if (controller.signal.aborted) return

      if (res.ok) {
        setMedia(media.filter((m) => m.id !== mediaToDelete.id))
        if (selectedMedia?.id === mediaToDelete.id) {
          setSelectedMedia(null)
        }
        setDeleteDialogOpen(false)
        setMediaToDelete(null)
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to delete media')
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return // Request was aborted, ignore
      }
      console.error('Failed to delete media:', error instanceof Error ? error.message : error)
      setError('Failed to delete media')
    } finally {
      if (!controller.signal.aborted) {
        setIsDeleting(null)
      }
    }
  }

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(true)
      createTrackedTimeout(() => setCopiedUrl(false), 2000)
    } catch {
      console.warn('Clipboard access denied')
    }
  }

  // Format file size
  const formatSize = (bytes: number | null) => {
    if (!bytes) return '-'
    const kb = bytes / 1024
    if (kb < 1024) return `${kb.toFixed(1)} KB`
    return `${(kb / 1024).toFixed(1)} MB`
  }

  // Remove failed upload
  const removeUpload = (id: string) => {
    setUploadingFiles((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <div
      className="space-y-6"
      onDragEnter={handleDragEnter}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Media Library</h1>
          <p className="text-sm text-[var(--slate-gray)] mt-1">
            Manage your uploaded images and files
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center gap-1 p-1 bg-[var(--concrete-gray)]/30 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[var(--safety-orange)] text-white'
                  : 'text-[var(--slate-gray)] hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-[var(--safety-orange)] text-white'
                  : 'text-[var(--slate-gray)] hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--safety-orange)] text-white font-medium rounded-xl hover:bg-[var(--safety-orange-dark)] transition-colors"
          >
            <Upload className="w-5 h-5" />
            Upload
          </button>
        </div>
      </div>

      {/* Upload Progress */}
      <AnimatePresence>
        {uploadingFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            {uploadingFiles.map((file) => (
              <div
                key={file.id}
                className={`p-3 rounded-xl border ${
                  file.status === 'error'
                    ? 'bg-red-500/10 border-red-500/20'
                    : file.status === 'success'
                    ? 'bg-green-500/10 border-green-500/20'
                    : 'bg-[var(--concrete-gray)]/30 border-[var(--steel-gray)]/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  {file.status === 'uploading' ? (
                    <Loader2 className="w-5 h-5 text-[var(--safety-orange)] animate-spin flex-shrink-0" />
                  ) : file.status === 'success' ? (
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-white truncate">{file.name}</p>
                      {file.status === 'uploading' && (
                        <span className="text-xs text-[var(--slate-gray)] ml-2">{file.progress}%</span>
                      )}
                    </div>
                    {file.status === 'error' && (
                      <p className="text-xs text-red-400 mt-0.5">
                        {file.error}
                        {file.retryCount > 0 && ` (Attempt ${file.retryCount}/${MAX_RETRY_ATTEMPTS})`}
                      </p>
                    )}
                  </div>
                  {file.status === 'error' && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {file.retryCount < MAX_RETRY_ATTEMPTS && (
                        <button
                          onClick={() => retryUpload(file.id)}
                          className="p-1.5 rounded-md text-[var(--safety-orange)] hover:bg-[var(--safety-orange)]/10 transition-colors"
                          title="Retry upload"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => removeUpload(file.id)}
                        className="p-1.5 rounded-md text-[var(--slate-gray)] hover:text-white hover:bg-[var(--steel-gray)]/20 transition-colors"
                        title="Remove"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                {/* Progress bar for uploading status */}
                {file.status === 'uploading' && (
                  <div className="mt-2 h-1.5 bg-[var(--steel-gray)]/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[var(--safety-orange)] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${file.progress}%` }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Drag Overlay */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--asphalt-dark)]/90 backdrop-blur-sm"
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <CloudUpload className="w-20 h-20 text-[var(--safety-orange)] mx-auto mb-4" />
              </motion.div>
              <p className="text-xl font-semibold text-white">Drop files to upload</p>
              <p className="text-sm text-[var(--slate-gray)] mt-1">
                Supports JPG, PNG, GIF, WebP (max 10MB)
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[var(--safety-orange)] animate-spin" />
        </div>
      ) : media.length === 0 ? (
        <div
          className="bg-[var(--concrete-gray)]/30 border-2 border-dashed border-[var(--steel-gray)]/30 rounded-2xl p-12 text-center cursor-pointer hover:border-[var(--safety-orange)]/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <CloudUpload className="w-12 h-12 text-[var(--steel-gray)] mx-auto mb-4" />
          <p className="text-white mb-2">Drag and drop files here</p>
          <p className="text-sm text-[var(--slate-gray)] mb-4">
            or click to browse
          </p>
          <p className="text-xs text-[var(--steel-gray)]">
            Supports JPG, PNG, GIF, WebP (max 10MB)
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* Upload Card */}
          <div
            className="aspect-square bg-[var(--concrete-gray)]/30 border-2 border-dashed border-[var(--steel-gray)]/30 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[var(--safety-orange)]/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-8 h-8 text-[var(--steel-gray)] mb-2" />
            <span className="text-xs text-[var(--slate-gray)]">Upload</span>
          </div>

          {media.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
              className="relative group aspect-square bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 rounded-xl overflow-hidden cursor-pointer hover:border-[var(--safety-orange)]/50 transition-colors"
              onClick={() => setSelectedMedia(item)}
            >
              <Image
                src={item.file_url}
                alt={item.alt_text || item.original_filename || item.filename}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-medium px-2 py-1 bg-black/50 rounded">
                  View
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-[var(--concrete-gray)]/30 border border-[var(--steel-gray)]/20 rounded-2xl overflow-hidden">
          <div className="divide-y divide-[var(--steel-gray)]/10">
            {media.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="flex items-center gap-4 p-4 hover:bg-[var(--asphalt-dark)]/30 transition-colors"
              >
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={item.file_url}
                    alt={item.alt_text || item.original_filename || item.filename}
                    fill
                    sizes="64px"
                    className="object-cover rounded-lg"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{item.original_filename || item.filename}</p>
                  <p className="text-xs text-[var(--slate-gray)]">
                    {formatSize(item.file_size)} · {item.mime_type}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyUrl(item.file_url)}
                    className="p-2 rounded-lg text-[var(--slate-gray)] hover:text-white hover:bg-[var(--steel-gray)]/30 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(item)}
                    disabled={isDeleting === item.id}
                    className="p-2 rounded-lg text-[var(--slate-gray)] hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                  >
                    {isDeleting === item.id ? (
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

      {/* Media Preview Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedMedia(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-4xl w-full bg-[var(--concrete-gray)] border border-[var(--steel-gray)]/30 rounded-2xl overflow-hidden shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[var(--steel-gray)]/20">
                <h3 className="font-semibold text-white truncate">{selectedMedia.original_filename || selectedMedia.filename}</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteClick(selectedMedia)}
                    disabled={isDeleting === selectedMedia.id}
                    className="p-2 rounded-lg text-[var(--slate-gray)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    {isDeleting === selectedMedia.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => setSelectedMedia(null)}
                    className="p-2 rounded-lg text-[var(--slate-gray)] hover:text-white hover:bg-[var(--steel-gray)]/30 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Image */}
              <div className="p-4 bg-[var(--asphalt-dark)]">
                <div className="relative w-full h-[60vh]">
                  <Image
                    src={selectedMedia.file_url}
                    alt={selectedMedia.alt_text || selectedMedia.original_filename || selectedMedia.filename}
                    fill
                    sizes="100vw"
                    className="object-contain rounded-lg"
                    unoptimized
                  />
                </div>
              </div>

              {/* Details */}
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[var(--slate-gray)]">Size:</span>
                    <span className="text-white ml-2">{formatSize(selectedMedia.file_size)}</span>
                  </div>
                  <div>
                    <span className="text-[var(--slate-gray)]">Type:</span>
                    <span className="text-white ml-2">{selectedMedia.mime_type}</span>
                  </div>
                  {selectedMedia.width && (
                    <div>
                      <span className="text-[var(--slate-gray)]">Dimensions:</span>
                      <span className="text-white ml-2">
                        {selectedMedia.width} x {selectedMedia.height}
                      </span>
                    </div>
                  )}
                </div>

                {/* URL */}
                <div>
                  <label className="block text-sm text-[var(--slate-gray)] mb-1">URL</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={selectedMedia.file_url}
                      className="flex-1 px-3 py-2 bg-[var(--asphalt-dark)] border border-[var(--steel-gray)]/20 rounded-lg text-white text-sm"
                    />
                    <button
                      onClick={() => copyUrl(selectedMedia.file_url)}
                      className="px-3 py-2 bg-[var(--safety-orange)] text-white rounded-lg hover:bg-[var(--safety-orange-dark)] transition-colors flex items-center gap-2"
                    >
                      {copiedUrl ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
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
          setMediaToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Delete File"
        message={`Are you sure you want to delete "${mediaToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete File"
        variant="danger"
        isLoading={isDeleting !== null}
      />
    </div>
  )
}
