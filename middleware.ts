import createMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { locales, defaultLocale } from './i18n/config'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
})

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isAuthPage = pathname.includes('/login')
  const token = request.cookies.get('oxupax_token')

  if (!isAuthPage && !token) {
    const segments = pathname.split('/')
    const locale =
      segments[1] && (locales as readonly string[]).includes(segments[1])
        ? segments[1]
        : defaultLocale
    return NextResponse.redirect(
      new URL(`/${locale}/login`, request.url)
    )
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
