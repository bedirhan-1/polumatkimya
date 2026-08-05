import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {MarketingFallback} from '@/components/content/marketing-fallback'
import {PageBuilder} from '@/components/content/page-builder'
import {getDictionary} from '@/lib/i18n/get-dictionary'
import {isLocale, locales, type Locale} from '@/lib/i18n/locales'
import {asPageBuilderBlocks, asSeo, asString} from '@/lib/sanity/content'
import {buildPageMetadata} from '@/lib/seo/metadata'
import {getPageBySlug} from '@/sanity/lib/pages'

type PageProps = {
  params: Promise<{locale: string; pageSlug: string}>
}

const KNOWN_COMPANY_SLUGS = [
  'mission-and-vision',
  'environmental-responsibility',
  'occupational-health-and-safety',
  'customer-satisfaction',
  'human-resources',
  'return-and-exchange-policy',
]

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    KNOWN_COMPANY_SLUGS.map((pageSlug) => ({locale, pageSlug})),
  )
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale: localeParam, pageSlug} = await params
  if (!isLocale(localeParam)) return {}
  const dictionary = await getDictionary(localeParam)
  const page = await getPageBySlug(localeParam, pageSlug)
  const title = asString(
    page && typeof page === 'object' ? (page as {title?: unknown}).title : null,
    pageSlug,
  )
  return buildPageMetadata({
    locale: localeParam,
    fallbackTitle: title,
    fallbackDescription: dictionary.meta.defaultDescription,
    seo: asSeo(page && typeof page === 'object' ? (page as {seo?: unknown}).seo : null),
    path: `/company/${pageSlug}`,
  })
}

export default async function CompanyPage({params}: PageProps) {
  const {locale: localeParam, pageSlug} = await params
  if (!isLocale(localeParam)) notFound()

  const locale = localeParam as Locale
  const dictionary = await getDictionary(locale)
  const page = await getPageBySlug(locale, pageSlug)
  const blocks = asPageBuilderBlocks(
    page && typeof page === 'object' ? (page as {pageBuilder?: unknown}).pageBuilder : null,
  )
  const title = asString(
    page && typeof page === 'object' ? (page as {title?: unknown}).title : null,
    pageSlug,
  )

  return (
    <main id="main-content">
      {blocks ? (
        <PageBuilder locale={locale} dictionary={dictionary} blocks={blocks} />
      ) : (
        <MarketingFallback
          locale={locale}
          dictionary={dictionary}
          title={title}
          description={dictionary.meta.defaultDescription}
        />
      )}
    </main>
  )
}
