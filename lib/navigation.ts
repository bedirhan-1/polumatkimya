import type {Locale} from '@/lib/i18n/locales'
import type {Dictionary} from '@/lib/i18n/get-dictionary'

export const DEALER_PORTAL_URL = 'https://polumat.netahsilat.com/auth/sign-in'

/** Fallback contact used when Sanity site settings are empty (matches live Polumat). */
export const DEFAULT_CONTACT = {
  phone: '+90 372 615 77 70',
  phoneHref: 'tel:+903726157770',
  email: 'fabrika@polumatkimya.com',
  emailHref: 'mailto:fabrika@polumatkimya.com',
} as const

export type NavItem = {
  href: string
  label: string
  external?: boolean
  openInNewTab?: boolean
  children?: NavItem[]
}

export function getCorporateNavItems(locale: Locale, dictionary: Dictionary): NavItem[] {
  return [
    {href: `/${locale}/about`, label: dictionary.nav.about},
    {
      href: `/${locale}/company/mission-and-vision`,
      label: dictionary.nav.missionVision,
    },
    {
      href: `/${locale}/quality-certificates`,
      label: dictionary.nav.quality,
    },
    {
      href: `/${locale}/company/environmental-responsibility`,
      label: dictionary.nav.environment,
    },
    {
      href: `/${locale}/company/occupational-health-and-safety`,
      label: dictionary.nav.ohs,
    },
    {
      href: `/${locale}/company/customer-satisfaction`,
      label: dictionary.nav.customerSatisfaction,
    },
    {
      href: `/${locale}/company/human-resources`,
      label: dictionary.nav.humanResources,
    },
  ]
}

export function getDefaultNavItems(locale: Locale, dictionary: Dictionary): NavItem[] {
  return [
    {href: `/${locale}/products`, label: dictionary.nav.products},
    {href: `/${locale}/industries`, label: dictionary.nav.industries},
    {
      href: `/${locale}/about`,
      label: dictionary.nav.corporate,
      children: getCorporateNavItems(locale, dictionary),
    },
    {href: `/${locale}/blog`, label: dictionary.nav.blog},
    {href: `/${locale}/videos`, label: dictionary.footer.videos},
    {href: `/${locale}/contact`, label: dictionary.nav.contact},
    {
      href: DEALER_PORTAL_URL,
      label: dictionary.nav.dealerLogin,
      external: true,
      openInNewTab: true,
    },
  ]
}

/** Ensure dealer portal is always available even when Sanity overrides nav. */
export function withDealerLogin(items: NavItem[], dictionary: Dictionary): NavItem[] {
  const alreadyPresent = items.some(
    (item) => item.href === DEALER_PORTAL_URL || /bayi|dealer|netahsilat/i.test(item.href),
  )
  if (alreadyPresent) return items
  return [
    ...items,
    {
      href: DEALER_PORTAL_URL,
      label: dictionary.nav.dealerLogin,
      external: true,
      openInNewTab: true,
    },
  ]
}

export function getDefaultFooterColumns(locale: Locale, dictionary: Dictionary) {
  return [
    {
      title: dictionary.footer.company,
      links: getCorporateNavItems(locale, dictionary),
    },
    {
      title: dictionary.footer.resources,
      links: [
        {href: `/${locale}/products`, label: dictionary.nav.products},
        {href: `/${locale}/industries`, label: dictionary.nav.industries},
        {href: `/${locale}/blog`, label: dictionary.nav.blog},
        {href: `/${locale}/videos`, label: dictionary.footer.videos},
      ],
    },
    {
      title: dictionary.footer.legal,
      links: [
        {href: `/${locale}/legal/privacy-policy`, label: dictionary.footer.privacy},
        {href: `/${locale}/legal/personal-data-protection`, label: dictionary.footer.kvkk},
        {href: `/${locale}/legal/cookie-policy`, label: dictionary.footer.cookies},
        {
          href: DEALER_PORTAL_URL,
          label: dictionary.nav.dealerLogin,
          external: true,
          openInNewTab: true,
        },
      ],
    },
  ]
}
