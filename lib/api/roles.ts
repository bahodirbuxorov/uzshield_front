import api from '@/lib/api/axios'
import type { PaginatedResponse } from '@/lib/types/employee'

/** Permission record */
export interface Permission {
  id: number
  name: string
  guard_name: string
}

/** Role record */
export interface Role {
  id: number
  name: string
  description: string | null
  guard_name: string
  permissions: Permission[]
  created_at: string
  updated_at: string
}

/**
 * List the full permission catalog.
 * GET /api/permissions
 */
export async function fetchPermissions(): Promise<Permission[]> {
  const res = await api.get<{ data: Permission[] }>('/api/permissions')
  return res.data.data
}

/**
 * List all roles with their permissions.
 * GET /api/roles
 */
export async function fetchRoles(): Promise<PaginatedResponse<Role>> {
  const res = await api.get<PaginatedResponse<Role>>('/api/roles')
  return res.data
}

/**
 * Get a role with its permissions.
 * GET /api/roles/{role}
 */
export async function fetchRoleById(id: number): Promise<Role> {
  const res = await api.get<{ data: Role }>(`/api/roles/${id}`)
  return res.data.data
}

/**
 * Create a role.
 * POST /api/roles
 */
export async function createRole(payload: {
  name: string
  description?: string
  permission_names?: string[]
}): Promise<Role> {
  const res = await api.post<{ data: Role }>('/api/roles', payload)
  return res.data.data
}

/**
 * Update a role's name or description.
 * PUT /api/roles/{role}
 */
export async function updateRole(
  id: number,
  payload: Partial<{ name: string; description: string }>
): Promise<Role> {
  const res = await api.put<{ data: Role }>(`/api/roles/${id}`, payload)
  return res.data.data
}

/**
 * Delete a role (blocked if protected).
 * DELETE /api/roles/{role}
 */
export async function deleteRole(id: number): Promise<void> {
  await api.delete(`/api/roles/${id}`)
}

/**
 * Sync the full permission list on a role.
 * PUT /api/roles/{role}/permissions
 */
export async function syncRolePermissions(id: number, permission_names: string[]): Promise<Role> {
  const res = await api.put<{ data: Role }>(`/api/roles/${id}/permissions`, { permission_names })
  return res.data.data
}

/**
 * Grant one permission to a role.
 * POST /api/roles/{role}/permissions
 */
export async function grantRolePermission(id: number, permission_name: string): Promise<Role> {
  const res = await api.post<{ data: Role }>(`/api/roles/${id}/permissions`, { permission_name })
  return res.data.data
}

/**
 * Revoke a permission from a role.
 * DELETE /api/roles/{role}/permissions/{permission}
 */
export async function revokeRolePermission(roleId: number, permission: string): Promise<void> {
  await api.delete(`/api/roles/${roleId}/permissions/${permission}`)
}
