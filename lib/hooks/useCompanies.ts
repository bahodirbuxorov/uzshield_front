import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchCompanies,
  fetchCompanyById,
  fetchCompanyStatistics,
  createCompany,
  updateCompany,
  deleteCompany,
} from '@/lib/api/companies'

/** Query key factory for companies */
export const companyKeys = {
  all: ['companies'] as const,
  list: (per_page?: number) => [...companyKeys.all, 'list', per_page] as const,
  detail: (id: number) => [...companyKeys.all, 'detail', id] as const,
  statistics: (id: number) => [...companyKeys.all, 'statistics', id] as const,
}

/** Fetch companies list */
export function useCompanies(per_page = 25) {
  return useQuery({
    queryKey: companyKeys.list(per_page),
    queryFn: () => fetchCompanies(per_page),
    placeholderData: (prev) => prev,
  })
}

/** Fetch a single company */
export function useCompany(id: number) {
  return useQuery({
    queryKey: companyKeys.detail(id),
    queryFn: () => fetchCompanyById(id),
    enabled: !!id,
  })
}

/** Fetch company statistics */
export function useCompanyStatistics(id: number) {
  return useQuery({
    queryKey: companyKeys.statistics(id),
    queryFn: () => fetchCompanyStatistics(id),
    enabled: !!id,
  })
}

/** Create a company */
export function useCreateCompany() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.all })
    },
  })
}

/** Update a company */
export function useUpdateCompany(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Parameters<typeof updateCompany>[1]) =>
      updateCompany(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.all })
    },
  })
}

/** Delete a company */
export function useDeleteCompany() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.all })
    },
  })
}
