import api from '@/lib/api/axios'

/** KPI for a single employee */
export interface EmployeeKPI {
  employee_id: number
  name: string
  campaigns_count: number
  clicked_count: number
  trained_count: number
  click_rate: number | null
  training_rate: number | null
  risk_score: number | null
  risk_level: 'low' | 'medium' | 'high' | 'critical' | null
}

/** KPI for a department */
export interface DepartmentKPI {
  department_id: number
  name: string
  avg_click_rate: number | null
  avg_training_rate: number | null
  avg_risk_score: number | null
  employee_count: number
  top_performers: EmployeeKPI[]
  at_risk_employees: EmployeeKPI[]
}

/** KPI for a company */
export interface CompanyKPI {
  company_id: number
  name: string
  overall_click_rate: number | null
  overall_training_rate: number | null
  overall_risk_score: number | null
  total_employees: number
  total_campaigns: number
  departments: DepartmentKPI[]
}

/**
 * KPI for a single employee.
 * GET /api/kpi/employees/{employee}
 */
export async function fetchEmployeeKPI(employeeId: number): Promise<EmployeeKPI> {
  const res = await api.get<{ data: EmployeeKPI }>(`/api/kpi/employees/${employeeId}`)
  return res.data.data
}

/**
 * KPI for a department.
 * GET /api/kpi/departments/{department}
 */
export async function fetchDepartmentKPI(departmentId: number): Promise<DepartmentKPI> {
  const res = await api.get<{ data: DepartmentKPI }>(`/api/kpi/departments/${departmentId}`)
  return res.data.data
}

/**
 * KPI for a company.
 * GET /api/kpi/companies/{company}
 */
export async function fetchCompanyKPI(companyId: number): Promise<CompanyKPI> {
  const res = await api.get<{ data: CompanyKPI }>(`/api/kpi/companies/${companyId}`)
  return res.data.data
}
