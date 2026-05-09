import api from '@/lib/api/axios'
import type { PaginatedResponse } from '@/lib/types/employee'

/** Report record from API */
export interface Report {
  id: number
  type: 'campaign_summary' | 'employee_risk' | 'training_progress' | string
  company_id: number | null
  date_from: string | null
  date_to: string | null
  data: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

/** Analytics dashboard payload from /api/reports/analytics */
export interface AnalyticsDashboard {
  total_employees: number
  active_campaigns: number
  overall_click_rate: number | null
  overall_training_rate: number | null
  risk_distribution: {
    low: number
    medium: number
    high: number
    critical: number
  } | null
  top_vulnerable_employees?: Array<{
    id: number
    name: string
    email: string
    risk_score: number | null
  }>
  campaign_trend?: Array<{
    month: string
    click_rate: number
    training_rate: number
  }>
  department_stats?: Array<{
    department: string
    avg_risk_score: number
    employee_count: number
    click_rate: number
    training_rate: number
  }>
}

/**
 * List generated reports.
 * GET /api/reports
 */
export async function fetchReports(): Promise<PaginatedResponse<Report>> {
  const res = await api.get<PaginatedResponse<Report>>('/api/reports')
  return res.data
}

/**
 * Get a single generated report.
 * GET /api/reports/{report}
 */
export async function fetchReportById(id: number): Promise<Report> {
  const res = await api.get<{ data: Report }>(`/api/reports/${id}`)
  return res.data.data
}

/**
 * Generate a report on demand.
 * POST /api/reports/generate
 */
export async function generateReport(payload: {
  type: string
  company_id?: number
  date_from?: string
  date_to?: string
}): Promise<Report> {
  const res = await api.post<{ data: Report }>('/api/reports/generate', payload)
  return res.data.data
}

/**
 * High-level analytics dashboard payload.
 * GET /api/reports/analytics
 */
export async function fetchAnalytics(company_id?: number): Promise<AnalyticsDashboard> {
  const res = await api.get<{ data: AnalyticsDashboard }>('/api/reports/analytics', {
    params: company_id ? { company_id } : undefined,
  })
  return res.data.data
}
