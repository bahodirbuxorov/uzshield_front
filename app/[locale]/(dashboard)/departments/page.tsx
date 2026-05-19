'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Layers, Plus, Pencil, Trash2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
  useDepartments,
  useCreateDepartment,
  useUpdateDepartment,
  useDeleteDepartment,
} from '@/lib/hooks/useDepartments'
import { useCompanies } from '@/lib/hooks/useCompanies'
import { useEmployees } from '@/lib/hooks/useEmployees'
import { useAuthStore } from '@/lib/store/useAuthStore'
import type { Department } from '@/lib/types/employee'

export default function DepartmentsPage() {
  const t = useTranslations('departments')
  const tCommon = useTranslations('common')
  const { user } = useAuthStore()
  const isSuper = user?.roles?.includes('super_admin') ?? false

  const { data, isLoading } = useDepartments()
  const { data: empData } = useEmployees()
  const { data: companiesData } = useCompanies(50)
  const createMutation = useCreateDepartment()
  const deleteMutation = useDeleteDepartment()

  const [editing, setEditing] = useState<Department | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', company_id: user?.company_id ?? 0 })

  const departments = data?.data ?? []
  const employees = empData?.data ?? []
  const companies = companiesData?.data ?? []
  const editMutation = useUpdateDepartment(editing?.id ?? 0)

  const employeesByDept = useMemo(() => {
    const map = new Map<number, number>()
    for (const e of employees) {
      if (e.department_id != null) {
        map.set(e.department_id, (map.get(e.department_id) ?? 0) + 1)
      }
    }
    return map
  }, [employees])

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', description: '', company_id: user?.company_id ?? (companies[0]?.id ?? 0) })
    setDialogOpen(true)
  }

  const openEdit = (d: Department) => {
    setEditing(d)
    setForm({ name: d.name, description: d.description ?? '', company_id: d.company_id ?? 0 })
    setDialogOpen(true)
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
        if (!form.company_id) {
          toast.error(t('errors.companyRequired'))
          return
        }
        await createMutation.mutateAsync({
          company_id: form.company_id,
          name: form.name,
          description: form.description || undefined,
        })
        toast.success(t('created'))
      }
      setDialogOpen(false)
    } catch {
      toast.error(tCommon('error'))
    }
  }

  const handleDelete = async (d: Department) => {
    if (!confirm(t('confirmDelete', { name: d.name }))) return
    try {
      await deleteMutation.mutateAsync(d.id)
      toast.success(t('deleted'))
    } catch {
      toast.error(tCommon('error'))
    }
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
          <Button id="new-department-btn" size="sm" onClick={openCreate}>
            <Plus style={{ width: 16, height: 16 }} />
            {t('add')}
          </Button>
        }
      />

      {isLoading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 12,
          }}
        >
          {[...Array(6)].map((_, i) => <Skeleton key={i} style={{ height: 120 }} />)}
        </div>
      ) : departments.length === 0 ? (
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
            icon={<Layers style={{ width: 32, height: 32 }} />}
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
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 12,
          }}
        >
          {departments.map((d) => {
            const count = employeesByDept.get(d.id) ?? 0
            return (
              <div
                key={d.id}
                className="cyber-corners"
                style={{
                  position: 'relative',
                  padding: 16,
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 4,
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-accent)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card-hover)'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 4,
                        backgroundColor: 'var(--surface-secondary)',
                        border: '1px solid var(--border-accent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent)',
                        flexShrink: 0,
                      }}
                    >
                      <Layers style={{ width: 14, height: 14 }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h3
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          margin: 0,
                          fontFamily: 'var(--font-display)',
                          letterSpacing: '0.02em',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {d.name}
                      </h3>
                      <p
                        style={{
                          fontSize: 10,
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--muted)',
                          margin: 0,
                          letterSpacing: '0.08em',
                        }}
                      >
                        dept #{d.id.toString(16).padStart(4, '0')}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <Button variant="ghost" size="icon" onClick={() => openEdit(d)} aria-label={tCommon('edit')}>
                      <Pencil style={{ width: 12, height: 12 }} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(d)}
                      style={{ color: 'var(--danger)' }}
                      aria-label={tCommon('delete')}
                    >
                      <Trash2 style={{ width: 12, height: 12 }} />
                    </Button>
                  </div>
                </div>
                {d.description && (
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    {d.description}
                  </p>
                )}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    paddingTop: 8,
                    borderTop: '1px dashed var(--border)',
                    fontSize: 11,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  <Users style={{ width: 12, height: 12 }} />
                  <span style={{ color: 'var(--accent)' }}>{count}</span>
                  {t('headcount')}
                </div>
              </div>
            )
          })}
        </div>
      )}

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
              <label style={labelStyle}>[ {tCommon('name')} ]</label>
              <input id="dept-name" style={inputBase} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            {!editing && isSuper && (
              <div>
                <label style={labelStyle}>[ {t('company')} ]</label>
                <select
                  style={inputBase}
                  value={form.company_id || ''}
                  onChange={(e) => setForm({ ...form, company_id: Number(e.target.value) })}
                >
                  <option value="">—</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}
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
            <Button
              id="save-department"
              onClick={handleSave}
              disabled={createMutation.isPending || editMutation.isPending}
            >
              {tCommon('save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
