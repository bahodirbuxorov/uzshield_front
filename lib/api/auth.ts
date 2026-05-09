import api from '@/lib/api/axios'
import type { AuthUser, LoginCredentials, LoginResponse, MeResponse } from '@/lib/types/auth'

/**
 * Authenticate with the API and receive a Sanctum token.
 * POST /api/auth/login
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/api/auth/login', {
    email: credentials.email,
    password: credentials.password,
    device_name: credentials.device_name ?? 'web',
  })
  return response.data
}

/**
 * Fetch the currently authenticated user.
 * GET /api/auth/me
 */
export async function getMe(): Promise<AuthUser> {
  const response = await api.get<MeResponse>('/api/auth/me')
  return response.data.data
}

/**
 * Revoke the current API token.
 * POST /api/auth/logout
 */
export async function logout(): Promise<void> {
  await api.post('/api/auth/logout')
}
