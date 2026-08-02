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
  reference?: {
    _type?: string
    slug?: string | null
    language?: string | null
  } | null
}

type SiteSettingsData = {
  companyName?: string | null
  headerNavigation?: HeaderNavItem[] | null
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

export function mapHeaderNavigation(
  locale: Locale,
  navigation: HeaderNavItem[] | null | undefined,
): NavItem[] {
  if (!navigation?.length) return []

  return navigation
    .map((item) => {
      const href = resolveHref(locale, item)
      if (!href || !item.label) return null
      return {
        href,
        label: item.label,
      }
    })
    .filter((item): item is NavItem => item !== null)
}
