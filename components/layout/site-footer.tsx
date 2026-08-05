import Link from 'next/link'

import {PolumatLogo} from '@/components/brand/polumat-logo'
import type {Dictionary} from '@/lib/i18n/get-dictionary'
import type {Locale} from '@/lib/i18n/locales'
import {
  DEFAULT_CONTACT,
  DEALER_PORTAL_URL,
  getDefaultFooterColumns,
} from '@/lib/navigation'

type SiteFooterProps = {
  locale: Locale
  dictionary: Dictionary
}

export function SiteFooter({locale, dictionary}: SiteFooterProps) {
  const columns = getDefaultFooterColumns(locale, dictionary)
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-border">
      <div className="product-hero-panel relative overflow-hidden">
        <div className="product-mesh absolute inset-0 opacity-25" aria-hidden />
        <div className="container-site relative grid gap-10 py-14 lg:grid-cols-[1.2fr_2fr] lg:gap-16 lg:py-16">
          <div>
            <Link
              href={`/${locale}`}
              aria-label={dictionary.meta.siteName}
              className="inline-flex no-underline"
            >
              <PolumatLogo
                alt={dictionary.meta.siteName}
                size="medium"
                surface="dark"
                className="h-11 w-auto"
              />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
              {dictionary.meta.defaultDescription}
            </p>
            <div className="mt-6 flex flex-col gap-2 text-sm">
              <a
                href={DEFAULT_CONTACT.phoneHref}
                className="text-foreground no-underline transition hover:text-accent"
                dir="ltr"
              >
                {DEFAULT_CONTACT.phone}
              </a>
              <a
                href={DEFAULT_CONTACT.emailHref}
                className="text-muted no-underline transition hover:text-foreground"
                dir="ltr"
              >
                {DEFAULT_CONTACT.email}
              </a>
              <a
                href={DEALER_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex w-fit font-semibold text-accent no-underline hover:underline"
              >
                {dictionary.nav.dealerLogin}
              </a>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title}>
                <p className="text-xs font-semibold tracking-[0.18em] text-muted uppercase">
                  {column.title}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => {
                    const external = 'external' in link && Boolean(link.external)
                    return (
                      <li key={`${column.title}-${link.href}`}>
                        {external ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-foreground/80 no-underline transition hover:text-accent"
                          >
                            {link.label}
                          </a>
                        ) : (
                          <Link
                            href={link.href}
                            className="text-sm text-foreground/80 no-underline transition hover:text-accent"
                          >
                            {link.label}
                          </Link>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-background">
        <div className="container-site flex flex-col gap-2 py-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {dictionary.meta.siteName}. {dictionary.footer.rights}
          </p>
          <p className="tracking-[0.16em] uppercase" dir="ltr">
            Çaycuma · Zonguldak
          </p>
        </div>
      </div>
    </footer>
  )
}
