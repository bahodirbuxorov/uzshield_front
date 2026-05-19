'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Mail,
  Users,
  FileText,
  GraduationCap,
  BarChart2,
  Settings,
  LogOut,
  ShieldHalf,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useCampaigns } from '@/lib/hooks/useCampaigns'
import { logout } from '@/lib/api/auth'

interface NavItem {
  key: string
  href: string
  icon: React.ElementType
  badge?: number
  code: string
}

export function Sidebar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const { user, clearAuth } = useAuthStore()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = async () => {
    try { await logout() } catch { /* ignore network errors on logout */ }
    clearAuth()
  }

  const { data: campaignData } = useCampaigns({ status: 'active' })
  const activeCampaignCount = campaignData?.meta?.total ?? 0

  const navItems: NavItem[] = [
    { key: 'dashboard', href: `/${locale}/dashboard`, icon: LayoutDashboard, code: '01' },
    { key: 'campaigns', href: `/${locale}/campaigns`, icon: Mail, badge: activeCampaignCount || undefined, code: '02' },
    { key: 'employees', href: `/${locale}/employees`, icon: Users, code: '03' },
    { key: 'templates', href: `/${locale}/templates`, icon: FileText, code: '04' },
    { key: 'training', href: `/${locale}/training`, icon: GraduationCap, code: '05' },
    { key: 'reports', href: `/${locale}/reports`, icon: BarChart2, code: '06' },
    { key: 'settings', href: `/${locale}/settings`, icon: Settings, code: '07' },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? 'AU'

  const sidebarWidth = collapsed ? 72 : 260

  return (
    <>
      <motion.aside
        animate={{ width: sidebarWidth }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-full z-40 flex flex-col overflow-hidden"
        style={{
          backgroundColor: 'var(--background-deep)',
          borderRight: '1px solid var(--border)',
          boxShadow: 'inset -1px 0 0 rgba(0,229,255,0.04), 8px 0 32px -8px rgba(0,0,0,0.6)',
          minWidth: sidebarWidth,
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center h-16 shrink-0"
          style={{
            borderBottom: '1px solid var(--border)',
            padding: collapsed ? '0 16px' : '0 20px',
            gap: 12,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              width: 36,
              height: 36,
              borderRadius: 4,
              backgroundColor: 'var(--surface-elevated)',
              border: '1px solid var(--border-accent)',
              boxShadow: 'var(--shadow-glow-accent)',
              position: 'relative',
            }}
          >
            <ShieldHalf style={{ width: 18, height: 18, color: 'var(--accent)' }} />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}
              >
                <span
                  style={{
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: 16,
                    letterSpacing: '0.04em',
                    lineHeight: 1,
                  }}
                >
                  UZ<span style={{ color: 'var(--accent)' }}>SHIELD</span>
                </span>
                <span
                  style={{
                    color: 'var(--muted)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    letterSpacing: '0.18em',
                    marginTop: 3,
                    textTransform: 'uppercase',
                  }}
                >
                  cyber.console
                  <span className="animate-blink" style={{ color: 'var(--accent)' }}>_</span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Section label */}
        {!collapsed && (
          <div
            style={{
              padding: '14px 20px 6px',
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              color: 'var(--muted)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            {'// navigation'}
          </div>
        )}

        {/* Nav Items */}
        <nav
          className="flex-1 overflow-y-auto overflow-x-hidden"
          style={{ padding: collapsed ? '12px 8px' : '0 12px 12px' }}
        >
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  id={`nav-${item.key}`}
                  aria-label={t(item.key as Parameters<typeof t>[0])}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: collapsed ? '10px 0' : '9px 12px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    borderRadius: 4,
                    position: 'relative',
                    textDecoration: 'none',
                    transition: 'background-color 0.15s, color 0.15s, border-color 0.15s',
                    backgroundColor: active ? 'var(--accent-tint)' : 'transparent',
                    border: '1px solid',
                    borderColor: active ? 'var(--border-accent)' : 'transparent',
                    color: active ? 'var(--accent)' : 'var(--text-secondary)',
                    fontSize: 13,
                    fontWeight: 500,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      ;(e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-secondary)'
                      ;(e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
                      ;(e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'
                    }
                  }}
                >
                  {/* active indicator bar */}
                  {active && !collapsed && (
                    <span
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 6,
                        bottom: 6,
                        width: 2,
                        backgroundColor: 'var(--accent)',
                        boxShadow: '0 0 8px var(--accent)',
                      }}
                    />
                  )}
                  <item.icon
                    className="shrink-0"
                    style={{ width: 18, height: 18 }}
                  />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        className="flex-1 min-w-0 overflow-hidden text-ellipsis"
                        style={{ textTransform: 'capitalize' }}
                      >
                        {t(item.key as Parameters<typeof t>[0])}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {!collapsed && (
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 9,
                        color: active ? 'var(--accent)' : 'var(--muted)',
                        opacity: 0.7,
                        letterSpacing: '0.05em',
                      }}
                    >
                      {item.code}
                    </span>
                  )}
                  {item.badge && item.badge > 0 && (
                    <span
                      style={{
                        position: collapsed ? 'absolute' : 'static',
                        top: collapsed ? 4 : undefined,
                        right: collapsed ? 4 : undefined,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: 18,
                        height: 16,
                        borderRadius: 2,
                        backgroundColor: 'var(--danger-light)',
                        color: 'var(--danger)',
                        border: '1px solid rgba(255,59,92,0.3)',
                        fontSize: 9,
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        padding: '0 4px',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: 'var(--border)', margin: '0 12px' }} />

        {/* Bottom section */}
        <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* User info — only when expanded */}
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                  borderRadius: 4,
                  marginBottom: 6,
                  backgroundColor: 'var(--surface)',
                }}
              >
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <Avatar style={{ width: 32, height: 32, border: '1px solid var(--border-accent)' }}>
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
                  <span
                    style={{
                      position: 'absolute',
                      bottom: -1,
                      right: -1,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent)',
                      border: '2px solid var(--surface)',
                      boxShadow: '0 0 6px var(--accent)',
                    }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      color: 'var(--text-primary)',
                      fontSize: 12,
                      fontWeight: 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {user?.name ?? 'Admin'}
                  </p>
                  <p
                    style={{
                      color: 'var(--accent)',
                      fontSize: 10,
                      fontFamily: 'var(--font-mono)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      marginTop: 1,
                    }}
                  >
                    [{user?.roles?.[0]?.replace('_', '.') ?? 'guest'}]
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Language Switcher — only when expanded */}
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                style={{ overflow: 'hidden' }}
              >
                <LanguageSwitcher />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Logout */}
          <button
            id="sidebar-logout"
            onClick={handleLogout}
            aria-label={t('logout')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              width: '100%',
              padding: collapsed ? '10px 0' : '9px 12px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              borderRadius: 4,
              background: 'none',
              border: '1px solid transparent',
              cursor: 'pointer',
              color: 'var(--muted)',
              fontSize: 12,
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              transition: 'all 0.15s',
              fontFamily: 'var(--font-display)',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.backgroundColor = 'var(--danger-light)'
              ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,59,92,0.3)'
              ;(e.currentTarget as HTMLElement).style.color = 'var(--danger)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
              ;(e.currentTarget as HTMLElement).style.borderColor = 'transparent'
              ;(e.currentTarget as HTMLElement).style.color = 'var(--muted)'
            }}
          >
            <LogOut style={{ width: 16, height: 16, flexShrink: 0 }} />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  {t('logout')}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              padding: '6px 0',
              background: 'none',
              border: '1px solid var(--border)',
              borderRadius: 4,
              cursor: 'pointer',
              color: 'var(--muted)',
              transition: 'all 0.15s',
              marginTop: 4,
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.color = 'var(--accent)'
              ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border-accent)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.color = 'var(--muted)'
              ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
            }}
          >
            {collapsed
              ? <ChevronRight style={{ width: 14, height: 14 }} />
              : <ChevronLeft style={{ width: 14, height: 14 }} />
            }
          </button>
        </div>
      </motion.aside>

      {/* Spacer div so main content shifts with sidebar */}
      <div
        style={{
          flexShrink: 0,
          transition: 'width 0.3s',
          width: sidebarWidth,
        }}
      />
    </>
  )
}
