'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Play, Clock, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { PageHeader } from '@/components/shared/PageHeader'
import { MOCK_TRAINING_MODULES } from '@/lib/constants/mockData'

export default function TrainingPage() {
  const t = useTranslations('training')
  const [selectedModule, setSelectedModule] = useState<typeof MOCK_TRAINING_MODULES[0] | null>(null)

  return (
    <div className="page-container">
      <PageHeader title={t('title')} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
        {MOCK_TRAINING_MODULES.map((mod) => {
          const moduleKey = `modules.${mod.key}` as Parameters<typeof t>[0]
          return (
            <Card key={mod.id} className="hover:shadow-card-hover transition-shadow duration-200 overflow-hidden">
              {/* Color bar */}
              <div className="h-1.5 w-full" style={{ backgroundColor: mod.color }} />
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-2xl text-2xl shrink-0"
                    style={{ backgroundColor: mod.color + '15' }}
                  >
                    {mod.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
                      {t(moduleKey)}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-xs text-[var(--muted)]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {mod.duration} {t('minutes')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {mod.totalEmployees} employees
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-[var(--muted)] mb-1.5">
                    <span>{t('completionRate')}</span>
                    <span className="font-semibold" style={{ color: mod.color }}>{mod.completionRate}%</span>
                  </div>
                  <Progress value={mod.completionRate} className="h-2" />
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-sm"
                  id={`start-module-${mod.id}`}
                  onClick={() => setSelectedModule(mod)}
                >
                  <Play className="w-4 h-4" />
                  {t('startModule')}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Module Dialog */}
      <Dialog open={!!selectedModule} onOpenChange={() => setSelectedModule(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedModule && t(`modules.${selectedModule.key}` as Parameters<typeof t>[0])}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Video placeholder */}
            <div className="aspect-video bg-[var(--surface-secondary)] rounded-xl flex items-center justify-center border border-[var(--border)]">
              <div className="text-center text-[var(--muted)]">
                <Play className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{t('watchVideo')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">
                <Clock className="w-3.5 h-3.5 mr-1" />
                {selectedModule?.duration} {t('minutes')}
              </Badge>
              <Badge variant="success">{selectedModule?.completionRate}% {t('completionRate')}</Badge>
            </div>
            <Button className="w-full" id="begin-module-dialog">
              <Play className="w-4 h-4" />
              {t('startModule')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
