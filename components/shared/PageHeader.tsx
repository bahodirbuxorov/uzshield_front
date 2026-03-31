import { Button } from '@/components/ui/button'
import type { ReactNode } from 'react'

interface PageHeaderProps {
  /** Page title */
  title: string
  /** Optional subtitle */
  description?: string
  /** Optional action buttons on the right */
  actions?: ReactNode
}

/**
 * Reusable page header with title, description, and action slot.
 */
export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h2
          className="text-2xl font-bold text-[var(--text-primary)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-[var(--text-secondary)]">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  )
}
