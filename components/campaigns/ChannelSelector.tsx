'use client'

import { useTranslations } from 'next-intl'
import { Mail, MessageSquare, Smartphone } from 'lucide-react'
import type { CampaignChannel } from '@/lib/types/campaign'

const CHANNELS: { key: CampaignChannel; icon: React.ElementType; tone: string }[] = [
  { key: 'email',    icon: Mail,          tone: '#00FF94' },
  { key: 'telegram', icon: MessageSquare, tone: '#00E5FF' },
  { key: 'sms',      icon: Smartphone,    tone: '#B847FF' },
]

interface ChannelSelectorProps {
  selected: CampaignChannel[]
  onToggle: (channel: CampaignChannel) => void
}

/** Card-style channel selector for the campaign wizard */
export function ChannelSelector({ selected, onToggle }: ChannelSelectorProps) {
  const t = useTranslations('campaigns')

  return (
    <div className="grid grid-cols-3 gap-3">
      {CHANNELS.map(({ key, icon: Icon, tone }) => {
        const isSelected = selected.includes(key)
        return (
          <button
            key={key}
            type="button"
            id={`channel-${key}`}
            onClick={() => onToggle(key)}
            aria-pressed={isSelected}
            aria-label={t(`channel.${key}` as Parameters<typeof t>[0])}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              padding: '18px 12px',
              borderRadius: 4,
              border: '1px solid',
              borderColor: isSelected ? `${tone}80` : 'var(--border)',
              backgroundColor: isSelected ? `${tone}14` : 'var(--surface)',
              color: isSelected ? tone : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.15s',
              boxShadow: isSelected ? `0 0 18px ${tone}33, inset 0 0 0 1px ${tone}40` : 'none',
              position: 'relative',
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)'
                ;(e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-secondary)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
                ;(e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface)'
              }
            }}
          >
            <Icon style={{ width: 26, height: 26 }} />
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              {t(`channel.${key}` as Parameters<typeof t>[0])}
            </span>
          </button>
        )
      })}
    </div>
  )
}
