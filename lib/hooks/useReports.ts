import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchReports,
  fetchReportById,
  fetchAnalytics,
  generateReport,
} from '@/lib/api/reports'

export const reportKeys = {
  all: ['reports'] as const,
  list: () => [...reportKeys.all, 'list'] as const,
  detail: (id: number) => [...reportKeys.all, 'detail', id] as const,
  analytics: (company_id?: number) => [...reportKeys.all, 'analytics', company_id] as const,
}

/** List all generated reports */
export function useReports() {
  return useQuery({
    queryKey: reportKeys.list(),
    queryFn: fetchReports,
  })
}

/** Fetch a single report */
export function useReport(id: number) {
  return useQuery({
    queryKey: reportKeys.detail(id),
    queryFn: () => fetchReportById(id),
    enabled: !!id,
  })
}

/** Analytics dashboard data */
export function useAnalytics(company_id?: number) {
  return useQuery({
    queryKey: reportKeys.analytics(company_id),
    queryFn: () => fetchAnalytics(company_id),
  })
}

/** Generate a new report */
export function useGenerateReport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: generateReport,
    onSuccess: () => qc.invalidateQueries({ queryKey: reportKeys.all }),
  })
}
