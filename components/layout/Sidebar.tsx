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
  Shield,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { cn } from '@/lib/utils/cn'
import { useCampaigns } from '@/lib/hooks/useCampaigns'

interface NavItem {
  key: string
  href: string
  icon: React.ElementType
  badge?: number
}

export function Sidebar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const { user, clearAuth } = useAuthStore()
  const [collapsed, setCollapsed] = useState(false)

  const { data: campaignData } = useCampaigns(1, 100, 'active', 'all')
  const activeCampaignCount = campaignData?.total ?? 0

  const navItems: NavItem[] = [
    { key: 'dashboard', href: `/${locale}/dashboard`, icon: LayoutDashboard },
    { key: 'campaigns', href: `/${locale}/campaigns`, icon: Mail, badge: activeCampaignCount || undefined },
    { key: 'employees', href: `/${locale}/employees`, icon: Users },
    { key: 'templates', href: `/${locale}/templates`, icon: FileText },
    { key: 'training', href: `/${locale}/training`, icon: GraduationCap },
    { key: 'reports', href: `/${locale}/reports`, icon: BarChart2 },
    { key: 'settings', href: `/${locale}/settings`, icon: Settings },
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
      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarWidth }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-full z-40 flex flex-col overflow-hidden"
        style={{
          backgroundColor: 'var(--primary)',
          boxShadow: '2px 0 16px rgba(0,0,0,0.15)',
          minWidth: sidebarWidth,
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center h-16 shrink-0 border-b"
          style={{
            borderColor: 'rgba(255,255,255,0.1)',
            padding: collapsed ? '0 16px' : '0 20px',
            gap: 12,
            overflow: 'hidden',
          }}
        >
          <div
            className="flex items-center justify-center shrink-0 rounded-xl"
            style={{ width: 36, height: 36, backgroundColor: 'var(--accent)' }}
          >
            <Shield className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="text-white font-bold text-lg tracking-tight whitespace-nowrap"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                UzShield
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav Items */}
        <nav
          className="flex-1 overflow-y-auto overflow-x-hidden"
          style={{ padding: '12px 8px' }}
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
                    padding: collapsed ? '10px 0' : '10px 12px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    borderRadius: 12,
                    position: 'relative',
                    textDecoration: 'none',
                    transition: 'background-color 0.15s',
                    backgroundColor: active ? 'var(--accent)' : 'transparent',
                    color: active ? 'white' : 'rgba(255,255,255,0.6)',
                    fontSize: 14,
                    fontWeight: 500,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.08)'
                  }}
                  onMouseLeave={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
                  }}
                >
                  <item.icon
                    className="shrink-0"
                    style={{ width: 20, height: 20, color: active ? 'white' : 'rgba(255,255,255,0.6)' }}
                  />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        className="flex-1 min-w-0 overflow-hidden text-ellipsis"
                      >
                        {t(item.key as Parameters<typeof t>[0])}
                      </motion.span>
                    )}
                  </AnimatePresence>
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
                        height: 18,
                        borderRadius: 9,
                        backgroundColor: 'var(--warning)',
                        color: 'white',
                        fontSize: 10,
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
        <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.1)', margin: '0 8px' }} />

        {/* Bottom section */}
        <div style={{ padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
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
                  padding: '8px 12px',
                  overflow: 'hidden',
                }}
              >
                <Avatar className="shrink-0" style={{ width: 32, height: 32 }}>
                  <AvatarFallback style={{ fontSize: 12 }}>{initials}</AvatarFallback>
                </Avatar>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      color: 'white',
                      fontSize: 13,
                      fontWeight: 500,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {user?.name ?? 'Admin'}
                  </p>
                  <p
                    style={{
                      color: 'rgba(255,255,255,0.4)',
                      fontSize: 11,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {user?.companyName}
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
            onClick={clearAuth}
            aria-label={t('logout')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              width: '100%',
              padding: collapsed ? '10px 0' : '10px 12px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              borderRadius: 12,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.55)',
              fontSize: 14,
              fontWeight: 500,
              transition: 'background-color 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.08)'
              ;(e.currentTarget as HTMLElement).style.color = 'white'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
              ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)'
            }}
          >
            <LogOut style={{ width: 20, height: 20, flexShrink: 0 }} />
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
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.3)',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'white' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.3)' }}
          >
            {collapsed
              ? <ChevronRight style={{ width: 16, height: 16 }} />
              : <ChevronLeft style={{ width: 16, height: 16 }} />
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
