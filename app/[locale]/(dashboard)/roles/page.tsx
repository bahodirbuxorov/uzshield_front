'use client'

import { useState, useMemo, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { ShieldCheck, Plus, Pencil, Trash2, Lock, KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { toast } from 'sonner'
import {
  useRoles,
  usePermissions,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
  useSyncRolePermissions,
} from '@/lib/hooks/useRoles'
import type { Role } from '@/lib/api/roles'

const PROTECTED_ROLES = new Set(['super_admin', 'company_admin'])

export default function RolesPage() {
  const t = useTranslations('roles')
  const tCommon = useTranslations('common')

  const { data: rolesData, isLoading } = useRoles()
  const { data: permissionList } = usePermissions()
  const createMutation = useCreateRole()
  const deleteMutation = useDeleteRole()

  const roles = rolesData?.data ?? []
  const permissions = permissionList ?? []

  const [editing, setEditing] = useState<Role | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [permDialogOpen, setPermDialogOpen] = useState(false)
  const [permEditing, setPermEditing] = useState<Role | null>(null)
  const [selectedPerms, setSelectedPerms] = useState<string[]>([])
  const [form, setForm] = useState({ name: '', description: '' })
  const [permFilter, setPermFilter] = useState('')

  const editMutation = useUpdateRole(editing?.id ?? 0)
  const syncPermsMutation = useSyncRolePermissions(permEditing?.id ?? 0)

  const filteredPerms = useMemo(() => {
    if (!permFilter) return permissions
    return permissions.filter((p) => p.name.toLowerCase().includes(permFilter.toLowerCase()))
  }, [permissions, permFilter])

  useEffect(() => {
    if (permEditing) {
      setSelectedPerms(permEditing.permissions.map((p) => p.name))
    }
  }, [permEditing])

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', description: '' })
    setDialogOpen(true)
  }

  const openEdit = (r: Role) => {
    setEditing(r)
    setForm({ name: r.name, description: r.description ?? '' })
    setDialogOpen(true)
  }

  const openPermissionEditor = (r: Role) => {
    setPermEditing(r)
    setPermFilter('')
    setPermDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error(t('errors.nameRequired'))
      return
    }
    try {
      if (editing) {
        await editMutation.mutateAsync({ name: form.name, description: form.description || undefined })
        toast.success(t('updated'))
      } else {
        await createMutation.mutateAsync({ name: form.name, description: form.description || undefined })
        toast.success(t('created'))
      }
      setDialogOpen(false)
    } catch {
      toast.error(tCommon('error'))
    }
  }

  const handleDelete = async (r: Role) => {
    if (PROTECTED_ROLES.has(r.name)) {
      toast.error(t('errors.protectedRole'))
      return
    }
    if (!confirm(t('confirmDelete', { name: r.name }))) return
    try {
      await deleteMutation.mutateAsync(r.id)
      toast.success(t('deleted'))
    } catch {
      toast.error(tCommon('error'))
    }
  }

  const handlePermSave = async () => {
    if (!permEditing) return
    try {
      await syncPermsMutation.mutateAsync(selectedPerms)
      toast.success(t('permissionsUpdated'))
      setPermDialogOpen(false)
    } catch {
      toast.error(tCommon('error'))
    }
  }

  const togglePerm = (name: string) => {
    setSelectedPerms((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name],
    )
  }

  const inputBase: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    fontSize: 13,
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-primary)',
    backgroundColor: 'var(--surface-secondary)',
    border: '1px solid var(--border-strong)',
    borderRadius: 4,
    outline: 'none',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 10,
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.14em',
    marginBottom: 6,
  }

  return (
    <div className="page-container">
      <PageHeader
        title={t('title')}
        description={t('description')}
        actions={
          <Button id="new-role-btn" size="sm" onClick={openCreate}>
            <Plus style={{ width: 16, height: 16 }} />
            {t('add')}
          </Button>
        }
      />

      {isLoading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 12,
          }}
        >
          {[...Array(4)].map((_, i) => <Skeleton key={i} style={{ height: 160 }} />)}
        </div>
      ) : roles.length === 0 ? (
        <div
          className="cyber-corners"
          style={{
            position: 'relative',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 4,
          }}
        >
          <EmptyState
            icon={<ShieldCheck style={{ width: 32, height: 32 }} />}
            title={t('empty')}
            description={t('emptyDesc')}
            actionLabel={t('add')}
            onAction={openCreate}
          />
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 12,
          }}
        >
          {roles.map((r) => {
            const isProtected = PROTECTED_ROLES.has(r.name)
            return (
              <div
                key={r.id}
                className="cyber-corners"
                style={{
                  position: 'relative',
                  padding: 18,
                  backgroundColor: 'var(--surface)',
                  border: `1px solid ${isProtected ? 'var(--border-accent)' : 'var(--border)'}`,
                  borderRadius: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card-hover)'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 4,
                        backgroundColor: 'var(--surface-secondary)',
                        border: '1px solid var(--border-accent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent)',
                        flexShrink: 0,
                        boxShadow: isProtected ? 'var(--shadow-glow-accent)' : 'none',
                      }}
                    >
                      <ShieldCheck style={{ width: 16, height: 16 }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h3
                        style={{
                          fontSize: 14,
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--text-primary)',
                          margin: 0,
                          fontWeight: 700,
                          letterSpacing: '0.04em',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {r.name}
                      </h3>
                      {isProtected && (
                        <p
                          style={{
                            fontSize: 9,
                            fontFamily: 'var(--font-mono)',
                            color: 'var(--accent)',
                            margin: 0,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                          }}
                        >
                          <Lock style={{ width: 9, height: 9, display: 'inline', marginRight: 4 }} />
                          {t('protected')}
                        </p>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <Button variant="ghost" size="icon" onClick={() => openPermissionEditor(r)} aria-label={t('managePermissions')}>
                      <KeyRound style={{ width: 12, height: 12 }} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openEdit(r)} aria-label={tCommon('edit')}>
                      <Pencil style={{ width: 12, height: 12 }} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(r)}
                      disabled={isProtected}
                      style={{ color: isProtected ? 'var(--muted)' : 'var(--danger)' }}
                      aria-label={tCommon('delete')}
                    >
                      <Trash2 style={{ width: 12, height: 12 }} />
                    </Button>
                  </div>
                </div>

                {r.description && (
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    {r.description}
                  </p>
                )}

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 4,
                    paddingTop: 8,
                    borderTop: '1px dashed var(--border)',
                  }}
                >
                  {r.permissions.slice(0, 6).map((p) => (
                    <Badge key={p.id} variant="outline">
                      {p.name}
                    </Badge>
                  ))}
                  {r.permissions.length > 6 && (
                    <Badge variant="default">+{r.permissions.length - 6}</Badge>
                  )}
                  {r.permissions.length === 0 && (
                    <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                      {t('noPermissions')}
                    </span>
                  )}
                </div>

                <div
                  style={{
                    fontSize: 10,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--muted)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  <span style={{ color: 'var(--accent)' }}>{r.permissions.length}</span> / {permissions.length} {t('permissions')}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', marginRight: 8 }}>&gt;</span>
              {editing ? t('edit') : t('add')}
            </DialogTitle>
            <DialogDescription>{editing ? t('editDesc') : t('addDesc')}</DialogDescription>
          </DialogHeader>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={labelStyle}>[ {t('roleName')} ]</label>
              <input id="role-name" style={inputBase} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. analyst" />
            </div>
            <div>
              <label style={labelStyle}>[ {t('descriptionLabel')} ]</label>
              <textarea
                style={{ ...inputBase, minHeight: 80, resize: 'vertical' }}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>{tCommon('cancel')}</Button>
            <Button id="save-role" onClick={handleSave} disabled={createMutation.isPending || editMutation.isPending}>
              {tCommon('save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Permission editor dialog */}
      <Dialog open={permDialogOpen} onOpenChange={setPermDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              <KeyRound style={{ width: 16, height: 16, display: 'inline', marginRight: 6, color: 'var(--accent)' }} />
              {t('managePermissionsFor', { name: permEditing?.name ?? '' })}
            </DialogTitle>
            <DialogDescription>
              {t('selectedCount', { count: selectedPerms.length, total: permissions.length })}
            </DialogDescription>
          </DialogHeader>

          <input
            placeholder={t('filterPermissions')}
            style={{ ...inputBase, marginBottom: 12 }}
            value={permFilter}
            onChange={(e) => setPermFilter(e.target.value)}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 6,
              maxHeight: 360,
              overflowY: 'auto',
              padding: 4,
            }}
          >
            {filteredPerms.map((p) => {
              const active = selectedPerms.includes(p.name)
              return (
                <label
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 10px',
                    borderRadius: 4,
                    cursor: 'pointer',
                    backgroundColor: active ? 'var(--accent-tint)' : 'var(--surface-secondary)',
                    border: `1px solid ${active ? 'var(--border-accent)' : 'var(--border)'}`,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: active ? 'var(--accent)' : 'var(--text-secondary)',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => togglePerm(p.name)}
                    style={{ accentColor: 'var(--accent)' }}
                  />
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.name}
                  </span>
                </label>
              )
            })}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPermDialogOpen(false)}>{tCommon('cancel')}</Button>
            <Button
              variant="secondary"
              onClick={() => setSelectedPerms(permissions.map((p) => p.name))}
            >
              {t('selectAll')}
            </Button>
            <Button variant="secondary" onClick={() => setSelectedPerms([])}>
              {t('clearAll')}
            </Button>
            <Button id="save-perms" onClick={handlePermSave} disabled={syncPermsMutation.isPending}>
              {tCommon('save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
