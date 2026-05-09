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
        <CardTitle className="text-base">{t('topVulnerable')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {employees.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center', padding: '16px 0' }}>
            Ma&apos;lumot yo&apos;q
          </p>
        ) : (
          employees.map((emp, i) => {
            const initials = emp.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
            return (
              <Link
                key={emp.id}
                href={`/${locale}/employees/${emp.id}`}
                className="flex items-center gap-3 group"
                aria-label={`View employee ${emp.name}`}
              >
                <span className="text-xs text-[var(--muted)] w-4 shrink-0">{i + 1}</span>
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors truncate">
                    {emp.name}
                  </p>
                  <p className="text-xs text-[var(--muted)] truncate">
                    {emp.department?.name ?? emp.position ?? ''}
                  </p>
                </div>
                <Badge variant={emp.status === 'active' ? 'success' : 'secondary'} style={{ fontSize: 11 }}>
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
