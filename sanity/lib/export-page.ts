import type {Locale} from '@/lib/i18n/locales'
import {sanityFetch} from '@/sanity/lib/live'
import {EXPORT_PAGE_QUERY} from '@/sanity/queries/export-page'

export async function getExportPage(locale: Locale) {
  try {
    const {data} = await sanityFetch({
      query: EXPORT_PAGE_QUERY,
      params: {locale},
      stega: false,
    })
    return data ?? null
  } catch {
    return null
  }
}
