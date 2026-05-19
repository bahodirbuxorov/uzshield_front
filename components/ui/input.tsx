import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-[4px] border border-[var(--border-strong)] bg-[var(--surface-secondary)] px-3 py-1 text-sm text-[var(--text-primary)] placeholder:text-[var(--muted)] transition-colors',
          'focus-visible:outline-none focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[rgba(0,255,148,0.18)]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        style={{ fontFamily: 'var(--font-mono)' }}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
