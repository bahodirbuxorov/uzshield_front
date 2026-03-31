import { cn } from '@/lib/utils/cn'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * Animated circular spinner.
 */
export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          sizes[size],
          'rounded-full border-2 border-[var(--border)] border-t-[var(--accent)] animate-spin'
        )}
        role="status"
        aria-label="Loading"
      />
    </div>
  )
}

/**
 * Full-page centered loading spinner.
 */
export function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[400px]">
      <LoadingSpinner size="lg" />
    </div>
  )
}
