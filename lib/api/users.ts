import api from '@/lib/api/axios'
import type { PaginatedResponse } from '@/lib/types/employee'
import type { Role } from '@/lib/api/roles'

/** User record from API */
export interface ApiUser {
  id: number
  company_id: number | null
  name: string
  email: string
  phone: string | null
  roles: Role[]
  permissions: string[]
  created_at: string
  updated_at: string
}

/**
 * List users (auto-scoped to caller's tenant).
 * GET /api/users
 */
export async function fetchUsers(params?: {
  search?: string
  company_id?: number
}): Promise<PaginatedResponse<ApiUser>> {
  const res = await api.get<PaginatedResponse<ApiUser>>('/api/users', { params })
  return res.data
}

/**
 * Get a user with roles + permissions.
 * GET /api/users/{user}
 */
export async function fetchUserById(id: number): Promise<ApiUser> {
  const res = await api.get<{ data: ApiUser }>(`/api/users/${id}`)
  return res.data.data
}

/**
 * Create a user and assign roles.
 * POST /api/users
 */
export async function createUser(payload: {
  name: string
  email: string
  phone?: string
  password: string
  company_id?: number
  role_names?: string[]
}): Promise<ApiUser> {
  const res = await api.post<{ data: ApiUser }>('/api/users', payload)
  return res.data.data
}

/**
 * Update a user.
 * PUT /api/users/{user}
 */
export async function updateUser(
  id: number,
  payload: Partial<{
    name: string
    email: string
    phone: string
    password: string
    company_id: number
  }>
): Promise<ApiUser> {
  const res = await api.put<{ data: ApiUser }>(`/api/users/${id}`, payload)
  return res.data.data
}

/**
 * Delete a user (revokes all their tokens).
 * DELETE /api/users/{user}
 */
export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/api/users/${id}`)
}

/**
 * Replace a user's role assignment.
 * PUT /api/users/{user}/roles
 */
export async function updateUserRoles(id: number, role_names: string[]): Promise<ApiUser> {
  const res = await api.put<{ data: ApiUser }>(`/api/users/${id}/roles`, { role_names })
  return res.data.data
}
