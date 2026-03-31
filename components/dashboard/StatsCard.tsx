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

export function StatsCard({
  title,
  value,
  trend,
  trendLabel,
  icon: Icon,
  iconColor,
  iconBg,
  loading = false,
  index = 0,
}: StatsCardProps) {
  if (loading) {
    return (
      <div
        style={{
          backgroundColor: 'white',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}
      >
        <Skeleton style={{ height: 16, width: 128, marginBottom: 16 }} />
        <Skeleton style={{ height: 32, width: 96, marginBottom: 8 }} />
        <Skeleton style={{ height: 12, width: 112 }} />
      </div>
    )
  }

  const trendIcon = trend === undefined ? null : trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus
  const trendColor =
    trend === undefined ? '' :
    trend > 0 ? 'var(--success)' :
    trend < 0 ? 'var(--danger)' :
    'var(--muted)'
  const TrendIcon = trendIcon

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: 'easeOut' }}
      style={{
        backgroundColor: 'white',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: 24,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        transition: 'box-shadow 0.2s',
        cursor: 'default',
      }}
      onHoverStart={(e) => { (e.target as HTMLElement).style?.setProperty?.('box-shadow', '0 4px 12px rgba(0,0,0,0.12)') }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>{title}</span>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 42,
            height: 42,
            borderRadius: 12,
            backgroundColor: iconBg?.replace('bg-', '') === iconBg ? undefined : undefined,
            background: iconBg === 'bg-blue-50' ? '#EFF6FF' :
                         iconBg === 'bg-[var(--success-light)]' ? 'var(--success-light)' :
                         iconBg === 'bg-[var(--warning-light)]' ? 'var(--warning-light)' :
                         iconBg === 'bg-purple-50' ? '#F5F3FF' : '#F1F5F9',
            flexShrink: 0,
          }}
        >
          <Icon
            style={{
              width: 20,
              height: 20,
              color: iconColor === 'text-[var(--accent)]' ? 'var(--accent)' :
                     iconColor === 'text-[var(--success)]' ? 'var(--success)' :
                     iconColor === 'text-amber-500' ? '#F59E0B' :
                     iconColor === 'text-purple-600' ? '#9333EA' : 'var(--accent)',
            }}
          />
        </div>
      </div>

      {/* Value */}
      <p
        style={{
          fontSize: 30,
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: 0,
          fontFamily: 'var(--font-display)',
          lineHeight: 1,
          marginBottom: trend !== undefined ? 6 : 0,
        }}
      >
        {value}
      </p>

      {/* Trend */}
      {trend !== undefined && TrendIcon && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500, color: trendColor }}>
          <TrendIcon style={{ width: 14, height: 14 }} />
          <span>
            {Math.abs(trend)}% {trendLabel}
          </span>
        </div>
      )}
    </motion.div>
  )
}
