import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchNotifications,
  fetchNotificationById,
  sendNotification,
  fetchNotificationStatistics,
} from '@/lib/api/notifications'

export const notificationKeys = {
  all: ['notifications'] as const,
  list: (params?: object) => [...notificationKeys.all, 'list', params] as const,
  detail: (id: number) => [...notificationKeys.all, 'detail', id] as const,
  statistics: () => [...notificationKeys.all, 'statistics'] as const,
}

export function useNotifications(params?: { status?: string; channel?: string }) {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => fetchNotifications(params),
    placeholderData: (prev) => prev,
  })
}

export function useNotification(id: number) {
  return useQuery({
    queryKey: notificationKeys.detail(id),
    queryFn: () => fetchNotificationById(id),
    enabled: !!id,
  })
}

export function useNotificationStatistics() {
  return useQuery({
    queryKey: notificationKeys.statistics(),
    queryFn: fetchNotificationStatistics,
  })
}

export function useSendNotification() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: sendNotification,
    onSuccess: () => qc.invalidateQueries({ queryKey: notificationKeys.all }),
  })
}
