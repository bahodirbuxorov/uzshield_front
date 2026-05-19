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
    <div
      className="flex items-start justify-between gap-4 flex-wrap"
      style={{
        paddingBottom: 16,
        borderBottom: '1px solid var(--border)',
        position: 'relative',
      }}
    >
      <div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--muted)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          <span style={{ color: 'var(--accent)' }}>&gt;</span> module
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '0.02em',
            margin: 0,
          }}
        >
          {title}
        </h2>
        {description && (
          <p
            style={{
              marginTop: 6,
              fontSize: 13,
              color: 'var(--text-secondary)',
            }}
          >
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  )
}
