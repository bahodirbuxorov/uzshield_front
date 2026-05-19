import * as React from 'react'
import { cn } from '@/lib/utils/cn'

/** Generic badge component — cyber/terminal style */
const Badge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & {
    variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline'
  }
>(({ className, variant = 'default', ...props }, ref) => {
  const variants: Record<string, string> = {
    default:
      'bg-[var(--accent-tint)] text-[var(--accent)] border border-[var(--accent-tint-strong)]',
    secondary:
      'bg-[var(--surface-secondary)] text-[var(--text-secondary)] border border-[var(--border)]',
    success:
      'bg-[var(--success-light)] text-[var(--accent)] border border-[var(--accent-tint-strong)]',
    warning:
      'bg-[var(--warning-light)] text-[var(--warning)] border border-[rgba(255,176,32,0.25)]',
    danger:
      'bg-[var(--danger-light)] text-[var(--danger)] border border-[rgba(255,59,92,0.30)]',
    outline:
      'border border-[var(--border-strong)] text-[var(--text-secondary)] bg-transparent',
  }
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1 rounded-[3px] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
        variants[variant],
        className
      )}
      style={{ fontFamily: 'var(--font-mono)' }}
      {...props}
    />
  )
})
Badge.displayName = 'Badge'

export { Badge }
