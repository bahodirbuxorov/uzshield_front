'use client'

import { useTranslations } from 'next-intl'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { AnalyticsDashboard } from '@/lib/api/reports'

const RISK_COLORS: Record<string, string> = {
  low: '#00FF94',
  medium: '#FFB020',
  high: '#FF3B5C',
  critical: '#B847FF',
}

interface RiskChartProps {
  trendData: NonNullable<AnalyticsDashboard['campaign_trend']>
  riskData: AnalyticsDashboard['risk_distribution'] | null
  loading?: boolean
}

/**
 * Two-chart panel: phishing click rate line chart + risk distribution donut.
 */
export function RiskChart({ trendData, riskData, loading }: RiskChartProps) {
  const t = useTranslations('dashboard')
  const tEmployee = useTranslations('employees')

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6"><Skeleton className="h-64 w-full" /></Card>
        <Card className="p-6"><Skeleton className="h-64 w-full" /></Card>
      </div>
    )
  }

  const totalRiskCount = riskData ? (riskData.low + riskData.medium + riskData.high + riskData.critical) : 0
  const riskArray = riskData && totalRiskCount > 0 ? [
    { level: 'low', count: riskData.low, percentage: Math.round((riskData.low / totalRiskCount) * 100) },
    { level: 'medium', count: riskData.medium, percentage: Math.round((riskData.medium / totalRiskCount) * 100) },
    { level: 'high', count: riskData.high, percentage: Math.round((riskData.high / totalRiskCount) * 100) },
    { level: 'critical', count: riskData.critical, percentage: Math.round((riskData.critical / totalRiskCount) * 100) },
  ].filter(r => r.count > 0) : []

  const axisTick = { fontSize: 11, fill: 'var(--muted)', fontFamily: 'var(--font-mono)' }
  const tooltipStyle = {
    backgroundColor: 'var(--surface-elevated)',
    border: '1px solid var(--border-strong)',
    borderRadius: 4,
    fontSize: 12,
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-mono)',
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Line Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className="live-dot" style={{ width: 6, height: 6 }} />
            {t('clickRateTrend')}
          </CardTitle>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--muted)',
              letterSpacing: '0.08em',
            }}
          >
            [ time-series ]
          </span>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData} margin={{ top: 4, right: 16, bottom: 4, left: -16 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={axisTick} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
              <YAxis tick={axisTick} axisLine={false} tickLine={false} unit="%" />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ stroke: 'var(--accent)', strokeOpacity: 0.3, strokeDasharray: '3 3' }}
                formatter={(v) => `${v}%`}
              />
              <Legend
                wrapperStyle={{
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--text-secondary)',
                }}
              />
              <Line
                type="monotone"
                dataKey="click_rate"
                stroke="var(--danger)"
                strokeWidth={2}
                dot={{ r: 3, fill: 'var(--danger)', stroke: 'var(--background)' }}
                activeDot={{ r: 5, fill: 'var(--danger)', stroke: 'var(--background)', strokeWidth: 2 }}
                name="Click Rate"
              />
              <Line
                type="monotone"
                dataKey="training_rate"
                stroke="var(--accent)"
                strokeWidth={2}
                dot={{ r: 3, fill: 'var(--accent)', stroke: 'var(--background)' }}
                activeDot={{ r: 5, fill: 'var(--accent)', stroke: 'var(--background)', strokeWidth: 2 }}
                name="Trained Rate"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Donut Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: 'var(--critical)',
                boxShadow: '0 0 8px var(--critical)',
              }}
            />
            {t('riskDistribution')}
          </CardTitle>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--muted)',
              letterSpacing: '0.08em',
            }}
          >
            n = {totalRiskCount}
          </span>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie
                  data={riskArray}
                  dataKey="count"
                  nameKey="level"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  stroke="var(--background-deep)"
                  strokeWidth={2}
                >
                  {riskArray.map((entry) => (
                    <Cell key={entry.level} fill={RISK_COLORS[entry.level]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v, name) => [`${v} employees`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1">
              {riskArray.length === 0 ? (
                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--muted)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {'// no data'}
                </div>
              ) : riskArray.map((entry) => (
                <div
                  key={entry.level}
                  className="flex items-center justify-between"
                  style={{
                    padding: '6px 10px',
                    border: '1px solid var(--border)',
                    borderRadius: 4,
                    backgroundColor: 'var(--surface-secondary)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 2,
                        backgroundColor: RISK_COLORS[entry.level],
                        boxShadow: `0 0 8px ${RISK_COLORS[entry.level]}80`,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 11,
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--text-secondary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                      }}
                    >
                      {tEmployee(`riskLevel.${entry.level}` as Parameters<typeof tEmployee>[0])}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 13,
                      fontWeight: 700,
                      color: RISK_COLORS[entry.level],
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {entry.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
