'use client'

import { use } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import {
  ArrowLeft, Mail, Phone, Building2, Calendar, ShieldAlert,
  CheckCircle2, XCircle, Clock, TrendingUp, TrendingDown,
  GraduationCap, BarChart2, Send,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { PageLoader } from '@/components/shared/LoadingSpinner'
import {
  useEmployee,
  useEmployeeCampaigns,
  useEmployeeTrainings,
  useEmployeeActivities,
} from '@/lib/hooks/useEmployees'
import { formatDate } from '@/lib/utils/formatters'
import type { RiskLevel } from '@/lib/types/employee'

const RISK_COLORS: Record<RiskLevel, string> = {
  low: 'var(--success)',
  medium: 'var(--warning)',
  high: 'var(--danger)',
  critical: '#7C3AED',
}

const RISK_BG: Record<RiskLevel, string> = {
  low: 'var(--success-light)',
  medium: 'var(--warning-light)',
  high: 'var(--danger-light)',
  critical: '#F3E8FF',
}

export default function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const t = useTranslations('employees')
  const tCommon = useTranslations('common')
  const locale = useLocale()

  const { data: employee, isLoading } = useEmployee(id)
  const { data: campaigns } = useEmployeeCampaigns(id)
  const { data: trainings } = useEmployeeTrainings(id)
  const { data: activities } = useEmployeeActivities(id)

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

  const clickedCount = (campaigns ?? []).filter((c) => c.clickedAt).length
  const trainedCount = (trainings ?? []).filter((tr) => tr.status === 'completed').length
  const totalCampaigns = (campaigns ?? []).length

  return (
    <div className="page-container">
      {/* Back nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/${locale}/employees`}>
            <ArrowLeft style={{ width: 16, height: 16 }} />
          </Link>
        </Button>
        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: 0,
            fontFamily: 'var(--font-display)',
          }}
        >
          {t('profile')}
        </h2>
      </div>

      {/* Main grid — responsive */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
          alignItems: 'start',
        }}
      >
        {/* ── LEFT: Profile Card ── */}
        <div style={{ gridColumn: 'span 1' }}>
          <Card>
            <CardContent
              style={{
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16,
                textAlign: 'center',
              }}
            >
              {/* Avatar */}
              <div style={{ position: 'relative' }}>
                <Avatar style={{ width: 88, height: 88 }}>
                  <AvatarFallback
                    style={{
                      fontSize: 28,
                      fontWeight: 700,
                      backgroundColor: RISK_BG[employee.riskLevel],
                      color: RISK_COLORS[employee.riskLevel],
                    }}
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    backgroundColor:
                      employee.status === 'active' ? 'var(--success)' : 'var(--muted)',
                    border: '2px solid white',
                  }}
                />
              </div>

              {/* Name & role */}
              <div>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    margin: '0 0 4px',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  {employee.name}
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '0 0 2px' }}>
                  {employee.position}
                </p>
                <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>{employee.department}</p>
              </div>

              <Badge variant={employee.status === 'active' ? 'success' : 'secondary'}>
                {t(`status.${employee.status}` as Parameters<typeof t>[0])}
              </Badge>

              {/* Contact info */}
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  padding: '12px 0',
                  borderTop: '1px solid var(--border)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <Building2 style={{ width: 14, height: 14, color: 'var(--muted)', flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{employee.department}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <Calendar style={{ width: 14, height: 14, color: 'var(--muted)', flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{formatDate(employee.lastActivity)}</span>
                </div>
              </div>

              {/* Risk Score */}
              <div style={{ width: '100%' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ShieldAlert style={{ width: 14, height: 14, color: RISK_COLORS[employee.riskLevel] }} />
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>
                      {t('riskScore')}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: RISK_COLORS[employee.riskLevel],
                      fontFamily: 'var(--font-display)',
                    }}
                  >
                    {employee.riskScore}
                    <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--muted)' }}>/100</span>
                  </span>
                </div>
                <Progress value={employee.riskScore} style={{ height: 10, borderRadius: 8 }} />
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    marginTop: 8,
                    padding: '3px 10px',
                    borderRadius: 20,
                    backgroundColor: RISK_BG[employee.riskLevel],
                    fontSize: 11,
                    fontWeight: 600,
                    color: RISK_COLORS[employee.riskLevel],
                  }}
                >
                  <ShieldAlert style={{ width: 11, height: 11 }} />
                  {t(`riskLevel.${employee.riskLevel}` as Parameters<typeof t>[0])} Risk
                </div>
              </div>

              {/* Mini stats */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: 8,
                  width: '100%',
                  paddingTop: 12,
                  borderTop: '1px solid var(--border)',
                }}
              >
                {[
                  { label: 'Kampaniya', value: employee.campaignsParticipated, color: 'var(--accent)', Icon: Send },
                  { label: 'Trening', value: employee.trainingsCompleted, color: 'var(--success)', Icon: GraduationCap },
                  { label: 'Bosdi', value: clickedCount, color: 'var(--danger)', Icon: BarChart2 },
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
            </CardContent>
          </Card>
        </div>

        {/* ── RIGHT column — spans 2 ── */}
        <div
          style={{
            gridColumn: 'span 2',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {/* Campaign History */}
          <Card>
            <CardHeader style={{ paddingBottom: 0 }}>
              <CardTitle
                style={{
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>{t('campaignHistory')}</span>
                <Badge variant="outline">{totalCampaigns} ta</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent style={{ padding: 0 }}>
              <div style={{ overflowX: 'auto' }}>
                <table
                  style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}
                  aria-label="Campaign history"
                >
                  <thead>
                    <tr
                      style={{
                        borderBottom: '1px solid var(--border)',
                        backgroundColor: 'var(--surface-secondary)',
                      }}
                    >
                      {['Kampaniya', 'Kanal', 'Bosdi?', 'Trening', 'Sana'].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: '10px 16px',
                            textAlign: 'left',
                            fontSize: 11,
                            fontWeight: 600,
                            color: 'var(--muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(campaigns ?? []).length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          style={{
                            padding: 32,
                            textAlign: 'center',
                            color: 'var(--muted)',
                            fontSize: 13,
                          }}
                        >
                          Ma&apos;lumot yo&apos;q
                        </td>
                      </tr>
                    ) : (
                      (campaigns ?? []).map((c) => (
                        <tr
                          key={c.campaignId}
                          style={{ borderBottom: '1px solid var(--border)' }}
                          onMouseEnter={(e) => {
                            ;(e.currentTarget as HTMLElement).style.backgroundColor =
                              'var(--surface-secondary)'
                          }}
                          onMouseLeave={(e) => {
                            ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
                          }}
                        >
                          <td
                            style={{
                              padding: '12px 16px',
                              fontWeight: 500,
                              color: 'var(--text-primary)',
                              minWidth: 160,
                            }}
                          >
                            {c.campaignName}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <Badge variant="outline" style={{ textTransform: 'capitalize', fontSize: 11 }}>
                              {c.channel ?? 'email'}
                            </Badge>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            {c.clickedAt ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--danger)' }}>
                                <XCircle style={{ width: 15, height: 15 }} />
                                <span style={{ fontSize: 12 }}>Ha</span>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--success)' }}>
                                <CheckCircle2 style={{ width: 15, height: 15 }} />
                                <span style={{ fontSize: 12 }}>Yo&apos;q</span>
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            {c.trainedAt ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--success)' }}>
                                <CheckCircle2 style={{ width: 15, height: 15 }} />
                                <span style={{ fontSize: 12 }}>Bajarildi</span>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--muted)' }}>
                                <Clock style={{ width: 15, height: 15 }} />
                                <span style={{ fontSize: 12 }}>Kutilmoqda</span>
                              </div>
                            )}
                          </td>
                          <td
                            style={{
                              padding: '12px 16px',
                              fontSize: 12,
                              color: 'var(--muted)',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {formatDate(c.sentAt ?? '')}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Training History */}
          <Card>
            <CardHeader style={{ paddingBottom: 0 }}>
              <CardTitle
                style={{
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>{t('trainingHistory')}</span>
                <Badge variant="outline">{trainedCount}/{(trainings ?? []).length} bajarildi</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent style={{ padding: 20 }}>
              {(trainings ?? []).length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 13, padding: '16px 0' }}>
                  Ma&apos;lumot yo&apos;q
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {(trainings ?? []).map((tr) => (
                    <div
                      key={tr.moduleId}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '12px 14px',
                        borderRadius: 10,
                        border: '1px solid var(--border)',
                        backgroundColor: 'white',
                        transition: 'box-shadow 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        ;(e.currentTarget as HTMLElement).style.boxShadow =
                          '0 2px 8px rgba(0,0,0,0.08)'
                      }}
                      onMouseLeave={(e) => {
                        ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                      }}
                    >
                      {/* Status icon */}
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          backgroundColor:
                            tr.status === 'completed'
                              ? 'var(--success-light)'
                              : tr.status === 'in_progress'
                              ? 'var(--warning-light)'
                              : 'var(--surface-secondary)',
                        }}
                      >
                        {tr.status === 'completed' ? (
                          <CheckCircle2
                            style={{ width: 18, height: 18, color: 'var(--success)' }}
                          />
                        ) : tr.status === 'in_progress' ? (
                          <TrendingUp
                            style={{ width: 18, height: 18, color: 'var(--warning)' }}
                          />
                        ) : (
                          <Clock style={{ width: 18, height: 18, color: 'var(--muted)' }} />
                        )}
                      </div>

                      {/* Module info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: 'var(--text-primary)',
                            margin: '0 0 2px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {tr.moduleName}
                        </p>
                        <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>
                          {tr.completedAt ? `Tugatildi: ${formatDate(tr.completedAt)}` : 'Hali tugatilmagan'}
                        </p>
                      </div>

                      {/* Progress (if in_progress) + badge */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                        {tr.status === 'in_progress' && tr.progress !== undefined && (
                          <div style={{ width: 60 }}>
                            <Progress value={tr.progress} style={{ height: 6 }} />
                            <p style={{ fontSize: 10, color: 'var(--muted)', textAlign: 'center', margin: '2px 0 0' }}>
                              {tr.progress}%
                            </p>
                          </div>
                        )}
                        <Badge
                          variant={
                            tr.status === 'completed'
                              ? 'success'
                              : tr.status === 'in_progress'
                              ? 'warning'
                              : 'secondary'
                          }
                        >
                          {tr.status === 'completed'
                            ? 'Bajarildi'
                            : tr.status === 'in_progress'
                            ? 'Davom etmoqda'
                            : 'Boshlanmagan'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          {(activities ?? []).length > 0 && (
            <Card>
              <CardHeader style={{ paddingBottom: 0 }}>
                <CardTitle style={{ fontSize: 14 }}>So&apos;nggi faollik</CardTitle>
              </CardHeader>
              <CardContent style={{ padding: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {(activities ?? []).slice(0, 6).map((act, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 12,
                        padding: '10px 0',
                        borderBottom: i < Math.min((activities ?? []).length, 6) - 1 ? '1px solid var(--border)' : 'none',
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          marginTop: 5,
                          flexShrink: 0,
                          backgroundColor:
                            act.type === 'click' ? 'var(--danger)' :
                            act.type === 'training_complete' ? 'var(--success)' :
                            'var(--accent)',
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13, color: 'var(--text-primary)', margin: '0 0 2px', fontWeight: 500 }}>
                          {act.description}
                        </p>
                        <p style={{ fontSize: 11, color: 'var(--muted)', margin: 0 }}>
                          {formatDate(act.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
