'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Mail, MessageSquare, Smartphone, Send, MousePointer, GraduationCap, Play } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { fmtPercent, formatDate } from '@/lib/utils/formatters'
import type { Campaign, CampaignStatus, CampaignChannel } from '@/lib/types/campaign'

const CHANNEL_ICONS: Record<CampaignChannel, React.ElementType> = {
  email: Mail,
  telegram: MessageSquare,
  sms: Smartphone,
}

const STATUS_COLORS: Record<CampaignStatus, { bg: string; text: string; border: string; label: string }> = {
  running:   { bg: 'rgba(0,255,148,0.10)',  text: '#00FF94', border: 'rgba(0,255,148,0.35)', label: 'LIVE' },
  scheduled: { bg: 'rgba(0,229,255,0.10)',  text: '#00E5FF', border: 'rgba(0,229,255,0.35)', label: 'SCHEDULED' },
  cancelled: { bg: 'rgba(255,59,92,0.12)',  text: '#FF3B5C', border: 'rgba(255,59,92,0.30)', label: 'CANCELLED' },
  completed: { bg: 'var(--surface-secondary)', text: 'var(--muted)', border: 'var(--border)', label: 'DONE' },
  draft:     { bg: 'var(--surface-secondary)', text: 'var(--text-secondary)', border: 'var(--border)', label: 'DRAFT' },
}

const STATUS_STRIP: Record<CampaignStatus, string> = {
  running:   'var(--accent)',
  scheduled: 'var(--cyan)',
  cancelled: 'var(--danger)',
  completed: 'var(--muted)',
  draft:     'var(--border-strong)',
}

interface CampaignCardProps {
  campaign: Campaign
  index?: number
}

export function CampaignCard({ campaign, index = 0 }: CampaignCardProps) {
  const t = useTranslations('campaigns')
  const locale = useLocale()
  const status = STATUS_COLORS[campaign.status] || STATUS_COLORS.draft
  const stripColor = STATUS_STRIP[campaign.status]

  // fake hex id from campaign id
  const idHex = String(campaign.id ?? '0000').slice(-4).padStart(4, '0').toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: 'easeOut' }}
      style={{ height: '100%' }}
      whileHover={{ y: -2 }}
    >
      <Card
        className="cyber-corners"
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          cursor: 'default',
          position: 'relative',
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border-accent)'
          ;(e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card-hover)'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
          ;(e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card)'
        }}
      >
        {/* Glowing left strip */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: 2,
            backgroundColor: stripColor,
            boxShadow: `0 0 12px ${stripColor}`,
          }}
        />

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
            <div style={{ flex: 1, minWidth: 0 }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: 'var(--muted)',
                  letterSpacing: '0.1em',
                  display: 'block',
                  marginBottom: 4,
                }}
              >
                CMP-{idHex}
              </span>
              <Link
                href={`/${locale}/campaigns/${campaign.id}`}
                className="text-clamp-2 text-break-anywhere"
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  lineHeight: 1.4,
                  transition: 'color 0.15s',
                }}
                title={campaign.name}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--accent)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)' }}
              >
                {campaign.name}
              </Link>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '3px 8px',
                borderRadius: 3,
                backgroundColor: status.bg,
                border: `1px solid ${status.border}`,
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                fontWeight: 700,
                color: status.text,
                whiteSpace: 'nowrap',
                flexShrink: 0,
                letterSpacing: '0.08em',
              }}
            >
              {campaign.status === 'running' && (
                <span
                  className="live-dot"
                  style={{ width: 5, height: 5, backgroundColor: status.text }}
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
                    padding: '3px 8px', borderRadius: 3,
                    backgroundColor: 'var(--surface-secondary)',
                    border: '1px solid var(--border)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10, color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  <Icon style={{ width: 11, height: 11 }} />
                  <span>{ch}</span>
                </div>
              )
            })}
            <div
              style={{
                marginLeft: 'auto',
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--muted)',
                padding: '3px 8px',
                borderRadius: 3,
                border: '1px solid var(--border)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {t(('difficulty.' + (campaign.difficulty ?? 'medium')) as Parameters<typeof t>[0])}
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
              { Icon: GraduationCap, label: t('form.trained'), value: campaign.completedTrainingCount ?? 0, color: 'var(--accent)' },
            ].map(({ Icon, label, value, color }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, marginBottom: 4 }}>
                  <Icon style={{ width: 10, height: 10, color: 'var(--muted)' }} />
                  <span
                    style={{
                      fontSize: 9,
                      color: 'var(--muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {label}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color,
                    margin: 0,
                    fontFamily: 'var(--font-mono)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
            <p
              style={{
                fontSize: 10,
                color: 'var(--muted)',
                margin: 0,
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.04em',
              }}
            >
              {formatDate(campaign.startedAt || campaign.starts_at || campaign.created_at)}
            </p>
            <Link
              href={`/${locale}/campaigns/${campaign.id}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                color: 'var(--accent)',
                textDecoration: 'none',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                padding: '5px 10px',
                borderRadius: 3,
                border: '1px solid var(--border-accent)',
                backgroundColor: 'var(--accent-tint)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent)'
                ;(e.currentTarget as HTMLElement).style.color = '#021A0E'
                ;(e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-glow-accent)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent-tint)'
                ;(e.currentTarget as HTMLElement).style.color = 'var(--accent)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = ''
              }}
            >
              <Play style={{ width: 10, height: 10 }} />
              inspect
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
