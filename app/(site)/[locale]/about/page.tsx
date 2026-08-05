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
  params: Promise<{locale: string}>
}

export function generateStaticParams() {
  return locales.map((locale) => ({locale}))
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale: localeParam} = await params
  if (!isLocale(localeParam)) return {}
  const dictionary = await getDictionary(localeParam)
  const page = await getPageBySlug(localeParam, 'about')
  return buildPageMetadata({
    locale: localeParam,
    fallbackTitle: dictionary.nav.about,
    fallbackDescription: dictionary.pages.aboutDescription,
    seo: asSeo(page && typeof page === 'object' ? (page as {seo?: unknown}).seo : null),
    path: '/about',
  })
}

export default async function AboutPage({params}: PageProps) {
  const {locale: localeParam} = await params
  if (!isLocale(localeParam)) notFound()

  const locale = localeParam as Locale
  const dictionary = await getDictionary(locale)
  const page = await getPageBySlug(locale, 'about')
  const blocks = asPageBuilderBlocks(
    page && typeof page === 'object' ? (page as {pageBuilder?: unknown}).pageBuilder : null,
  )
  const title = asString(
    page && typeof page === 'object' ? (page as {title?: unknown}).title : null,
    dictionary.nav.about,
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
          description={dictionary.pages.aboutDescription}
        />
      )}
    </main>
  )
}
