'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Building2, Plus, Pencil, Trash2, Users, ShieldAlert } from 'lucide-react'
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
  useCompanies,
  useCreateCompany,
  useUpdateCompany,
  useDeleteCompany,
} from '@/lib/hooks/useCompanies'
import type { Company } from '@/lib/api/companies'
import { useAuthStore } from '@/lib/store/useAuthStore'

interface FormState {
  name: string
  industry: string
  size: string
  contact_email: string
  contact_phone: string
  status: 'active' | 'inactive'
}

const emptyForm: FormState = {
  name: '',
  industry: '',
  size: '',
  contact_email: '',
  contact_phone: '',
  status: 'active',
}

export default function CompaniesPage() {
  const t = useTranslations('companies')
  const tCommon = useTranslations('common')
  const { user } = useAuthStore()
  const isSuper = user?.roles?.includes('super_admin') ?? false

  const { data, isLoading } = useCompanies(50)
  const createMutation = useCreateCompany()
  const deleteMutation = useDeleteCompany()

  const [editing, setEditing] = useState<Company | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)

  const companies = data?.data ?? []
  const total = data?.meta?.total ?? companies.length
  const editMutation = useUpdateCompany(editing?.id ?? 0)

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEdit = (c: Company) => {
    setEditing(c)
    setForm({
      name: c.name,
      industry: c.industry ?? '',
      size: c.size?.toString() ?? '',
      contact_email: c.contact_email ?? '',
      contact_phone: c.contact_phone ?? '',
      status: c.status,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error(t('errors.nameRequired'))
      return
    }
    const payload = {
      name: form.name,
      industry: form.industry || undefined,
      size: form.size ? Number(form.size) : undefined,
      contact_email: form.contact_email || undefined,
      contact_phone: form.contact_phone || undefined,
      status: form.status,
    }
    try {
      if (editing) {
        await editMutation.mutateAsync(payload)
        toast.success(t('updated'))
      } else {
        await createMutation.mutateAsync(payload)
        toast.success(t('created'))
      }
      setDialogOpen(false)
    } catch {
      toast.error(tCommon('error'))
    }
  }

  const handleDelete = async (c: Company) => {
    if (!confirm(t('confirmDelete', { name: c.name }))) return
    try {
      await deleteMutation.mutateAsync(c.id)
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
          isSuper && (
            <Button id="new-company-btn" size="sm" onClick={openCreate}>
              <Plus style={{ width: 16, height: 16 }} />
              {t('add')}
            </Button>
          )
        }
      />

      {!isSuper && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: 12,
            border: '1px dashed var(--border-strong)',
            borderRadius: 4,
            backgroundColor: 'var(--warning-light)',
            color: 'var(--warning)',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
          }}
        >
          <ShieldAlert style={{ width: 14, height: 14 }} />
          {t('superAdminOnly')}
        </div>
      )}

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
        ) : companies.length === 0 ? (
          <EmptyState
            icon={<Building2 style={{ width: 32, height: 32 }} />}
            title={t('empty')}
            description={t('emptyDesc')}
            actionLabel={isSuper ? t('add') : undefined}
            onAction={isSuper ? openCreate : undefined}
          />
        ) : (
          <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }} aria-label="Companies">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface-secondary)' }}>
                {[tCommon('name'), t('industry'), t('size'), tCommon('email'), tCommon('status'), ''].map((h, i) => (
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
              {companies.map((c) => (
                <tr
                  key={c.id}
                  style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-secondary)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 30,
                          height: 30,
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
                        <Building2 style={{ width: 14, height: 14 }} />
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, color: 'var(--text-primary)', margin: 0, fontSize: 13 }}>{c.name}</p>
                        <p
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 10,
                            color: 'var(--muted)',
                            margin: 0,
                            letterSpacing: '0.06em',
                          }}
                        >
                          #{c.id.toString(16).padStart(6, '0')}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{c.industry ?? '—'}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                    {c.size != null ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <Users style={{ width: 12, height: 12 }} /> {c.size}
                      </span>
                    ) : '—'}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{c.contact_email ?? '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <Badge variant={c.status === 'active' ? 'success' : 'secondary'}>{t(`status.${c.status}`)}</Badge>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {isSuper && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Button variant="outline" size="sm" onClick={() => openEdit(c)} aria-label={tCommon('edit')}>
                          <Pencil style={{ width: 12, height: 12 }} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(c)}
                          style={{ color: 'var(--danger)', borderColor: 'rgba(255,59,92,0.3)' }}
                          aria-label={tCommon('delete')}
                        >
                          <Trash2 style={{ width: 12, height: 12 }} />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {total > 0 && (
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          {tCommon('total')}: <strong>{total}</strong>
        </p>
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>[ {tCommon('name')} ]</label>
              <input id="company-name" style={inputBase} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>[ {t('industry')} ]</label>
              <input style={inputBase} value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>[ {t('size')} ]</label>
              <input type="number" style={inputBase} value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>[ {tCommon('email')} ]</label>
              <input type="email" style={inputBase} value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>[ {t('phone')} ]</label>
              <input style={inputBase} value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>[ {tCommon('status')} ]</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['active', 'inactive'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setForm({ ...form, status: s })}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      fontSize: 12,
                      fontFamily: 'var(--font-mono)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      borderRadius: 4,
                      cursor: 'pointer',
                      backgroundColor: form.status === s ? 'var(--accent-tint)' : 'var(--surface-secondary)',
                      border: `1px solid ${form.status === s ? 'var(--border-accent)' : 'var(--border)'}`,
                      color: form.status === s ? 'var(--accent)' : 'var(--text-secondary)',
                    }}
                  >
                    {t(`status.${s}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>{tCommon('cancel')}</Button>
            <Button
              id="save-company"
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
