import api from '@/lib/api/axios'
import type { Department } from '@/lib/types/employee'
import type { PaginatedResponse } from '@/lib/types/employee'

/** Department statistics from /api/departments/{id}/statistics */
export interface DepartmentStatistics {
  department_id: number
  employees_count: number
  active_employees: number
  inactive_employees: number
  campaigns_count: number
  click_rate: number | null
  training_rate: number | null
}

/**
 * List departments (auto-scoped to caller's company).
 * GET /api/departments
 */
export async function fetchDepartments(): Promise<PaginatedResponse<Department>> {
  const response = await api.get<PaginatedResponse<Department>>('/api/departments')
  return response.data
}

/**
 * Get a single department.
 * GET /api/departments/{department}
 */
export async function fetchDepartmentById(id: number): Promise<Department> {
  const response = await api.get<{ data: Department }>(`/api/departments/${id}`)
  return response.data.data
}

/**
 * Create a department.
 * POST /api/departments
 */
export async function createDepartment(payload: {
  company_id: number
  name: string
  description?: string
}): Promise<Department> {
  const response = await api.post<{ data: Department }>('/api/departments', payload)
  return response.data.data
}

/**
 * Update a department.
 * PUT /api/departments/{department}
 */
export async function updateDepartment(
  id: number,
  payload: Partial<{ name: string; description: string }>
): Promise<Department> {
  const response = await api.put<{ data: Department }>(`/api/departments/${id}`, payload)
  return response.data.data
}

/**
 * Delete a department.
 * DELETE /api/departments/{department}
 */
export async function deleteDepartment(id: number): Promise<void> {
  await api.delete(`/api/departments/${id}`)
}

/**
 * Get statistics for a department.
 * GET /api/departments/{department}/statistics
 */
export async function fetchDepartmentStatistics(id: number): Promise<DepartmentStatistics> {
  const response = await api.get<{ data: DepartmentStatistics }>(
    `/api/departments/${id}/statistics`
  )
  return response.data.data
}
