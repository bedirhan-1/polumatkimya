import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {Breadcrumbs} from '@/components/content/breadcrumbs'
import {PageHero} from '@/components/content/page-hero'
import {MobileProductFilters} from '@/components/product/mobile-product-filters'
import {ProductFilters} from '@/components/product/product-filters'
import {ProductGrid} from '@/components/product/product-grid'
import {getDictionary} from '@/lib/i18n/get-dictionary'
import {isLocale, locales, type Locale} from '@/lib/i18n/locales'
import {firstParam, formatResultsCount} from '@/lib/products/seo'
import type {FilterOption, ProductCardData} from '@/lib/products/types'
import {buildPageMetadata} from '@/lib/seo/metadata'
import {
  getFilterIndustries,
  getProductCategories,
  getProducts,
} from '@/sanity/lib/products'

type PageProps = {
  params: Promise<{locale: string}>
  searchParams: Promise<{[key: string]: string | string[] | undefined}>
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
    fallbackTitle: dictionary.products.title,
    fallbackDescription: dictionary.products.description,
    path: '/products',
  })
}

export default async function ProductsPage({params, searchParams}: PageProps) {
  const {locale: localeParam} = await params
  if (!isLocale(localeParam)) notFound()

  const locale = localeParam as Locale
  const dictionary = await getDictionary(locale)
  const query = await searchParams
  const filters = {
    category: firstParam(query.category),
    industry: firstParam(query.industry),
    q: firstParam(query.q),
  }

  const [categories, industries, products] = await Promise.all([
    getProductCategories(locale),
    getFilterIndustries(locale),
    getProducts(locale, filters),
  ])

  const categoryOptions = (Array.isArray(categories) ? categories : []) as FilterOption[]
  const industryOptions = (Array.isArray(industries) ? industries : []) as FilterOption[]
  const productList = (Array.isArray(products) ? products : []) as ProductCardData[]
  const resultsLabel = formatResultsCount(dictionary.filters.resultsCount, productList.length)

  return (
    <main id="main-content">
      <PageHero>
        <Breadcrumbs
          className="mb-0"
          label={dictionary.products.breadcrumbs}
          items={[
            {href: `/${locale}`, label: dictionary.common.home},
            {label: dictionary.products.title},
          ]}
        />
        <div className="animate-product-rise mt-6 max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.22em] text-accent uppercase">
            Polumat
          </p>
          <h1 className="mt-3 font-display text-4xl text-foreground sm:text-5xl lg:text-6xl">
            {dictionary.products.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted sm:text-lg">
            {dictionary.products.description}
          </p>
        </div>
      </PageHero>

      <section className="border-b border-border">
        <div className="container-site py-10 sm:py-12">
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <aside className="hidden lg:block">
              <div className="sticky top-[var(--sticky-offset)] z-10 max-h-[calc(100vh-var(--sticky-offset)-1rem)] overflow-y-auto">
                <ProductFilters
                  locale={locale}
                  dictionary={dictionary}
                  categories={categoryOptions}
                  industries={industryOptions}
                  current={filters}
                />
              </div>
            </aside>

            <div className="flex flex-col gap-6">
              <MobileProductFilters
                locale={locale}
                dictionary={dictionary}
                categories={categoryOptions}
                industries={industryOptions}
                current={filters}
              />
              <div className="flex items-end justify-between gap-4 border-b border-border pb-3">
                <p className="text-sm font-medium tracking-wide text-foreground">{resultsLabel}</p>
                {filters.category || filters.industry || filters.q ? (
                  <p className="text-xs text-muted">{dictionary.filters.activeFilters}</p>
                ) : null}
              </div>
              <ProductGrid
                locale={locale}
                products={productList}
                detailLabel={dictionary.products.detail}
                emptyLabel={
                  filters.category || filters.industry || filters.q
                    ? dictionary.filters.noResults
                    : dictionary.products.empty
                }
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
