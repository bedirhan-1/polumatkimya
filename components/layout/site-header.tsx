import Link from 'next/link'

import {LanguageSwitcher} from '@/components/navigation/language-switcher'
import {MobileNavigation} from '@/components/navigation/mobile-navigation'
import {ButtonLink} from '@/components/ui/button-link'
import type {Dictionary} from '@/lib/i18n/get-dictionary'
import type {Locale} from '@/lib/i18n/locales'
import {getDefaultNavItems, type NavItem} from '@/lib/navigation'

type SiteHeaderProps = {
  locale: Locale
  dictionary: Dictionary
  items?: NavItem[]
}

export function SiteHeader({locale, dictionary, items}: SiteHeaderProps) {
  const navItems = items?.length ? items : getDefaultNavItems(locale, dictionary)
  const homeHref = `/${locale}`
  const quoteHref = `/${locale}/request-a-quote`

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="container-site flex h-[var(--header-height)] items-center justify-between gap-4">
        <Link
          href={homeHref}
          className="font-display text-xl font-bold tracking-[0.04em] text-foreground no-underline sm:text-2xl"
        >
          <span className="text-accent">POLUMAT</span>
          <span className="ms-1 text-muted">KİMYA</span>
        </Link>

        <nav aria-label={dictionary.a11y.mainNavigation} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center px-3 text-sm font-medium text-muted no-underline transition hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher locale={locale} label={dictionary.a11y.languageSwitcher} />
          <ButtonLink href={quoteHref} className="hidden sm:inline-flex">
            {dictionary.nav.requestQuote}
          </ButtonLink>
          <MobileNavigation
            localeHome={homeHref}
            brand={dictionary.meta.siteName}
            items={navItems}
            quoteHref={quoteHref}
            quoteLabel={dictionary.nav.requestQuote}
            openLabel={dictionary.a11y.openMenu}
            closeLabel={dictionary.a11y.closeMenu}
            navLabel={dictionary.a11y.mainNavigation}
          />
        </div>
      </div>
    </header>
  )
}
