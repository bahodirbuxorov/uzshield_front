import { getRequestConfig } from 'next-intl/server'
import { locales, defaultLocale } from './config'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  const validLocale = locales.includes(locale as Locale)
    ? (locale as Locale)
    : defaultLocale

  return {
    locale: validLocale,
    messages: (await import(`../messages/${validLocale}.json`)).default,
  }
})

type Locale = (typeof locales)[number]
