import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {HomeLanding} from '@/components/home/home-landing'
import {asHomePageContent} from '@/lib/home/content'
import {getDictionary} from '@/lib/i18n/get-dictionary'
import {isLocale, type Locale} from '@/lib/i18n/locales'
import type {ProductDetailData} from '@/lib/products/types'
import {asSeo} from '@/lib/sanity/content'
import {buildPageMetadata} from '@/lib/seo/metadata'
import {getHomePage} from '@/sanity/lib/pages'
import {getProductBySlug} from '@/sanity/lib/products'

type HomePageProps = {
  params: Promise<{locale: string}>
}

export async function generateMetadata({params}: HomePageProps): Promise<Metadata> {
  const {locale: localeParam} = await params
  if (!isLocale(localeParam)) return {}
  const dictionary = await getDictionary(localeParam)
  const page = await getHomePage(localeParam)
  return buildPageMetadata({
    locale: localeParam,
    fallbackTitle: dictionary.meta.siteName,
    fallbackDescription: dictionary.meta.defaultDescription,
    seo: asSeo(page && typeof page === 'object' ? (page as {seo?: unknown}).seo : null),
    path: '/',
  })
}

export default async function HomePage({params}: HomePageProps) {
  const {locale: localeParam} = await params
  if (!isLocale(localeParam)) notFound()

  const locale = localeParam as Locale
  const [page, spotlightProductRaw] = await Promise.all([
    getHomePage(locale),
    getProductBySlug(locale, 'mdf-kit-activator'),
  ])
  const spotlightProduct =
    spotlightProductRaw &&
    typeof spotlightProductRaw === 'object' &&
    '_id' in spotlightProductRaw &&
    'title' in spotlightProductRaw
      ? (spotlightProductRaw as ProductDetailData)
      : null

  return (
    <main id="main-content">
      <HomeLanding
        locale={locale}
        content={asHomePageContent(page)}
        spotlightProduct={spotlightProduct}
      />
    </main>
  )
}
