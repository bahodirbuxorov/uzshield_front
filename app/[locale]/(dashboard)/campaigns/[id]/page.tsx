'use client'

import { use } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowLeft, Send, MousePointer, GraduationCap, Download, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { CampaignStatusBadge } from '@/components/campaigns/CampaignStatus'
import { PageLoader } from '@/components/shared/LoadingSpinner'
import { useCampaign, useCampaignResults, useCampaignTimeline } from '@/lib/hooks/useCampaigns'
import { formatDate, timeAgo, fmtPercent } from '@/lib/utils/formatters'

const EV_ICON: Record<string, React.ElementType> = {
  sent: Send,
  clicked: AlertCircle,
  trained: CheckCircle,
  paused: Clock,
  resumed: Clock,
  completed: CheckCircle,
}

const EV_COLOR: Record<string, string> = {
  sent: 'text-[var(--accent)]',
  clicked: 'text-[var(--danger)]',
  trained: 'text-[var(--success)]',
  paused: 'text-amber-500',
  resumed: 'text-amber-500',
  completed: 'text-[var(--success)]',
}

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const t = useTranslations('campaigns')
  const tCommon = useTranslations('common')
  const locale = useLocale()

  const { data: campaign, isLoading } = useCampaign(id)
  const { data: results } = useCampaignResults(id)
  const { data: timeline } = useCampaignTimeline(id)

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
            {formatDate(campaign.startedAt)} — {campaign.completedAt ? formatDate(campaign.completedAt) : 'Ongoing'}
          </p>
        </div>
        <Button variant="outline" size="sm" id="export-csv">
          <Download className="w-4 h-4" />
          {t('exportCsv')}
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: t('form.sent'), value: campaign.sentCount, icon: Send, color: 'text-[var(--accent)]' },
          { label: t('form.clicked'), value: `${fmtPercent(campaign.clickRate)}`, icon: MousePointer, color: 'text-[var(--danger)]' },
          { label: t('form.trained'), value: campaign.completedTrainingCount, icon: GraduationCap, color: 'text-[var(--success)]' },
        ].map((s) => (
          <Card key={s.label} className="p-4 text-center">
            <s.icon className={`w-6 h-6 mx-auto mb-2 ${s.color}`} />
            <p className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>{s.value}</p>
            <p className="text-xs text-[var(--muted)] mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Results Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle className="text-base">{t('results')}</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase">{tCommon('name')}</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase hidden sm:table-cell">Dept</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase">Clicked</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--muted)] uppercase hidden md:table-cell">Trained</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(results ?? []).map((r) => (
                      <tr key={r.employeeId} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-secondary)]">
                        <td className="px-4 py-3">
                          <p className="font-medium text-[var(--text-primary)]">{r.employeeName}</p>
                          <p className="text-xs text-[var(--muted)]">{r.email}</p>
                        </td>
                        <td className="px-4 py-3 text-[var(--text-secondary)] hidden sm:table-cell">{r.department}</td>
                        <td className="px-4 py-3">
                          {r.clickedAt ? (
                            <Badge variant="danger">Yes</Badge>
                          ) : (
                            <Badge variant="success">No</Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          {r.trainedAt ? <Badge variant="success">Done</Badge> : <Badge variant="secondary">Pending</Badge>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <Card>
          <CardHeader><CardTitle className="text-base">{t('timeline')}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {(timeline ?? []).map((event) => {
              const Icon = EV_ICON[event.type] ?? Clock
              return (
                <div key={event.id} className="flex gap-3">
                  <div className={`mt-0.5 ${EV_COLOR[event.type]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--text-primary)]">{event.description}</p>
                    <p className="text-xs text-[var(--muted)] mt-0.5">{timeAgo(event.timestamp)}</p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
