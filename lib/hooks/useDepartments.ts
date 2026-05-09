import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchDepartments,
  fetchDepartmentById,
  fetchDepartmentStatistics,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '@/lib/api/departments'

/** Query key factory for departments */
export const departmentKeys = {
  all: ['departments'] as const,
  list: () => [...departmentKeys.all, 'list'] as const,
  detail: (id: number) => [...departmentKeys.all, 'detail', id] as const,
  statistics: (id: number) => [...departmentKeys.all, 'statistics', id] as const,
}

/** Fetch departments list (auto-scoped to caller's company) */
export function useDepartments() {
  return useQuery({
    queryKey: departmentKeys.list(),
    queryFn: fetchDepartments,
    placeholderData: (prev) => prev,
  })
}

/** Fetch a single department */
export function useDepartment(id: number) {
  return useQuery({
    queryKey: departmentKeys.detail(id),
    queryFn: () => fetchDepartmentById(id),
    enabled: !!id,
  })
}

/** Fetch department statistics */
export function useDepartmentStatistics(id: number) {
  return useQuery({
    queryKey: departmentKeys.statistics(id),
    queryFn: () => fetchDepartmentStatistics(id),
    enabled: !!id,
  })
}

/** Create a department */
export function useCreateDepartment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all })
    },
  })
}

/** Update a department */
export function useUpdateDepartment(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Parameters<typeof updateDepartment>[1]) =>
      updateDepartment(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all })
    },
  })
}

/** Delete a department */
export function useDeleteDepartment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all })
    },
  })
}
