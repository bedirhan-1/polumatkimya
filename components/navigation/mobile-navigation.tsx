'use client'

import Link from 'next/link'
import {useEffect, useId, useState} from 'react'

import type {NavItem} from '@/lib/navigation'

type MobileNavigationProps = {
  localeHome: string
  brand: string
  items: NavItem[]
  quoteHref: string
  quoteLabel: string
  openLabel: string
  closeLabel: string
  navLabel: string
}

export function MobileNavigation({
  localeHome,
  brand,
  items,
  quoteHref,
  quoteLabel,
  openLabel,
  closeLabel,
  navLabel,
}: MobileNavigationProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="inline-flex min-h-11 min-w-11 items-center justify-center border border-border bg-surface text-foreground"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="sr-only">{open ? closeLabel : openLabel}</span>
        <span aria-hidden="true" className="flex flex-col gap-1.5">
          <span className={`block h-0.5 w-5 bg-current transition ${open ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-5 bg-current transition ${open ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-5 bg-current transition ${open ? '-translate-y-2 -rotate-45' : ''}`} />
        </span>
      </button>

      {open ? (
        <div
          id={panelId}
          className="fixed inset-0 top-[var(--header-height)] z-40 border-t border-border bg-background/98 backdrop-blur-sm"
        >
          <nav aria-label={navLabel} className="container-site flex flex-col gap-2 py-6">
            <Link
              href={localeHome}
              className="border-b border-border pb-4 text-lg font-display font-semibold tracking-wide"
              onClick={() => setOpen(false)}
            >
              {brand}
            </Link>
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="min-h-11 border-b border-border py-3 text-base text-foreground"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={quoteHref}
              className="mt-4 inline-flex min-h-11 items-center justify-center bg-accent px-4 py-3 text-sm font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              {quoteLabel}
            </Link>
          </nav>
        </div>
      ) : null}
    </div>
  )
}
