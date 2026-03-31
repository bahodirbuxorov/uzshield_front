import { MOCK_API_DELAY, MOCK_AUTH_EMAIL, MOCK_AUTH_PASSWORD } from '@/lib/constants'
import type { AuthUser, LoginCredentials, LoginResponse } from '@/lib/types/auth'

const delay = () => new Promise<void>((r) => setTimeout(r, MOCK_API_DELAY))

const MOCK_USER: AuthUser = {
  id: 'u1',
  name: 'Admin User',
  email: 'admin@uzshield.uz',
  role: 'admin',
  companyId: 'comp1',
  companyName: 'Acme UZ LLC',
}

/**
 * Mock login — returns token + user on valid credentials.
 * @throws Error on invalid credentials
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  await delay()
  if (
    credentials.email !== MOCK_AUTH_EMAIL ||
    credentials.password !== MOCK_AUTH_PASSWORD
  ) {
    throw new Error('invalid_credentials')
  }
  return {
    token: 'mock-jwt-token-' + Date.now(),
    user: MOCK_USER,
  }
}

/**
 * Mock logout — clears stored token.
 */
export async function logout(): Promise<void> {
  await delay()
}
