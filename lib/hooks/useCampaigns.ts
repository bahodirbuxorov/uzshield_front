import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchCampaigns, fetchCampaignById, fetchCampaignResults, fetchCampaignTimeline, createCampaign, fetchTemplates } from '@/lib/api/campaigns'
import type { CampaignFormValues } from '@/lib/types/campaign'

/** Query key factory for campaigns */
export const campaignKeys = {
  all: ['campaigns'] as const,
  list: (page: number, pageSize: number, status: string, channel: string) =>
    [...campaignKeys.all, 'list', page, pageSize, status, channel] as const,
  detail: (id: string) => [...campaignKeys.all, 'detail', id] as const,
  results: (id: string) => [...campaignKeys.all, 'results', id] as const,
  timeline: (id: string) => [...campaignKeys.all, 'timeline', id] as const,
  templates: (channel?: string, category?: string, difficulty?: string) =>
    ['templates', channel, category, difficulty] as const,
}

/** Fetch paginated campaigns */
export function useCampaigns(page: number, pageSize: number, status: string, channel: string) {
  return useQuery({
    queryKey: campaignKeys.list(page, pageSize, status, channel),
    queryFn: () => fetchCampaigns(page, pageSize, status, channel),
    placeholderData: (prev) => prev,
  })
}

/** Fetch single campaign */
export function useCampaign(id: string) {
  return useQuery({
    queryKey: campaignKeys.detail(id),
    queryFn: () => fetchCampaignById(id),
    enabled: !!id,
  })
}

/** Fetch campaign employee results */
export function useCampaignResults(id: string) {
  return useQuery({
    queryKey: campaignKeys.results(id),
    queryFn: () => fetchCampaignResults(id),
    enabled: !!id,
  })
}

/** Fetch campaign timeline */
export function useCampaignTimeline(id: string) {
  return useQuery({
    queryKey: campaignKeys.timeline(id),
    queryFn: () => fetchCampaignTimeline(id),
    enabled: !!id,
  })
}

/** Create a new campaign */
export function useCreateCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (values: CampaignFormValues) => createCampaign(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.all })
    },
  })
}

/** Fetch phishing templates */
export function useTemplates(channel?: string, category?: string, difficulty?: string) {
  return useQuery({
    queryKey: campaignKeys.templates(channel, category, difficulty),
    queryFn: () => fetchTemplates(channel, category, difficulty),
  })
}
