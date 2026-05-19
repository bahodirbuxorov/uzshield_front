'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Search, Plus, FileText, X, Eye, Send, Mail, MessageSquare, Smartphone, AlignLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { useTemplates } from '@/lib/hooks/useCampaigns'
import type { PhishingTemplate } from '@/lib/types/campaign'
import { toast } from 'sonner'

/* ─── Mini form state ─── */
interface NewTemplateForm {
  name: string
  channel: 'email' | 'sms' | 'telegram'
  difficulty: 'easy' | 'medium' | 'hard'
  subject: string
  body: string
}

const EMPTY_FORM: NewTemplateForm = {
  name: '',
  channel: 'email',
  difficulty: 'medium',
  subject: '',
  body: '',
}

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '8px 12px',
  fontSize: 13,
  fontFamily: 'var(--font-mono)',
  color: 'var(--text-primary)',
  backgroundColor: 'var(--surface-secondary)',
  border: '1px solid var(--border-strong)',
  borderRadius: 4,
  outline: 'none',
  transition: 'border-color 0.15s, box-shadow 0.15s',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 10,
  fontFamily: 'var(--font-mono)',
  fontWeight: 600,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.14em',
  marginBottom: 8,
}

export default function TemplatesPage() {
  const t = useTranslations('templates')
  const tCampaign = useTranslations('campaigns')
  const locale = useLocale()
  const router = useRouter()

  const [search, setSearch] = useState('')
  const [channel, setChannel] = useState('all')
  const [difficulty, setDifficulty] = useState('all')

  /* ─── Preview modal ─── */
  const [previewTemplate, setPreviewTemplate] = useState<PhishingTemplate | null>(null)

  /* ─── Create modal ─── */
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState<NewTemplateForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const { data: templates, isLoading } = useTemplates(
    channel !== 'all' ? channel : undefined,
    undefined,
    difficulty !== 'all' ? difficulty : undefined
  )

  const filtered = (templates ?? []).filter(
    (tmpl: PhishingTemplate) =>
      !search ||
      tmpl.name.toLowerCase().includes(search.toLowerCase()) ||
      tmpl.subject.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = async () => {
    if (!form.name.trim() || !form.subject.trim() || !form.body.trim()) {
      toast.error('Barcha maydonlarni to\'ldiring')
      return
    }
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800)) // simulate save
    setSaving(false)
    setShowCreate(false)
    setForm(EMPTY_FORM)
    toast.success('Shablon muvaffaqiyatli yaratildi!')
  }

  const CHANNEL_ICON: Record<string, React.ElementType> = {
    email: Mail,
    telegram: MessageSquare,
    sms: Smartphone,
  }

  return (
    <div className="page-container">
      <PageHeader
        title={t('title')}
        actions={
          <Button size="sm" id="create-template-btn" onClick={() => setShowCreate(true)}>
            <Plus style={{ width: 16, height: 16 }} />
            {t('createCustom')}
          </Button>
        }
      />

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: 320 }}>
          <Search
            style={{
              position: 'absolute', left: 12, top: '50%',
              transform: 'translateY(-50%)', width: 16, height: 16,
              color: 'var(--muted)', pointerEvents: 'none',
            }}
          />
          <input
            id="template-search"
            type="text"
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...inputStyle, height: 36, paddingLeft: 36, paddingRight: 12, padding: undefined }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,255,148,0.15)' }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' }}
          />
        </div>
        <div style={{ flex: '0 0 auto', minWidth: 144 }}>
          <Select value={channel} onValueChange={setChannel}>
            <SelectTrigger id="template-channel-filter"><SelectValue placeholder={t('filterByChannel')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{tCampaign('channel.all')}</SelectItem>
              <SelectItem value="email">{tCampaign('channel.email')}</SelectItem>
              <SelectItem value="telegram">{tCampaign('channel.telegram')}</SelectItem>
              <SelectItem value="sms">{tCampaign('channel.sms')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div style={{ flex: '0 0 auto', minWidth: 144 }}>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger id="template-difficulty-filter"><SelectValue placeholder={t('filterByDifficulty')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha daraja</SelectItem>
              <SelectItem value="easy">{tCampaign('difficulty.easy')}</SelectItem>
              <SelectItem value="medium">{tCampaign('difficulty.medium')}</SelectItem>
              <SelectItem value="hard">{tCampaign('difficulty.hard')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {[...Array(6)].map((_, i) => <Skeleton key={i} style={{ height: 220 }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<FileText style={{ width: 32, height: 32 }} />} title={t('noTemplates')} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filtered.map((tmpl: PhishingTemplate) => {
            const ChIcon = CHANNEL_ICON[tmpl.channel] ?? Mail
            return (
              <Card
                key={tmpl.id}
                style={{ transition: 'box-shadow 0.2s, transform 0.2s', overflow: 'hidden' }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'
                  ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.boxShadow = ''
                  ;(e.currentTarget as HTMLElement).style.transform = ''
                }}
              >
                {/* Top color strip */}
                <div style={{
                  height: 4,
                  backgroundColor:
                    tmpl.difficulty === 'easy' ? 'var(--success)' :
                    tmpl.difficulty === 'medium' ? 'var(--warning)' : 'var(--danger)',
                }} />
                <CardContent style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0, flex: 1, lineHeight: 1.4 }}>
                      {tmpl.name}
                    </h3>
                    <Badge variant={tmpl.difficulty === 'easy' ? 'success' : tmpl.difficulty === 'medium' ? 'warning' : 'danger'}>
                      {tCampaign(`difficulty.${tmpl.difficulty}` as Parameters<typeof tCampaign>[0])}
                    </Badge>
                  </div>

                  {/* Subject preview */}
                  <p style={{
                    fontSize: 13, color: 'var(--text-secondary)', margin: 0,
                    fontStyle: 'italic', lineHeight: 1.5,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    &ldquo;{tmpl.subject}&rdquo;
                  </p>

                  {/* Tags row */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      padding: '3px 8px', borderRadius: 6,
                      backgroundColor: 'var(--surface-secondary)',
                      fontSize: 12, color: 'var(--text-secondary)',
                    }}>
                      <ChIcon style={{ width: 12, height: 12 }} />
                      <span style={{ textTransform: 'capitalize' }}>{tmpl.channel}</span>
                    </div>
                    <Badge variant="outline">{tCampaign(`category.${tmpl.category}` as Parameters<typeof tCampaign>[0])}</Badge>
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--muted)' }}>{tmpl.usageCount}× ishlatilgan</span>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                    <Button
                      size="sm"
                      variant="outline"
                      style={{ flex: 1, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}
                      id={`preview-${tmpl.id}`}
                      onClick={() => setPreviewTemplate(tmpl)}
                    >
                      <Eye style={{ width: 13, height: 13 }} />
                      {t('preview')}
                    </Button>
                    <Button
                      size="sm"
                      style={{ flex: 1, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}
                      id={`use-${tmpl.id}`}
                      onClick={() => router.push(`/${locale}/campaigns/new`)}
                    >
                      <Send style={{ width: 13, height: 13 }} />
                      {t('useInCampaign')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* ── PREVIEW MODAL ── */}
      <Dialog open={!!previewTemplate} onOpenChange={(o) => { if (!o) setPreviewTemplate(null) }}>
        <DialogContent style={{ maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}>
          <DialogHeader>
            <DialogTitle style={{ fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Eye style={{ width: 18, height: 18, color: 'var(--accent)' }} />
              Shablon ko&apos;rinishi
            </DialogTitle>
          </DialogHeader>

          {previewTemplate && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Meta */}
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: 8, padding: '12px 16px',
                backgroundColor: 'var(--surface-secondary)', borderRadius: 10,
              }}>
                <div style={{ flex: 1, minWidth: 120 }}>
                  <p style={{ fontSize: 11, color: 'var(--muted)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nomi</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{previewTemplate.name}</p>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Badge variant={previewTemplate.difficulty === 'easy' ? 'success' : previewTemplate.difficulty === 'medium' ? 'warning' : 'danger'}>
                    {tCampaign(`difficulty.${previewTemplate.difficulty}` as Parameters<typeof tCampaign>[0])}
                  </Badge>
                  <Badge variant="outline" style={{ textTransform: 'capitalize' }}>{previewTemplate.channel}</Badge>
                  <Badge variant="outline">{tCampaign(`category.${previewTemplate.category}` as Parameters<typeof tCampaign>[0])}</Badge>
                </div>
              </div>

              {/* Email/message preview frame */}
              <div style={{
                border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              }}>
                {/* Bar */}
                <div style={{
                  padding: '10px 16px',
                  backgroundColor: 'var(--surface-elevated)',
                  borderBottom: '1px solid var(--border-strong)',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  {previewTemplate.channel === 'email' && <Mail style={{ width: 14, height: 14, color: 'var(--accent)' }} />}
                  {previewTemplate.channel === 'telegram' && <MessageSquare style={{ width: 14, height: 14, color: 'var(--cyan)' }} />}
                  {previewTemplate.channel === 'sms' && <Smartphone style={{ width: 14, height: 14, color: 'var(--critical)' }} />}
                  <span style={{
                    color: 'var(--text-primary)', fontWeight: 600, fontSize: 11,
                    fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.12em',
                  }}>
                    {previewTemplate.channel === 'email' ? 'email · payload' : previewTemplate.channel === 'telegram' ? 'telegram · payload' : 'sms · payload'}
                  </span>
                </div>

                {previewTemplate.channel === 'email' && (
                  <div style={{ padding: 16, backgroundColor: 'var(--surface)' }}>
                    <div style={{
                      padding: '8px 12px', backgroundColor: 'var(--surface-secondary)',
                      border: '1px solid var(--border)',
                      borderRadius: 4, marginBottom: 12, fontSize: 13,
                    }}>
                      <span style={{
                        color: 'var(--muted)', fontFamily: 'var(--font-mono)',
                        textTransform: 'uppercase', fontSize: 10, letterSpacing: '0.12em', marginRight: 6,
                      }}>SUBJECT:</span>
                      <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{previewTemplate.subject}</span>
                    </div>
                    <div style={{
                      padding: 14, backgroundColor: 'var(--surface-secondary)',
                      border: '1px dashed var(--border-strong)', borderRadius: 4,
                      fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.7,
                      whiteSpace: 'pre-wrap',
                    }}>
                      {previewTemplate.previewText || 'Salom, {{employee_name}}!\n\nXavfsizlik testiga qatnashganingiz uchun rahmat. Bu xabar simulyatsiya hisoblanadi.\n\n{{link_url}}\n\nHurmat bilan,\n{{sender_name}}'}
                    </div>
                  </div>
                )}

                {(previewTemplate.channel === 'telegram' || previewTemplate.channel === 'sms') && (
                  <div style={{ padding: 20, backgroundColor: 'var(--surface)', minHeight: 140 }}>
                    <div style={{
                      maxWidth: 300, marginLeft: 'auto',
                      backgroundColor: 'var(--surface-secondary)',
                      border: '1px solid var(--border-strong)', borderRadius: 8,
                      padding: '10px 14px', fontSize: 13,
                      color: 'var(--text-primary)', lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                    }}>
                      {previewTemplate.previewText || `Hurmatli foydalanuvchi!\n\n${previewTemplate.subject}\n\nBatafsil: {{link_url}}`}
                    </div>
                  </div>
                )}
              </div>

              {/* Variables hint */}
              <div style={{
                padding: 10, borderRadius: 4,
                backgroundColor: 'var(--warning-light)',
                border: '1px dashed rgba(255,176,32,0.35)',
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                color: 'var(--warning)',
                letterSpacing: '0.02em',
              }}>
                <strong>O&apos;zgaruvchilar: </strong>
                {`{{employee_name}}, {{link_url}}, {{company_name}}, {{sender_name}}`}
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <Button variant="outline" style={{ flex: 1 }} onClick={() => setPreviewTemplate(null)}>Yopish</Button>
                <Button
                  style={{ flex: 1 }}
                  onClick={() => { setPreviewTemplate(null); router.push(`/${locale}/campaigns/new`) }}
                >
                  <Send style={{ width: 14, height: 14 }} />
                  Kampaniyada ishlatish
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── CREATE TEMPLATE MODAL ── */}
      <Dialog open={showCreate} onOpenChange={(o) => { if (!o) { setShowCreate(false); setForm(EMPTY_FORM) } }}>
        <DialogContent style={{ maxWidth: 580, maxHeight: '92vh', overflowY: 'auto' }}>
          <DialogHeader>
            <DialogTitle style={{ fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlignLeft style={{ width: 18, height: 18, color: 'var(--accent)' }} />
              Maxsus shablon yaratish
            </DialogTitle>
          </DialogHeader>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingTop: 4 }}>
            {/* Name */}
            <div>
              <label style={labelStyle}>Shablon nomi *</label>
              <input
                placeholder="Masalan: IT xodimlar uchun bank fishing"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,255,148,0.15)' }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' }}
              />
            </div>

            {/* Channel + Difficulty */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>Kanal *</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {(['email', 'telegram', 'sms'] as const).map((ch) => {
                    const Icon = CHANNEL_ICON[ch]
                    return (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => setForm({ ...form, channel: ch })}
                        style={{
                          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                          gap: 4, padding: '10px 4px', borderRadius: 4, border: '1px solid',
                          borderColor: form.channel === ch ? 'var(--border-accent)' : 'var(--border)',
                          backgroundColor: form.channel === ch ? 'var(--accent-tint)' : 'var(--surface)',
                          boxShadow: form.channel === ch ? 'inset 0 0 0 1px rgba(0,255,148,0.25)' : 'none',
                          cursor: 'pointer', fontSize: 11,
                          color: form.channel === ch ? 'var(--accent)' : 'var(--text-secondary)',
                          fontWeight: 600, textTransform: 'uppercase',
                          letterSpacing: '0.1em', fontFamily: 'var(--font-mono)',
                          transition: 'all 0.15s',
                        }}
                      >
                        <Icon style={{ width: 16, height: 16 }} />
                        {ch}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Qiyinlik darajasi *</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {(['easy', 'medium', 'hard'] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setForm({ ...form, difficulty: d })}
                      style={{
                        flex: 1, padding: '10px 4px', borderRadius: 4, border: '1px solid',
                        borderColor: form.difficulty === d ? (d === 'easy' ? 'var(--accent)' : d === 'medium' ? 'var(--warning)' : 'var(--danger)') : 'var(--border)',
                        backgroundColor: form.difficulty === d ? (d === 'easy' ? 'var(--success-light)' : d === 'medium' ? 'var(--warning-light)' : 'var(--danger-light)') : 'var(--surface)',
                        cursor: 'pointer', fontSize: 11,
                        color: form.difficulty === d ? (d === 'easy' ? 'var(--accent)' : d === 'medium' ? 'var(--warning)' : 'var(--danger)') : 'var(--text-secondary)',
                        fontWeight: 600, textTransform: 'uppercase',
                        letterSpacing: '0.1em', fontFamily: 'var(--font-mono)',
                        transition: 'all 0.15s',
                      }}
                    >
                      {tCampaign(`difficulty.${d}` as Parameters<typeof tCampaign>[0])}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label style={labelStyle}>
                {form.channel === 'email' ? 'Email mavzusi *' : 'Xabar sarlavhasi *'}
              </label>
              <input
                placeholder={form.channel === 'email' ? 'Masalan: Sizning hisobingiz bloklandi' : 'Masalan: Sizga sovg\'a!'}
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,255,148,0.15)' }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' }}
              />
            </div>

            {/* Body */}
            <div>
              <label style={labelStyle}>Xabar matni *</label>
              <textarea
                rows={6}
                placeholder={`Xabar matni...\n\nFoydalanish mumkin: {{employee_name}}, {{link_url}}, {{company_name}}`}
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                style={{
                  ...inputStyle,
                  height: 'auto',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  lineHeight: 1.6,
                  padding: '10px 12px',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,255,148,0.15)' }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' }}
              />
              <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                💡 O&apos;zgaruvchilar: <code style={{ backgroundColor: 'var(--surface-secondary)', padding: '1px 4px', borderRadius: 4 }}>{'{{employee_name}}'}</code>{' '}
                <code style={{ backgroundColor: 'var(--surface-secondary)', padding: '1px 4px', borderRadius: 4 }}>{'{{link_url}}'}</code>
              </p>
            </div>

            {/* Live preview snippet */}
            {(form.subject || form.body) && (
              <div style={{
                padding: 12, borderRadius: 8, border: '1px solid var(--border)',
                backgroundColor: 'var(--surface-secondary)',
              }}>
                <p style={{ fontSize: 11, color: 'var(--muted)', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ko&apos;rinish</p>
                {form.subject && (
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>{form.subject}</p>
                )}
                {form.body && (
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                    {form.body.slice(0, 120)}{form.body.length > 120 ? '…' : ''}
                  </p>
                )}
              </div>
            )}

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 10, paddingTop: 4, borderTop: '1px solid var(--border)' }}>
              <Button
                variant="outline"
                style={{ flex: 0 }}
                onClick={() => { setShowCreate(false); setForm(EMPTY_FORM) }}
              >
                Bekor qilish
              </Button>
              <Button
                style={{ flex: 1 }}
                onClick={handleCreate}
                disabled={saving}
                id="submit-create-template"
              >
                {saving ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 0.6s linear infinite' }} />
                    Saqlanmoqda…
                  </span>
                ) : 'Shablon saqlash'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
