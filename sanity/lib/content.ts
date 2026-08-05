import type {Locale} from '@/lib/i18n/locales'
import {isLocale} from '@/lib/i18n/locales'
import {client} from '@/sanity/lib/client'
import {sanityFetch} from '@/sanity/lib/live'
import {
  LATEST_POSTS_QUERY,
  LATEST_VIDEOS_QUERY,
  POST_BY_SLUG_QUERY,
  POST_SLUGS_QUERY,
  POSTS_QUERY,
  VIDEOS_QUERY,
} from '@/sanity/queries/content'

async function safeFetch<T>(fn: () => Promise<{data: T}>): Promise<T | null> {
  try {
    const {data} = await fn()
    return data ?? null
  } catch {
    return null
  }
}

export function getPosts(locale: Locale) {
  return safeFetch(() =>
    sanityFetch({
      query: POSTS_QUERY,
      params: {locale},
      stega: false,
    }),
  )
}

export function getPostBySlug(locale: Locale, slug: string) {
  return safeFetch(() =>
    sanityFetch({
      query: POST_BY_SLUG_QUERY,
      params: {locale, slug},
      stega: false,
    }),
  )
}

export function getLatestPosts(locale: Locale, limit = 3) {
  return safeFetch(() =>
    sanityFetch({
      query: LATEST_POSTS_QUERY,
      params: {locale, limit},
      stega: false,
    }),
  )
}

export function getVideos(locale: Locale) {
  return safeFetch(() =>
    sanityFetch({
      query: VIDEOS_QUERY,
      params: {locale},
      stega: false,
    }),
  )
}

export function getLatestVideos(locale: Locale, limit = 3) {
  return safeFetch(() =>
    sanityFetch({
      query: LATEST_VIDEOS_QUERY,
      params: {locale, limit},
      stega: false,
    }),
  )
}

export async function getPublishedPostParams(): Promise<Array<{locale: string; postSlug: string}>> {
  try {
    const rows = await client
      .withConfig({useCdn: false})
      .fetch<Array<{slug: string; language: string}>>(POST_SLUGS_QUERY)
    return (rows || [])
      .filter((row) => row.slug && isLocale(row.language))
      .map((row) => ({locale: row.language, postSlug: row.slug}))
  } catch {
    return []
  }
}

export function buildPostLocaleHrefs(
  translations:
    | Array<{
        language?: string | null
        slug?: string | null
        translationStatus?: string | null
      } | null>
    | null
    | undefined,
  fallbackLocale: Locale,
  fallbackSlug: string,
): Partial<Record<Locale, string>> {
  const hrefs: Partial<Record<Locale, string>> = {
    [fallbackLocale]: `/${fallbackLocale}/blog/${fallbackSlug}`,
  }

  for (const item of translations || []) {
    if (!item?.language || !item.slug || !isLocale(item.language)) continue
    if (item.translationStatus && item.translationStatus !== 'complete') continue
    hrefs[item.language] = `/${item.language}/blog/${item.slug}`
  }

  return hrefs
}
