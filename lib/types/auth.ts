/** Authenticated user record — matches /api/auth/me & /api/auth/login */
export interface AuthUser {
  id: number
  company_id: number | null
  name: string
  email: string
  phone: string | null
  roles: string[]
  permissions: string[]
  created_at: string
  updated_at: string
}

/** Login request payload */
export interface LoginCredentials {
  email: string
  password: string
  device_name?: string
}

/** Login response from API */
export interface LoginResponse {
  token: string
  user: AuthUser
}

/** /api/auth/me response wrapper */
export interface MeResponse {
  data: AuthUser
}
