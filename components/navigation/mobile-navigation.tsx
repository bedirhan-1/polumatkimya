'use client'

import Link from 'next/link'
import {useEffect, useId, useRef, useState} from 'react'

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
    ? 'flex min-h-11 items-center border-b border-border/50 py-2.5 ps-4 text-[0.95rem] text-muted no-underline transition hover:text-foreground'
    : 'flex min-h-12 items-center border-b border-border py-3 text-base font-medium text-foreground no-underline'

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
  const [expanded, setExpanded] = useState<string | null>(null)
  const panelId = useId()
  const openButtonRef = useRef<HTMLButtonElement>(null)
  const wasOpenRef = useRef(false)

  useEffect(() => {
    if (!open) {
      if (wasOpenRef.current) openButtonRef.current?.focus()
      wasOpenRef.current = false
      return
    }

    wasOpenRef.current = true
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        setExpanded(null)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const close = () => {
    setOpen(false)
    setExpanded(null)
  }

  return (
    <div className="xl:hidden">
      <button
        ref={openButtonRef}
        type="button"
        className="inline-flex min-h-11 min-w-11 items-center justify-center border border-border bg-surface text-foreground"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="sr-only">{open ? closeLabel : openLabel}</span>
        <span aria-hidden="true" className="relative block h-3.5 w-5">
          <span
            className={`absolute inset-x-0 top-0 h-0.5 origin-center bg-current transition duration-200 ${
              open ? 'top-[6px] rotate-45' : ''
            }`}
          />
          <span
            className={`absolute inset-x-0 top-[6px] h-0.5 bg-current transition duration-200 ${
              open ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`absolute inset-x-0 bottom-0 h-0.5 origin-center bg-current transition duration-200 ${
              open ? 'bottom-[6px] -rotate-45' : ''
            }`}
          />
        </span>
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-label={closeLabel}
            className="fixed inset-0 z-[55] bg-black/55"
            onClick={close}
          />
          <div
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-label={navLabel}
            className="fixed inset-x-0 top-[var(--header-height)] bottom-0 z-[60] border-t border-border bg-[#0b0c0e]"
          >
            <nav
              aria-label={navLabel}
              className="container-site flex h-full max-h-[calc(100dvh-var(--header-height))] flex-col gap-1 overflow-y-auto overscroll-contain py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
            >
              <Link
                href={localeHome}
                aria-label={brand}
                className="mb-2 flex shrink-0 border-b border-border pb-4 no-underline"
                onClick={close}
              >
                <PolumatLogo alt={brand} size="small" surface="dark" className="h-8 w-auto" />
              </Link>

              {items.map((item) => {
                const key = `${item.href}-${item.label}`
                const hasChildren = Boolean(item.children?.length)
                const isExpanded = expanded === key

                if (!hasChildren) {
                  return (
                    <div key={key}>
                      <MobileLink item={item} onNavigate={close} />
                    </div>
                  )
                }

                return (
                  <div key={key}>
                    <div className="flex items-stretch border-b border-border">
                      <Link
                        href={item.href}
                        className="flex min-h-12 flex-1 items-center py-3 text-base font-medium text-foreground no-underline"
                        onClick={close}
                      >
                        {item.label}
                      </Link>
                      <button
                        type="button"
                        className="inline-flex min-h-12 min-w-12 items-center justify-center text-muted"
                        aria-expanded={isExpanded}
                        aria-label={item.label}
                        onClick={() => setExpanded(isExpanded ? null : key)}
                      >
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 12 12"
                          className={`h-3 w-3 transition duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.75"
                        >
                          <path
                            d="M2.5 4.5 6 8l3.5-3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                    {isExpanded
                      ? item.children?.map((child) => (
                          <MobileLink
                            key={`${child.href}-${child.label}`}
                            item={child}
                            onNavigate={close}
                            nested
                          />
                        ))
                      : null}
                  </div>
                )
              })}

              <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4 text-sm">
                <a
                  href={phoneHref}
                  className="min-h-11 inline-flex items-center text-muted no-underline hover:text-foreground"
                  dir="ltr"
                  onClick={close}
                >
                  {phoneLabel}
                </a>
                <a
                  href={emailHref}
                  className="min-h-11 inline-flex items-center break-all text-muted no-underline hover:text-foreground"
                  dir="ltr"
                  onClick={close}
                >
                  {emailLabel}
                </a>
              </div>

              <Link
                href={quoteHref}
                className="mt-4 inline-flex min-h-12 shrink-0 items-center justify-center bg-accent px-4 py-3 text-sm font-semibold tracking-wide text-white no-underline uppercase"
                onClick={close}
              >
                {quoteLabel}
              </Link>

              {catalogHref ? (
                <a
                  href={catalogHref}
                  download
                  className="mt-2 inline-flex min-h-11 shrink-0 items-center justify-center border border-border px-4 py-3 text-sm font-semibold text-foreground no-underline"
                  onClick={close}
                >
                  {catalogLabel}
                </a>
              ) : null}
            </nav>
          </div>
        </>
      ) : null}
    </div>
  )
}
