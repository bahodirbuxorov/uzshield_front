'use client'

import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Bell, Search, Terminal } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuthStore } from '@/lib/store/useAuthStore'

const ROUTE_TITLE_MAP: Record<string, string> = {
  dashboard: 'dashboard',
  campaigns: 'campaigns',
  employees: 'employees',
  templates: 'templates',
  training: 'training',
  reports: 'reports',
  settings: 'settings',
}

export function Header() {
  const tNav = useTranslations('nav')
  const pathname = usePathname()
  const { user } = useAuthStore()
  const [clock, setClock] = useState<string>('')

  useEffect(() => {
    const tick = () => {
      const d = new Date()
      const pad = (n: number) => String(n).padStart(2, '0')
      setClock(`${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} UTC`)
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  const segments = pathname.split('/').filter(Boolean)
  const pageSegment = segments.find((s) => s in ROUTE_TITLE_MAP)
  const titleKey = pageSegment ? ROUTE_TITLE_MAP[pageSegment] : 'dashboard'

  const initials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() ?? 'AU'

  return (
    <header
      id="main-header"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: 64,
        flexShrink: 0,
        backgroundColor: 'var(--background-deep)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Terminal style={{ width: 14, height: 14, color: 'var(--accent)' }} />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--muted)',
              letterSpacing: '0.08em',
            }}
          >
            oxupax@console:~/
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--accent)',
              letterSpacing: '0.08em',
            }}
          >
            {titleKey}
          </span>
          <span
            className="animate-blink"
            style={{
              display: 'inline-block',
              width: 6,
              height: 12,
              backgroundColor: 'var(--accent)',
              marginLeft: 2,
              verticalAlign: 'middle',
            }}
          />
        </div>

        <span style={{ width: 1, height: 20, backgroundColor: 'var(--border)' }} />

        <h1
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {tNav(titleKey as Parameters<typeof tNav>[0])}
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Live clock */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 10px',
            borderRadius: 4,
            border: '1px solid var(--border)',
            backgroundColor: 'var(--surface)',
          }}
        >
          <span className="live-dot" style={{ width: 6, height: 6 }} />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--text-secondary)',
              letterSpacing: '0.06em',
              minWidth: 92,
              textAlign: 'right',
            }}
          >
            {clock || '--:--:-- UTC'}
          </span>
        </div>

        {/* Search hint */}
        <button
          aria-label="Search"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 10px',
            borderRadius: 4,
            border: '1px solid var(--border)',
            backgroundColor: 'var(--surface)',
            color: 'var(--muted)',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border-accent)'
            ;(e.currentTarget as HTMLElement).style.color = 'var(--accent)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
            ;(e.currentTarget as HTMLElement).style.color = 'var(--muted)'
          }}
        >
          <Search style={{ width: 14, height: 14 }} />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.04em',
            }}
          >
            ⌘K
          </span>
        </button>

        {/* Notifications */}
        <button
          id="notifications-bell"
          aria-label="Notifications"
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: 4,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border-accent)'
            ;(e.currentTarget as HTMLElement).style.color = 'var(--accent)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
            ;(e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'
          }}
        >
          <Bell style={{ width: 16, height: 16 }} />
          <span
            style={{
              position: 'absolute',
              top: 7,
              right: 7,
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'var(--danger)',
              border: '2px solid var(--background-deep)',
              boxShadow: 'var(--shadow-glow-danger)',
            }}
          />
        </button>

        <Avatar style={{ width: 36, height: 36, border: '1px solid var(--border-accent)' }}>
          <AvatarFallback
            style={{
              fontSize: 11,
              backgroundColor: 'var(--surface-elevated)',
              color: 'var(--accent)',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
            }}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
