import type {Locale} from '@/lib/i18n/locales'
import {client} from '@/sanity/lib/client'
import {sanityFetch} from '@/sanity/lib/live'
import {
  FILTER_INDUSTRIES_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  PRODUCT_CATEGORIES_QUERY,
  PRODUCT_CATEGORY_BY_SLUG_QUERY,
  PRODUCTS_QUERY,
} from '@/sanity/queries/products'

async function safeFetch<T>(fn: () => Promise<{data: T}>): Promise<T | null> {
  try {
    const {data} = await fn()
    return data ?? null
  } catch {
    return null
  }
}

export type ProductFilters = {
  category?: string
  industry?: string
  q?: string
}

export function getProductCategories(locale: Locale) {
  return safeFetch(() =>
    sanityFetch({
      query: PRODUCT_CATEGORIES_QUERY,
      params: {locale},
      stega: false,
    }),
  )
}

export function getProductCategoryBySlug(locale: Locale, slug: string) {
  return safeFetch(() =>
    sanityFetch({
      query: PRODUCT_CATEGORY_BY_SLUG_QUERY,
      params: {locale, slug},
      stega: false,
    }),
  )
}

export function getFilterIndustries(locale: Locale) {
  return safeFetch(() =>
    sanityFetch({
      query: FILTER_INDUSTRIES_QUERY,
      params: {locale},
      stega: false,
    }),
  )
}

export function getProducts(locale: Locale, filters: ProductFilters = {}) {
  const category = filters.category || ''
  const industry = filters.industry || ''
  const q = (filters.q || '').trim()
  const qWildcard = q ? `*${q}*` : ''

  return safeFetch(() =>
    sanityFetch({
      query: PRODUCTS_QUERY,
      params: {locale, category, industry, q, qWildcard},
      stega: false,
    }),
  )
}

export function getProductBySlug(locale: Locale, slug: string) {
  return safeFetch(() =>
    sanityFetch({
      query: PRODUCT_BY_SLUG_QUERY,
      params: {locale, slug},
      stega: false,
    }),
  )
}

export async function getPublishedProductSlugs(): Promise<string[]> {
  try {
    const slugs = await client
      .withConfig({useCdn: false})
      .fetch<Array<{slug: string}>>(`*[_type == "product" && status == "published" && defined(slug.current)]{"slug": slug.current}`)
    return (slugs || []).map((item) => item.slug)
  } catch {
    return []
  }
}

export async function getCategorySlugs(): Promise<string[]> {
  try {
    const slugs = await client
      .withConfig({useCdn: false})
      .fetch<Array<{slug: string}>>(`*[_type == "productCategory" && defined(slug.current)]{"slug": slug.current}`)
    return (slugs || []).map((item) => item.slug)
  } catch {
    return []
  }
}
