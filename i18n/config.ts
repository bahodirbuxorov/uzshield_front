export const locales = ['uz', 'uz-Cyrl', 'ru', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'uz'

export const localeNames: Record<Locale, string> = {
  uz: "O'zbek",
  'uz-Cyrl': 'Ўзбек',
  ru: 'Русский',
  en: 'English',
}

export const localeFlags: Record<Locale, string> = {
  uz: '🇺🇿',
  'uz-Cyrl': '🇺🇿',
  ru: '🇷🇺',
  en: '🇬🇧',
}

/** These locales need Noto Sans (cyrillic support) */
export const cyrillicLocales: Locale[] = ['uz-Cyrl', 'ru']
