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
import type { ChartDataPoint, RiskDistribution } from '@/lib/types/report'

const RISK_COLORS: Record<string, string> = {
  low: '#00B37E',
  medium: '#F59E0B',
  high: '#EF4444',
  critical: '#7C3AED',
}

interface RiskChartProps {
  trendData: ChartDataPoint[]
  riskData: RiskDistribution[]
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('clickRateTrend')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData} margin={{ top: 4, right: 16, bottom: 4, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--muted)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--muted)' }} unit="%" />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', fontSize: 12 }}
                formatter={(v) => `${v}%`}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="clickRate"
                stroke="var(--danger)"
                strokeWidth={2.5}
                dot={{ r: 4, fill: 'var(--danger)' }}
                name="Click Rate"
              />
              <Line
                type="monotone"
                dataKey="trainedRate"
                stroke="var(--success)"
                strokeWidth={2.5}
                dot={{ r: 4, fill: 'var(--success)' }}
                name="Trained Rate"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Donut Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('riskDistribution')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie
                  data={riskData}
                  dataKey="count"
                  nameKey="level"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {riskData.map((entry) => (
                    <Cell key={entry.level} fill={RISK_COLORS[entry.level]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', fontSize: 12 }}
                  formatter={(v, name) => [`${v} employees`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1">
              {riskData.map((entry) => (
                <div key={entry.level} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: RISK_COLORS[entry.level] }}
                    />
                    <span className="text-[var(--text-secondary)] capitalize">
                      {tEmployee(`riskLevel.${entry.level}` as Parameters<typeof tEmployee>[0])}
                    </span>
                  </div>
                  <span className="font-semibold text-[var(--text-primary)]">{entry.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
