import api from '@/lib/api/axios'
import type { PaginatedResponse } from '@/lib/types/employee'

/** Company record from API */
export interface Company {
  id: number
  name: string
  industry: string | null
  size: number | null
  contact_email: string | null
  contact_phone: string | null
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

/** Company statistics from /api/companies/{id}/statistics */
export interface CompanyStatistics {
  company_id: number
  departments_count: number
  employees_count: number
  campaigns_count: number
  active_employees: number
  inactive_employees: number
}

/**
 * List all companies.
 * GET /api/companies
 */
export async function fetchCompanies(per_page = 25): Promise<PaginatedResponse<Company>> {
  const response = await api.get<PaginatedResponse<Company>>('/api/companies', {
    params: { per_page },
  })
  return response.data
}

/**
 * Get a single company by ID.
 * GET /api/companies/{company}
 */
export async function fetchCompanyById(id: number): Promise<Company> {
  const response = await api.get<{ data: Company }>(`/api/companies/${id}`)
  return response.data.data
}

/**
 * Create a new company (super admin only).
 * POST /api/companies
 */
export async function createCompany(payload: {
  name: string
  industry?: string
  size?: number
  contact_email?: string
  contact_phone?: string
  status?: 'active' | 'inactive'
}): Promise<Company> {
  const response = await api.post<{ data: Company }>('/api/companies', payload)
  return response.data.data
}

/**
 * Update a company.
 * PUT /api/companies/{company}
 */
export async function updateCompany(
  id: number,
  payload: Partial<{
    name: string
    industry: string
    size: number
    status: 'active' | 'inactive'
  }>
): Promise<Company> {
  const response = await api.put<{ data: Company }>(`/api/companies/${id}`, payload)
  return response.data.data
}

/**
 * Delete a company (super admin only).
 * DELETE /api/companies/{company}
 */
export async function deleteCompany(id: number): Promise<void> {
  await api.delete(`/api/companies/${id}`)
}

/**
 * Get aggregate statistics for a company.
 * GET /api/companies/{company}/statistics
 */
export async function fetchCompanyStatistics(id: number): Promise<CompanyStatistics> {
  const response = await api.get<{ data: CompanyStatistics }>(
    `/api/companies/${id}/statistics`
  )
  return response.data.data
}
