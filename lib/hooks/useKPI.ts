import { useQuery } from '@tanstack/react-query'
import { fetchEmployeeKPI, fetchDepartmentKPI, fetchCompanyKPI } from '@/lib/api/kpi'

export const kpiKeys = {
  all: ['kpi'] as const,
  employee: (id: number) => [...kpiKeys.all, 'employee', id] as const,
  department: (id: number) => [...kpiKeys.all, 'department', id] as const,
  company: (id: number) => [...kpiKeys.all, 'company', id] as const,
}

export function useEmployeeKPI(employeeId: number) {
  return useQuery({
    queryKey: kpiKeys.employee(employeeId),
    queryFn: () => fetchEmployeeKPI(employeeId),
    enabled: !!employeeId,
  })
}

export function useDepartmentKPI(departmentId: number) {
  return useQuery({
    queryKey: kpiKeys.department(departmentId),
    queryFn: () => fetchDepartmentKPI(departmentId),
    enabled: !!departmentId,
  })
}

export function useCompanyKPI(companyId: number) {
  return useQuery({
    queryKey: kpiKeys.company(companyId),
    queryFn: () => fetchCompanyKPI(companyId),
    enabled: !!companyId,
  })
}
