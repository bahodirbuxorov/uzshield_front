'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { Employee } from '@/lib/types/employee'

interface TopVulnerableEmployeesProps {
  employees: Employee[]
  loading?: boolean
}

/** Top employees list for the dashboard (sorted by caller) */
export function TopVulnerableEmployees({ employees, loading }: TopVulnerableEmployeesProps) {
  const t = useTranslations('dashboard')
  const locale = useLocale()

  if (loading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-5 w-48" /></CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: 'var(--danger)',
              boxShadow: 'var(--shadow-glow-danger)',
            }}
          />
          {t('topVulnerable')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {employees.length === 0 ? (
          <p
            style={{
              fontSize: 12,
              color: 'var(--muted)',
              textAlign: 'center',
              padding: '16px 0',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {'// no data'}
          </p>
        ) : (
          employees.map((emp, i) => {
            const initials = emp.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
            return (
              <Link
                key={emp.id}
                href={`/${locale}/employees/${emp.id}`}
                className="group"
                aria-label={`View employee ${emp.name}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '8px 10px',
                  borderRadius: 4,
                  border: '1px solid transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-secondary)'
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'transparent'
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontFamily: 'var(--font-mono)',
                    color: i < 3 ? 'var(--danger)' : 'var(--muted)',
                    width: 18,
                    flexShrink: 0,
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                  }}
                >
                  #{String(i + 1).padStart(2, '0')}
                </span>
                <Avatar
                  className="shrink-0"
                  style={{ width: 28, height: 28, border: '1px solid var(--border)' }}
                >
                  <AvatarFallback
                    style={{
                      fontSize: 10,
                      backgroundColor: 'var(--surface-elevated)',
                      color: 'var(--text-secondary)',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                    }}
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      margin: 0,
                    }}
                  >
                    {emp.name}
                  </p>
                  <p
                    style={{
                      fontSize: 10,
                      color: 'var(--muted)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      margin: 0,
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {emp.department?.name ?? emp.position ?? ''}
                  </p>
                </div>
                <Badge variant={emp.status === 'active' ? 'success' : 'secondary'}>
                  {emp.status}
                </Badge>
              </Link>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
