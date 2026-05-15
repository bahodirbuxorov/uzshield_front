'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Mail, MessageSquare, Smartphone, Send, MousePointer, GraduationCap, MoreHorizontal, Play } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { fmtPercent, formatDate } from '@/lib/utils/formatters'
import type { Campaign, CampaignStatus, CampaignChannel } from '@/lib/types/campaign'

const CHANNEL_ICONS: Record<CampaignChannel, React.ElementType> = {
  email: Mail,
  telegram: MessageSquare,
  sms: Smartphone,
}

const STATUS_COLORS: Record<CampaignStatus, { bg: string; text: string; label: string }> = {
  active: { bg: 'var(--success-light)', text: 'var(--success)', label: 'Faol' },
  running: { bg: 'var(--success-light)', text: 'var(--success)', label: 'Faol' },
  paused: { bg: 'var(--warning-light)', text: 'var(--warning)', label: "To'xtatilgan" },
  completed: { bg: 'var(--surface-secondary)', text: 'var(--muted)', label: 'Yakunlangan' },
  draft: { bg: '#F1F5F9', text: '#475569', label: 'Qoralama' },
}

const STATUS_STRIP: Record<CampaignStatus, string> = {
  active: 'var(--success)',
  running: 'var(--success)',
  paused: 'var(--warning)',
  completed: 'var(--muted)',
  draft: 'var(--border)',
}

interface CampaignCardProps {
  campaign: Campaign
  index?: number
}

export function CampaignCard({ campaign, index = 0 }: CampaignCardProps) {
  const t = useTranslations('campaigns')
  const locale = useLocale()
  const status = STATUS_COLORS[campaign.status] || STATUS_COLORS.draft

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: 'easeOut' }}
      style={{ height: '100%' }}
    >
      <Card
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'box-shadow 0.2s, transform 0.2s',
          cursor: 'default',
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'
          ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLElement).style.boxShadow = ''
          ;(e.currentTarget as HTMLElement).style.transform = ''
        }}
      >
        {/* Status strip top */}
        <div style={{ height: 4, backgroundColor: STATUS_STRIP[campaign.status], flexShrink: 0 }} />

        <CardContent
          style={{
            padding: 18,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            flex: 1,
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
            <Link
              href={`/${locale}/campaigns/${campaign.id}`}
              style={{
                fontWeight: 600,
                fontSize: 14,
                color: 'var(--text-primary)',
                textDecoration: 'none',
                lineHeight: 1.4,
                flex: 1,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--accent)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)' }}
            >
              {campaign.name}
            </Link>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '3px 10px',
                borderRadius: 20,
                backgroundColor: status.bg,
                fontSize: 11,
                fontWeight: 600,
                color: status.text,
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {campaign.status === 'active' && (
                <span
                  style={{
                    width: 6, height: 6, borderRadius: '50%',
                    backgroundColor: status.text, flexShrink: 0,
                    animation: 'pulse 2s infinite',
                  }}
                />
              )}
              {status.label}
            </div>
          </div>

          {/* Channel badges + difficulty */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            {(campaign.channels ?? []).map((ch) => {
              const Icon = CHANNEL_ICONS[ch]
              return (
                <div
                  key={ch}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '3px 8px', borderRadius: 6,
                    backgroundColor: 'var(--surface-secondary)',
                    fontSize: 11, color: 'var(--text-secondary)',
                  }}
                >
                  <Icon style={{ width: 12, height: 12 }} />
                  <span style={{ textTransform: 'capitalize' }}>{ch}</span>
                </div>
              )
            })}
            <div
              style={{
                marginLeft: 'auto',
                fontSize: 11,
                color: 'var(--muted)',
                padding: '3px 8px',
                borderRadius: 6,
                border: '1px solid var(--border)',
              }}
            >
              {t('difficulty.' + campaign.difficulty as Parameters<typeof t>[0])}
            </div>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 8,
              padding: '12px 0 8px',
              borderTop: '1px solid var(--border)',
            }}
          >
            {[
              { Icon: Send, label: t('form.sent'), value: campaign.sentCount ?? 0, color: 'var(--text-primary)' },
              { Icon: MousePointer, label: t('form.clicked'), value: campaign.clickRate != null ? fmtPercent(campaign.clickRate) : '0%', color: 'var(--danger)' },
              { Icon: GraduationCap, label: t('form.trained'), value: campaign.completedTrainingCount ?? 0, color: 'var(--success)' },
            ].map(({ Icon, label, value, color }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, marginBottom: 4 }}>
                  <Icon style={{ width: 11, height: 11, color: 'var(--muted)' }} />
                  <span style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {label}
                  </span>
                </div>
                <p style={{ fontSize: 15, fontWeight: 700, color, margin: 0, fontFamily: 'var(--font-display)' }}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
            <p style={{ fontSize: 11, color: 'var(--muted)', margin: 0 }}>
              {formatDate(campaign.startedAt || campaign.starts_at || campaign.created_at)}
            </p>
            <Link
              href={`/${locale}/campaigns/${campaign.id}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 12, color: 'var(--accent)',
                textDecoration: 'none', fontWeight: 500,
                padding: '4px 10px', borderRadius: 6,
                border: '1px solid var(--border)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent)'
                ;(e.currentTarget as HTMLElement).style.color = 'white'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
                ;(e.currentTarget as HTMLElement).style.color = 'var(--accent)'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
              }}
            >
              <Play style={{ width: 11, height: 11 }} />
              Ko&apos;rish
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
