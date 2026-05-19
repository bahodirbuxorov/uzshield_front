'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Plus, BookOpen, Clock, Users, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/shared/PageHeader'
import { useTrainingTemplates, useTrainingStatistics } from '@/lib/hooks/useTraining'

export default function TrainingPage() {
  const t = useTranslations('training')
  const [showAll, setShowAll] = useState(false)

  const { data: templatesData, isLoading: tplLoading } = useTrainingTemplates()
  const { data: stats } = useTrainingStatistics()

  const templates = templatesData?.data ?? []
  const visible = showAll ? templates : templates.slice(0, 6)

  return (
    <div className="page-container">
      <PageHeader
        title={t('title')}
        actions={
          <Button id="add-template-btn" variant="outline" size="sm">
            <Plus style={{ width: 16, height: 16 }} />
            Yangi shablon
          </Button>
        }
      />

      {/* Stats row */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
          {[
            { label: 'Shablonlar', value: stats.total_templates, color: 'var(--accent)', Icon: BookOpen },
            { label: 'Topshiriqlar', value: stats.total_assignments, color: 'var(--text-primary)', Icon: Users },
            { label: 'Bajarildi', value: stats.completed_assignments, color: 'var(--success)', Icon: CheckCircle },
            { label: 'Kutilmoqda', value: stats.pending_assignments, color: 'var(--warning)', Icon: AlertCircle },
            {
              label: 'O\'rtacha ball',
              value: stats.avg_score != null ? stats.avg_score.toFixed(1) : '—',
              color: 'var(--accent)',
              Icon: CheckCircle,
            },
          ].map((s) => (
            <div
              key={s.label}
              className="cyber-corners"
              style={{
                position: 'relative',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 4,
                padding: '16px 20px',
                textAlign: 'center',
              }}
            >
              <s.Icon style={{ width: 18, height: 18, color: s.color, margin: '0 auto 10px', filter: `drop-shadow(0 0 6px ${s.color})` }} />
              <p
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: s.color,
                  margin: '0 0 4px',
                  fontFamily: 'var(--font-mono)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {s.value}
              </p>
              <p
                style={{
                  fontSize: 10,
                  color: 'var(--muted)',
                  margin: 0,
                  fontFamily: 'var(--font-mono)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Templates grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {tplLoading
          ? [...Array(4)].map((_, i) => <Skeleton key={i} style={{ height: 180 }} />)
          : visible.length === 0
          ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 0', color: 'var(--muted)', fontSize: 14 }}>
              Trening shablonlari yo&apos;q
            </div>
          )
          : visible.map((tpl) => (
            <Card key={tpl.id} style={{ overflow: 'hidden' }}>
              {/* top bar */}
              <div style={{ height: 4, backgroundColor: tpl.ai_generated ? 'var(--accent)' : 'var(--success)' }} />
              <CardHeader style={{ paddingBottom: 8 }}>
                <CardTitle style={{ fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tpl.title}</span>
                  <Badge variant={tpl.ai_generated ? 'secondary' : 'outline'} style={{ flexShrink: 0, fontSize: 10 }}>
                    {tpl.ai_generated ? '🤖 AI' : 'Manual'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent style={{ paddingTop: 0 }}>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 12px', lineClamp: 3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                  {tpl.content}
                </p>

                {tpl.topics.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                    {tpl.topics.slice(0, 3).map((topic) => (
                      <Badge key={topic} variant="outline" style={{ fontSize: 10 }}>
                        {topic}
                      </Badge>
                    ))}
                    {tpl.topics.length > 3 && (
                      <Badge variant="outline" style={{ fontSize: 10, color: 'var(--muted)' }}>
                        +{tpl.topics.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: 'var(--muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock style={{ width: 13, height: 13 }} />
                    {new Date(tpl.created_at).toLocaleDateString('uz-UZ')}
                  </span>
                  {tpl.employee_id && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Users style={{ width: 13, height: 13 }} />
                      Employee #{tpl.employee_id}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        }
      </div>

      {templates.length > 6 && (
        <div style={{ textAlign: 'center' }}>
          <Button variant="outline" onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Kamroq ko\'rsatish' : `Ko'proq ko'rsatish (${templates.length - 6} ta)`}
          </Button>
        </div>
      )}
    </div>
  )
}
