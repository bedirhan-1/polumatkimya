'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'

import {PolumatLogo} from '@/components/brand/polumat-logo'
import {LanguageSwitcher} from '@/components/navigation/language-switcher'
import {MobileNavigation} from '@/components/navigation/mobile-navigation'
import {ButtonLink} from '@/components/ui/button-link'
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
  if (pathname === href) return true
  return pathname.startsWith(`${href}/`)
}

function isNavItemActive(pathname: string, item: NavItem) {
  if (item.children?.some((child) => isActivePath(pathname, child.href))) return true
  return isActivePath(pathname, item.href)
}

export function SiteHeader({locale, dictionary, items, phone, email}: SiteHeaderProps) {
  const pathname = usePathname() || `/${locale}`
  const navItems = withDealerLogin(getDefaultNavItems(locale, dictionary), dictionary)
  const homeHref = `/${locale}`
  const quoteHref = `/${locale}/request-a-quote`
  const phoneValue = phone?.trim() || DEFAULT_CONTACT.phone
  const emailValue = email?.trim() || DEFAULT_CONTACT.email
  const phoneHref = phoneValue.replace(/[^\d+]/g, '').startsWith('+')
    ? `tel:${phoneValue.replace(/[^\d+]/g, '')}`
    : DEFAULT_CONTACT.phoneHref
  const emailHref = `mailto:${emailValue}`

  const primaryNav = navItems.filter((item) => item.href !== DEALER_PORTAL_URL)
  const dealerItem =
    navItems.find((item) => item.href === DEALER_PORTAL_URL) ||
    ({
      href: DEALER_PORTAL_URL,
      label: dictionary.nav.dealerLogin,
      external: true,
      openInNewTab: true,
    } satisfies NavItem)

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur-md">
      {/* Utility strip — contact + dealer portal */}
      <div className="hidden border-b border-border/60 bg-surface lg:block">
        <div className="container-site flex h-11 items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-5 text-muted">
            <a href={phoneHref} className="no-underline transition hover:text-foreground" dir="ltr">
              {phoneValue}
            </a>
            <span className="h-3 w-px bg-border" aria-hidden />
            <a href={emailHref} className="no-underline transition hover:text-foreground" dir="ltr">
              {emailValue}
            </a>
          </div>
          <NavAnchor
            item={dealerItem}
            className="inline-flex items-center gap-1.5 text-sm font-semibold tracking-wide text-accent no-underline transition hover:brightness-110"
          />
        </div>
      </div>

      <div className="container-site flex h-[var(--header-height)] items-center justify-between gap-4">
        <Link
          href={homeHref}
          aria-label={dictionary.meta.siteName}
          className="inline-flex shrink-0 items-center no-underline"
        >
          <PolumatLogo
            alt={dictionary.meta.siteName}
            size="small"
            surface="dark"
            className="h-7 w-auto sm:h-9"
            eager
          />
        </Link>

        <nav aria-label={dictionary.a11y.mainNavigation} className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {primaryNav.map((item) => {
              const active = isNavItemActive(pathname, item)
              if (item.children?.length) {
                return (
                  <li key={`${item.href}-${item.label}`} className="group relative">
                    <Link
                      href={item.href}
                      className={`inline-flex min-h-11 items-center gap-1.5 border-b-2 px-3 text-sm font-medium no-underline transition ${
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
                    className={`inline-flex min-h-11 items-center border-b-2 px-3 text-sm font-medium no-underline transition ${
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
          <NavAnchor
            item={dealerItem}
            className="hidden min-h-11 items-center border border-border px-3 text-sm font-semibold text-foreground no-underline transition hover:border-accent hover:text-accent md:inline-flex lg:hidden"
          />
          <ButtonLink href={quoteHref} className="hidden sm:inline-flex">
            {dictionary.nav.requestQuote}
          </ButtonLink>
          <MobileNavigation
            localeHome={homeHref}
            brand={dictionary.meta.siteName}
            items={[...primaryNav, dealerItem]}
            quoteHref={quoteHref}
            quoteLabel={dictionary.nav.requestQuote}
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
