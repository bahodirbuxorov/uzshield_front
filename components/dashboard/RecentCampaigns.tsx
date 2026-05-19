'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate, fmtPercent } from '@/lib/utils/formatters'
import type { Campaign, CampaignStatus } from '@/lib/types/campaign'

const STATUS_VARIANT: Record<CampaignStatus, 'success' | 'warning' | 'secondary' | 'default' | 'danger'> = {
  running: 'success',
  scheduled: 'default',
  draft: 'secondary',
  completed: 'secondary',
  cancelled: 'danger',
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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <span className="live-dot" style={{ width: 6, height: 6 }} />
          {t('recentCampaigns')}
        </CardTitle>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--muted)',
            letterSpacing: '0.08em',
          }}
        >
          [{campaigns.length} entries]
        </span>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label="Recent campaigns">
            <thead>
              <tr style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                <th
                  className="text-left px-6 py-3"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    fontWeight: 600,
                    color: 'var(--muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                  }}
                >
                  {tCampaign('form.name')}
                </th>
                <th
                  className="text-left px-4 py-3 hidden sm:table-cell"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    fontWeight: 600,
                    color: 'var(--muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                  }}
                >
                  {tCampaign('channel.all')}
                </th>
                <th
                  className="text-left px-4 py-3 hidden md:table-cell"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    fontWeight: 600,
                    color: 'var(--muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                  }}
                >
                  {tCampaign('clickRate')}
                </th>
                <th
                  className="text-left px-4 py-3"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    fontWeight: 600,
                    color: 'var(--muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                  }}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  className="transition-colors"
                  style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-secondary)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
                >
                  <td className="px-6 py-3">
                    <Link
                      href={`/${locale}/campaigns/${campaign.id}`}
                      style={{
                        fontWeight: 500,
                        color: 'var(--text-primary)',
                        textDecoration: 'none',
                        transition: 'color 0.15s',
                        fontSize: 13,
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--accent)' }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)' }}
                    >
                      {campaign.name}
                    </Link>
                    <p
                      style={{
                        fontSize: 10,
                        color: 'var(--muted)',
                        marginTop: 2,
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {formatDate(campaign.startedAt)}
                    </p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="flex gap-1 flex-wrap">
                      {(campaign.channels ?? []).map((ch) => (
                        <Badge key={ch} variant="outline">{ch}</Badge>
                      ))}
                    </div>
                  </td>
                  <td
                    className="px-4 py-3 hidden md:table-cell"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      color: 'var(--danger)',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
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
