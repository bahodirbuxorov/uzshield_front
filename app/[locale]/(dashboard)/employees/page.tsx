'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { Search, Upload, Trash2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { useEmployees } from '@/lib/hooks/useEmployees'
import { DEPARTMENTS, DEFAULT_PAGE_SIZE } from '@/lib/constants'
import { formatDate } from '@/lib/utils/formatters'

export default function EmployeesPage() {
  const t = useTranslations('employees')
  const tCommon = useTranslations('common')
  const locale = useLocale()

  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('all')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<string[]>([])

  const { data, isLoading } = useEmployees(page, DEFAULT_PAGE_SIZE, search, department)
  const totalPages = Math.ceil((data?.total ?? 0) / DEFAULT_PAGE_SIZE)

  const toggleSelect = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])

  return (
    <div className="page-container">
      <PageHeader
        title={t('title')}
        actions={
          <Button variant="outline" size="sm" id="import-employees-btn">
            <Upload style={{ width: 16, height: 16 }} />
            {t('import')}
          </Button>
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
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
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

        <div style={{ flex: '0 0 auto', minWidth: 176 }}>
          <Select value={department} onValueChange={(v) => { setDepartment(v); setPage(1) }}>
            <SelectTrigger id="dept-filter">
              <SelectValue placeholder={t('department')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{tCommon('all')}</SelectItem>
              {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {selected.length > 0 && (
          <Button variant="destructive" size="sm" id="bulk-delete">
            <Trash2 style={{ width: 16, height: 16 }} />
            {t('bulkDelete')} ({selected.length})
          </Button>
        )}
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
        ) : data?.data.length === 0 ? (
          <EmptyState icon={<Users style={{ width: 32, height: 32 }} />} title={t('noEmployees')} />
        ) : (
          <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }} aria-label="Employees table">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface-secondary)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', width: 40 }}>
                  <input
                    type="checkbox"
                    aria-label="Select all"
                    onChange={(e) => setSelected(e.target.checked ? (data?.data ?? []).map((emp) => emp.id) : [])}
                    checked={selected.length === (data?.data ?? []).length && selected.length > 0}
                  />
                </th>
                {[tCommon('name'), t('department'), t('riskScore'), t('lastActivity'), tCommon('status'), ''].map((h, i) => (
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
              {(data?.data ?? []).map((emp) => {
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
                      <input
                        type="checkbox"
                        aria-label={`Select ${emp.name}`}
                        checked={selected.includes(emp.id)}
                        onChange={() => toggleSelect(emp.id)}
                      />
                    </td>
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
                      {emp.department}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 64 }}>
                          <Progress value={emp.riskScore} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', width: 24 }}>
                          {emp.riskScore}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                      {formatDate(emp.lastActivity)}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            {tCommon('total')}: {data?.total}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              {tCommon('back')}
            </Button>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{page} / {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              {tCommon('next')}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
