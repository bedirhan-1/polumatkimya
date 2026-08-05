'use client'

import Link from 'next/link'
import {useEffect, useId, useState} from 'react'

import {PolumatLogo} from '@/components/brand/polumat-logo'
import type {NavItem} from '@/lib/navigation'

type MobileNavigationProps = {
  localeHome: string
  brand: string
  items: NavItem[]
  quoteHref: string
  quoteLabel: string
  catalogHref?: string | null
  catalogLabel: string
  phoneHref: string
  phoneLabel: string
  emailHref: string
  emailLabel: string
  openLabel: string
  closeLabel: string
  navLabel: string
}

function MobileLink({
  item,
  onNavigate,
  nested,
}: {
  item: NavItem
  onNavigate: () => void
  nested?: boolean
}) {
  const className = nested
    ? 'flex min-h-10 items-center border-b border-border/60 py-2.5 ps-4 text-sm text-muted no-underline hover:text-foreground'
    : 'flex min-h-11 items-center border-b border-border py-3 text-base text-foreground no-underline'

  if (item.external) {
    return (
      <a
        href={item.href}
        className={className}
        target={item.openInNewTab ? '_blank' : undefined}
        rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
        onClick={onNavigate}
      >
        {item.label}
      </a>
    )
  }

  return (
    <Link href={item.href} className={className} onClick={onNavigate}>
      {item.label}
    </Link>
  )
}

export function MobileNavigation({
  localeHome,
  brand,
  items,
  quoteHref,
  quoteLabel,
  catalogHref,
  catalogLabel,
  phoneHref,
  phoneLabel,
  emailHref,
  emailLabel,
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

  const close = () => setOpen(false)

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
          className="fixed inset-0 top-[var(--header-height)] z-40 border-t border-border bg-[#0b0c0e]"
        >
          <nav
            aria-label={navLabel}
            className="container-site flex h-full max-h-[calc(100dvh-var(--header-height))] flex-col gap-1 overflow-y-auto py-6"
          >
            <Link
              href={localeHome}
              aria-label={brand}
              className="flex border-b border-border pb-4 no-underline"
              onClick={close}
            >
              <PolumatLogo alt={brand} size="small" surface="dark" className="h-8 w-auto" />
            </Link>

            {items.map((item) => (
              <div key={`${item.href}-${item.label}`}>
                <MobileLink item={item} onNavigate={close} />
                {item.children?.map((child) => (
                  <MobileLink
                    key={`${child.href}-${child.label}`}
                    item={child}
                    onNavigate={close}
                    nested
                  />
                ))}
              </div>
            ))}

            <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4 text-sm">
              <a
                href={phoneHref}
                className="text-muted no-underline hover:text-foreground"
                dir="ltr"
                onClick={close}
              >
                {phoneLabel}
              </a>
              <a
                href={emailHref}
                className="text-muted no-underline hover:text-foreground"
                dir="ltr"
                onClick={close}
              >
                {emailLabel}
              </a>
            </div>

            <Link
              href={quoteHref}
              className="mt-4 inline-flex min-h-11 items-center justify-center bg-accent px-4 py-3 text-sm font-semibold text-white no-underline"
              onClick={close}
            >
              {quoteLabel}
            </Link>

            {catalogHref ? (
              <a
                href={catalogHref}
                download
                className="mt-2 inline-flex min-h-11 items-center justify-center border border-border px-4 py-3 text-sm font-semibold text-foreground no-underline"
                onClick={close}
              >
                {catalogLabel}
              </a>
            ) : null}
          </nav>
        </div>
      ) : null}
    </div>
  )
}
