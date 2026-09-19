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
  href?: string
  label: string
  external?: boolean
  openInNewTab?: boolean
  children?: NavItem[]
}

export function getCorporateNavItems(locale: Locale, dictionary: Dictionary): NavItem[] {
  return [
    {href: `/${locale}/export`, label: dictionary.nav.export},
    {href: `/${locale}/about`, label: dictionary.nav.about},
    {href: `/${locale}/gallery`, label: dictionary.nav.gallery},
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
      href: `/${locale}/private-label`,
      label: locale === 'ar' ? 'العلامة الخاصة' : 'Private Label',
    },
    {
      label: dictionary.nav.corporate,
      children: getCorporateNavItems(locale, dictionary),
    },
    {href: `/${locale}/export`, label: dictionary.nav.export},
    {href: `/${locale}/turkey-sales`, label: dictionary.nav.turkeySales},
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
    (item) =>
      Boolean(item.href) &&
      (item.href === DEALER_PORTAL_URL || /bayi|dealer|netahsilat/i.test(item.href || '')),
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
      links: [
        ...getCorporateNavItems(locale, dictionary),
        {href: `/${locale}/turkey-sales`, label: dictionary.nav.turkeySales},
        {href: `/${locale}/contact`, label: dictionary.nav.contact},
      ],
    },
    {
      title: dictionary.footer.resources,
      links: [
        {href: `/${locale}/products`, label: dictionary.nav.products},
        {href: `/${locale}/industries`, label: dictionary.nav.industries},
        {href: `/${locale}/export`, label: dictionary.nav.export},
        {href: `/${locale}/blog`, label: dictionary.nav.blog},
        {href: `/${locale}/videos`, label: dictionary.footer.videos},
        {href: `/${locale}/gallery`, label: dictionary.nav.gallery},
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

/** Ensure contact + gallery stay available even when Sanity overrides footer/nav. */
export function withFooterEssentials(
  columns: Array<{title: string; links: NavItem[]}>,
  locale: Locale,
  dictionary: Dictionary,
): Array<{title: string; links: NavItem[]}> {
  if (!columns.length) return getDefaultFooterColumns(locale, dictionary)

  const contactHref = `/${locale}/contact`
  const galleryHref = `/${locale}/gallery`
  const allLinks = columns.flatMap((column) => column.links)
  const hasContact = allLinks.some((link) => link.href === contactHref)
  const hasGallery = allLinks.some((link) => link.href === galleryHref)

  if (hasContact && hasGallery) return columns

  return columns.map((column, index) => {
    if (index !== 0) return column
    const links = [...column.links]
    if (!hasGallery) {
      links.push({href: galleryHref, label: dictionary.nav.gallery})
    }
    if (!hasContact) {
      links.push({href: contactHref, label: dictionary.nav.contact})
    }
    return {...column, links}
  })
}

/** Ensure Turkey Sales sits between Export and Contact when Sanity nav is stale. */
export function withTurkeySalesNav(
  items: NavItem[],
  locale: Locale,
  dictionary: Dictionary,
): NavItem[] {
  const turkeyHref = `/${locale}/turkey-sales`
  const alreadyPresent = items.some((item) => {
    if (item.href === turkeyHref) return true
    return (item.children || []).some((child) => child.href === turkeyHref)
  })
  if (alreadyPresent) return items

  const exportIndex = items.findIndex((item) => item.href === `/${locale}/export`)
  const contactIndex = items.findIndex((item) => item.href === `/${locale}/contact`)
  const link = {href: turkeyHref, label: dictionary.nav.turkeySales}

  if (exportIndex >= 0) {
    const next = [...items]
    next.splice(exportIndex + 1, 0, link)
    return next
  }

  if (contactIndex >= 0) {
    const next = [...items]
    next.splice(contactIndex, 0, link)
    return next
  }

  return [...items, link]
}

/** Ensure Turkey Sales appears under the Kurumsal / Company footer column. */
export function withTurkeySalesFooter(
  columns: Array<{title: string; links: NavItem[]}>,
  locale: Locale,
  dictionary: Dictionary,
): Array<{title: string; links: NavItem[]}> {
  if (!columns.length) return columns

  const turkeyHref = `/${locale}/turkey-sales`
  const alreadyPresent = columns.some((column) =>
    column.links.some((link) => link.href === turkeyHref),
  )
  if (alreadyPresent) return columns

  return columns.map((column, index) => {
    if (index !== 0) return column
    const links = [...column.links]
    const contactIndex = links.findIndex((link) => link.href === `/${locale}/contact`)
    const link = {href: turkeyHref, label: dictionary.nav.turkeySales}
    if (contactIndex >= 0) {
      links.splice(contactIndex, 0, link)
    } else {
      links.push(link)
    }
    return {...column, links}
  })
}

export function withCorporateGallery(
  items: NavItem[],
  locale: Locale,
  dictionary: Dictionary,
): NavItem[] {
  const galleryHref = `/${locale}/gallery`
  const alreadyPresent = items.some((item) => {
    if (item.href === galleryHref) return true
    return (item.children || []).some((child) => child.href === galleryHref)
  })
  if (alreadyPresent) return items

  return items.map((item) => {
    if (!item.children?.length) return item
    const isCorporate =
      item.label === dictionary.nav.corporate ||
      item.children.some((child) => child.href === `/${locale}/about`)
    if (!isCorporate) return item

    const aboutIndex = item.children.findIndex((child) => child.href === `/${locale}/about`)
    const insertAt = aboutIndex >= 0 ? aboutIndex + 1 : 1
    const children = [...item.children]
    children.splice(insertAt, 0, {href: galleryHref, label: dictionary.nav.gallery})
    return {...item, children}
  })
}
