'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import type { Employee } from '@/lib/types/employee'

interface TopVulnerableEmployeesProps {
  employees: Employee[]
  loading?: boolean
}

/** Top 5 most at-risk employees for the dashboard */
export function TopVulnerableEmployees({ employees, loading }: TopVulnerableEmployeesProps) {
  const t = useTranslations('dashboard')
  const tEmp = useTranslations('employees')
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

  const RISK_COLORS: Record<string, string> = {
    low: 'var(--success)',
    medium: 'var(--warning)',
    high: 'var(--danger)',
    critical: '#7C3AED',
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('topVulnerable')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {employees.map((emp, i) => {
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
                <p className="text-xs text-[var(--muted)] truncate">{emp.department}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Progress
                  value={emp.riskScore}
                  className="w-16 h-1.5"
                  style={{ '--progress-color': RISK_COLORS[emp.riskLevel] } as React.CSSProperties}
                />
                <span
                  className="text-sm font-bold w-8 text-right"
                  style={{ color: RISK_COLORS[emp.riskLevel] }}
                >
                  {emp.riskScore}
                </span>
              </div>
            </Link>
          )
        })}
      </CardContent>
    </Card>
  )
}
