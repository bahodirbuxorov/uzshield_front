import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

/**
 * Illustrated empty state block with optional CTA button.
 */
export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {icon && (
        <div
          className="mb-4 flex items-center justify-center w-16 h-16 text-[var(--muted)]"
          style={{
            borderRadius: 4,
            backgroundColor: 'var(--surface-secondary)',
            border: '1px dashed var(--border-strong)',
          }}
        >
          {icon}
        </div>
      )}
      <h3
        className="text-base font-semibold text-[var(--text-primary)] mb-1"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[var(--text-secondary)] max-w-sm mb-4">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" id="empty-state-action">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
