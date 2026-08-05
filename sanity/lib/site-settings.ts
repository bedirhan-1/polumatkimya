import type {Locale} from '@/lib/i18n/locales'
import type {NavItem} from '@/lib/navigation'
import {resolveHref} from '@/sanity/lib/link-resolver'
import {sanityFetch} from '@/sanity/lib/live'
import {SITE_SETTINGS_QUERY} from '@/sanity/queries/site-settings'

type HeaderNavItem = {
  _key?: string
  label?: string | null
  linkType?: 'internal' | 'external' | 'reference' | null
  internalPath?: string | null
  externalUrl?: string | null
  openInNewTab?: boolean | null
  reference?: {
    _type?: string
    slug?: string | null
    language?: string | null
  } | null
}

type CatalogDocument = {
  _id?: string
  title?: string | null
  language?: string | null
  url?: string | null
}

type SiteSettingsData = {
  companyName?: string | null
  whatsappNumber?: string | null
  whatsappMessage?: string | null
  headerNavigation?: HeaderNavItem[] | null
  contactChannels?: Array<{
    _key?: string
    phone?: string | null
    email?: string | null
    department?: string | null
  }> | null
  catalogs?: CatalogDocument[] | null
  uiLabels?: {
    requestQuote?: string | null
    viewProducts?: string | null
    readMore?: string | null
    download?: string | null
  } | null
}

export async function getSiteSettings(locale: Locale): Promise<SiteSettingsData | null> {
  try {
    const {data} = await sanityFetch({
      query: SITE_SETTINGS_QUERY,
      params: {locale},
      stega: false,
    })
    if (!data || typeof data !== 'object') return null
    return data as SiteSettingsData
  } catch {
    return null
  }
}

export function getCatalogDownload(
  locale: Locale,
  catalogs: CatalogDocument[] | null | undefined,
): {href: string; title: string} | null {
  if (!catalogs?.length) return null
  const withFile = catalogs.filter((catalog) => Boolean(catalog.url))
  const catalog = withFile.find((item) => item.language === locale) || withFile[0]
  if (!catalog?.url) return null

  const filename = `${(catalog.title || 'catalog')
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase()}.pdf`

  return {
    href: `${catalog.url}?dl=${filename}`,
    title: catalog.title || filename,
  }
}

export function mapHeaderNavigation(
  locale: Locale,
  navigation: HeaderNavItem[] | null | undefined,
): NavItem[] {
  if (!navigation?.length) return []

  const items: NavItem[] = []
  for (const item of navigation) {
    const href = resolveHref(locale, item)
    if (!href || !item.label) continue
    const external = item.linkType === 'external' || /^https?:\/\//i.test(href)
    items.push({
      href,
      label: item.label,
      external,
      openInNewTab: Boolean(item.openInNewTab ?? external),
    })
  }
  return items
}
