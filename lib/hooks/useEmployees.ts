import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchEmployees,
  fetchEmployeeById,
  fetchEmployeeStatistics,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '@/lib/api/employees'
import type { EmployeeListParams } from '@/lib/api/employees'

/** Query key factory for employees */
export const employeeKeys = {
  all: ['employees'] as const,
  list: (params: EmployeeListParams) =>
    [...employeeKeys.all, 'list', params] as const,
  detail: (id: number) => [...employeeKeys.all, 'detail', id] as const,
  statistics: (id: number) => [...employeeKeys.all, 'statistics', id] as const,
}

/** Fetch employees list with optional filters */
export function useEmployees(params: EmployeeListParams = {}) {
  return useQuery({
    queryKey: employeeKeys.list(params),
    queryFn: () => fetchEmployees(params),
    placeholderData: (prev) => prev,
  })
}

/** Fetch single employee */
export function useEmployee(id: number) {
  return useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: () => fetchEmployeeById(id),
    enabled: !!id,
  })
}

/** Fetch per-employee statistics */
export function useEmployeeStatistics(id: number) {
  return useQuery({
    queryKey: employeeKeys.statistics(id),
    queryFn: () => fetchEmployeeStatistics(id),
    enabled: !!id,
  })
}

/** Create a new employee */
export function useCreateEmployee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all })
    },
  })
}

/** Update an existing employee */
export function useUpdateEmployee(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Parameters<typeof updateEmployee>[1]) =>
      updateEmployee(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all })
    },
  })
}

/** Delete an employee */
export function useDeleteEmployee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all })
    },
  })
}
