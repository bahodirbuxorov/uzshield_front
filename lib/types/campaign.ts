import type { Campaign as ApiCampaign } from '@/lib/api/campaigns'

/** Channel used to deliver a phishing simulation */
export type CampaignChannel = 'email' | 'telegram' | 'sms'

/** Lifecycle state of a campaign — matches App\Enums\CampaignStatus on the backend. */
export type CampaignStatus = 'draft' | 'scheduled' | 'running' | 'completed' | 'cancelled'

/** Difficulty level for phishing templates */
export type Difficulty = 'easy' | 'medium' | 'hard'

/** Template category */
export type TemplateCategory = 'bank' | 'social' | 'corporate' | 'government'

/** Re-export Campaign from API */
export type Campaign = ApiCampaign & {
  // Adding mock fields to satisfy existing UI until it's fully migrated
  channels?: CampaignChannel[]
  totalEmployees?: number
  sentCount?: number
  clickedCount?: number
  completedTrainingCount?: number
  clickRate?: number
  templateId?: string
  templateName?: string
  difficulty?: Difficulty
  category?: TemplateCategory
  startedAt?: string | null
  completedAt?: string | null
}

/** Summarised campaign row for list views */
export type CampaignSummary = Pick<
  Campaign,
  | 'id'
  | 'name'
  | 'status'
  | 'channels'
  | 'clickRate'
  | 'totalEmployees'
  | 'created_at'
  | 'starts_at'
>

/** Phishing template used in campaigns */
export interface PhishingTemplate {
  id: string
  name: string
  channel: CampaignChannel
  category: TemplateCategory
  difficulty: Difficulty
  subject: string
  previewText: string
  thumbnailUrl?: string
  usageCount: number
  createdAt: string
}

/** Individual employee result in a campaign */
export interface CampaignResult {
  employeeId: string
  employeeName: string
  email: string
  department: string
  sentAt: string | null
  clickedAt: string | null
  trainedAt: string | null
  riskScore: number
}

/** Activity event for campaign timeline */
export interface TimelineEvent {
  id: string
  type: 'sent' | 'clicked' | 'trained' | 'paused' | 'resumed' | 'completed'
  description: string
  timestamp: string
  count?: number
}

/** Form values for the new-campaign wizard */
export interface CampaignFormValues {
  name: string
  channels: CampaignChannel[]
  targetGroup: 'all' | 'department' | 'individual'
  departments?: string[]
  employeeIds?: string[]
  templateId: string
  scheduleType: 'immediately' | 'scheduled'
  scheduledAt?: string
}
