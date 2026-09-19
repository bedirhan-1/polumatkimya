import type {Locale} from '@/lib/i18n/locales'
import {sanityFetch} from '@/sanity/lib/live'
import {TURKEY_SALES_PAGE_QUERY} from '@/sanity/queries/turkey-sales-page'

export async function getTurkeySalesPage(locale: Locale) {
  try {
    const {data} = await sanityFetch({
      query: TURKEY_SALES_PAGE_QUERY,
      params: {locale},
      stega: false,
    })
    return data ?? null
  } catch {
    return null
  }
}
