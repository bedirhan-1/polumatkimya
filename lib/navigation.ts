import type {Locale} from '@/lib/i18n/locales'
import type {Dictionary} from '@/lib/i18n/get-dictionary'

export type NavItem = {
  href: string
  label: string
}

export function getDefaultNavItems(locale: Locale, dictionary: Dictionary): NavItem[] {
  return [
    {href: `/${locale}/products`, label: dictionary.nav.products},
    {href: `/${locale}/industries`, label: dictionary.nav.industries},
    {href: `/${locale}/private-label`, label: dictionary.nav.privateLabel},
    {href: `/${locale}/about`, label: dictionary.nav.about},
    {href: `/${locale}/blog`, label: dictionary.nav.blog},
    {href: `/${locale}/contact`, label: dictionary.nav.contact},
  ]
}

export function getDefaultFooterColumns(locale: Locale, dictionary: Dictionary) {
  return [
    {
      title: dictionary.footer.company,
      links: [
        {href: `/${locale}/about`, label: dictionary.nav.about},
        {href: `/${locale}/quality-certificates`, label: dictionary.footer.quality},
        {href: `/${locale}/contact`, label: dictionary.nav.contact},
      ],
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
      ],
    },
  ]
}
