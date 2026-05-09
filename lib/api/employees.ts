import api from '@/lib/api/axios'
import type { Employee, PaginatedResponse, EmployeeStatistics } from '@/lib/types/employee'

/** Query params for listing employees */
export interface EmployeeListParams {
  department_id?: number
  status?: 'active' | 'inactive'
  search?: string
}

/**
 * List employees with optional filters.
 * GET /api/employees
 */
export async function fetchEmployees(
  params: EmployeeListParams = {}
): Promise<PaginatedResponse<Employee>> {
  const response = await api.get<PaginatedResponse<Employee>>('/api/employees', { params })
  return response.data
}

/**
 * Get a single employee by ID.
 * GET /api/employees/{employee}
 */
export async function fetchEmployeeById(id: number): Promise<Employee> {
  const response = await api.get<{ data: Employee }>(`/api/employees/${id}`)
  return response.data.data
}

/**
 * Create a new employee.
 * POST /api/employees
 */
export async function createEmployee(payload: {
  department_id: number
  name: string
  email: string
  phone?: string
  age?: number
  position?: string
  status?: 'active' | 'inactive'
}): Promise<Employee> {
  const response = await api.post<{ data: Employee }>('/api/employees', payload)
  return response.data.data
}

/**
 * Update an employee.
 * PUT /api/employees/{employee}
 */
export async function updateEmployee(
  id: number,
  payload: Partial<{
    department_id: number
    name: string
    email: string
    phone: string
    age: number
    position: string
    status: 'active' | 'inactive'
  }>
): Promise<Employee> {
  const response = await api.put<{ data: Employee }>(`/api/employees/${id}`, payload)
  return response.data.data
}

/**
 * Delete an employee.
 * DELETE /api/employees/{employee}
 */
export async function deleteEmployee(id: number): Promise<void> {
  await api.delete(`/api/employees/${id}`)
}

/**
 * Get per-employee statistics.
 * GET /api/employees/{employee}/statistics
 */
export async function fetchEmployeeStatistics(id: number): Promise<EmployeeStatistics> {
  const response = await api.get<{ data: EmployeeStatistics }>(`/api/employees/${id}/statistics`)
  return response.data.data
}
