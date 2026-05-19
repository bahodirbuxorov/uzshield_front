'use client'

import { use } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import {
  ArrowLeft, Mail, Phone, Building2, Calendar,
  GraduationCap, BarChart2, Send, Briefcase, User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { PageLoader } from '@/components/shared/LoadingSpinner'
import { useEmployee, useEmployeeStatistics } from '@/lib/hooks/useEmployees'
import { formatDate } from '@/lib/utils/formatters'

export default function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const t = useTranslations('employees')
  const tCommon = useTranslations('common')
  const locale = useLocale()

  const empId = Number(id)
  const { data: employee, isLoading } = useEmployee(empId)
  const { data: stats } = useEmployeeStatistics(empId)

  if (isLoading) return <PageLoader />
  if (!employee)
    return (
      <div className="page-container" style={{ color: 'var(--danger)' }}>
        {tCommon('error')}
      </div>
    )

  const initials = employee.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="page-container">
      {/* Back nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/${locale}/employees`}>
            <ArrowLeft style={{ width: 16, height: 16 }} />
          </Link>
        </Button>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-display)' }}>
          {t('profile')}
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 20, alignItems: 'start' }}>
        {/* ── Profile Card ── */}
        <div>
          <Card>
            <CardContent style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
              {/* Avatar */}
              <div style={{ position: 'relative' }}>
                <Avatar style={{ width: 88, height: 88 }}>
                  <AvatarFallback style={{ fontSize: 28, fontWeight: 700 }}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: 18, height: 18, borderRadius: '50%',
                  backgroundColor: employee.status === 'active' ? 'var(--success)' : 'var(--muted)',
                  border: '2px solid white',
                }} />
              </div>

              {/* Name & role */}
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px', fontFamily: 'var(--font-display)' }}>
                  {employee.name}
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '0 0 2px' }}>
                  {employee.position ?? '—'}
                </p>
                <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
                  {employee.department?.name ?? '—'}
                </p>
              </div>

              <Badge variant={employee.status === 'active' ? 'success' : 'secondary'}>
                {t(`status.${employee.status}` as Parameters<typeof t>[0])}
              </Badge>

              {/* Contact info */}
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <Mail style={{ width: 14, height: 14, color: 'var(--muted)', flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {employee.email}
                  </span>
                </div>
                {employee.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <Phone style={{ width: 14, height: 14, color: 'var(--muted)', flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{employee.phone}</span>
                  </div>
                )}
                {employee.department && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <Building2 style={{ width: 14, height: 14, color: 'var(--muted)', flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{employee.department.name}</span>
                  </div>
                )}
                {employee.age && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <User style={{ width: 14, height: 14, color: 'var(--muted)', flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{employee.age} yosh</span>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <Calendar style={{ width: 14, height: 14, color: 'var(--muted)', flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{formatDate(employee.created_at)}</span>
                </div>
              </div>

              {/* Stats from API */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, width: '100%', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                {[
                  { label: 'Kampaniya', value: stats?.campaigns_count ?? '—', color: 'var(--accent)', Icon: Send },
                  { label: 'Bosdi', value: stats?.clicked_count ?? '—', color: 'var(--danger)', Icon: BarChart2 },
                  { label: 'Trening', value: stats?.trained_count ?? '—', color: 'var(--success)', Icon: GraduationCap },
                ].map((s) => (
                  <div key={s.label} style={{ textAlign: 'center' }}>
                    <s.Icon style={{ width: 16, height: 16, color: s.color, margin: '0 auto 4px' }} />
                    <p style={{ fontSize: 20, fontWeight: 700, color: s.color, margin: '0 0 2px', fontFamily: 'var(--font-display)' }}>
                      {s.value}
                    </p>
                    <p style={{ fontSize: 10, color: 'var(--muted)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Click rate & training rate */}
              {stats && (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Click rate</span>
                    <span style={{ fontWeight: 600, color: stats.click_rate && stats.click_rate > 30 ? 'var(--danger)' : 'var(--success)' }}>
                      {stats.click_rate != null ? `${stats.click_rate.toFixed(1)}%` : '—'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Training rate</span>
                    <span style={{ fontWeight: 600, color: 'var(--accent)' }}>
                      {stats.training_rate != null ? `${stats.training_rate.toFixed(1)}%` : '—'}
                    </span>
                  </div>
                  {stats.risk_score != null && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Risk score</span>
                      <span style={{ fontWeight: 700, color: stats.risk_score > 60 ? 'var(--danger)' : stats.risk_score > 30 ? 'var(--warning)' : 'var(--success)' }}>
                        {stats.risk_score.toFixed(0)}/100
                      </span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Right: Details ── */}
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: 14 }}>Xodim ma&apos;lumotlari</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { label: 'Ism', value: employee.name, Icon: User },
                  { label: 'Email', value: employee.email, Icon: Mail },
                  { label: 'Telefon', value: employee.phone ?? '—', Icon: Phone },
                  { label: 'Lavozim', value: employee.position ?? '—', Icon: Briefcase },
                  { label: 'Bo\'lim', value: employee.department?.name ?? '—', Icon: Building2 },
                  { label: 'Yosh', value: employee.age ? `${employee.age}` : '—', Icon: User },
                  { label: 'Qo\'shilgan sana', value: formatDate(employee.created_at), Icon: Calendar },
                  { label: 'Yangilangan', value: formatDate(employee.updated_at), Icon: Calendar },
                ].map(({ label, value, Icon }) => (
                  <div key={label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <Icon style={{ width: 15, height: 15, color: 'var(--muted)', marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: 11, color: 'var(--muted)', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
                      <p style={{ fontSize: 14, color: 'var(--text-primary)', margin: 0, fontWeight: 500 }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
