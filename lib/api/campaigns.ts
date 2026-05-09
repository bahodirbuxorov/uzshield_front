import api from '@/lib/api/axios'
import type { PaginatedResponse } from '@/lib/types/employee'

/** Campaign record from API */
export interface Campaign {
  id: number
  name: string
  description: string | null
  type: 'phishing_simulation' | string
  template_subject: string | null
  template_body: string | null
  landing_url: string | null
  status: 'draft' | 'active' | 'completed' | 'paused'
  starts_at: string | null
  ends_at: string | null
  created_at: string
  updated_at: string
}

/** Campaign statistics from /api/campaigns/{id}/statistics */
export interface CampaignStatistics {
  campaign_id: number
  total_targets: number
  sent_count: number
  clicked_count: number
  trained_count: number
  click_rate: number | null
  training_rate: number | null
}

/** Per-target result from /api/campaigns/{id}/results */
export interface CampaignTargetResult {
  employee_id: number
  employee_name: string
  email: string
  department: string | null
  sent_at: string | null
  clicked_at: string | null
  trained_at: string | null
}

export interface CreateCampaignPayload {
  name: string
  description?: string
  type?: string
  template_subject?: string
  template_body?: string
  landing_url?: string
  starts_at?: string
  ends_at?: string
}

/**
 * List campaigns with optional filters.
 * GET /api/campaigns
 */
export async function fetchCampaigns(params?: {
  status?: string
  type?: string
}): Promise<PaginatedResponse<Campaign>> {
  const res = await api.get<PaginatedResponse<Campaign>>('/api/campaigns', { params })
  return res.data
}

/**
 * Get a single campaign.
 * GET /api/campaigns/{campaign}
 */
export async function fetchCampaignById(id: number): Promise<Campaign> {
  const res = await api.get<{ data: Campaign }>(`/api/campaigns/${id}`)
  return res.data.data
}

/**
 * Create a campaign.
 * POST /api/campaigns
 */
export async function createCampaign(payload: CreateCampaignPayload): Promise<Campaign> {
  const res = await api.post<{ data: Campaign }>('/api/campaigns', payload)
  return res.data.data
}

/**
 * Update a campaign.
 * PUT /api/campaigns/{campaign}
 */
export async function updateCampaign(id: number, payload: Partial<CreateCampaignPayload>): Promise<Campaign> {
  const res = await api.put<{ data: Campaign }>(`/api/campaigns/${id}`, payload)
  return res.data.data
}

/**
 * Delete a campaign.
 * DELETE /api/campaigns/{campaign}
 */
export async function deleteCampaign(id: number): Promise<void> {
  await api.delete(`/api/campaigns/${id}`)
}

/**
 * Attach employees to a campaign.
 * POST /api/campaigns/{campaign}/employees
 */
export async function attachCampaignEmployees(id: number, employee_ids: number[]): Promise<void> {
  await api.post(`/api/campaigns/${id}/employees`, { employee_ids })
}

/**
 * Launch a campaign.
 * POST /api/campaigns/{campaign}/launch
 */
export async function launchCampaign(id: number): Promise<Campaign> {
  const res = await api.post<{ data: Campaign }>(`/api/campaigns/${id}/launch`)
  return res.data.data
}

/**
 * Get campaign statistics.
 * GET /api/campaigns/{campaign}/statistics
 */
export async function fetchCampaignStatistics(id: number): Promise<CampaignStatistics> {
  const res = await api.get<{ data: CampaignStatistics }>(`/api/campaigns/${id}/statistics`)
  return res.data.data
}

/**
 * Get per-target results for a campaign.
 * GET /api/campaigns/{campaign}/results
 */
export async function fetchCampaignResults(id: number): Promise<CampaignTargetResult[]> {
  const res = await api.get<{ data: CampaignTargetResult[] }>(`/api/campaigns/${id}/results`)
  return res.data.data
}
