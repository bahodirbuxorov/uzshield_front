'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ShieldHalf, Eye, EyeOff, AlertCircle, Terminal } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { login } from '@/lib/api/auth'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { loginSchema, type LoginFormValues } from '@/lib/utils/validators'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const t = useTranslations('auth')
  const locale = useLocale()
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const inputBaseStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    height: 44,
    padding: '0 12px',
    fontSize: 13,
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-primary)',
    backgroundColor: 'var(--surface-secondary)',
    border: '1px solid var(--border-strong)',
    borderRadius: 4,
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s, background-color 0.15s',
    letterSpacing: '0.02em',
  }

  const focusStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'var(--accent)'
    e.target.style.boxShadow = '0 0 0 3px rgba(0,255,148,0.15)'
    e.target.style.backgroundColor = 'var(--surface-elevated)'
  }
  const blurStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'var(--border-strong)'
    e.target.style.boxShadow = ''
    e.target.style.backgroundColor = 'var(--surface-secondary)'
  }

  const emailReg = register('email')
  const passwordReg = register('password')

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const { token, user } = await login(data)
      setAuth(user, token)
      toast.success('access granted · ' + user.name)
      router.push(`/${locale}/dashboard`)
    } catch {
      toast.error(t('invalidCredentials'))
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div
        className="cyber-corners"
        style={{
          position: 'relative',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border-strong)',
          borderRadius: 6,
          padding: 32,
          boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,255,148,0.06)',
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Terminal header bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '0 0 16px',
            marginBottom: 20,
            borderBottom: '1px dashed var(--border)',
          }}
        >
          <Terminal style={{ width: 12, height: 12, color: 'var(--accent)' }} />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--muted)',
              letterSpacing: '0.1em',
              flex: 1,
            }}
          >
            uzshield@auth:~$ login
          </span>
          <span style={{ display: 'flex', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--danger)' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--warning)' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--accent)' }} />
          </span>
        </div>

        {/* Logo / brand */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: 8,
              backgroundColor: 'var(--surface-elevated)',
              border: '1px solid var(--border-accent)',
              boxShadow: 'var(--shadow-glow-accent)',
              marginBottom: 16,
              position: 'relative',
            }}
          >
            <ShieldHalf style={{ width: 26, height: 26, color: 'var(--accent)' }} />
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 22,
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            UZ<span style={{ color: 'var(--accent)' }}>SHIELD</span>
          </h1>
          <p
            style={{
              marginTop: 6,
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              color: 'var(--muted)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textAlign: 'center',
            }}
          >
            {t('tagline')}
          </p>
        </div>

        <h2
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--text-secondary)',
            marginBottom: 20,
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
          }}
        >
          &gt; {t('loginTitle')}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* Email */}
          <div className="space-y-1.5">
            <Label
              htmlFor="login-email"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--text-secondary)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              [ {t('email')} ]
            </Label>
            <input
              id="login-email"
              type="email"
              placeholder={t('emailPlaceholder')}
              autoComplete="email"
              aria-invalid={!!errors.email}
              style={inputBaseStyle}
              {...emailReg}
              onFocus={focusStyle}
              onBlur={(e) => { blurStyle(e); emailReg.onBlur(e) }}
            />
            {errors.email && (
              <p
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 11,
                  color: 'var(--danger)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <AlertCircle style={{ width: 12, height: 12, flexShrink: 0 }} />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label
              htmlFor="login-password"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--text-secondary)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              [ {t('password')} ]
            </Label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder={t('passwordPlaceholder')}
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                style={{ ...inputBaseStyle, padding: '0 44px 0 12px' }}
                {...passwordReg}
                onFocus={focusStyle}
                onBlur={(e) => { blurStyle(e); passwordReg.onBlur(e) }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--muted)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0,
                }}
              >
                {showPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
              </button>
            </div>
            {errors.password && (
              <p
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 11,
                  color: 'var(--danger)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <AlertCircle style={{ width: 12, height: 12, flexShrink: 0 }} />
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            id="login-submit"
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    border: '2px solid rgba(2,26,14,0.3)',
                    borderTopColor: '#021A0E',
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
                Authenticating…
              </span>
            ) : (
              <>&gt; {t('loginButton')}</>
            )}
          </Button>
        </form>

        {/* Hint */}
        <div
          style={{
            marginTop: 24,
            padding: 12,
            borderRadius: 4,
            border: '1px dashed var(--border)',
            backgroundColor: 'var(--surface-secondary)',
            fontSize: 11,
            color: 'var(--muted)',
            fontFamily: 'var(--font-mono)',
            textAlign: 'center',
            letterSpacing: '0.04em',
          }}
        >
          <span style={{ color: 'var(--accent)' }}># DEMO</span>{' '}
          super@oxupax.local / password
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  )
}
