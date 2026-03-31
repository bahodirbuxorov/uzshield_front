'use client'

import { useTranslations } from 'next-intl'
import { Mail, MessageSquare, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { CampaignChannel } from '@/lib/types/campaign'

const CHANNELS: { key: CampaignChannel; icon: React.ElementType; color: string; bg: string }[] = [
  { key: 'email', icon: Mail, color: 'text-[var(--accent)]', bg: 'bg-blue-50 border-blue-200 hover:border-[var(--accent)]' },
  { key: 'telegram', icon: MessageSquare, color: 'text-sky-500', bg: 'bg-sky-50 border-sky-200 hover:border-sky-400' },
  { key: 'sms', icon: Smartphone, color: 'text-[var(--success)]', bg: 'bg-[var(--success-light)] border-green-200 hover:border-[var(--success)]' },
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
      {CHANNELS.map(({ key, icon: Icon, color, bg }) => {
        const isSelected = selected.includes(key)
        return (
          <button
            key={key}
            type="button"
            id={`channel-${key}`}
            onClick={() => onToggle(key)}
            aria-pressed={isSelected}
            aria-label={t(`channel.${key}` as Parameters<typeof t>[0])}
            className={cn(
              'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-150',
              isSelected
                ? `${bg} ${color} border-opacity-100 shadow-sm ring-2 ring-offset-1`
                : `bg-white border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface-secondary)] ${bg}`,
              isSelected ? 'ring-[var(--accent)]' : 'ring-transparent'
            )}
          >
            <Icon className={cn('w-7 h-7', isSelected ? color : 'text-[var(--muted)]')} />
            <span className={cn('text-sm font-medium capitalize', isSelected ? color : 'text-[var(--text-secondary)]')}>
              {t(`channel.${key}` as Parameters<typeof t>[0])}
            </span>
          </button>
        )
      })}
    </div>
  )
}
