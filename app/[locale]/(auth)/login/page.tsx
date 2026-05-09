'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react'
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

  const focusStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'var(--accent)'
    e.target.style.boxShadow = '0 0 0 3px rgba(26,111,255,0.12)'
  }
  const blurStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'var(--border)'
    e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'
  }

  const emailReg = register('email')
  const passwordReg = register('password')

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const { token, user } = await login(data)
      setAuth(user, token)
      toast.success('Welcome back, ' + user.name + '!')
      router.push(`/${locale}/dashboard`)
    } catch {
      toast.error(t('invalidCredentials'))
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="bg-white rounded-2xl shadow-xl border border-[var(--border)] p-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--primary)] mb-4 shadow-lg">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1
            className="text-2xl font-bold text-[var(--text-primary)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            UzShield
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)] text-center">{t('tagline')}</p>
        </div>

        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6 text-center">
          {t('loginTitle')}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="login-email">{t('email')}</Label>
            <input
              id="login-email"
              type="email"
              placeholder={t('emailPlaceholder')}
              autoComplete="email"
              aria-invalid={!!errors.email}
              style={{
                display: 'block',
                width: '100%',
                height: '42px',
                padding: '0 12px',
                fontSize: '14px',
                color: 'var(--text-primary)',
                backgroundColor: 'white',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                outline: 'none',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
              {...emailReg}
              onFocus={focusStyle}
              onBlur={(e) => { blurStyle(e); emailReg.onBlur(e) }}
            />
            {errors.email && (
              <p className="flex items-center gap-1 text-xs" style={{ color: 'var(--danger)' }}>
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="login-password">{t('password')}</Label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder={t('passwordPlaceholder')}
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                style={{
                  display: 'block',
                  width: '100%',
                  height: '42px',
                  padding: '0 44px 0 12px',
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  backgroundColor: 'white',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  outline: 'none',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
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
                  right: '12px',
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
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="flex items-center gap-1 text-xs" style={{ color: 'var(--danger)' }}>
                <AlertCircle className="w-3 h-3 shrink-0" />
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
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Loading…
              </span>
            ) : (
              t('loginButton')
            )}
          </Button>
        </form>

        {/* Hint */}
        <div
          className="mt-6 p-3 rounded-xl text-xs text-center"
          style={{ backgroundColor: 'var(--surface-secondary)', color: 'var(--text-secondary)' }}
        >
          <span className="font-medium">Demo: </span>
          super@oxupax.local / password
        </div>
      </div>
    </motion.div>
  )
}
