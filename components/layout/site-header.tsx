'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'

import {PolumatLogo} from '@/components/brand/polumat-logo'
import {LanguageSwitcher} from '@/components/navigation/language-switcher'
import {MobileNavigation} from '@/components/navigation/mobile-navigation'
import {ButtonLink, buttonClassName} from '@/components/ui/button-link'
import type {Dictionary} from '@/lib/i18n/get-dictionary'
import type {Locale} from '@/lib/i18n/locales'
import {
  DEFAULT_CONTACT,
  DEALER_PORTAL_URL,
  getDefaultNavItems,
  withDealerLogin,
  type NavItem,
} from '@/lib/navigation'

type SiteHeaderProps = {
  locale: Locale
  dictionary: Dictionary
  items?: NavItem[]
  phone?: string | null
  email?: string | null
  catalogHref?: string | null
}

function DownloadIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v8m0 0L5 7m3 3 3-3" />
      <path d="M2.5 12.5h11" />
    </svg>
  )
}

function NavAnchor({
  item,
  className,
  onClick,
}: {
  item: NavItem
  className: string
  onClick?: () => void
}) {
  if (item.external) {
    return (
      <a
        href={item.href}
        className={className}
        target={item.openInNewTab ? '_blank' : undefined}
        rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
        onClick={onClick}
      >
        {item.label}
      </a>
    )
  }

  return (
    <Link href={item.href} className={className} onClick={onClick}>
      {item.label}
    </Link>
  )
}

function isActivePath(pathname: string, href: string) {
  if (href.startsWith('http')) return false
  if (href.includes('#')) return false
  if (pathname === href) return true
  if (href.split('/').filter(Boolean).length === 1) return false
  return pathname.startsWith(`${href}/`)
}

function isNavItemActive(pathname: string, item: NavItem) {
  if (item.children?.some((child) => isActivePath(pathname, child.href))) return true
  return isActivePath(pathname, item.href)
}

export function SiteHeader({
  locale,
  dictionary,
  items,
  phone,
  email,
  catalogHref,
}: SiteHeaderProps) {
  const pathname = usePathname() || `/${locale}`
  const navItems = withDealerLogin(
    items?.length ? items : getDefaultNavItems(locale, dictionary),
    dictionary,
  )
  const homeHref = `/${locale}`
  const quoteHref = `/${locale}/request-a-quote`
  const phoneValue = phone?.trim() || DEFAULT_CONTACT.phone
  const emailValue = email?.trim() || DEFAULT_CONTACT.email
  const phoneHref = phoneValue.replace(/[^\d+]/g, '').startsWith('+')
    ? `tel:${phoneValue.replace(/[^\d+]/g, '')}`
    : DEFAULT_CONTACT.phoneHref
  const emailHref = `mailto:${emailValue}`

  const standardNav = navItems.filter((item) => item.href !== DEALER_PORTAL_URL)
  const findNav = (href: string) => standardNav.find((item) => item.href === href)
  const primaryNav = [
    {href: homeHref, label: dictionary.common.home},
    findNav(`/${locale}/products`),
    findNav(`/${locale}/industries`),
    {href: `${homeHref}#private-label`, label: 'Private Label'},
    findNav(`/${locale}/about`),
    findNav(`/${locale}/contact`),
  ].filter((item): item is NavItem => Boolean(item))
  const dealerItem =
    navItems.find((item) => item.href === DEALER_PORTAL_URL) ||
    ({
      href: DEALER_PORTAL_URL,
      label: dictionary.nav.dealerLogin,
      external: true,
      openInNewTab: true,
    } satisfies NavItem)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070809]/96 shadow-[0_10px_30px_rgba(0,0,0,0.22)]">
      <div className="container-site flex h-[var(--header-height)] items-center justify-between gap-5">
        <Link
          href={homeHref}
          aria-label={dictionary.meta.siteName}
          className="inline-flex shrink-0 items-center no-underline"
        >
          <PolumatLogo
            alt={dictionary.meta.siteName}
            size="small"
            surface="dark"
            className="h-8 w-auto xl:h-9"
            eager
          />
        </Link>

        <nav aria-label={dictionary.a11y.mainNavigation} className="hidden lg:block">
          <ul className="flex items-center gap-0.5 xl:gap-1">
            {primaryNav.map((item) => {
              const active = isNavItemActive(pathname, item)
              if (item.children?.length) {
                return (
                  <li key={`${item.href}-${item.label}`} className="group relative">
                    <Link
                      href={item.href}
                      className={`inline-flex min-h-11 items-center gap-1.5 border-b px-2.5 text-[0.7rem] font-semibold tracking-[0.06em] uppercase no-underline transition xl:px-3 ${
                        active
                          ? 'border-accent text-foreground'
                          : 'border-transparent text-muted hover:text-foreground'
                      }`}
                    >
                      <span>{item.label}</span>
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 12 12"
                        className="h-2.5 w-2.5 shrink-0 transition duration-200 ease-out group-hover:rotate-180 group-focus-within:rotate-180"
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
                    </Link>
                    <ul className="pointer-events-none absolute start-0 top-full z-50 min-w-64 origin-top border border-border bg-surface py-2 opacity-0 shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition duration-200 ease-out translate-y-1 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
                      {item.children.map((child) => {
                        const childIsActive = isActivePath(pathname, child.href)
                        return (
                          <li key={`${child.href}-${child.label}`}>
                            <NavAnchor
                              item={child}
                              className={`block px-4 py-2.5 text-sm no-underline transition hover:bg-background hover:text-accent ${
                                childIsActive ? 'text-accent' : 'text-foreground'
                              }`}
                            />
                          </li>
                        )
                      })}
                    </ul>
                  </li>
                )
              }
              return (
                <li key={`${item.href}-${item.label}`}>
                  <NavAnchor
                    item={item}
                    className={`inline-flex min-h-11 items-center border-b px-2.5 text-[0.7rem] font-semibold tracking-[0.06em] uppercase no-underline transition xl:px-3 ${
                      active
                        ? 'border-accent text-foreground'
                        : 'border-transparent text-muted hover:text-foreground'
                    }`}
                  />
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher locale={locale} label={dictionary.a11y.languageSwitcher} />
          {catalogHref ? (
            <a
              href={catalogHref}
              download
              className={buttonClassName(
                'secondary',
                'hidden min-h-10 px-4 py-2 text-xs uppercase no-underline lg:inline-flex xl:px-5',
              )}
            >
              <DownloadIcon />
              {dictionary.nav.downloadCatalog}
            </a>
          ) : null}
          <ButtonLink
            href={quoteHref}
            className="hidden min-h-10 px-4 py-2 text-xs uppercase no-underline sm:inline-flex xl:px-5"
          >
            {dictionary.nav.requestQuote}
            <span aria-hidden>→</span>
          </ButtonLink>
          <MobileNavigation
            localeHome={homeHref}
            brand={dictionary.meta.siteName}
            items={[...primaryNav, dealerItem]}
            quoteHref={quoteHref}
            quoteLabel={dictionary.nav.requestQuote}
            catalogHref={catalogHref}
            catalogLabel={dictionary.nav.downloadCatalog}
            phoneHref={phoneHref}
            phoneLabel={phoneValue}
            emailHref={emailHref}
            emailLabel={emailValue}
            openLabel={dictionary.a11y.openMenu}
            closeLabel={dictionary.a11y.closeMenu}
            navLabel={dictionary.a11y.mainNavigation}
          />
        </div>
      </div>
    </header>
  )
}
