import type { Metadata } from 'next'
import { Sora, DM_Sans, Noto_Sans } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getLocale } from 'next-intl/server'
import { cyrillicLocales } from '@/i18n/config'
import { Providers } from '@/components/Providers'
import '@/app/globals.css'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const notoSans = Noto_Sans({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-cyrillic',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | UzShield',
    default: 'UzShield — Cybersecurity Awareness',
  },
  description: 'Xodimlarni fishing hujumlaridan himoya qiling | Protect employees from phishing attacks',
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages()
  const isCyrillic = cyrillicLocales.includes(locale as 'uz-Cyrl' | 'ru')

  return (
    <html
      lang={locale}
      className={`${sora.variable} ${dmSans.variable} ${notoSans.variable}`}
    >
      <body
        style={{
          fontFamily: isCyrillic ? 'var(--font-cyrillic)' : 'var(--font-body)',
          backgroundColor: 'var(--background)',
        }}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
