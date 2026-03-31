import { useQuery } from '@tanstack/react-query'
import {
  fetchEmployees,
  fetchEmployeeById,
  fetchEmployeeCampaigns,
  fetchEmployeeTrainings,
  fetchEmployeeActivities,
} from '@/lib/api/employees'

/** Query key factory for employees */
export const employeeKeys = {
  all: ['employees'] as const,
  list: (page: number, pageSize: number, search: string, department: string) =>
    [...employeeKeys.all, 'list', page, pageSize, search, department] as const,
  detail: (id: string) => [...employeeKeys.all, 'detail', id] as const,
  campaigns: (id: string) => [...employeeKeys.all, 'campaigns', id] as const,
  trainings: (id: string) => [...employeeKeys.all, 'trainings', id] as const,
  activities: (id: string) => [...employeeKeys.all, 'activities', id] as const,
}

/** Fetch paginated employees */
export function useEmployees(page: number, pageSize: number, search: string, department: string) {
  return useQuery({
    queryKey: employeeKeys.list(page, pageSize, search, department),
    queryFn: () => fetchEmployees(page, pageSize, search, department),
    placeholderData: (prev) => prev,
  })
}

/** Fetch single employee */
export function useEmployee(id: string) {
  return useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: () => fetchEmployeeById(id),
    enabled: !!id,
  })
}

/** Fetch employee campaign history */
export function useEmployeeCampaigns(id: string) {
  return useQuery({
    queryKey: employeeKeys.campaigns(id),
    queryFn: () => fetchEmployeeCampaigns(id),
    enabled: !!id,
  })
}

/** Fetch employee training records */
export function useEmployeeTrainings(id: string) {
  return useQuery({
    queryKey: employeeKeys.trainings(id),
    queryFn: () => fetchEmployeeTrainings(id),
    enabled: !!id,
  })
}

/** Fetch employee activity timeline */
export function useEmployeeActivities(id: string) {
  return useQuery({
    queryKey: employeeKeys.activities(id),
    queryFn: () => fetchEmployeeActivities(id),
    enabled: !!id,
  })
}
