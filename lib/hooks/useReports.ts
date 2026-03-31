import { useQuery } from '@tanstack/react-query'
import { fetchReport } from '@/lib/api/reports'

/** Query key factory for reports */
export const reportKeys = {
  all: ['reports'] as const,
  detail: (dateRange: string) => [...reportKeys.all, dateRange] as const,
}

/**
 * Fetch analytics report for a given date range.
 * @param dateRange key like 'last7', 'last30', 'last90', or 'custom'
 */
export function useReport(dateRange = 'last30') {
  return useQuery({
    queryKey: reportKeys.detail(dateRange),
    queryFn: () => fetchReport(dateRange),
  })
}
