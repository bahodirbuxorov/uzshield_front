'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import type { ElementType } from 'react'

interface StatsCardProps {
  title: string
  value: string | number
  trend?: number
  trendLabel?: string
  icon: ElementType
  iconColor?: string
  iconBg?: string
  loading?: boolean
  index?: number
}

const TONE_MAP: Record<string, { fg: string; glow: string; bg: string }> = {
  'text-[var(--accent)]': {
    fg: 'var(--accent)',
    glow: '0 0 18px rgba(0,255,148,0.35)',
    bg: 'rgba(0,255,148,0.08)',
  },
  'text-[var(--success)]': {
    fg: 'var(--accent)',
    glow: '0 0 18px rgba(0,255,148,0.35)',
    bg: 'rgba(0,255,148,0.08)',
  },
  'text-amber-500': {
    fg: 'var(--warning)',
    glow: '0 0 18px rgba(255,176,32,0.35)',
    bg: 'rgba(255,176,32,0.10)',
  },
  'text-purple-600': {
    fg: 'var(--critical)',
    glow: '0 0 18px rgba(184,71,255,0.35)',
    bg: 'rgba(184,71,255,0.10)',
  },
}

export function StatsCard({
  title,
  value,
  trend,
  trendLabel,
  icon: Icon,
  iconColor,
  loading = false,
  index = 0,
}: StatsCardProps) {
  if (loading) {
    return (
      <div
        className="cyber-corners"
        style={{
          position: 'relative',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 4,
          padding: 20,
        }}
      >
        <Skeleton style={{ height: 14, width: 128, marginBottom: 16 }} />
        <Skeleton style={{ height: 36, width: 96, marginBottom: 8 }} />
        <Skeleton style={{ height: 12, width: 112 }} />
      </div>
    )
  }

  const tone = (iconColor && TONE_MAP[iconColor]) || TONE_MAP['text-[var(--accent)]']

  const trendIcon = trend === undefined ? null : trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus
  const trendColor =
    trend === undefined ? '' :
    trend > 0 ? 'var(--accent)' :
    trend < 0 ? 'var(--danger)' :
    'var(--muted)'
  const TrendIcon = trendIcon

  // Generate a fake hex-ish ID
  const hex = (title.length * 17 + (typeof value === 'string' ? value.length : value) * 31)
    .toString(16)
    .padStart(4, '0')
    .toUpperCase()
    .slice(0, 4)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      className="cyber-corners"
      style={{
        position: 'relative',
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 4,
        padding: 20,
        overflow: 'hidden',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border-accent)'
        ;(e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 1px ${tone.fg}33, 0 8px 28px -12px ${tone.fg}40`
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
        ;(e.currentTarget as HTMLElement).style.boxShadow = ''
      }}
    >
      {/* corner hex id */}
      <span
        style={{
          position: 'absolute',
          top: 8,
          right: 10,
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          letterSpacing: '0.1em',
          color: 'var(--muted)',
          opacity: 0.7,
        }}
      >
        0x{hex}
      </span>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--muted)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          {title}
        </span>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: 4,
            backgroundColor: tone.bg,
            border: `1px solid ${tone.fg}40`,
            boxShadow: tone.glow,
            flexShrink: 0,
          }}
        >
          <Icon style={{ width: 18, height: 18, color: tone.fg }} />
        </div>
      </div>

      {/* Value */}
      <p
        style={{
          fontSize: 32,
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: 0,
          fontFamily: 'var(--font-mono)',
          lineHeight: 1,
          letterSpacing: '-0.02em',
          marginBottom: trend !== undefined ? 8 : 0,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </p>

      {/* Trend */}
      {trend !== undefined && TrendIcon && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            color: trendColor,
            letterSpacing: '0.04em',
          }}
        >
          <TrendIcon style={{ width: 12, height: 12 }} />
          <span>
            {trend > 0 ? '+' : ''}{Math.abs(trend)}%
          </span>
          <span style={{ color: 'var(--muted)', textTransform: 'uppercase', fontSize: 10 }}>
            {trendLabel}
          </span>
        </div>
      )}
    </motion.div>
  )
}
