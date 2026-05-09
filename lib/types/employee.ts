/** Risk classification for an employee */
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

/** Full employee record — matches API response */
export interface Employee {
  id: number
  department_id: number | null
  name: string
  email: string
  phone: string | null
  age: number | null
  position: string | null
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
  /** Optional relation — populated when department is eager-loaded */
  department?: Department
}

/** Department relation embedded in Employee */
export interface Department {
  id: number
  company_id: number | null
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

/** Paginated API response wrapper */
export interface PaginatedResponse<T> {
  data: T[]
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number | null
    to: number | null
  }
  links?: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
}

/** Per-employee statistics from /api/employees/{id}/statistics */
export interface EmployeeStatistics {
  employee_id: number
  campaigns_count: number
  clicked_count: number
  trained_count: number
  click_rate: number | null
  training_rate: number | null
  risk_score: number | null
}

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
