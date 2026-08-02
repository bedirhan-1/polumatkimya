'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'

import {localeNames, locales, type Locale} from '@/lib/i18n/locales'

const LOCALE_COOKIE = 'polumat_locale'

type LanguageSwitcherProps = {
  locale: Locale
  label: string
}

function replaceLocaleInPath(pathname: string, nextLocale: Locale): string {
  const segments = pathname.split('/')
  if (segments.length > 1 && locales.includes(segments[1] as Locale)) {
    segments[1] = nextLocale
    return segments.join('/') || `/${nextLocale}`
  }
  return `/${nextLocale}`
}

export function LanguageSwitcher({locale, label}: LanguageSwitcherProps) {
  const pathname = usePathname() || `/${locale}`

  return (
    <div>
      <p className="sr-only" id="language-switcher-label">
        {label}
      </p>
      <ul
        aria-labelledby="language-switcher-label"
        className="flex items-center gap-1 rounded border border-border bg-surface p-1"
      >
        {locales.map((item) => {
          const href = replaceLocaleInPath(pathname, item)
          const isActive = item === locale
          return (
            <li key={item}>
              <Link
                href={href}
                hrefLang={item}
                lang={item}
                aria-current={isActive ? 'true' : undefined}
                onClick={() => {
                  document.cookie = `${LOCALE_COOKIE}=${item};path=/;max-age=31536000;samesite=lax`
                }}
                className={`block min-h-9 px-2.5 py-1.5 text-center text-xs font-semibold tracking-wide transition ${
                  isActive
                    ? 'bg-accent text-white'
                    : 'text-muted hover:bg-surface-elevated hover:text-foreground'
                }`}
              >
                {localeNames[item]}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
