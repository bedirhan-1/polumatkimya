import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {Breadcrumbs} from '@/components/content/breadcrumbs'
import {IndustryCards, type IndustryCardItem} from '@/components/content/industry-cards'
import {MarketingFallback} from '@/components/content/marketing-fallback'
import {PageHero} from '@/components/content/page-hero'
import {getDictionary} from '@/lib/i18n/get-dictionary'
import {isLocale, locales, type Locale} from '@/lib/i18n/locales'
import {buildPageMetadata} from '@/lib/seo/metadata'
import {getApplicationAreas} from '@/sanity/lib/pages'

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
  return buildPageMetadata({
    locale: localeParam,
    fallbackTitle: dictionary.pages.industriesTitle,
    fallbackDescription: dictionary.pages.industriesDescription,
    path: '/industries',
  })
}

export default async function IndustriesPage({params}: PageProps) {
  const {locale: localeParam} = await params
  if (!isLocale(localeParam)) notFound()

  const locale = localeParam as Locale
  const dictionary = await getDictionary(locale)
  const areasRaw = await getApplicationAreas(locale)
  const areas = (Array.isArray(areasRaw) ? areasRaw : []) as IndustryCardItem[]
  const hasAreas = areas.some((area) => area.slug && area.title)

  return (
    <main id="main-content">
      <PageHero compact>
        <Breadcrumbs
          className="mb-0"
          label={dictionary.products.breadcrumbs}
          items={[
            {href: `/${locale}`, label: dictionary.common.home},
            {label: dictionary.pages.industriesTitle},
          ]}
        />
        <div className="mt-5 max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.22em] text-accent uppercase">
            Polumat
          </p>
          <h1 className="mt-2 font-display text-3xl text-foreground sm:text-4xl lg:text-5xl">
            {dictionary.pages.industriesTitle}
          </h1>
          <p className="mt-3 text-sm text-muted sm:text-base">
            {dictionary.pages.industriesDescription}
          </p>
        </div>
      </PageHero>

      {hasAreas ? (
        <section className="border-b border-border bg-[#08090b]">
          <div className="container-site py-10 sm:py-14">
            <IndustryCards locale={locale} areas={areas} />
          </div>
        </section>
      ) : (
        <MarketingFallback
          locale={locale}
          dictionary={dictionary}
          title={dictionary.pages.industriesTitle}
          description={dictionary.pages.industriesDescription}
        />
      )}
    </main>
  )
}
