'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { Search, Upload, Users, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { useEmployees } from '@/lib/hooks/useEmployees'
import { useDepartments } from '@/lib/hooks/useDepartments'
import { formatDate } from '@/lib/utils/formatters'

export default function EmployeesPage() {
  const t = useTranslations('employees')
  const tCommon = useTranslations('common')
  const locale = useLocale()

  const [search, setSearch] = useState('')
  const [departmentId, setDepartmentId] = useState<number | undefined>(undefined)
  const [statusFilter, setStatusFilter] = useState<'active' | 'inactive' | undefined>(undefined)

  const { data, isLoading } = useEmployees({
    search: search || undefined,
    department_id: departmentId,
    status: statusFilter,
  })

  const { data: deptData } = useDepartments()
  const departments = deptData?.data ?? []
  const employees = data?.data ?? []
  const total = data?.meta?.total ?? employees.length

  return (
    <div className="page-container">
      <PageHeader
        title={t('title')}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="outline" size="sm" id="import-employees-btn">
              <Upload style={{ width: 16, height: 16 }} />
              {t('import')}
            </Button>
            <Button size="sm" id="add-employee-btn">
              <Plus style={{ width: 16, height: 16 }} />
              {tCommon('add')}
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: 320 }}>
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
            id="employee-search"
            type="text"
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              height: 36,
              paddingLeft: 36,
              paddingRight: 12,
              fontSize: 14,
              color: 'var(--text-primary)',
              backgroundColor: 'white',
              border: '1px solid var(--border)',
              borderRadius: 8,
              outline: 'none',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(26,111,255,0.1)' }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' }}
          />
        </div>

        {/* Department filter */}
        <div style={{ flex: '0 0 auto', minWidth: 180 }}>
          <Select
            value={departmentId?.toString() ?? 'all'}
            onValueChange={(v) => setDepartmentId(v === 'all' ? undefined : Number(v))}
          >
            <SelectTrigger id="dept-filter">
              <SelectValue placeholder={t('department')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{tCommon('all')}</SelectItem>
              {departments.map((d) => (
                <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status filter */}
        <div style={{ flex: '0 0 auto', minWidth: 140 }}>
          <Select
            value={statusFilter ?? 'all'}
            onValueChange={(v) => setStatusFilter(v === 'all' ? undefined : v as 'active' | 'inactive')}
          >
            <SelectTrigger id="status-filter">
              <SelectValue placeholder={tCommon('status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{tCommon('all')}</SelectItem>
              <SelectItem value="active">{t('status.active')}</SelectItem>
              <SelectItem value="inactive">{t('status.inactive')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: 12,
          border: '1px solid var(--border)',
          overflowX: 'auto',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}
      >
        {isLoading ? (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[...Array(8)].map((_, i) => <Skeleton key={i} style={{ height: 56 }} />)}
          </div>
        ) : employees.length === 0 ? (
          <EmptyState icon={<Users style={{ width: 32, height: 32 }} />} title={t('noEmployees')} />
        ) : (
          <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }} aria-label="Employees table">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface-secondary)' }}>
                {[tCommon('name'), t('department'), t('position'), tCommon('status'), ''].map((h, i) => (
                  <th
                    key={i}
                    style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: 11,
                      fontWeight: 600,
                      color: 'var(--muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => {
                const initials = emp.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
                return (
                  <tr
                    key={emp.id}
                    style={{
                      borderBottom: '1px solid var(--border)',
                      transition: 'background-color 0.1s',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-secondary)' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Avatar style={{ width: 36, height: 36, flexShrink: 0 }}>
                          <AvatarFallback style={{ fontSize: 12 }}>{initials}</AvatarFallback>
                        </Avatar>
                        <div style={{ minWidth: 0 }}>
                          <Link
                            href={`/${locale}/employees/${emp.id}`}
                            style={{
                              display: 'block',
                              fontWeight: 500,
                              color: 'var(--text-primary)',
                              textDecoration: 'none',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--accent)' }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)' }}
                          >
                            {emp.name}
                          </Link>
                          <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0, whiteSpace: 'nowrap' }}>{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      {emp.department?.name ?? '—'}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      {emp.position ?? '—'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <Badge variant={emp.status === 'active' ? 'success' : 'secondary'}>
                        {t(`status.${emp.status}` as Parameters<typeof t>[0])}
                      </Badge>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <Link
                        href={`/${locale}/employees/${emp.id}`}
                        style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.textDecoration = 'underline' }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.textDecoration = 'none' }}
                      >
                        {tCommon('view')}
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      {total > 0 && (
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          {tCommon('total')}: <strong>{total}</strong>
        </p>
      )}
    </div>
  )
}
