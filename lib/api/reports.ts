import { MOCK_API_DELAY } from '@/lib/constants'
import { MOCK_REPORT } from '@/lib/constants/mockData'
import type { Report } from '@/lib/types/report'

const delay = () => new Promise<void>((r) => setTimeout(r, MOCK_API_DELAY))

/**
 * Fetch the full analytics report.
 * @param dateRange optional date range filter key
 */
export async function fetchReport(dateRange?: string): Promise<Report> {
  await delay()
  void dateRange
  return { ...MOCK_REPORT, period: dateRange ?? 'Last 30 days' }
}
