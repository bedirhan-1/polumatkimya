import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {Breadcrumbs} from '@/components/content/breadcrumbs'
import {PageHero} from '@/components/content/page-hero'
import {PortableTextRenderer} from '@/components/content/portable-text'
import {SanityImage} from '@/components/content/sanity-image'
import {RelatedProductsSlider} from '@/components/product/related-products-slider'
import {getDictionary} from '@/lib/i18n/get-dictionary'
import {isLocale, locales, type Locale} from '@/lib/i18n/locales'
import type {ProductCardData} from '@/lib/products/types'
import {buildPageMetadata} from '@/lib/seo/metadata'
import {client} from '@/sanity/lib/client'
import {getApplicationAreaBySlug} from '@/sanity/lib/pages'
import {getProducts} from '@/sanity/lib/products'
import {APPLICATION_AREA_SLUGS_QUERY} from '@/sanity/queries/industries'

type PageProps = {
  params: Promise<{locale: string; industrySlug: string}>
}

export async function generateStaticParams() {
  try {
    const slugs = await client
      .withConfig({useCdn: false})
      .fetch<{slug: string}[]>(APPLICATION_AREA_SLUGS_QUERY)
    return locales.flatMap((locale) =>
      (slugs || []).map((item) => ({locale, industrySlug: item.slug})),
    )
  } catch {
    return []
  }
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale: localeParam, industrySlug} = await params
  if (!isLocale(localeParam)) return {}
  const dictionary = await getDictionary(localeParam)
  const area = await getApplicationAreaBySlug(localeParam, industrySlug)
  const title =
    area && typeof area === 'object' && 'title' in area && typeof area.title === 'string'
      ? area.title
      : industrySlug
  return buildPageMetadata({
    locale: localeParam,
    fallbackTitle: title,
    fallbackDescription: dictionary.pages.industriesDescription,
    seo: area && typeof area === 'object' && 'seo' in area ? (area.seo as never) : null,
    path: `/industries/${industrySlug}`,
  })
}

function asProductCards(value: unknown): ProductCardData[] {
  if (!Array.isArray(value)) return []
  return value.filter(
    (item): item is ProductCardData =>
      Boolean(item && typeof item === 'object' && 'slug' in item && 'title' in item),
  )
}

export default async function IndustryDetailPage({params}: PageProps) {
  const {locale: localeParam, industrySlug} = await params
  if (!isLocale(localeParam)) notFound()

  const locale = localeParam as Locale
  const dictionary = await getDictionary(locale)
  const [area, filteredProducts] = await Promise.all([
    getApplicationAreaBySlug(locale, industrySlug),
    getProducts(locale, {industry: industrySlug}),
  ])

  if (!area || typeof area !== 'object' || !('title' in area) || !area.title) {
    notFound()
  }

  const data = area as {
    title: string
    summary?: string | null
    body?: unknown
    coverImage?: {asset?: {_ref?: string}; alt?: string | null} | null
    benefits?: Array<{
      _key: string
      title?: string | null
      description?: string | null
    }> | null
    products?: ProductCardData[] | null
  }

  const curated = asProductCards(data.products)
  const fromFilter = asProductCards(filteredProducts)
  const products = (curated.length ? curated : fromFilter).slice(0, 12)

  return (
    <main id="main-content">
      <PageHero compact>
        <Breadcrumbs
          className="mb-0"
          label={dictionary.products.breadcrumbs}
          items={[
            {href: `/${locale}`, label: dictionary.common.home},
            {href: `/${locale}/industries`, label: dictionary.pages.industriesTitle},
            {label: data.title},
          ]}
        />

        <div className="mt-5 grid items-center gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.22em] text-accent uppercase">
              {dictionary.pages.industriesTitle}
            </p>
            <h1 className="mt-2 font-display text-3xl text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
              {data.title}
            </h1>
            {data.summary ? (
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base line-clamp-3">
                {data.summary}
              </p>
            ) : null}
          </div>

          {data.coverImage?.asset ? (
            <div className="relative hidden aspect-[16/10] overflow-hidden border border-white/10 bg-surface sm:block lg:aspect-[5/3]">
              <SanityImage
                image={data.coverImage}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 40vw, 28vw"
              />
            </div>
          ) : null}
        </div>
      </PageHero>

      {products.length ? (
        <RelatedProductsSlider
          locale={locale}
          products={products}
          detailLabel={dictionary.products.detail}
          heading={dictionary.pages.recommendedProducts}
          allProductsHref={`/${locale}/products?industry=${encodeURIComponent(industrySlug)}`}
          allProductsLabel={dictionary.nav.products}
        />
      ) : (
        <section className="border-b border-border section-space">
          <div className="container-site">
            <p className="text-sm text-muted">{dictionary.pages.emptyIndustry}</p>
          </div>
        </section>
      )}

      {data.body ? (
        <section className="border-b border-border py-10 sm:py-12">
          <div className="container-site max-w-3xl">
            <PortableTextRenderer value={data.body} />
          </div>
        </section>
      ) : null}

      {data.benefits?.length ? (
        <section className="border-b border-border py-10 sm:py-12">
          <div className="container-site grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.benefits.map((benefit) => (
              <div key={benefit._key} className="border border-border/80 bg-surface/60 px-4 py-4">
                <h2 className="text-sm font-semibold tracking-wide text-foreground uppercase">
                  {benefit.title}
                </h2>
                {benefit.description ? (
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{benefit.description}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  )
}
