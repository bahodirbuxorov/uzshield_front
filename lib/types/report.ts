/** Single point on a time-series chart */
export interface ChartDataPoint {
  month: string
  clickRate: number
  trainedRate: number
}

/** Risk distribution for donut chart */
export interface RiskDistribution {
  level: 'low' | 'medium' | 'high' | 'critical'
  count: number
  percentage: number
}

/** Per-department risk summary */
export interface DepartmentRisk {
  department: string
  avgRiskScore: number
  employeeCount: number
  clickRate: number
  trainedRate: number
}

/** Channel effectiveness data */
export interface ChannelEffectiveness {
  channel: 'email' | 'telegram' | 'sms'
  sent: number
  clicked: number
  clickRate: number
  trained: number
}

/** Full report response */
export interface Report {
  period: string
  overallClickRate: number
  overallTrainingRate: number
  totalCampaigns: number
  totalEmployeesTargeted: number
  clickRateTrend: ChartDataPoint[]
  riskDistribution: RiskDistribution[]
  departmentRisks: DepartmentRisk[]
  channelEffectiveness: ChannelEffectiveness[]
}
