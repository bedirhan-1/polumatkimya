import type {Locale} from '@/lib/i18n/locales'
import {sanityFetch} from '@/sanity/lib/live'
import {
  CONTACT_PAGE_QUERY,
  HOME_PAGE_QUERY,
  PAGE_BY_SLUG_QUERY,
} from '@/sanity/queries/pages'
import {
  APPLICATION_AREA_BY_SLUG_QUERY,
  APPLICATION_AREAS_QUERY,
} from '@/sanity/queries/industries'
import {CERTIFICATES_QUERY} from '@/sanity/queries/certificates'

async function safeFetch<T>(fn: () => Promise<{data: T}>): Promise<T | null> {
  try {
    const {data} = await fn()
    return data ?? null
  } catch {
    return null
  }
}

export function getHomePage(locale: Locale) {
  return safeFetch(() =>
    sanityFetch({
      query: HOME_PAGE_QUERY,
      params: {locale},
      stega: false,
    }),
  )
}

export function getContactPage(locale: Locale) {
  return safeFetch(() =>
    sanityFetch({
      query: CONTACT_PAGE_QUERY,
      params: {locale},
      stega: false,
    }),
  )
}

export function getPageBySlug(locale: Locale, slug: string) {
  return safeFetch(() =>
    sanityFetch({
      query: PAGE_BY_SLUG_QUERY,
      params: {locale, slug},
      stega: false,
    }),
  )
}

export function getApplicationAreas(locale: Locale) {
  return safeFetch(() =>
    sanityFetch({
      query: APPLICATION_AREAS_QUERY,
      params: {locale},
      stega: false,
    }),
  )
}

export function getApplicationAreaBySlug(locale: Locale, slug: string) {
  return safeFetch(() =>
    sanityFetch({
      query: APPLICATION_AREA_BY_SLUG_QUERY,
      params: {locale, slug},
      stega: false,
    }),
  )
}

export function getCertificates(locale: Locale) {
  return safeFetch(() =>
    sanityFetch({
      query: CERTIFICATES_QUERY,
      params: {locale},
      stega: false,
    }),
  )
}
