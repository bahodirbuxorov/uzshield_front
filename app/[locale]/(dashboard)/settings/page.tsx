'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Key, RefreshCw, Bell, Globe, CreditCard, Building2, Users, Shield } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/PageHeader'

import { UsersTab } from '@/components/settings/UsersTab'

const TABS = ['company', 'users', 'employees', 'notifications', 'integration', 'billing'] as const
type TabKey = typeof TABS[number]

const TAB_ICONS: Record<TabKey, React.ElementType> = {
  company: Building2,
  users: Shield,
  employees: Users,
  notifications: Bell,
  integration: Globe,
  billing: CreditCard,
}

export default function SettingsPage() {
  const t = useTranslations('settings')
  const tCommon = useTranslations('common')
  const [activeTab, setActiveTab] = useState<TabKey>('company')
  const [apiKey] = useState('uzs_live_sk_••••••••••••••••••••••••••')

  const handleSave = () => {
    toast.success(tCommon('save') + ' ✓')
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--text-primary)',
    marginBottom: 6,
  }

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
    <div className="page-container">
      <PageHeader title={t('title')} />

      {/* Tab Nav */}
      <div
        style={{
          display: 'flex',
          gap: 4,
          backgroundColor: 'var(--surface-secondary)',
          padding: 6,
          borderRadius: 12,
          flexWrap: 'wrap',
          width: 'fit-content',
        }}
      >
        {TABS.map((tab) => {
          const Icon = TAB_ICONS[tab]
          const isActive = activeTab === tab
          return (
            <button
              key={tab}
              id={`settings-tab-${tab}`}
              onClick={() => setActiveTab(tab)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                transition: 'all 0.15s',
                backgroundColor: isActive ? 'white' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                whiteSpace: 'nowrap',
              }}
            >
              <Icon style={{ width: 15, height: 15 }} />
              {t(`tabs.${tab}` as Parameters<typeof t>[0])}
            </button>
          )
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === 'company' && (
        <Card>
          <CardHeader><CardTitle style={{ fontSize: 15 }}>{t('tabs.company')}</CardTitle></CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 480 }}>
              <div>
                <label htmlFor="company-name" style={labelStyle}>{t('companyName')}</label>
                <input id="company-name" defaultValue="Acme UZ LLC" style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--accent)' }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border)' }}
                />
              </div>
              <div>
                <label htmlFor="company-website" style={labelStyle}>{t('companyWebsite')}</label>
                <input id="company-website" defaultValue="https://acme.uz" style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--accent)' }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border)' }}
                />
              </div>
              <div>
                <label htmlFor="timezone" style={labelStyle}>{t('timezone')}</label>
                <input id="timezone" defaultValue="Asia/Tashkent (UTC+5)" readOnly style={{ ...inputStyle, backgroundColor: 'var(--surface-secondary)', cursor: 'not-allowed' }} />
              </div>
              <Button id="save-company" onClick={handleSave} style={{ width: 'fit-content' }}>{tCommon('save')}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'users' && <UsersTab />}

      {activeTab === 'employees' && (
        <Card>
          <CardHeader><CardTitle style={{ fontSize: 15 }}>{t('tabs.employees')}</CardTitle></CardHeader>
          <CardContent>
            <div style={{ maxWidth: 480 }}>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>
                Configure default onboarding settings for new employees.
              </p>
              {[
                { label: 'Auto-enroll in phishing campaigns', enabled: true },
                { label: 'Require training on join', enabled: false },
                { label: 'Send welcome email', enabled: true },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 0',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <span style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>{item.label}</span>
                  <Badge variant={item.enabled ? 'success' : 'secondary'}>{item.enabled ? 'Enabled' : 'Disabled'}</Badge>
                </div>
              ))}
              <div style={{ marginTop: 20 }}>
                <Button id="save-employees" onClick={handleSave}>{tCommon('save')}</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'notifications' && (
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Bell style={{ width: 16, height: 16 }} />
              {t('tabs.notifications')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxWidth: 480 }}>
              {[
                { key: 'emailNotifications', label: t('emailNotifications') },
                { key: 'smsNotifications', label: t('smsNotifications') },
              ].map((item) => (
                <div
                  key={item.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 0',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <label htmlFor={item.key} style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500, cursor: 'pointer' }}>
                    {item.label}
                  </label>
                  <input
                    id={item.key}
                    type="checkbox"
                    defaultChecked
                    style={{ width: 16, height: 16, accentColor: 'var(--accent)', cursor: 'pointer' }}
                    aria-label={item.label}
                  />
                </div>
              ))}
              <div style={{ marginTop: 16 }}>
                <label htmlFor="notification-email" style={labelStyle}>Alert email</label>
                <input id="notification-email" type="email" defaultValue="admin@acme.uz" style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--accent)' }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border)' }}
                />
              </div>
              <div style={{ marginTop: 16 }}>
                <Button id="save-notifications" onClick={handleSave}>{tCommon('save')}</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'integration' && (
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Globe style={{ width: 16, height: 16 }} />
              {t('tabs.integration')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 520 }}>
              <div>
                <label htmlFor="api-key" style={labelStyle}>{t('apiKey')}</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    id="api-key"
                    value={apiKey}
                    readOnly
                    style={{ ...inputStyle, flex: 1, fontFamily: 'monospace', fontSize: 12, backgroundColor: 'var(--surface-secondary)' }}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    id="regenerate-api-key"
                    aria-label={t('regenerate')}
                    onClick={() => toast.success('API key regenerated')}
                  >
                    <RefreshCw style={{ width: 16, height: 16 }} />
                  </Button>
                </div>
                <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                  {t('regenerate')} will invalidate the old key
                </p>
              </div>
              <div>
                <label htmlFor="webhook-url" style={labelStyle}>{t('webhookUrl')}</label>
                <input
                  id="webhook-url"
                  placeholder="https://your-server.com/webhook"
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--accent)' }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border)' }}
                />
              </div>
              <Button id="save-integration" onClick={handleSave} style={{ width: 'fit-content' }}>{tCommon('save')}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'billing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CreditCard style={{ width: 16, height: 16 }} />
                {t('currentPlan')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
                {(['starter', 'pro', 'enterprise'] as const).map((plan) => (
                  <div
                    key={plan}
                    style={{
                      padding: 20,
                      borderRadius: 12,
                      border: `2px solid ${plan === 'pro' ? 'var(--accent)' : 'var(--border)'}`,
                      backgroundColor: plan === 'pro' ? '#EFF6FF' : 'white',
                      textAlign: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'capitalize', margin: '0 0 8px' }}>
                      {t(`plans.${plan}` as Parameters<typeof t>[0])}
                    </p>
                    {plan === 'pro' && <Badge variant="default">Current</Badge>}
                  </div>
                ))}
              </div>
              <Button id="upgrade-plan" variant="outline">{t('upgradePlan')}</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle style={{ fontSize: 15 }}>{t('billingHistory')}</CardTitle></CardHeader>
            <CardContent style={{ padding: 0 }}>
              <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface-secondary)' }}>
                    {['Date', 'Plan', 'Amount', 'Status'].map((h) => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { date: 'Mar 1, 2025', plan: 'Pro', amount: '$49' },
                    { date: 'Feb 1, 2025', plan: 'Pro', amount: '$49' },
                    { date: 'Jan 1, 2025', plan: 'Pro', amount: '$49' },
                  ].map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{r.date}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--text-primary)' }}>{r.plan}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-primary)' }}>{r.amount}</td>
                      <td style={{ padding: '12px 16px' }}><Badge variant="success">Paid</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
