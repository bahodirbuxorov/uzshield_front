import { MOCK_API_DELAY } from '@/lib/constants'
import { MOCK_CAMPAIGNS, MOCK_CAMPAIGN_RESULTS, MOCK_TIMELINE_EVENTS, MOCK_TEMPLATES } from '@/lib/constants/mockData'
import type { Campaign, CampaignFormValues, CampaignResult, PhishingTemplate, TimelineEvent } from '@/lib/types/campaign'

/** Simulate network latency */
const delay = () => new Promise<void>((r) => setTimeout(r, MOCK_API_DELAY))

/**
 * Fetch paginated campaigns list.
 * @param page 1-indexed page number
 * @param pageSize records per page
 * @param status optional status filter
 * @param channel optional channel filter
 */
export async function fetchCampaigns(
  page = 1,
  pageSize = 10,
  status?: string,
  channel?: string
): Promise<{ data: Campaign[]; total: number }> {
  await delay()
  let data = [...MOCK_CAMPAIGNS]
  if (status && status !== 'all') data = data.filter((c) => c.status === status)
  if (channel && channel !== 'all') data = data.filter((c) => c.channels.includes(channel as Campaign['channels'][0]))
  const total = data.length
  const sliced = data.slice((page - 1) * pageSize, page * pageSize)
  return { data: sliced, total }
}

/**
 * Fetch a single campaign by ID.
 */
export async function fetchCampaignById(id: string): Promise<Campaign> {
  await delay()
  const campaign = MOCK_CAMPAIGNS.find((c) => c.id === id)
  if (!campaign) throw new Error(`Campaign ${id} not found`)
  return campaign
}

/**
 * Fetch employee results for a campaign.
 */
export async function fetchCampaignResults(campaignId: string): Promise<CampaignResult[]> {
  await delay()
  void campaignId
  return MOCK_CAMPAIGN_RESULTS
}

/**
 * Fetch activity timeline for a campaign.
 */
export async function fetchCampaignTimeline(campaignId: string): Promise<TimelineEvent[]> {
  await delay()
  void campaignId
  return MOCK_TIMELINE_EVENTS
}

/**
 * Create a new campaign from form values.
 */
export async function createCampaign(values: CampaignFormValues): Promise<Campaign> {
  await delay()
  const newCampaign: Campaign = {
    id: `c${Date.now()}`,
    name: values.name,
    channels: values.channels,
    status: values.scheduleType === 'immediately' ? 'active' : 'draft',
    totalEmployees: 120,
    sentCount: 0,
    clickedCount: 0,
    completedTrainingCount: 0,
    clickRate: 0,
    templateId: values.templateId,
    templateName: 'Selected Template',
    difficulty: 'medium',
    category: 'corporate',
    createdAt: new Date().toISOString(),
    startedAt: values.scheduleType === 'immediately' ? new Date().toISOString() : null,
    completedAt: null,
  }
  return newCampaign
}

/**
 * Fetch phishing templates with optional filters.
 */
export async function fetchTemplates(
  channel?: string,
  category?: string,
  difficulty?: string
): Promise<PhishingTemplate[]> {
  await delay()
  let data = [...MOCK_TEMPLATES]
  if (channel && channel !== 'all') data = data.filter((t) => t.channel === channel)
  if (category && category !== 'all') data = data.filter((t) => t.category === category)
  if (difficulty && difficulty !== 'all') data = data.filter((t) => t.difficulty === difficulty)
  return data
}
