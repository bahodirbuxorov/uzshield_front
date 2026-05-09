'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChannelSelector } from '@/components/campaigns/ChannelSelector'
import { useCreateCampaign } from '@/lib/hooks/useCampaigns'
import { useTemplates } from '@/lib/hooks/useCampaigns'
import { campaignStep1Schema, type CampaignStep1Values } from '@/lib/utils/validators'
import type { CampaignChannel, PhishingTemplate } from '@/lib/types/campaign'
import Link from 'next/link'

const TOTAL_STEPS = 3

export default function NewCampaignPage() {
  const t = useTranslations('campaigns')
  const tCommon = useTranslations('common')
  const locale = useLocale()
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [selectedChannels, setSelectedChannels] = useState<CampaignChannel[]>(['email'])
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [step1Values, setStep1Values] = useState<CampaignStep1Values | null>(null)

  const { mutateAsync: createCampaign, isPending } = useCreateCampaign()
  const { data: templates } = useTemplates()

  const { register, handleSubmit, formState: { errors } } = useForm<CampaignStep1Values>({
    resolver: zodResolver(campaignStep1Schema),
    defaultValues: { name: '', targetGroup: 'all', channels: ['email'], scheduleType: 'immediately' },
  })
  const nameReg = register('name')

  const toggleChannel = (ch: CampaignChannel) => {
    setSelectedChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    )
  }

  const onStep1Submit = (values: CampaignStep1Values) => {
    setStep1Values({ ...values, channels: selectedChannels })
    setStep(2)
  }

  const onLaunch = async () => {
    if (!step1Values || !selectedTemplateId) return
    const tmpl = templates?.find((t: PhishingTemplate) => t.id === selectedTemplateId)
    if (!tmpl) return
    
    try {
      await createCampaign({ 
        name: step1Values.name,
        type: 'phishing_simulation',
        template_subject: tmpl.subject,
        template_body: tmpl.previewText,
      })
      toast.success('Campaign launched successfully!')
      router.push(`/${locale}/campaigns`)
    } catch {
      toast.error(tCommon('error'))
    }
  }

  const stepLabels = [t('form.step1'), t('form.step2'), t('form.step3')]

  /* shared label style */
  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--text-primary)',
    marginBottom: 6,
  }

  /* shared input style */
  const inputStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    height: 40,
    padding: '0 12px',
    fontSize: 14,
    color: 'var(--text-primary)',
    backgroundColor: 'white',
    border: '1px solid var(--border)',
    borderRadius: 8,
    outline: 'none',
  }

  return (
    <div className="page-container" style={{ maxWidth: 680, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/${locale}/campaigns`}>
            <ArrowLeft style={{ width: 16, height: 16 }} />
          </Link>
        </Button>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: 0,
            fontFamily: 'var(--font-display)',
          }}
        >
          {t('newCampaign')}
        </h2>
      </div>

      {/* Progress Steps */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {stepLabels.map((label, i) => {
          const n = i + 1
          const isComplete = step > n
          const isActive = step === n
          return (
            <div key={n} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    fontSize: 12,
                    fontWeight: 700,
                    flexShrink: 0,
                    transition: 'all 0.2s',
                    backgroundColor: isComplete ? 'var(--success)' : isActive ? 'var(--accent)' : 'var(--surface-secondary)',
                    color: isComplete || isActive ? 'white' : 'var(--muted)',
                  }}
                >
                  {isComplete ? <Check style={{ width: 14, height: 14 }} /> : n}
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'var(--text-primary)' : 'var(--muted)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {label}
                </span>
              </div>
              {i < stepLabels.length - 1 && (
                <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border)', margin: '0 12px' }} />
              )}
            </div>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1 */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card>
              <CardContent style={{ padding: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 20px' }}>
                  {t('form.step1')}
                </h3>

                <div style={{ marginBottom: 20 }}>
                  <label htmlFor="campaign-name" style={labelStyle}>{t('form.name')}</label>
                  <input
                    id="campaign-name"
                    placeholder={t('form.namePlaceholder')}
                    style={inputStyle}
                    {...nameReg}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(26,111,255,0.1)' }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; nameReg.onBlur(e) }}
                  />
                  {errors.name && (
                    <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 4 }}>{errors.name.message}</p>
                  )}
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>{t('form.selectChannel')}</label>
                  <ChannelSelector selected={selectedChannels} onToggle={toggleChannel} />
                  {selectedChannels.length === 0 && (
                    <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 4 }}>Select at least one channel</p>
                  )}
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>{t('form.targetGroup')}</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {(['allEmployees', 'byDepartment', 'byIndividual'] as const).map((key) => (
                      <button
                        key={key}
                        type="button"
                        style={{
                          padding: '10px',
                          fontSize: 13,
                          borderRadius: 8,
                          border: '1px solid var(--border)',
                          backgroundColor: 'white',
                          cursor: 'pointer',
                          color: 'var(--text-primary)',
                          transition: 'all 0.15s',
                          textAlign: 'center',
                        }}
                        onMouseEnter={(e) => {
                          ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'
                          ;(e.currentTarget as HTMLElement).style.backgroundColor = '#EFF6FF'
                        }}
                        onMouseLeave={(e) => {
                          ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
                          ;(e.currentTarget as HTMLElement).style.backgroundColor = 'white'
                        }}
                      >
                        {t(`form.${key}` as Parameters<typeof t>[0])}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  id="step1-next"
                  onClick={handleSubmit(onStep1Submit)}
                  disabled={selectedChannels.length === 0}
                  style={{ width: '100%' }}
                >
                  {tCommon('next')} <ChevronRight style={{ width: 16, height: 16 }} />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card>
              <CardContent style={{ padding: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 16px' }}>
                  {t('form.step2')}
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: 12,
                    maxHeight: 400,
                    overflowY: 'auto',
                    paddingRight: 4,
                    marginBottom: 16,
                  }}
                >
                  {(templates ?? []).map((tmpl: PhishingTemplate) => (
                    <button
                      key={tmpl.id}
                      type="button"
                      id={`template-${tmpl.id}`}
                      onClick={() => setSelectedTemplateId(tmpl.id)}
                      style={{
                        textAlign: 'left',
                        padding: 16,
                        borderRadius: 12,
                        border: `2px solid ${selectedTemplateId === tmpl.id ? 'var(--accent)' : 'var(--border)'}`,
                        backgroundColor: selectedTemplateId === tmpl.id ? '#EFF6FF' : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0, flex: 1 }}>{tmpl.name}</p>
                        <Badge variant={tmpl.difficulty === 'easy' ? 'success' : tmpl.difficulty === 'medium' ? 'warning' : 'danger'}>
                          {t(`difficulty.${tmpl.difficulty}` as Parameters<typeof t>[0])}
                        </Badge>
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '0 0 8px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {tmpl.previewText}
                      </p>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <Badge variant="outline">{tmpl.channel}</Badge>
                        <Badge variant="outline">{t(`category.${tmpl.category}` as Parameters<typeof t>[0])}</Badge>
                      </div>
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <Button variant="outline" onClick={() => setStep(1)} id="step2-back">{tCommon('back')}</Button>
                  <Button
                    onClick={() => setStep(3)}
                    disabled={!selectedTemplateId}
                    style={{ flex: 1 }}
                    id="step2-next"
                  >
                    {tCommon('next')} <ChevronRight style={{ width: 16, height: 16 }} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card>
              <CardContent style={{ padding: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 20px' }}>
                  {t('form.step3')}
                </h3>

                <div
                  style={{
                    borderRadius: 12,
                    backgroundColor: 'var(--surface-secondary)',
                    padding: 16,
                    marginBottom: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                >
                  {[
                    { label: t('form.name'), value: step1Values?.name },
                    {
                      label: t('form.selectChannel'),
                      value: (
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {selectedChannels.map((ch) => (
                            <Badge key={ch} variant="outline" style={{ textTransform: 'capitalize' }}>{ch}</Badge>
                          ))}
                        </div>
                      ),
                    },
                    {
                      label: t('form.selectTemplate'),
                      value: (templates ?? []).find((tmpl: PhishingTemplate) => tmpl.id === selectedTemplateId)?.name ?? '—',
                    },
                    { label: t('form.schedule'), value: t('form.immediately') },
                  ].map((row, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14 }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{row.label}</span>
                      <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{row.value}</span>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    backgroundColor: 'var(--success-light)',
                    color: 'var(--success)',
                    fontSize: 14,
                    marginBottom: 20,
                  }}
                >
                  ✓ {t('form.readyToLaunch')}
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <Button variant="outline" onClick={() => setStep(2)} id="step3-back">{tCommon('back')}</Button>
                  <Button onClick={onLaunch} disabled={isPending} style={{ flex: 1 }} id="launch-campaign">
                    {isPending ? 'Launching…' : t('form.launch')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
