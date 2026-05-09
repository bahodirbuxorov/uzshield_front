import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchCampaigns,
  fetchCampaignById,
  fetchCampaignStatistics,
  fetchCampaignResults,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  attachCampaignEmployees,
  launchCampaign,
} from '@/lib/api/campaigns'
import type { CreateCampaignPayload } from '@/lib/api/campaigns'
import { MOCK_TEMPLATES } from '@/lib/constants/mockData'

/** Query key factory for campaigns */
export const campaignKeys = {
  all: ['campaigns'] as const,
  list: (params?: { status?: string; type?: string }) => [...campaignKeys.all, 'list', params] as const,
  detail: (id: number) => [...campaignKeys.all, 'detail', id] as const,
  statistics: (id: number) => [...campaignKeys.all, 'statistics', id] as const,
  results: (id: number) => [...campaignKeys.all, 'results', id] as const,
  templates: () => ['templates'] as const,
}

/** Fetch campaigns list */
export function useCampaigns(params?: { status?: string; type?: string }) {
  return useQuery({
    queryKey: campaignKeys.list(params),
    queryFn: () => fetchCampaigns(params),
    placeholderData: (prev) => prev,
  })
}

/** Fetch single campaign */
export function useCampaign(id: number) {
  return useQuery({
    queryKey: campaignKeys.detail(id),
    queryFn: () => fetchCampaignById(id),
    enabled: !!id,
  })
}

/** Fetch campaign statistics */
export function useCampaignStatistics(id: number) {
  return useQuery({
    queryKey: campaignKeys.statistics(id),
    queryFn: () => fetchCampaignStatistics(id),
    enabled: !!id,
  })
}

/** Fetch campaign results */
export function useCampaignResults(id: number) {
  return useQuery({
    queryKey: campaignKeys.results(id),
    queryFn: () => fetchCampaignResults(id),
    enabled: !!id,
  })
}

/** Create a campaign */
export function useCreateCampaign() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateCampaignPayload) => createCampaign(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: campaignKeys.all }),
  })
}

/** Update a campaign */
export function useUpdateCampaign(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<CreateCampaignPayload>) => updateCampaign(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: campaignKeys.all }),
  })
}

/** Delete a campaign */
export function useDeleteCampaign() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteCampaign,
    onSuccess: () => qc.invalidateQueries({ queryKey: campaignKeys.all }),
  })
}

/** Attach employees to campaign */
export function useAttachCampaignEmployees(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (employee_ids: number[]) => attachCampaignEmployees(id, employee_ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: campaignKeys.detail(id) }),
  })
}

/** Launch a campaign */
export function useLaunchCampaign(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => launchCampaign(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: campaignKeys.all }),
  })
}

/** Fetch phishing templates (mock) */
export function useTemplates(channel?: string, category?: string, difficulty?: string) {
  return useQuery({
    queryKey: [...campaignKeys.templates(), { channel, category, difficulty }],
    queryFn: async () => {
      let filtered = MOCK_TEMPLATES
      if (channel) filtered = filtered.filter((t) => t.channel === channel)
      if (category) filtered = filtered.filter((t) => t.category === category)
      if (difficulty) filtered = filtered.filter((t) => t.difficulty === difficulty)
      return filtered
    },
  })
}
