'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { Plus, Search, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { CampaignCard } from '@/components/campaigns/CampaignCard'
import { Skeleton } from '@/components/ui/skeleton'
import { useCampaigns } from '@/lib/hooks/useCampaigns'
import { useCampaignStore } from '@/lib/store/useCampaignStore'
import { DEFAULT_PAGE_SIZE } from '@/lib/constants'

export default function CampaignsPage() {
  const t = useTranslations('campaigns')
  const tCommon = useTranslations('common')
  const locale = useLocale()
  const router = useRouter()

  const { statusFilter, channelFilter, currentPage, setStatusFilter, setChannelFilter, setCurrentPage } = useCampaignStore()
  const [search, setSearch] = useState('')

  const { data, isLoading } = useCampaigns(
    statusFilter !== 'all' ? { status: statusFilter } : undefined
  )

  const totalPages = Math.ceil((data?.meta?.total ?? (data?.data ?? []).length) / DEFAULT_PAGE_SIZE)

  const filtered = (data?.data ?? []).filter((c) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-container">
      <PageHeader
        title={t('title')}
        actions={
          <Button asChild id="new-campaign-btn">
            <Link href={`/${locale}/campaigns/new`}>
              <Plus style={{ width: 16, height: 16 }} />
              {t('newCampaign')}
            </Link>
          </Button>
        }
      />

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        {/* Search with icon */}
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: 320 }}>
          <Search
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 16,
              height: 16,
              color: 'var(--muted)',
              pointerEvents: 'none',
            }}
          />
          <input
            id="campaign-search"
            type="text"
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              height: 36,
              paddingLeft: 36,
              paddingRight: 12,
              fontSize: 13,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-primary)',
              backgroundColor: 'var(--surface-secondary)',
              border: '1px solid var(--border-strong)',
              borderRadius: 4,
              outline: 'none',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,255,148,0.15)' }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--border-strong)'; e.target.style.boxShadow = 'none' }}
          />
        </div>

        <div style={{ flex: '0 0 auto', minWidth: 160 }}>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
            <SelectTrigger id="status-filter">
              <SelectValue placeholder={t('status.all')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('status.all')}</SelectItem>
              <SelectItem value="active">{t('status.active')}</SelectItem>
              <SelectItem value="draft">{t('status.draft')}</SelectItem>
              <SelectItem value="paused">{t('status.paused')}</SelectItem>
              <SelectItem value="completed">{t('status.completed')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div style={{ flex: '0 0 auto', minWidth: 160 }}>
          <Select value={channelFilter} onValueChange={setChannelFilter}>
            <SelectTrigger id="channel-filter">
              <SelectValue placeholder={t('channel.all')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('channel.all')}</SelectItem>
              <SelectItem value="email">{t('channel.email')}</SelectItem>
              <SelectItem value="telegram">{t('channel.telegram')}</SelectItem>
              <SelectItem value="sms">{t('channel.sms')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16 }}>
          {[...Array(6)].map((_, i) => <Skeleton key={i} style={{ height: 200 }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Mail style={{ width: 32, height: 32 }} />}
          title={tCommon('noData')}
          actionLabel={t('newCampaign')}
          onAction={() => router.push(`/${locale}/campaigns/new`)}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16 }}>
          {filtered.map((campaign, i) => (
            <CampaignCard key={campaign.id} campaign={campaign} index={i} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {tCommon('back')}
          </Button>
          <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            {tCommon('page')} {currentPage} {tCommon('of')} {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            {tCommon('next')}
          </Button>
        </div>
      )}
    </div>
  )
}
