import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { enUS as en } from 'date-fns/locale'

/**
 * Format an ISO date string to a human-readable date.
 * @example formatDate('2025-03-05T09:00:00Z') → 'Mar 5, 2025'
 */
export function formatDate(iso: string | null | undefined, pattern = 'MMM d, yyyy'): string {
  if (!iso) return '—'
  return format(parseISO(iso), pattern, { locale: en })
}

/**
 * Return a relative time string like "3 days ago".
 */
export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return '—'
  return formatDistanceToNow(parseISO(iso), { addSuffix: true, locale: en })
}

/**
 * Format a number as a percentage string.
 * @example fmtPercent(28.3) → '28.3%'
 */
export function fmtPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Format a large number with locale separators.
 * @example fmtNumber(1234567) → '1,234,567'
 */
export function fmtNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

/**
 * Clamp a value between a min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Truncate a string to maxLength and append "…" if needed.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 1) + '…'
}
