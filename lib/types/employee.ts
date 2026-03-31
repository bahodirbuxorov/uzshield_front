/** Risk classification for an employee */
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

/** Full employee record */
export interface Employee {
  id: string
  name: string
  email: string
  phone?: string
  department: string
  position: string
  riskScore: number // 0–100
  riskLevel: RiskLevel
  status: 'active' | 'inactive'
  lastActivity: string | null
  campaignsParticipated: number
  trainingsCompleted: number
  joinedAt: string
  avatarUrl?: string
}

/** Employee row for table views */
export type EmployeeSummary = Pick<
  Employee,
  | 'id'
  | 'name'
  | 'email'
  | 'department'
  | 'riskScore'
  | 'riskLevel'
  | 'status'
  | 'lastActivity'
>

/** A record of an employee participating in a campaign */
export interface EmployeeCampaignRecord {
  campaignId: string
  campaignName: string
  channel?: string
  sentAt: string | null
  clickedAt: string | null
  trainedAt: string | null
  result: 'passed' | 'clicked' | 'missed' | 'pending'
}

/** A record of a training module completion */
export interface TrainingRecord {
  moduleId: string
  moduleName: string
  completedAt: string | null
  score: number
  progress?: number
  status: 'completed' | 'in_progress' | 'not_started'
}

/** Activity event for employee page timeline */
export interface EmployeeActivity {
  id: string
  type: 'login' | 'campaign_sent' | 'clicked' | 'training_completed' | 'click' | 'training_complete'
  description: string
  timestamp: string
  createdAt: string
}
