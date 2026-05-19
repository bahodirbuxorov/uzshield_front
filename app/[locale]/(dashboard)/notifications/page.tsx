'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Bell, Send, Mail, Inbox, Smartphone, Plus, AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import {
  useNotifications,
  useNotificationStatistics,
  useSendNotification,
} from '@/lib/hooks/useNotifications'
import { useEmployees } from '@/lib/hooks/useEmployees'
import { formatDate } from '@/lib/utils/formatters'

type Channel = 'email' | 'sms' | 'in_app'

const channelIcon: Record<Channel, typeof Mail> = {
  email: Mail,
  sms: Smartphone,
  in_app: Inbox,
}

export default function NotificationsPage() {
  const t = useTranslations('notifications')
  const tCommon = useTranslations('common')

  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [channelFilter, setChannelFilter] = useState<string>('all')
  const [composerOpen, setComposerOpen] = useState(false)

  const [form, setForm] = useState<{
    channel: Channel
    subject: string
    body: string
    employee_ids: number[]
  }>({ channel: 'email', subject: '', body: '', employee_ids: [] })

  const { data: notifData, isLoading } = useNotifications({
    status: statusFilter === 'all' ? undefined : statusFilter,
    channel: channelFilter === 'all' ? undefined : channelFilter,
  })
  const { data: stats } = useNotificationStatistics()
  const { data: empData } = useEmployees({ status: 'active' })
  const sendMutation = useSendNotification()

  const notifications = notifData?.data ?? []
  const employees = empData?.data ?? []

  const toggleEmployee = (id: number) => {
    setForm((f) => ({
      ...f,
      employee_ids: f.employee_ids.includes(id)
        ? f.employee_ids.filter((e) => e !== id)
        : [...f.employee_ids, id],
    }))
  }

  const handleSend = async () => {
    if (!form.subject) {
      toast.error(t('errors.subjectRequired'))
      return
    }
    if (!form.body) {
      toast.error(t('errors.bodyRequired'))
      return
    }
    if (form.employee_ids.length === 0) {
      toast.error(t('errors.recipientsRequired'))
      return
    }
    try {
      const res = await sendMutation.mutateAsync({
        channel: form.channel,
        subject: form.subject,
        body: form.body,
        employee_ids: form.employee_ids,
      })
      toast.success(t('sentSuccess', { count: res.sent }))
      setComposerOpen(false)
      setForm({ channel: 'email', subject: '', body: '', employee_ids: [] })
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

  return (
    <div className="page-container">
      <PageHeader
        title={t('title')}
        description={t('description')}
        actions={
          <Button id="compose-notification-btn" size="sm" onClick={() => setComposerOpen(true)}>
            <Plus style={{ width: 16, height: 16 }} />
            {t('compose')}
          </Button>
        }
      />

      {/* Stats strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 12,
        }}
      >
        {[
          { label: t('stats.total'), value: stats?.total ?? 0, color: 'var(--text-primary)', icon: Bell },
          { label: t('stats.sent'), value: stats?.sent ?? 0, color: 'var(--accent)', icon: CheckCircle2 },
          { label: t('stats.pending'), value: stats?.pending ?? 0, color: 'var(--warning)', icon: Clock },
          { label: t('stats.failed'), value: stats?.failed ?? 0, color: 'var(--danger)', icon: AlertCircle },
        ].map((s) => (
          <Card key={s.label} className="cyber-corners">
            <CardContent style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 4,
                  backgroundColor: 'var(--surface-secondary)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: s.color,
                }}
              >
                <s.icon style={{ width: 16, height: 16 }} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: 10,
                    color: 'var(--muted)',
                    fontFamily: 'var(--font-mono)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                    margin: 0,
                  }}
                >
                  {s.label}
                </p>
                <p
                  style={{
                    fontSize: 22,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    color: s.color,
                    margin: 0,
                    lineHeight: 1.1,
                  }}
                >
                  {s.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 160 }}>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id="notif-status-filter">
              <SelectValue placeholder={tCommon('status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{tCommon('all')}</SelectItem>
              <SelectItem value="sent">{t('status.sent')}</SelectItem>
              <SelectItem value="pending">{t('status.pending')}</SelectItem>
              <SelectItem value="failed">{t('status.failed')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div style={{ minWidth: 160 }}>
          <Select value={channelFilter} onValueChange={setChannelFilter}>
            <SelectTrigger id="notif-channel-filter">
              <SelectValue placeholder={t('channel')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{tCommon('all')}</SelectItem>
              <SelectItem value="email">{t('channels.email')}</SelectItem>
              <SelectItem value="in_app">{t('channels.inApp')}</SelectItem>
              <SelectItem value="sms">{t('channels.sms')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* List */}
      <div
        className="cyber-corners"
        style={{
          position: 'relative',
          backgroundColor: 'var(--surface)',
          borderRadius: 4,
          border: '1px solid var(--border)',
          overflow: 'hidden',
        }}
      >
        {isLoading ? (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[...Array(6)].map((_, i) => <Skeleton key={i} style={{ height: 56 }} />)}
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={<Bell style={{ width: 32, height: 32 }} />}
            title={t('noNotifications')}
            description={t('noNotificationsDesc')}
            actionLabel={t('compose')}
            onAction={() => setComposerOpen(true)}
          />
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {notifications.map((n) => {
              const Icon = channelIcon[n.channel] ?? Mail
              const variant =
                n.status === 'sent' ? 'success'
                : n.status === 'failed' ? 'danger'
                : 'warning'
              return (
                <li
                  key={n.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 14,
                    padding: '14px 18px',
                    borderBottom: '1px solid var(--border)',
                    transition: 'background-color 0.12s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-secondary)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 4,
                      backgroundColor: 'var(--surface-secondary)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-secondary)',
                      flexShrink: 0,
                    }}
                  >
                    <Icon style={{ width: 14, height: 14 }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {n.subject ?? `[${n.channel}]`}
                      </span>
                      <Badge variant={variant}>{t(`status.${n.status}`)}</Badge>
                      <Badge variant="outline">{n.channel}</Badge>
                    </div>
                    <p
                      style={{
                        fontSize: 12,
                        color: 'var(--text-secondary)',
                        margin: 0,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {n.body}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--muted)',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {n.sent_at ? formatDate(n.sent_at) : formatDate(n.created_at)}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* Composer dialog */}
      <Dialog open={composerOpen} onOpenChange={setComposerOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', marginRight: 8 }}>&gt;</span>
              {t('compose')}
            </DialogTitle>
            <DialogDescription>{t('composeDesc')}</DialogDescription>
          </DialogHeader>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 10,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  marginBottom: 6,
                }}
              >
                [ {t('channel')} ]
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['email', 'in_app', 'sms'] as Channel[]).map((c) => {
                  const Icon = channelIcon[c]
                  const active = form.channel === c
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, channel: c }))}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        padding: '10px 14px',
                        fontSize: 12,
                        fontFamily: 'var(--font-mono)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        borderRadius: 4,
                        cursor: 'pointer',
                        backgroundColor: active ? 'var(--accent-tint)' : 'var(--surface-secondary)',
                        border: `1px solid ${active ? 'var(--border-accent)' : 'var(--border)'}`,
                        color: active ? 'var(--accent)' : 'var(--text-secondary)',
                        transition: 'all 0.15s',
                      }}
                    >
                      <Icon style={{ width: 14, height: 14 }} />
                      {c}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 10,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  marginBottom: 6,
                }}
              >
                [ {t('subject')} ]
              </label>
              <input
                id="compose-subject"
                style={inputBase}
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                placeholder={t('subjectPlaceholder')}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 10,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  marginBottom: 6,
                }}
              >
                [ {t('body')} ]
              </label>
              <textarea
                id="compose-body"
                style={{ ...inputBase, minHeight: 110, resize: 'vertical', lineHeight: 1.5 }}
                value={form.body}
                onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                placeholder={t('bodyPlaceholder')}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 10,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  marginBottom: 6,
                }}
              >
                [ {t('recipients')} · {form.employee_ids.length} ]
              </label>
              <div
                style={{
                  maxHeight: 180,
                  overflowY: 'auto',
                  borderRadius: 4,
                  border: '1px solid var(--border-strong)',
                  backgroundColor: 'var(--surface-secondary)',
                  padding: 8,
                }}
              >
                {employees.length === 0 ? (
                  <p style={{ fontSize: 12, color: 'var(--muted)', padding: 8 }}>{t('noEmployees')}</p>
                ) : (
                  employees.map((e) => {
                    const checked = form.employee_ids.includes(e.id)
                    return (
                      <label
                        key={e.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '6px 8px',
                          borderRadius: 3,
                          cursor: 'pointer',
                          fontSize: 12,
                          color: checked ? 'var(--accent)' : 'var(--text-secondary)',
                          backgroundColor: checked ? 'var(--accent-tint)' : 'transparent',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleEmployee(e.id)}
                          style={{ accentColor: 'var(--accent)' }}
                        />
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {e.name}
                        </span>
                        <span style={{ color: 'var(--muted)' }}>{e.email}</span>
                      </label>
                    )
                  })
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setComposerOpen(false)}>
              {tCommon('cancel')}
            </Button>
            <Button id="send-notification" onClick={handleSend} disabled={sendMutation.isPending}>
              <Send style={{ width: 14, height: 14 }} />
              {sendMutation.isPending ? t('sending') : t('send')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
