'use client'

import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Bell } from 'lucide-react'
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
        backgroundColor: 'white',
        borderBottom: '1px solid var(--border)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}
    >
      <h1
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-display)',
          margin: 0,
        }}
      >
        {tNav(titleKey as Parameters<typeof tNav>[0])}
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
            borderRadius: 8,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            transition: 'background-color 0.15s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-secondary)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
        >
          <Bell style={{ width: 20, height: 20 }} />
          <span
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'var(--danger)',
              border: '2px solid white',
            }}
          />
        </button>

        <Avatar style={{ width: 36, height: 36 }}>
          <AvatarFallback style={{ fontSize: 12, backgroundColor: 'var(--accent)', color: 'white' }}>
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
