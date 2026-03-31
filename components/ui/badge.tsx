import * as React from 'react'
import { cn } from '@/lib/utils/cn'

/** Generic badge component */
const Badge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' }
>(({ className, variant = 'default', ...props }, ref) => {
  const variants: Record<string, string> = {
    default: 'bg-[var(--accent)]/10 text-[var(--accent)]',
    secondary: 'bg-[var(--surface-secondary)] text-[var(--text-secondary)]',
    success: 'bg-[var(--success-light)] text-[var(--success)]',
    warning: 'bg-[var(--warning-light)] text-amber-600',
    danger: 'bg-[var(--danger-light)] text-[var(--danger)]',
    outline: 'border border-[var(--border)] text-[var(--text-secondary)]',
  }
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    />
  )
})
Badge.displayName = 'Badge'

export { Badge }
