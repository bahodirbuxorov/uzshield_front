'use client'

import { useTranslations } from 'next-intl'
import { Download } from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/shared/PageHeader'
import { PageLoader } from '@/components/shared/LoadingSpinner'
import { useAnalytics } from '@/lib/hooks/useReports'

export default function ReportsPage() {
  const t = useTranslations('reports')
  const { data: analytics, isLoading } = useAnalytics()

  if (isLoading) return <PageLoader />

  const summaryCards = [
    { label: 'Click Rate', value: analytics?.overall_click_rate != null ? `${analytics.overall_click_rate.toFixed(1)}%` : '—', color: 'var(--danger)' },
    { label: 'Training Rate', value: analytics?.overall_training_rate != null ? `${analytics.overall_training_rate.toFixed(1)}%` : '—', color: 'var(--success)' },
    { label: 'Active Campaigns', value: analytics?.active_campaigns ?? '—', color: 'var(--accent)' },
    { label: 'Total Employees', value: analytics?.total_employees ?? '—', color: 'var(--text-primary)' },
  ]

  const departmentStats = analytics?.department_stats ?? []
  const campaignTrend = analytics?.campaign_trend ?? []

  return (
    <div className="page-container">
      <PageHeader
        title={t('title')}
        actions={
          <Button variant="outline" size="sm" id="export-pdf-btn">
            <Download style={{ width: 16, height: 16 }} />
            {t('exportPdf')}
          </Button>
        }
      />

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
        {summaryCards.map((s, i) => (
          <div
            key={i}
            style={{
              backgroundColor: 'white',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: 20,
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}
          >
            <p style={{ fontSize: 26, fontWeight: 700, color: s.color, margin: '0 0 4px', fontFamily: 'var(--font-display)' }}>
              {s.value}
            </p>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 24 }}>
        {/* Campaign trend chart */}
        <Card>
          <CardHeader><CardTitle style={{ fontSize: 14 }}>{t('clickRateTrend')}</CardTitle></CardHeader>
          <CardContent>
            {campaignTrend.length === 0 ? (
              <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: 13 }}>
                Ma&apos;lumot yo&apos;q
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={campaignTrend} margin={{ top: 4, right: 16, bottom: 4, left: -16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--muted)' }} unit="%" />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(v) => `${v}%`} />
                  <Line type="monotone" dataKey="click_rate" stroke="var(--danger)" strokeWidth={2} dot={false} name="Click Rate" />
                  <Line type="monotone" dataKey="training_rate" stroke="var(--success)" strokeWidth={2} dot={false} name="Training" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Department risk chart */}
        <Card>
          <CardHeader><CardTitle style={{ fontSize: 14 }}>{t('riskByDepartment')}</CardTitle></CardHeader>
          <CardContent>
            {departmentStats.length === 0 ? (
              <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: 13 }}>
                Ma&apos;lumot yo&apos;q
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={departmentStats} margin={{ top: 4, right: 16, bottom: 4, left: -16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="department" tick={{ fontSize: 10, fill: 'var(--muted)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--muted)' }} />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="avg_risk_score" fill="var(--accent)" radius={[4, 4, 0, 0]} name="Risk Score" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Click rate by department */}
        <Card>
          <CardHeader><CardTitle style={{ fontSize: 14 }}>{t('channelEffectiveness')}</CardTitle></CardHeader>
          <CardContent>
            {departmentStats.length === 0 ? (
              <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: 13 }}>
                Ma&apos;lumot yo&apos;q
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={departmentStats} margin={{ top: 4, right: 16, bottom: 4, left: -16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="department" tick={{ fontSize: 11, fill: 'var(--muted)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--muted)' }} unit="%" />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(v) => `${v}%`} />
                  <Bar dataKey="click_rate" fill="var(--danger)" radius={[4, 4, 0, 0]} name="Click Rate" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Training rate trend */}
        <Card>
          <CardHeader><CardTitle style={{ fontSize: 14 }}>{t('trainingCompletion')}</CardTitle></CardHeader>
          <CardContent>
            {campaignTrend.length === 0 ? (
              <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: 13 }}>
                Ma&apos;lumot yo&apos;q
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={campaignTrend} margin={{ top: 4, right: 16, bottom: 4, left: -16 }}>
                  <defs>
                    <linearGradient id="trainGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--success)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--success)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--muted)' }} unit="%" />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(v) => `${v}%`} />
                  <Area type="monotone" dataKey="training_rate" stroke="var(--success)" strokeWidth={2} fill="url(#trainGrad)" name="Training Rate" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Department Summary Table */}
      <Card>
        <CardHeader><CardTitle style={{ fontSize: 14 }}>{t('departmentSummary')}</CardTitle></CardHeader>
        <CardContent style={{ padding: 0 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface-secondary)' }}>
                  {['Department', 'Employees', 'Avg Risk', 'Click Rate', 'Training Rate'].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {departmentStats.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: 32, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
                      Ma&apos;lumot yo&apos;q
                    </td>
                  </tr>
                ) : (
                  departmentStats.map((r) => (
                    <tr key={r.department} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--text-primary)' }}>{r.department}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{r.employee_count}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: r.avg_risk_score > 60 ? 'var(--danger)' : r.avg_risk_score > 40 ? '#F59E0B' : 'var(--success)' }}>
                        {r.avg_risk_score.toFixed(0)}
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--danger)', fontWeight: 600 }}>{r.click_rate.toFixed(1)}%</td>
                      <td style={{ padding: '12px 16px', color: 'var(--success)', fontWeight: 600 }}>{r.training_rate.toFixed(1)}%</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
