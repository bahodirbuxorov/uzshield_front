import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import type { CampaignStatus } from '@/lib/types/campaign'

const STATUS_VARIANT: Record<CampaignStatus, 'success' | 'warning' | 'secondary' | 'default' | 'danger'> = {
  running: 'success',
  scheduled: 'default',
  draft: 'secondary',
  completed: 'secondary',
  cancelled: 'danger',
}

/** Status badge for a campaign */
export function CampaignStatusBadge({ status }: { status: CampaignStatus }) {
  const t = useTranslations('campaigns')
  return (
    <Badge variant={STATUS_VARIANT[status]}>
      {t(`status.${status}` as Parameters<typeof t>[0])}
    </Badge>
  )
}
