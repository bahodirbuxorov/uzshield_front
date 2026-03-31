import { MOCK_API_DELAY } from '@/lib/constants'
import {
  MOCK_EMPLOYEES,
  MOCK_EMPLOYEE_CAMPAIGNS,
  MOCK_EMPLOYEE_TRAININGS,
  MOCK_EMPLOYEE_ACTIVITIES,
} from '@/lib/constants/mockData'
import type { Employee, EmployeeCampaignRecord, TrainingRecord, EmployeeActivity } from '@/lib/types/employee'

const delay = () => new Promise<void>((r) => setTimeout(r, MOCK_API_DELAY))

/**
 * Fetch paginated employee list with optional search/dept filter.
 */
export async function fetchEmployees(
  page = 1,
  pageSize = 10,
  search = '',
  department = ''
): Promise<{ data: Employee[]; total: number }> {
  await delay()
  let data = [...MOCK_EMPLOYEES]
  if (search) {
    const q = search.toLowerCase()
    data = data.filter(
      (e) => e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q)
    )
  }
  if (department && department !== 'all') {
    data = data.filter((e) => e.department === department)
  }
  const total = data.length
  return { data: data.slice((page - 1) * pageSize, page * pageSize), total }
}

/**
 * Fetch a single employee by ID.
 */
export async function fetchEmployeeById(id: string): Promise<Employee> {
  await delay()
  const emp = MOCK_EMPLOYEES.find((e) => e.id === id)
  if (!emp) throw new Error(`Employee ${id} not found`)
  return emp
}

/**
 * Fetch campaign participation history for an employee.
 */
export async function fetchEmployeeCampaigns(employeeId: string): Promise<EmployeeCampaignRecord[]> {
  await delay()
  void employeeId
  return MOCK_EMPLOYEE_CAMPAIGNS
}

/**
 * Fetch training completion records for an employee.
 */
export async function fetchEmployeeTrainings(employeeId: string): Promise<TrainingRecord[]> {
  await delay()
  void employeeId
  return MOCK_EMPLOYEE_TRAININGS
}

/**
 * Fetch activity timeline for an employee.
 */
export async function fetchEmployeeActivities(employeeId: string): Promise<EmployeeActivity[]> {
  await delay()
  void employeeId
  return MOCK_EMPLOYEE_ACTIVITIES
}

/**
 * Delete employees by IDs.
 */
export async function deleteEmployees(ids: string[]): Promise<void> {
  await delay()
  void ids
}
