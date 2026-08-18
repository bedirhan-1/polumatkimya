'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useEffect, useId, useLayoutEffect, useRef, useState} from 'react'
import {createPortal} from 'react-dom'

import {useLocaleAlternates} from '@/components/i18n/locale-alternates'
import {locales, type Locale} from '@/lib/i18n/locales'

const LOCALE_COOKIE = 'polumat_locale'
const VIEWPORT_PAD = 12

const localeCodes: Record<Locale, string> = {
  tr: 'TR',
  en: 'EN',
  ar: 'AR',
}

const localeLabels: Record<Locale, string> = {
  tr: 'Türkçe',
  en: 'English',
  ar: 'العربية',
}

type LanguageSwitcherProps = {
  locale: Locale
  label: string
}

function LocaleFlag({locale}: {locale: Locale}) {
  const className = 'h-3.5 w-5 shrink-0 overflow-hidden rounded-[1px] ring-1 ring-white/15'

  if (locale === 'tr') {
    return (
      <svg aria-hidden="true" viewBox="0 0 28 18" className={className}>
        <rect width="28" height="18" fill="#e30a17" />
        <circle cx="10.8" cy="9" r="4.6" fill="#fff" />
        <circle cx="12.3" cy="9" r="3.7" fill="#e30a17" />
        <polygon
          points="16.8,6.5 17.4,8.1 19.1,8.2 17.8,9.3 18.2,11 16.8,10 15.4,11 15.8,9.3 14.5,8.2 16.2,8.1"
          fill="#fff"
        />
      </svg>
    )
  }

  if (locale === 'en') {
    return (
      <svg aria-hidden="true" viewBox="0 0 28 18" className={className}>
        <rect width="28" height="18" fill="#b22234" />
        {[2, 6, 10, 14].map((y) => (
          <rect key={y} y={y} width="28" height="2" fill="#fff" />
        ))}
        <rect width="12" height="10" fill="#3c3b6e" />
        {[2, 5, 8].flatMap((x) =>
          [2, 5, 8].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="0.65" fill="#fff" />),
        )}
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 28 18" className={className}>
      <rect width="28" height="18" fill="#006c35" />
      <path d="M7 6.2h14M8.5 8.2h11" stroke="#fff" strokeWidth="1.15" strokeLinecap="round" />
      <path d="M7.3 12.8h13.2l1.7-1" stroke="#fff" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
}

function replaceLocaleInPath(pathname: string, nextLocale: Locale): string {
  const segments = pathname.split('/')
  if (segments.length > 1 && locales.includes(segments[1] as Locale)) {
    segments[1] = nextLocale
    return segments.join('/') || `/${nextLocale}`
  }
  return `/${nextLocale}`
}

function clampMenuToViewport(menu: HTMLElement, trigger: HTMLElement) {
  const triggerRect = trigger.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const maxWidth = Math.max(0, viewportWidth - VIEWPORT_PAD * 2)

  menu.style.position = 'fixed'
  menu.style.top = `${triggerRect.bottom + 6}px`
  menu.style.left = `${VIEWPORT_PAD}px`
  menu.style.right = 'auto'
  menu.style.width = 'max-content'
  menu.style.maxWidth = `${maxWidth}px`
  menu.style.transform = 'none'

  const menuWidth = Math.min(menu.getBoundingClientRect().width, maxWidth)
  const rtl = document.documentElement.dir === 'rtl'
  const preferredLeft = rtl ? triggerRect.left : triggerRect.right - menuWidth
  const left = Math.min(
    Math.max(preferredLeft, VIEWPORT_PAD),
    Math.max(VIEWPORT_PAD, viewportWidth - VIEWPORT_PAD - menuWidth),
  )

  menu.style.left = `${left}px`
}

export function LanguageSwitcher({locale, label}: LanguageSwitcherProps) {
  const pathname = usePathname() || `/${locale}`
  const alternates = useLocaleAlternates()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const listId = useId()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node
      if (rootRef.current?.contains(target) || listRef.current?.contains(target)) return
      setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  useLayoutEffect(() => {
    if (!open) return
    const menu = listRef.current
    const trigger = buttonRef.current
    if (!menu || !trigger) return

    const place = () => clampMenuToViewport(menu, trigger)
    place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [open, locale])

  const menu = open ? (
    <ul
      ref={listRef}
      id={listId}
      role="listbox"
      aria-label={label}
      className="fixed z-[80] min-w-36 border border-border bg-surface py-1 shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
    >
      {locales.map((item) => {
        const href = alternates?.hrefs?.[item] || replaceLocaleInPath(pathname, item)
        const isActive = item === locale
        return (
          <li key={item} role="option" aria-selected={isActive}>
            <Link
              href={href}
              hrefLang={item}
              lang={item}
              aria-current={isActive ? 'true' : undefined}
              onClick={() => {
                document.cookie = `${LOCALE_COOKIE}=${item};path=/;max-age=31536000;samesite=lax`
                setOpen(false)
              }}
              className={`flex items-center justify-between gap-3 px-3 py-2.5 text-sm no-underline transition ${
                isActive
                  ? 'bg-accent/15 font-semibold text-accent'
                  : 'text-muted hover:bg-surface-elevated hover:text-foreground'
              }`}
            >
              <span className="flex items-center gap-2">
                <LocaleFlag locale={item} />
                <span>{localeLabels[item]}</span>
              </span>
              <span className="text-[0.7rem] tracking-[0.14em] opacity-70">{localeCodes[item]}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  ) : null

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        className="inline-flex min-h-11 items-center gap-1.5 px-1.5 text-xs font-semibold tracking-[0.14em] text-muted transition hover:text-foreground sm:px-2"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
      >
        <LocaleFlag locale={locale} />
        <span>{localeCodes[locale]}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 12 12"
          className={`h-2.5 w-2.5 transition ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <path d="M2.5 4.5 6 8l3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {mounted && menu ? createPortal(menu, document.body) : null}
    </div>
  )
}
