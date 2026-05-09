import type { Campaign, PhishingTemplate, CampaignResult, TimelineEvent } from '@/lib/types/campaign'
import type { Employee, EmployeeCampaignRecord, TrainingRecord, EmployeeActivity } from '@/lib/types/employee'
import type { Report, ChartDataPoint, RiskDistribution, DepartmentRisk, ChannelEffectiveness } from '@/lib/types/report'

// ───────────────────────────────────────────────
// EMPLOYEES
// ───────────────────────────────────────────────
export const MOCK_EMPLOYEES: Employee[] = [
  { id: 1, department_id: 1, name: 'Abdullayev Jasur', email: 'jasur@acme.uz', phone: null, age: 28, position: 'Backend Developer', status: 'active', created_at: '2023-01-15T00:00:00Z', updated_at: '2025-03-28T10:30:00Z', department: { id: 1, company_id: 1, name: 'IT', description: null, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' } },
  { id: 2, department_id: 2, name: 'Xolmatova Malika', email: 'malika@acme.uz', phone: null, age: 32, position: 'HR Manager', status: 'active', created_at: '2023-03-10T00:00:00Z', updated_at: '2025-03-27T14:00:00Z', department: { id: 2, company_id: 1, name: 'HR', description: null, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' } },
  { id: 3, department_id: 3, name: "Toshqo'ziyev Sherzod", email: 'sherzod@acme.uz', phone: null, age: 35, position: 'Accountant', status: 'active', created_at: '2022-11-20T00:00:00Z', updated_at: '2025-03-25T09:15:00Z', department: { id: 3, company_id: 1, name: 'Finance', description: null, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' } },
  { id: 4, department_id: 4, name: 'Nazarova Nilufar', email: 'nilufar@acme.uz', phone: null, age: 26, position: 'SMM Specialist', status: 'active', created_at: '2023-06-01T00:00:00Z', updated_at: '2025-03-29T11:45:00Z', department: { id: 4, company_id: 1, name: 'Marketing', description: null, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' } },
  { id: 5, department_id: 5, name: 'Rakhimov Bobur', email: 'bobur@acme.uz', phone: null, age: 30, position: 'Sales Manager', status: 'active', created_at: '2022-08-14T00:00:00Z', updated_at: '2025-03-26T16:00:00Z', department: { id: 5, company_id: 1, name: 'Sales', description: null, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' } },
  { id: 6, department_id: 6, name: "Yo'ldosheva Kamola", email: 'kamola@acme.uz', phone: null, age: 29, position: 'Lawyer', status: 'active', created_at: '2024-01-08T00:00:00Z', updated_at: '2025-03-28T13:00:00Z', department: { id: 6, company_id: 1, name: 'Legal', description: null, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' } },
  { id: 7, department_id: 1, name: 'Mirzayev Dilshod', email: 'dilshod@acme.uz', phone: null, age: 31, position: 'DevOps Engineer', status: 'active', created_at: '2023-04-22T00:00:00Z', updated_at: '2025-03-27T08:30:00Z', department: { id: 1, company_id: 1, name: 'IT', description: null, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' } },
  { id: 8, department_id: 3, name: 'Hasanova Zulfiya', email: 'zulfiya@acme.uz', phone: null, age: 40, position: 'CFO', status: 'active', created_at: '2021-07-30T00:00:00Z', updated_at: '2025-03-29T09:00:00Z', department: { id: 3, company_id: 1, name: 'Finance', description: null, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' } },
  { id: 9, department_id: 5, name: 'Sultonov Eldor', email: 'eldor@acme.uz', phone: null, age: 27, position: 'Sales Rep', status: 'active', created_at: '2023-09-11T00:00:00Z', updated_at: '2025-03-24T15:30:00Z', department: { id: 5, company_id: 1, name: 'Sales', description: null, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' } },
  { id: 10, department_id: 7, name: 'Qodirov Mansur', email: 'mansur@acme.uz', phone: null, age: 45, position: 'CEO', status: 'active', created_at: '2020-01-01T00:00:00Z', updated_at: '2025-03-30T10:00:00Z', department: { id: 7, company_id: 1, name: 'Management', description: null, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' } },
  { id: 11, department_id: 4, name: 'Ismailova Feruza', email: 'feruza@acme.uz', phone: null, age: 25, position: 'Content Manager', status: 'active', created_at: '2023-02-14T00:00:00Z', updated_at: '2025-03-28T12:00:00Z', department: { id: 4, company_id: 1, name: 'Marketing', description: null, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' } },
  { id: 12, department_id: 1, name: 'Tursunov Akbar', email: 'akbar@acme.uz', phone: null, age: 29, position: 'QA Engineer', status: 'inactive', created_at: '2022-12-01T00:00:00Z', updated_at: '2025-03-10T10:00:00Z', department: { id: 1, company_id: 1, name: 'IT', description: null, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' } },
  { id: 13, department_id: 2, name: 'Baxtiyorova Shahlo', email: 'shahlo@acme.uz', phone: null, age: 28, position: 'Recruiter', status: 'active', created_at: '2024-03-01T00:00:00Z', updated_at: '2025-03-27T14:30:00Z', department: { id: 2, company_id: 1, name: 'HR', description: null, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' } },
  { id: 14, department_id: 6, name: 'Ergashev Firdavs', email: 'firdavs@acme.uz', phone: null, age: 33, position: 'Legal Advisor', status: 'active', created_at: '2023-11-20T00:00:00Z', updated_at: '2025-03-29T11:00:00Z', department: { id: 6, company_id: 1, name: 'Legal', description: null, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' } },
  { id: 15, department_id: 3, name: 'Jumayeva Dilnoza', email: 'dilnoza@acme.uz', phone: null, age: 31, position: 'Financial Analyst', status: 'active', created_at: '2023-05-15T00:00:00Z', updated_at: '2025-03-26T09:00:00Z', department: { id: 3, company_id: 1, name: 'Finance', description: null, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' } },
]


// ───────────────────────────────────────────────
// CAMPAIGNS
// ───────────────────────────────────────────────
export const MOCK_CAMPAIGNS: any[] = [
  { id: 1, name: 'Ipak Yo\'li Bank Fishing', channels: ['email'], status: 'active', totalEmployees: 120, sentCount: 120, clickedCount: 34, completedTrainingCount: 28, clickRate: 28.3, templateId: 't1', templateName: 'Bank Notification', difficulty: 'medium', category: 'bank', created_at: '2025-03-01T08:00:00Z', starts_at: '2025-03-05T09:00:00Z', ends_at: null },
  { id: 2, name: 'Telegram Gift Scam Test', channels: ['telegram'], status: 'completed', totalEmployees: 85, sentCount: 85, clickedCount: 12, completedTrainingCount: 81, clickRate: 14.1, templateId: 't4', templateName: 'Telegram Prize', difficulty: 'easy', category: 'social', created_at: '2025-02-10T08:00:00Z', starts_at: '2025-02-12T09:00:00Z', ends_at: '2025-02-25T17:00:00Z' },
  { id: 3, name: 'IT Helpdesk Impersonation', channels: ['email', 'sms'], status: 'paused', totalEmployees: 56, sentCount: 56, clickedCount: 22, completedTrainingCount: 15, clickRate: 39.3, templateId: 't2', templateName: 'IT Support Reset', difficulty: 'hard', category: 'corporate', created_at: '2025-03-15T08:00:00Z', starts_at: '2025-03-16T09:00:00Z', ends_at: null },
  { id: 4, name: 'Tax Office SMS Alert', channels: ['sms'], status: 'draft', totalEmployees: 200, sentCount: 0, clickedCount: 0, completedTrainingCount: 0, clickRate: 0, templateId: 't6', templateName: 'Tax Authority', difficulty: 'medium', category: 'government', created_at: '2025-03-28T08:00:00Z', starts_at: null, ends_at: null },
  { id: 5, name: 'Password Reset Q1', channels: ['email'], status: 'completed', totalEmployees: 150, sentCount: 150, clickedCount: 18, completedTrainingCount: 145, clickRate: 12.0, templateId: 't3', templateName: 'Password Expiry', difficulty: 'easy', category: 'corporate', created_at: '2025-01-08T08:00:00Z', starts_at: '2025-01-10T09:00:00Z', ends_at: '2025-01-31T17:00:00Z' },
  { id: 6, name: 'Social Media Login Lure', channels: ['telegram', 'sms'], status: 'active', totalEmployees: 75, sentCount: 75, clickedCount: 29, completedTrainingCount: 18, clickRate: 38.7, templateId: 't5', templateName: 'Instagram Verify', difficulty: 'hard', category: 'social', created_at: '2025-03-20T08:00:00Z', starts_at: '2025-03-22T09:00:00Z', ends_at: null },
]

// ───────────────────────────────────────────────
// TEMPLATES
// ───────────────────────────────────────────────
export const MOCK_TEMPLATES: PhishingTemplate[] = [
  { id: 't1', name: 'Bank Notification', channel: 'email', category: 'bank', difficulty: 'medium', subject: 'Your account has been temporarily suspended', previewText: 'Dear customer, we detected unusual activity in your account...', usageCount: 12, createdAt: '2024-01-10' },
  { id: 't2', name: 'IT Support Reset', channel: 'email', category: 'corporate', difficulty: 'hard', subject: 'Action Required: Password Reset', previewText: 'Your corporate password expires in 24 hours...', usageCount: 8, createdAt: '2024-02-15' },
  { id: 't3', name: 'Password Expiry', channel: 'email', category: 'corporate', difficulty: 'easy', subject: 'Password Expiry Notice', previewText: 'Click the link below to update your password...', usageCount: 15, createdAt: '2024-01-20' },
  { id: 't4', name: 'Telegram Prize', channel: 'telegram', category: 'social', difficulty: 'easy', subject: 'You won a prize!', previewText: "Congratulations! You've been selected as our lucky winner...", usageCount: 6, createdAt: '2024-03-01' },
  { id: 't5', name: 'Instagram Verify', channel: 'telegram', category: 'social', difficulty: 'hard', subject: 'Verify your account', previewText: 'Your account will be suspended unless you verify...', usageCount: 4, createdAt: '2024-03-15' },
  { id: 't6', name: 'Tax Authority', channel: 'sms', category: 'government', difficulty: 'medium', subject: 'Tax Office: Payment overdue', previewText: 'You have an outstanding tax payment. Click to view...', usageCount: 3, createdAt: '2024-04-01' },
  { id: 't7', name: 'Delivery Failed', channel: 'sms', category: 'corporate', difficulty: 'easy', subject: 'Package delivery failed', previewText: 'Your package could not be delivered. Reschedule here...', usageCount: 9, createdAt: '2024-02-20' },
]

// ───────────────────────────────────────────────
// CHART DATA
// ───────────────────────────────────────────────
export const MOCK_CLICK_RATE_TREND: ChartDataPoint[] = [
  { month: 'Oct', clickRate: 42, trainedRate: 31 },
  { month: 'Nov', clickRate: 38, trainedRate: 44 },
  { month: 'Dec', clickRate: 35, trainedRate: 52 },
  { month: 'Jan', clickRate: 29, trainedRate: 61 },
  { month: 'Feb', clickRate: 24, trainedRate: 70 },
  { month: 'Mar', clickRate: 18, trainedRate: 78 },
]

export const MOCK_RISK_DISTRIBUTION: RiskDistribution[] = [
  { level: 'low', count: 42, percentage: 28 },
  { level: 'medium', count: 53, percentage: 35.3 },
  { level: 'high', count: 38, percentage: 25.3 },
  { level: 'critical', count: 17, percentage: 11.3 },
]

export const MOCK_DEPARTMENT_RISKS: DepartmentRisk[] = [
  { department: 'Finance', avgRiskScore: 71, employeeCount: 22, clickRate: 36, trainedRate: 58 },
  { department: 'Sales', avgRiskScore: 64, employeeCount: 35, clickRate: 31, trainedRate: 62 },
  { department: 'IT', avgRiskScore: 48, employeeCount: 18, clickRate: 24, trainedRate: 74 },
  { department: 'Marketing', avgRiskScore: 39, employeeCount: 15, clickRate: 18, trainedRate: 82 },
  { department: 'HR', avgRiskScore: 44, employeeCount: 12, clickRate: 21, trainedRate: 77 },
  { department: 'Legal', avgRiskScore: 29, employeeCount: 8, clickRate: 12, trainedRate: 88 },
  { department: 'Management', avgRiskScore: 24, employeeCount: 6, clickRate: 8, trainedRate: 92 },
]

export const MOCK_CHANNEL_EFFECTIVENESS: ChannelEffectiveness[] = [
  { channel: 'email', sent: 355, clicked: 84, clickRate: 23.7, trained: 302 },
  { channel: 'telegram', sent: 160, clicked: 51, clickRate: 31.9, trained: 128 },
  { channel: 'sms', sent: 200, clicked: 58, clickRate: 29.0, trained: 155 },
]

export const MOCK_REPORT: Report = {
  period: 'Last 30 days',
  overallClickRate: 22.4,
  overallTrainingRate: 76.3,
  totalCampaigns: 6,
  totalEmployeesTargeted: 686,
  clickRateTrend: MOCK_CLICK_RATE_TREND,
  riskDistribution: MOCK_RISK_DISTRIBUTION,
  departmentRisks: MOCK_DEPARTMENT_RISKS,
  channelEffectiveness: MOCK_CHANNEL_EFFECTIVENESS,
}

// ───────────────────────────────────────────────
// CAMPAIGN RESULTS
// ───────────────────────────────────────────────
export const MOCK_CAMPAIGN_RESULTS: CampaignResult[] = MOCK_EMPLOYEES.slice(0, 10).map((emp) => ({
  employeeId: String(emp.id),
  employeeName: emp.name,
  email: emp.email,
  department: emp.department?.name ?? '',
  sentAt: '2025-03-05T09:05:00Z',
  clickedAt: null,
  trainedAt: null,
  riskScore: 0,
}))


// ───────────────────────────────────────────────
// TIMELINE EVENTS
// ───────────────────────────────────────────────
export const MOCK_TIMELINE_EVENTS: TimelineEvent[] = [
  { id: 'ev1', type: 'sent', description: 'Phishing emails sent to all 120 employees', timestamp: '2025-03-05T09:00:00Z', count: 120 },
  { id: 'ev2', type: 'clicked', description: '34 employees clicked the phishing link', timestamp: '2025-03-05T11:30:00Z', count: 34 },
  { id: 'ev3', type: 'trained', description: '28 employees completed the training module', timestamp: '2025-03-06T14:00:00Z', count: 28 },
  { id: 'ev4', type: 'paused', description: 'Campaign paused for review', timestamp: '2025-03-08T10:00:00Z' },
  { id: 'ev5', type: 'resumed', description: 'Campaign resumed after review', timestamp: '2025-03-10T09:00:00Z' },
]

// ───────────────────────────────────────────────
// EMPLOYEE DETAIL DATA
// ───────────────────────────────────────────────
export const MOCK_EMPLOYEE_CAMPAIGNS: EmployeeCampaignRecord[] = [
  { campaignId: 'c1', campaignName: "Ipak Yo'li Bank Fishing", sentAt: '2025-03-05T09:00:00Z', clickedAt: '2025-03-05T09:12:00Z', trainedAt: null, result: 'clicked' },
  { campaignId: 'c2', campaignName: 'Telegram Gift Scam Test', sentAt: '2025-02-12T09:00:00Z', clickedAt: null, trainedAt: '2025-02-13T10:00:00Z', result: 'passed' },
  { campaignId: 'c5', campaignName: 'Password Reset Q1', sentAt: '2025-01-10T09:00:00Z', clickedAt: null, trainedAt: '2025-01-12T10:00:00Z', result: 'passed' },
]

export const MOCK_EMPLOYEE_TRAININGS: TrainingRecord[] = [
  { moduleId: 'm1', moduleName: 'Phishing Basics', completedAt: '2025-01-15T11:00:00Z', score: 85, status: 'completed', progress: 100 },
  { moduleId: 'm2', moduleName: 'Password Security', completedAt: '2025-02-20T11:00:00Z', score: 72, status: 'completed', progress: 100 },
  { moduleId: 'm3', moduleName: 'Social Engineering', completedAt: null, score: 0, status: 'in_progress', progress: 45 },
  { moduleId: 'm4', moduleName: 'Secure Browsing', completedAt: null, score: 0, status: 'not_started', progress: 0 },
]

export const MOCK_EMPLOYEE_ACTIVITIES: EmployeeActivity[] = [
  { id: 'a1', type: 'clicked', description: 'Clicked phishing link in "Bank Fishing" campaign', timestamp: '2025-03-05T09:12:00Z', createdAt: '2025-03-05T09:12:00Z' },
  { id: 'a2', type: 'training_completed', description: 'Completed "Password Security" training module', timestamp: '2025-02-20T11:00:00Z', createdAt: '2025-02-20T11:00:00Z' },
  { id: 'a3', type: 'campaign_sent', description: 'Received phishing simulation email', timestamp: '2025-02-12T09:00:00Z', createdAt: '2025-02-12T09:00:00Z' },
  { id: 'a4', type: 'training_completed', description: 'Completed "Phishing Basics" training module', timestamp: '2025-01-15T11:00:00Z', createdAt: '2025-01-15T11:00:00Z' },
  { id: 'a5', type: 'login', description: 'Logged into employee portal', timestamp: '2025-01-10T08:55:00Z', createdAt: '2025-01-10T08:55:00Z' },
]

// ───────────────────────────────────────────────
// TRAINING MODULES
// ───────────────────────────────────────────────
export const MOCK_TRAINING_MODULES = [
  { id: 'm1', key: 'phishingBasics', duration: 15, completionRate: 78, totalEmployees: 150, icon: '🎣', color: '#EF4444' },
  { id: 'm2', key: 'passwordSecurity', duration: 10, completionRate: 64, totalEmployees: 150, icon: '🔐', color: '#F59E0B' },
  { id: 'm3', key: 'socialEngineering', duration: 20, completionRate: 52, totalEmployees: 150, icon: '🎭', color: '#8B5CF6' },
  { id: 'm4', key: 'secureBrowsing', duration: 12, completionRate: 45, totalEmployees: 150, icon: '🌐', color: '#1A6FFF' },
]
