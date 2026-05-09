import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchPermissions,
  fetchRoles,
  fetchRoleById,
  createRole,
  updateRole,
  deleteRole,
  syncRolePermissions,
  grantRolePermission,
  revokeRolePermission,
} from '@/lib/api/roles'

export const roleKeys = {
  all: ['roles'] as const,
  list: () => [...roleKeys.all, 'list'] as const,
  detail: (id: number) => [...roleKeys.all, 'detail', id] as const,
  permissions: () => ['permissions'] as const,
}

export function usePermissions() {
  return useQuery({
    queryKey: roleKeys.permissions(),
    queryFn: fetchPermissions,
  })
}

export function useRoles() {
  return useQuery({
    queryKey: roleKeys.list(),
    queryFn: fetchRoles,
  })
}

export function useRole(id: number) {
  return useQuery({
    queryKey: roleKeys.detail(id),
    queryFn: () => fetchRoleById(id),
    enabled: !!id,
  })
}

export function useCreateRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createRole,
    onSuccess: () => qc.invalidateQueries({ queryKey: roleKeys.all }),
  })
}

export function useUpdateRole(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Parameters<typeof updateRole>[1]) => updateRole(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: roleKeys.all }),
  })
}

export function useDeleteRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteRole,
    onSuccess: () => qc.invalidateQueries({ queryKey: roleKeys.all }),
  })
}

export function useSyncRolePermissions(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (names: string[]) => syncRolePermissions(id, names),
    onSuccess: () => qc.invalidateQueries({ queryKey: roleKeys.all }),
  })
}

export function useGrantRolePermission(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (name: string) => grantRolePermission(id, name),
    onSuccess: () => qc.invalidateQueries({ queryKey: roleKeys.detail(id) }),
  })
}

export function useRevokeRolePermission(roleId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (permission: string) => revokeRolePermission(roleId, permission),
    onSuccess: () => qc.invalidateQueries({ queryKey: roleKeys.detail(roleId) }),
  })
}
