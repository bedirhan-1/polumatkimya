import Link from 'next/link'

import {SocialLinks, type SocialLinkItem} from '@/components/layout/social-links'
import {PolumatLogo} from '@/components/brand/polumat-logo'
import type {Dictionary} from '@/lib/i18n/get-dictionary'
import type {Locale} from '@/lib/i18n/locales'
import {
  DEFAULT_CONTACT,
  DEALER_PORTAL_URL,
  getDefaultFooterColumns,
  type NavItem,
} from '@/lib/navigation'

type FooterColumn = {
  title: string
  links: NavItem[]
}

type SiteFooterProps = {
  locale: Locale
  dictionary: Dictionary
  columns?: FooterColumn[] | null
  description?: string | null
  phone?: string | null
  email?: string | null
  legalText?: string | null
  metaItems?: Array<{_key?: string; label?: string | null}> | null
  socialLinks?: SocialLinkItem[] | null
}

export function SiteFooter({
  locale,
  dictionary,
  columns,
  description,
  phone,
  email,
  legalText,
  metaItems,
  socialLinks,
}: SiteFooterProps) {
  const resolvedColumns = (columns?.length ? columns : getDefaultFooterColumns(locale, dictionary)).map(
    (column) => ({
      ...column,
      links: column.links.filter((link) => link.href !== DEALER_PORTAL_URL),
    }),
  )
  const year = new Date().getFullYear()
  const phoneValue = phone?.trim() || DEFAULT_CONTACT.phone
  const emailValue = email?.trim() || DEFAULT_CONTACT.email
  const phoneHref = phoneValue.replace(/[^\d+]/g, '').startsWith('+')
    ? `tel:${phoneValue.replace(/[^\d+]/g, '')}`
    : DEFAULT_CONTACT.phoneHref
  const emailHref = `mailto:${emailValue}`
  const resolvedMetaItems = (metaItems || [])
    .map((item) => ({
      key: item._key || item.label || '',
      label: item.label?.trim() || '',
    }))
    .filter((item) => item.label)
  const displayMetaItems = resolvedMetaItems.length
    ? resolvedMetaItems
    : [{key: 'default-location', label: 'Çaycuma · Zonguldak'}]

  return (
    <footer className="mt-auto border-t border-border">
      <div className="product-hero-panel relative overflow-hidden">
        <div className="product-mesh absolute inset-0 opacity-70" aria-hidden />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
          aria-hidden
        />
        <div className="container-site relative grid gap-8 py-8 sm:gap-10 sm:py-12 lg:grid-cols-[1.2fr_2fr] lg:gap-16 lg:py-16">
          <div className="border-b border-white/10 pb-8 lg:border-b-0 lg:pb-0">
            <Link
              href={`/${locale}`}
              aria-label={dictionary.meta.siteName}
              className="inline-flex no-underline"
            >
              <PolumatLogo
                alt={dictionary.meta.siteName}
                size="medium"
                surface="dark"
                className="h-9 w-auto sm:h-11"
              />
            </Link>
            <p className="mt-4 max-w-sm text-[0.8125rem] leading-6 text-muted sm:mt-5 sm:text-sm">
              {description?.trim() || dictionary.meta.defaultDescription}
            </p>
            <div className="mt-5 grid overflow-hidden border border-white/10 bg-white/5 text-sm sm:mt-6 sm:max-w-lg sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <a
                href={phoneHref}
                className="px-4 py-3.5 text-foreground no-underline transition hover:bg-white/5 hover:text-accent"
                dir="ltr"
              >
                {phoneValue}
              </a>
              <a
                href={emailHref}
                className="min-w-0 border-t border-white/10 px-4 py-3.5 text-muted no-underline transition hover:bg-white/5 hover:text-foreground sm:border-t-0 sm:border-s lg:border-t lg:border-s-0 xl:border-t-0 xl:border-s"
                dir="ltr"
              >
                {emailValue}
              </a>
            </div>
            <a
              href={DEALER_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-3 border border-accent/50 px-4 py-2.5 text-xs font-semibold tracking-[0.08em] text-accent uppercase no-underline transition hover:border-accent hover:bg-accent hover:text-white"
            >
              {dictionary.nav.dealerLogin}
              <span aria-hidden>↗</span>
            </a>
            <SocialLinks
              items={socialLinks}
              label={dictionary.footer.social}
              tone="dark"
              className="mt-6"
            />
          </div>

          <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 sm:gap-x-8 lg:gap-10">
            {resolvedColumns.map((column, columnIndex) => (
              <div
                key={column.title}
                className={`min-w-0 ${columnIndex === 0 ? 'col-span-2 sm:col-span-1' : ''}`}
              >
                <p className="flex items-center gap-2.5 text-[0.6875rem] font-semibold tracking-[0.18em] text-muted uppercase before:h-px before:w-5 before:bg-accent/70">
                  {column.title}
                </p>
                <ul
                  className={`mt-4 gap-x-5 gap-y-0 ${
                    columnIndex === 0 ? 'grid grid-cols-2 sm:block sm:space-y-2.5' : 'space-y-0 sm:space-y-2.5'
                  }`}
                >
                  {column.links.map((link) => {
                    if (!link.href) return null
                    const external = Boolean(link.external)
                    return (
                      <li
                        key={`${column.title}-${link.href}`}
                        className="border-b border-white/7 last:border-b-0 sm:border-b-0"
                      >
                        {external ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block py-2.5 text-[0.8125rem] leading-5 break-words text-foreground/80 no-underline transition hover:text-accent sm:py-0 sm:text-sm"
                          >
                            {link.label}
                          </a>
                        ) : (
                          <Link
                            href={link.href}
                            className="block py-2.5 text-[0.8125rem] leading-5 break-words text-foreground/80 no-underline transition hover:text-accent sm:py-0 sm:text-sm"
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
        <div className="container-site flex flex-col gap-3 py-5 text-[0.6875rem] leading-5 text-muted sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-4 sm:text-xs">
          <p className="max-w-full">
            © {year} {dictionary.meta.siteName}.{' '}
            {legalText?.trim() || dictionary.footer.rights}
          </p>
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            {displayMetaItems.map((item) => (
              <p
                key={item.key}
                className="border border-white/10 px-2.5 py-1 tracking-[0.14em] uppercase"
                dir="ltr"
              >
                {item.label}
              </p>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
