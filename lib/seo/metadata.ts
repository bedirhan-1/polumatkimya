import type {Metadata} from 'next'

import {locales, type Locale} from '@/lib/i18n/locales'

type SeoFields = {
  title?: string | null
  description?: string | null
  noIndex?: boolean | null
} | null

function absoluteUrl(siteUrl: string, path: string) {
  const base = siteUrl.replace(/\/$/, '')
  return path.startsWith('http') ? path : `${base}${path.startsWith('/') ? path : `/${path}`}`
}

export function buildPageMetadata({
  locale,
  fallbackTitle,
  fallbackDescription,
  seo,
  path,
  localePaths,
}: {
  locale: Locale
  fallbackTitle: string
  fallbackDescription: string
  seo?: SeoFields
  path: string
  /** Optional per-locale path overrides (e.g. document-level blog slugs). */
  localePaths?: Partial<Record<Locale, string>>
}): Metadata {
  const title = seo?.title || fallbackTitle
  const description = seo?.description || fallbackDescription
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://polumatkimya.com'
  const defaultPath = `/${locale}${path === '/' ? '' : path}`
  const canonical = absoluteUrl(siteUrl, localePaths?.[locale] || defaultPath)

  const languages: Record<string, string> = {}
  for (const item of locales) {
    const itemPath =
      localePaths?.[item] || `/${item}${path === '/' ? '' : path}`
    languages[item] = absoluteUrl(siteUrl, itemPath)
  }
  languages['x-default'] = languages.tr

  return {
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    robots: seo?.noIndex ? {index: false, follow: false} : undefined,
  }
}
