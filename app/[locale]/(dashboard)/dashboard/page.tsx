'use client'

import { useTranslations } from 'next-intl'
import { Users, Activity, AlertTriangle, GraduationCap } from 'lucide-react'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { RiskChart } from '@/components/dashboard/RiskChart'
import { RecentCampaigns } from '@/components/dashboard/RecentCampaigns'
import { TopVulnerableEmployees } from '@/components/dashboard/TopVulnerableEmployees'
import { useAnalytics } from '@/lib/hooks/useReports'
import { useCampaigns } from '@/lib/hooks/useCampaigns'
import { useEmployees } from '@/lib/hooks/useEmployees'

export default function DashboardPage() {
  const t = useTranslations('dashboard')

  const { data: analytics, isLoading: analyticsLoading } = useAnalytics()
  const { data: campaignData, isLoading: campaignLoading } = useCampaigns()
  const { data: employeeData, isLoading: employeeLoading } = useEmployees({ status: 'active' })

  const topVulnerable = (employeeData?.data ?? []).slice(0, 5)

  const activeCampaigns = (campaignData?.data ?? []).filter(
    (c) => c.status === 'running' || c.status === 'scheduled'
  ).length
  const totalEmployees = employeeData?.meta?.total ?? (employeeData?.data ?? []).length

  return (
    <div className="page-container">
      {/* Stats Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 16,
        }}
      >
        <StatsCard
          title={t('totalEmployees')}
          value={totalEmployees}
          trend={5}
          trendLabel={t('vsLastMonth')}
          icon={Users}
          iconBg="bg-blue-50"
          iconColor="text-[var(--accent)]"
          loading={employeeLoading}
          index={0}
        />
        <StatsCard
          title={t('activeCampaigns')}
          value={activeCampaigns}
          icon={Activity}
          iconBg="bg-[var(--success-light)]"
          iconColor="text-[var(--success)]"
          loading={campaignLoading}
          index={1}
        />
        <StatsCard
          title={t('avgRiskScore')}
          value={analytics?.overall_click_rate != null ? `${analytics.overall_click_rate.toFixed(1)}%` : '–'}
          trend={-3.2}
          trendLabel={t('vsLastMonth')}
          icon={AlertTriangle}
          iconBg="bg-[var(--warning-light)]"
          iconColor="text-amber-500"
          loading={analyticsLoading}
          index={2}
        />
        <StatsCard
          title={t('trainingsThisMonth')}
          value={analytics?.overall_training_rate != null ? `${analytics.overall_training_rate.toFixed(0)}%` : '–'}
          trend={8}
          trendLabel={t('vsLastMonth')}
          icon={GraduationCap}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          loading={analyticsLoading}
          index={3}
        />
      </div>

      {/* Charts */}
      <RiskChart
        trendData={analytics?.campaign_trend ?? []}
        riskData={analytics?.risk_distribution ?? null}
        loading={analyticsLoading}
      />

      {/* Bottom Row - responsive 3-col layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 24,
          alignItems: 'start',
        }}
      >
        <div style={{ gridColumn: 'span 2' }}>
          <RecentCampaigns
            campaigns={(campaignData?.data ?? []).slice(0, 5)}
            loading={campaignLoading}
          />
        </div>
        <TopVulnerableEmployees employees={topVulnerable} loading={employeeLoading} />
      </div>
    </div>
  )
}
