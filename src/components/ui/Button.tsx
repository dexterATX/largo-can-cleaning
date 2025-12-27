'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      'inline-flex items-center justify-center gap-2',
      'font-semibold tracking-wide uppercase',
      'rounded-lg transition-all duration-300',
      'focus:outline-none focus-visible:outline-none',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'active:scale-[0.98]'
    )

    const variants = {
      primary: cn(
        'bg-[var(--safety-orange)] text-white',
        'hover:bg-[var(--safety-orange-dark)]',
        'shadow-lg hover:shadow-[var(--glow-orange)]',
        'border-2 border-transparent'
      ),
      secondary: cn(
        'bg-[var(--concrete-gray)] text-white',
        'hover:bg-[var(--steel-gray)]',
        'border-2 border-[var(--steel-gray)]'
      ),
      outline: cn(
        'bg-transparent text-[var(--safety-orange)]',
        'border-2 border-[var(--safety-orange)]',
        'hover:bg-[var(--safety-orange)] hover:text-white'
      ),
      ghost: cn(
        'bg-transparent text-[var(--safety-orange)]',
        'hover:bg-[var(--safety-orange)]/10',
        'border-2 border-transparent'
      ),
    }

    const sizes = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-4 text-base',
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
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
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
