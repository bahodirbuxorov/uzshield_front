import api from '@/lib/api/axios'
import type { PaginatedResponse } from '@/lib/types/employee'

/** Channels supported by the notification backend. */
export type NotificationChannel = 'email' | 'sms' | 'in_app'

/** Notification record from API */
export interface Notification {
  id: number
  channel: NotificationChannel
  subject: string | null
  body: string
  status: 'pending' | 'sent' | 'failed'
  sent_at: string | null
  created_at: string
  updated_at: string
}

/** Notification statistics */
export interface NotificationStatistics {
  total: number
  sent: number
  pending: number
  failed: number
  by_channel: Record<string, { total: number; sent: number; failed: number }>
}

/**
 * List notifications.
 * GET /api/notifications
 */
export async function fetchNotifications(params?: {
  status?: string
  channel?: string
}): Promise<PaginatedResponse<Notification>> {
  const res = await api.get<PaginatedResponse<Notification>>('/api/notifications', { params })
  return res.data
}

/**
 * Get a single notification.
 * GET /api/notifications/{notification}
 */
export async function fetchNotificationById(id: number): Promise<Notification> {
  const res = await api.get<{ data: Notification }>(`/api/notifications/${id}`)
  return res.data.data
}

/**
 * Send a notification to one or more recipients.
 * POST /api/notifications/send
 */
export async function sendNotification(payload: {
  channel: NotificationChannel
  subject: string
  body: string
  employee_ids?: number[]
  user_ids?: number[]
}): Promise<{ sent: number; data: Notification[] }> {
  const res = await api.post<{ sent: number; data: Notification[] }>(
    '/api/notifications/send',
    payload,
  )
  return res.data
}

/**
 * Get notification statistics.
 * GET /api/notifications/statistics
 */
export async function fetchNotificationStatistics(): Promise<NotificationStatistics> {
  const res = await api.get<{ data: NotificationStatistics }>('/api/notifications/statistics')
  return res.data.data
}
