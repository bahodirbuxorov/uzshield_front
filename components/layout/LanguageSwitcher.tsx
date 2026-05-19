'use client'

import { useTranslations, useLocale } from 'next-intl'
import { locales, localeNames, localeFlags } from '@/i18n/config'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'

/** Locale switcher dropdown — replaces the current path's locale segment */
export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const handleLocaleChange = (newLocale: string) => {
    // Replace the first path segment (which is the locale)
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          id="language-switcher"
          className="w-full justify-start gap-2 border border-[var(--border)] hover:border-[var(--border-accent)] normal-case tracking-normal"
          aria-label="Select language"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}
        >
          <span>{localeFlags[locale as keyof typeof localeFlags]}</span>
          <span className="flex-1 text-left">{localeNames[locale as keyof typeof localeNames]}</span>
          <ChevronDown className="w-3 h-3 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            id={`lang-${loc}`}
            onClick={() => handleLocaleChange(loc)}
            className={locale === loc ? 'bg-[var(--surface-secondary)] font-medium' : ''}
          >
            <span className="mr-2">{localeFlags[loc]}</span>
            {localeNames[loc]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
