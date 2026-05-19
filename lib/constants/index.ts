/** Pagination defaults */
export const DEFAULT_PAGE_SIZE = 10
export const PAGE_SIZE_OPTIONS = [10, 25, 50]

/** API base URL */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090'

/** Mock auth credentials */
export const MOCK_AUTH_EMAIL = 'admin@oxupax.uz'
export const MOCK_AUTH_PASSWORD = 'password123'

/** Cookie name used to store auth token */
export const AUTH_COOKIE_NAME = 'oxupax_token'

/** Sidebar widths (in px) */
export const SIDEBAR_WIDTH = 260
export const SIDEBAR_COLLAPSED_WIDTH = 68

/** Risk score thresholds */
export const RISK_THRESHOLDS = {
  low: 33,
  medium: 66,
  high: 90,
} as const

/** Department list for filter dropdowns */
export const DEPARTMENTS = [
  'IT',
  'Finance',
  'HR',
  'Marketing',
  'Sales',
  'Legal',
  'Management',
] as const

/** Simulated API latency in ms */
export const MOCK_API_DELAY = 400
