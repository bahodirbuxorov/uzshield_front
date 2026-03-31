/** Authenticated user record */
export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'viewer'
  companyId: string
  companyName: string
  avatarUrl?: string
}

/** Login request payload */
export interface LoginCredentials {
  email: string
  password: string
}

/** Login response from API */
export interface LoginResponse {
  token: string
  user: AuthUser
}
