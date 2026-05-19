'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { UserCog, Plus, Pencil, Trash2, Shield, KeyRound, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
  useUsers,
  useCreateUser,
  useUpdateUser,
  useUpdateUserRoles,
  useDeleteUser,
} from '@/lib/hooks/useUsers'
import { useRoles } from '@/lib/hooks/useRoles'
import { useCompanies } from '@/lib/hooks/useCompanies'
import { useAuthStore } from '@/lib/store/useAuthStore'
import type { ApiUser } from '@/lib/api/users'

interface FormState {
  name: string
  email: string
  phone: string
  password: string
  company_id: number | ''
  role_names: string[]
}

const emptyForm: FormState = {
  name: '',
  email: '',
  phone: '',
  password: '',
  company_id: '',
  role_names: [],
}

export default function UsersPage() {
  const t = useTranslations('users')
  const tCommon = useTranslations('common')
  const { user: currentUser } = useAuthStore()
  const isSuper = currentUser?.roles?.includes('super_admin') ?? false

  const [search, setSearch] = useState('')
  const { data: usersData, isLoading } = useUsers({ search: search || undefined })
  const { data: rolesData } = useRoles()
  const { data: companiesData } = useCompanies(50)
  const createMutation = useCreateUser()
  const deleteMutation = useDeleteUser()
  const updateRolesMutation = useUpdateUserRoles()

  const [editing, setEditing] = useState<ApiUser | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [roleDialogOpen, setRoleDialogOpen] = useState(false)
  const [roleEditing, setRoleEditing] = useState<ApiUser | null>(null)
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [form, setForm] = useState<FormState>(emptyForm)

  const users = usersData?.data ?? []
  const roles = rolesData?.data ?? []
  const companies = companiesData?.data ?? []
  const editMutation = useUpdateUser(editing?.id ?? 0)

  const openCreate = () => {
    setEditing(null)
    setForm({ ...emptyForm, role_names: roles[0]?.name ? [roles[0].name] : [] })
    setDialogOpen(true)
  }

  const openEdit = (u: ApiUser) => {
    setEditing(u)
    setForm({
      name: u.name,
      email: u.email,
      phone: u.phone ?? '',
      password: '',
      company_id: u.company_id ?? '',
      role_names: u.roles.map((r) => r.name),
    })
    setDialogOpen(true)
  }

  const openRoleEditor = (u: ApiUser) => {
    setRoleEditing(u)
    setSelectedRoles(u.roles.map((r) => r.name))
    setRoleDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error(t('errors.required'))
      return
    }
    if (!editing && !form.password) {
      toast.error(t('errors.passwordRequired'))
      return
    }
    try {
      if (editing) {
        const payload: Parameters<typeof editMutation.mutateAsync>[0] = {
          name: form.name,
          email: form.email,
        }
        if (form.phone) payload.phone = form.phone
        if (form.password) payload.password = form.password
        if (isSuper && form.company_id) payload.company_id = Number(form.company_id)
        await editMutation.mutateAsync(payload)
        toast.success(t('updated'))
      } else {
        await createMutation.mutateAsync({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          password: form.password,
          company_id: isSuper && form.company_id ? Number(form.company_id) : undefined,
          role_names: form.role_names.length ? form.role_names : undefined,
        })
        toast.success(t('created'))
      }
      setDialogOpen(false)
    } catch {
      toast.error(tCommon('error'))
    }
  }

  const handleRoleSave = async () => {
    if (!roleEditing) return
    try {
      await updateRolesMutation.mutateAsync({ id: roleEditing.id, role_names: selectedRoles })
      toast.success(t('rolesUpdated'))
      setRoleDialogOpen(false)
    } catch {
      toast.error(tCommon('error'))
    }
  }

  const handleDelete = async (u: ApiUser) => {
    if (u.id === currentUser?.id) {
      toast.error(t('errors.cannotDeleteSelf'))
      return
    }
    if (!confirm(t('confirmDelete', { name: u.name }))) return
    try {
      await deleteMutation.mutateAsync(u.id)
      toast.success(t('deleted'))
    } catch {
      toast.error(tCommon('error'))
    }
  }

  const toggleRole = (name: string) => {
    setSelectedRoles((prev) =>
      prev.includes(name) ? prev.filter((r) => r !== name) : [...prev, name],
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
          <Button id="new-user-btn" size="sm" onClick={openCreate}>
            <Plus style={{ width: 16, height: 16 }} />
            {t('add')}
          </Button>
        }
      />

      <div style={{ position: 'relative', maxWidth: 360 }}>
        <Search
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 16,
            height: 16,
            color: 'var(--muted)',
            pointerEvents: 'none',
          }}
        />
        <input
          id="user-search"
          type="text"
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            ...inputBase,
            height: 36,
            paddingLeft: 36,
          }}
        />
      </div>

      <div
        className="cyber-corners"
        style={{
          position: 'relative',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 4,
          overflowX: 'auto',
        }}
      >
        {isLoading ? (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[...Array(5)].map((_, i) => <Skeleton key={i} style={{ height: 56 }} />)}
          </div>
        ) : users.length === 0 ? (
          <EmptyState
            icon={<UserCog style={{ width: 32, height: 32 }} />}
            title={t('empty')}
            description={t('emptyDesc')}
            actionLabel={t('add')}
            onAction={openCreate}
          />
        ) : (
          <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }} aria-label="Users">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface-secondary)' }}>
                {[tCommon('name'), tCommon('email'), t('roles'), tCommon('actions')].map((h, i) => (
                  <th
                    key={i}
                    style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: 10,
                      fontWeight: 600,
                      color: 'var(--muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.14em',
                      whiteSpace: 'nowrap',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const initials = u.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
                const isCurrent = u.id === currentUser?.id
                return (
                  <tr
                    key={u.id}
                    style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-secondary)' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Avatar style={{ width: 34, height: 34, border: '1px solid var(--border-accent)' }}>
                          <AvatarFallback
                            style={{
                              fontSize: 11,
                              backgroundColor: 'var(--surface-secondary)',
                              color: 'var(--accent)',
                              fontFamily: 'var(--font-mono)',
                              fontWeight: 700,
                            }}
                          >
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontWeight: 600, color: 'var(--text-primary)', margin: 0, fontSize: 13 }}>
                            {u.name}
                            {isCurrent && (
                              <Badge variant="default" style={{ marginLeft: 8 }}>
                                {t('you')}
                              </Badge>
                            )}
                          </p>
                          <p
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: 10,
                              color: 'var(--muted)',
                              margin: 0,
                              letterSpacing: '0.06em',
                            }}
                          >
                            uid #{u.id.toString(16).padStart(6, '0')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                      {u.email}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {u.roles.length === 0 ? (
                          <Badge variant="secondary">—</Badge>
                        ) : (
                          u.roles.map((r) => (
                            <Badge key={r.id} variant="default">{r.name}</Badge>
                          ))
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Button variant="outline" size="sm" onClick={() => openRoleEditor(u)} aria-label={t('manageRoles')}>
                          <Shield style={{ width: 12, height: 12 }} />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openEdit(u)} aria-label={tCommon('edit')}>
                          <Pencil style={{ width: 12, height: 12 }} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isCurrent}
                          onClick={() => handleDelete(u)}
                          style={{ color: isCurrent ? 'var(--muted)' : 'var(--danger)', borderColor: 'rgba(255,59,92,0.3)' }}
                          aria-label={tCommon('delete')}
                        >
                          <Trash2 style={{ width: 12, height: 12 }} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            <div>
              <label style={labelStyle}>[ {tCommon('name')} ]</label>
              <input style={inputBase} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>[ {tCommon('email')} ]</label>
              <input type="email" style={inputBase} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>[ {t('phone')} ]</label>
              <input style={inputBase} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>
                <KeyRound style={{ width: 10, height: 10, display: 'inline', marginRight: 4 }} />
                [ {t('password')}{editing ? ` · ${t('passwordOptional')}` : ''} ]
              </label>
              <input type="password" style={inputBase} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            {isSuper && (
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>[ {t('company')} ]</label>
                <select
                  style={inputBase}
                  value={form.company_id || ''}
                  onChange={(e) => setForm({ ...form, company_id: e.target.value ? Number(e.target.value) : '' })}
                >
                  <option value="">—</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}
            {!editing && (
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>[ {t('initialRole')} ]</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {roles.map((r) => {
                    const active = form.role_names.includes(r.name)
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() =>
                          setForm((f) => ({
                            ...f,
                            role_names: active ? f.role_names.filter((n) => n !== r.name) : [...f.role_names, r.name],
                          }))
                        }
                        style={{
                          padding: '6px 12px',
                          fontSize: 11,
                          fontFamily: 'var(--font-mono)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          borderRadius: 3,
                          cursor: 'pointer',
                          backgroundColor: active ? 'var(--accent-tint)' : 'var(--surface-secondary)',
                          border: `1px solid ${active ? 'var(--border-accent)' : 'var(--border)'}`,
                          color: active ? 'var(--accent)' : 'var(--text-secondary)',
                        }}
                      >
                        {r.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>{tCommon('cancel')}</Button>
            <Button
              id="save-user"
              onClick={handleSave}
              disabled={createMutation.isPending || editMutation.isPending}
            >
              {tCommon('save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Role editor dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <Shield style={{ width: 16, height: 16, display: 'inline', marginRight: 6, color: 'var(--accent)' }} />
              {t('manageRolesFor', { name: roleEditing?.name ?? '' })}
            </DialogTitle>
            <DialogDescription>{t('manageRolesDesc')}</DialogDescription>
          </DialogHeader>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 320, overflowY: 'auto' }}>
            {roles.map((r) => {
              const active = selectedRoles.includes(r.name)
              return (
                <label
                  key={r.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    borderRadius: 4,
                    cursor: 'pointer',
                    backgroundColor: active ? 'var(--accent-tint)' : 'var(--surface-secondary)',
                    border: `1px solid ${active ? 'var(--border-accent)' : 'var(--border)'}`,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleRole(r.name)}
                    style={{ accentColor: 'var(--accent)' }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: active ? 'var(--accent)' : 'var(--text-primary)', margin: 0, fontWeight: 600 }}>
                      {r.name}
                    </p>
                    {r.description && (
                      <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: 0 }}>{r.description}</p>
                    )}
                  </div>
                  <Badge variant="outline">{r.permissions?.length ?? 0} perms</Badge>
                </label>
              )
            })}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>{tCommon('cancel')}</Button>
            <Button id="save-user-roles" onClick={handleRoleSave} disabled={updateRolesMutation.isPending}>
              {tCommon('save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
