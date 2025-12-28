'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { AlertTriangle, X, Trash2, AlertCircle } from 'lucide-react'

export interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  isLoading?: boolean
}

const variantConfig = {
  danger: {
    icon: Trash2,
    iconBg: 'bg-red-500/10',
    iconColor: 'text-red-500',
    confirmBg: 'bg-red-600 hover:bg-red-700',
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
    confirmBg: 'bg-amber-600 hover:bg-amber-700',
  },
  info: {
    icon: AlertCircle,
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
    confirmBg: 'bg-blue-600 hover:bg-blue-700',
  },
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}: ConfirmDialogProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  // Handle escape key
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose()
      }
    },
    [onClose, isLoading]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleEscape])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={!isLoading ? onClose : undefined}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-4"
          >
            <div className="rounded-2xl bg-[var(--asphalt-dark)] border border-[var(--steel-gray)]/30 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-start justify-between p-5 border-b border-[var(--steel-gray)]/20">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${config.iconBg}`}>
                    <Icon className={`w-6 h-6 ${config.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{title}</h3>
                </div>
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  aria-label="Close dialog"
                  className="p-2 rounded-lg text-[var(--slate-gray)] hover:text-white hover:bg-[var(--concrete-gray)]/50 transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5">
                <p className="text-[var(--light-gray)]">{message}</p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-5 border-t border-[var(--steel-gray)]/20 bg-[var(--asphalt-black)]/30">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg text-[var(--light-gray)] bg-[var(--concrete-gray)]/50 hover:bg-[var(--concrete-gray)] transition-colors disabled:opacity-50"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-50 ${config.confirmBg}`}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    confirmText
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/**
 * Hook to manage confirm dialog state
 */
export function useConfirmDialog() {
  const [state, setState] = useState<{
    isOpen: boolean
    title: string
    message: string
    variant: 'danger' | 'warning' | 'info'
    onConfirm: () => void | Promise<void>
  }>({
    isOpen: false,
    title: '',
    message: '',
    variant: 'danger',
    onConfirm: () => {},
  })

  const [isLoading, setIsLoading] = useState(false)

  const confirm = useCallback(
    (options: {
      title: string
      message: string
      variant?: 'danger' | 'warning' | 'info'
    }): Promise<boolean> => {
      return new Promise((resolve) => {
        setState({
          isOpen: true,
          title: options.title,
          message: options.message,
          variant: options.variant || 'danger',
          onConfirm: () => resolve(true),
        })
      })
    },
    []
  )

  const close = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }))
    setIsLoading(false)
  }, [])

  const handleConfirm = useCallback(async () => {
    setIsLoading(true)
    try {
      await state.onConfirm()
    } finally {
      close()
    }
  }, [state.onConfirm, close])

  return {
    isOpen: state.isOpen,
    title: state.title,
    message: state.message,
    variant: state.variant,
    isLoading,
    confirm,
    close,
    handleConfirm,
  }
}
