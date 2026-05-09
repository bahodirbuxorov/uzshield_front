'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate, fmtPercent } from '@/lib/utils/formatters'
import type { Campaign, CampaignStatus } from '@/lib/types/campaign'

const STATUS_VARIANT: Record<CampaignStatus, 'success' | 'warning' | 'secondary' | 'default'> = {
  active: 'success',
  paused: 'warning',
  completed: 'secondary',
  draft: 'default',
}

interface RecentCampaignsProps {
  campaigns: Campaign[]
  loading?: boolean
}

/** Table of last 5 campaigns for the dashboard */
export function RecentCampaigns({ campaigns, loading }: RecentCampaignsProps) {
  const t = useTranslations('dashboard')
  const tCampaign = useTranslations('campaigns')
  const locale = useLocale()

  if (loading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-5 w-40" /></CardHeader>
        <CardContent className="space-y-3">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('recentCampaigns')}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label="Recent campaigns">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wide">
                  {tCampaign('form.name')}
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wide hidden sm:table-cell">
                  {tCampaign('channel.all')}
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wide hidden md:table-cell">
                  {tCampaign('clickRate')}
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wide">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-secondary)] transition-colors"
                >
                  <td className="px-6 py-3">
                    <Link
                      href={`/${locale}/campaigns/${campaign.id}`}
                      className="font-medium text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
                    >
                      {campaign.name}
                    </Link>
                    <p className="text-xs text-[var(--muted)] mt-0.5">{formatDate(campaign.startedAt)}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="flex gap-1 flex-wrap">
                      {(campaign.channels ?? []).map((ch) => (
                        <Badge key={ch} variant="outline" className="capitalize text-xs">{ch}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell font-semibold text-[var(--text-primary)]">
                    {campaign.clickRate != null ? fmtPercent(campaign.clickRate) : '0%'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_VARIANT[campaign.status]}>
                      {tCampaign(`status.${campaign.status}` as Parameters<typeof tCampaign>[0])}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
