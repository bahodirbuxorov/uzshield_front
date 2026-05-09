'use client'

import { use } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import {
  ArrowLeft, Send, MousePointer, GraduationCap,
  Download, CheckCircle, XCircle, Clock, Rocket,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageLoader } from '@/components/shared/LoadingSpinner'
import { CampaignStatusBadge } from '@/components/campaigns/CampaignStatus'
import {
  useCampaign,
  useCampaignStatistics,
  useCampaignResults,
  useLaunchCampaign,
} from '@/lib/hooks/useCampaigns'
import { formatDate, fmtPercent } from '@/lib/utils/formatters'

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const t = useTranslations('campaigns')
  const tCommon = useTranslations('common')
  const locale = useLocale()

  const campaignId = Number(id)
  const { data: campaign, isLoading } = useCampaign(campaignId)
  const { data: stats } = useCampaignStatistics(campaignId)
  const { data: results } = useCampaignResults(campaignId)
  const { mutate: launch, isPending: launching } = useLaunchCampaign(campaignId)

  if (isLoading) return <PageLoader />
  if (!campaign) return <div className="page-container text-[var(--danger)]">{tCommon('error')}</div>

  return (
    <div className="page-container">
      {/* Back + Title */}
      <div className="flex items-start gap-4 flex-wrap">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/${locale}/campaigns`}><ArrowLeft className="w-4 h-4" /></Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
              {campaign.name}
            </h2>
            <CampaignStatusBadge status={campaign.status} />
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {campaign.starts_at ? formatDate(campaign.starts_at) : '—'}
            {campaign.ends_at ? ` — ${formatDate(campaign.ends_at)}` : ''}
          </p>
          {campaign.description && (
            <p className="text-sm text-[var(--muted)] mt-1">{campaign.description}</p>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {campaign.status === 'draft' && (
            <Button
              size="sm"
              id="launch-campaign-btn"
              onClick={() => launch()}
              disabled={launching}
            >
              <Rocket className="w-4 h-4" />
              {launching ? 'Ishga tushirilmoqda...' : 'Ishga tushirish'}
            </Button>
          )}
          <Button variant="outline" size="sm" id="export-csv">
            <Download className="w-4 h-4" />
            {t('exportCsv')}
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Yuborildi', value: stats?.sent_count ?? campaign.status, icon: Send, color: 'var(--accent)' },
          { label: 'Bosdi', value: stats?.clicked_count ?? 0, icon: MousePointer, color: 'var(--danger)' },
          { label: 'Trening', value: stats?.trained_count ?? 0, icon: GraduationCap, color: 'var(--success)' },
          {
            label: 'Click Rate',
            value: stats?.click_rate != null ? fmtPercent(stats.click_rate) : '—',
            icon: MousePointer,
            color: 'var(--warning)',
          },
        ].map((s) => (
          <Card key={s.label} style={{ padding: 16, textAlign: 'center' }}>
            <s.icon style={{ width: 24, height: 24, color: s.color, margin: '0 auto 8px' }} />
            <p className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)', margin: '0 0 4px' }}>
              {s.value}
            </p>
            <p className="text-xs text-[var(--muted)]">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Campaign Info + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Results Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle className="text-base">{t('results')}</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface-secondary)' }}>
                      <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>{tCommon('name')}</th>
                      <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>Bo&apos;lim</th>
                      <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>Bosdi</th>
                      <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>Trening</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(results ?? []).length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ padding: 32, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
                          Ma&apos;lumot yo&apos;q
                        </td>
                      </tr>
                    ) : (
                      (results ?? []).map((r) => (
                        <tr key={r.employee_id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '12px 16px' }}>
                            <p style={{ fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>{r.employee_name}</p>
                            <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>{r.email}</p>
                          </td>
                          <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: 13 }}>{r.department ?? '—'}</td>
                          <td style={{ padding: '12px 16px' }}>
                            {r.clicked_at ? (
                              <Badge variant="danger" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                <XCircle style={{ width: 12, height: 12 }} /> Ha
                              </Badge>
                            ) : (
                              <Badge variant="success" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                <CheckCircle style={{ width: 12, height: 12 }} /> Yo&apos;q
                              </Badge>
                            )}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            {r.trained_at ? (
                              <Badge variant="success">Bajarildi</Badge>
                            ) : (
                              <Badge variant="secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                <Clock style={{ width: 12, height: 12 }} /> Kutilmoqda
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Details */}
        <Card>
          <CardHeader><CardTitle className="text-base">Kampaniya ma&apos;lumotlari</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Tur', value: campaign.type },
              { label: 'Landing URL', value: campaign.landing_url ?? '—' },
              { label: 'Mavzu', value: campaign.template_subject ?? '—' },
              { label: 'Boshlanishi', value: campaign.starts_at ? formatDate(campaign.starts_at) : '—' },
              { label: 'Tugashi', value: campaign.ends_at ? formatDate(campaign.ends_at) : '—' },
              { label: 'Yaratildi', value: formatDate(campaign.created_at) },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>{label}</span>
                <span style={{ fontSize: 14, color: 'var(--text-primary)', wordBreak: 'break-all' }}>{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
