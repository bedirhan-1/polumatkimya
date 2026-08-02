import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'

import {defaultLocale, isLocale, locales} from '@/lib/i18n/locales'

const SKIP_PREFIXES = ['/admin', '/api', '/_next'] as const

function shouldSkipLocaleProxy(pathname: string): boolean {
  for (const prefix of SKIP_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return true
    }
  }
  // Static files (favicon.ico, images, manifest, etc.)
  if (pathname.includes('.')) return true
  return false
}

export function proxy(request: NextRequest) {
  const {pathname} = request.nextUrl

  if (shouldSkipLocaleProxy(pathname)) {
    return NextResponse.next()
  }

  const segment = pathname.split('/')[1]
  const hasLocale = Boolean(segment && isLocale(segment))

  if (hasLocale) {
    return NextResponse.next()
  }

  // Unsupported locale-looking segment → let the app 404 (do not force /tr)
  if (segment && /^[a-z]{2}(-[a-zA-Z0-9]+)?$/.test(segment) && !locales.includes(segment as never)) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = pathname === '/' ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`
  // 307 (not 308): avoid browsers permanently caching mistaken redirects like /admin → /tr/admin
  return NextResponse.redirect(url, 307)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
