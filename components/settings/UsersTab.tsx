'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Plus, Edit2, Trash2, Shield } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useUsers, useCreateUser, useUpdateUserRoles, useDeleteUser } from '@/lib/hooks/useUsers'
import { useRoles } from '@/lib/hooks/useRoles'
import { toast } from 'sonner'
import type { ApiUser } from '@/lib/api/users'

export function UsersTab() {
  const t = useTranslations('settings')
  const tCommon = useTranslations('common')
  const { data: usersData, isLoading: usersLoading } = useUsers()
  const { data: rolesData } = useRoles()
  const createUser = useCreateUser()
  const updateRoles = useUpdateUserRoles()
  const deleteUser = useDeleteUser()

  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'company_admin' })

  const users = usersData?.data ?? []
  const roles = rolesData?.data ?? []

  const handleCreateUser = async () => {
    if (!form.name || !form.email || !form.password) {
      toast.error(`Barcha maydonlarni to'ldiring`)
      return
    }
    try {
      await createUser.mutateAsync({
        name: form.name,
        email: form.email,
        password: form.password,
        role_names: [form.role],
      })
      toast.success("Foydalanuvchi yaratildi")
      setShowCreateModal(false)
      setForm({ name: '', email: '', password: '', role: 'company_admin' })
    } catch {
      toast.error("Xatolik yuz berdi")
    }
  }

  const handleDeleteUser = async (id: number) => {
    if (!confirm(`Rostdan ham o'chirmoqchimisiz?`)) return
    try {
      await deleteUser.mutateAsync(id)
      toast.success(`Foydalanuvchi o'chirildi`)
    } catch {
      toast.error("Xatolik yuz berdi")
    }
  }

  const handleUpdateRole = async (roleName: string) => {
    if (!selectedUser) return
    try {
      await updateRoles.mutateAsync({ id: selectedUser.id, role_names: [roleName] })
      setShowRoleModal(false)
      toast.success('Rol yangilandi')
    } catch {
      toast.error('Xatolik yuz berdi')
    }
  }

  return (
    <Card>
      <CardHeader style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <CardTitle style={{ fontSize: 15 }}>Foydalanuvchilar va Rollar</CardTitle>
        <Button size="sm" onClick={() => setShowCreateModal(true)}>
          <Plus style={{ width: 14, height: 14, marginRight: 4 }} />
          Foydalanuvchi qo&apos;shish
        </Button>
      </CardHeader>
      <CardContent style={{ padding: 0 }}>
        {usersLoading ? (
          <div style={{ padding: 20, textAlign: 'center', color: 'var(--muted)' }}>Yuklanmoqda...</div>
        ) : (
          <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface-secondary)' }}>
                {['Foydalanuvchi', 'Email', 'Rollar', 'Harakatlar'].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--text-primary)' }}>{u.name}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {u.roles?.map(r => (
                        <Badge key={r.id} variant="outline" style={{ backgroundColor: '#F3F4F6' }}>{r.name}</Badge>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Button variant="outline" size="sm" onClick={() => { setSelectedUser(u); setShowRoleModal(true); }}>
                        <Shield style={{ width: 14, height: 14 }} />
                      </Button>
                      <Button variant="outline" size="sm" style={{ color: 'var(--danger)' }} onClick={() => handleDeleteUser(u.id)}>
                        <Trash2 style={{ width: 14, height: 14 }} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Yangi foydalanuvchi</DialogTitle></DialogHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>Ism</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>Email</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>Parol</label>
              <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>Rol</label>
              <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', outline: 'none', backgroundColor: 'white' }}>
                {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                {roles.length === 0 && <option value="company_admin">Company Admin</option>}
              </select>
            </div>
            <Button onClick={handleCreateUser} disabled={createUser.isPending}>Saqlash</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
