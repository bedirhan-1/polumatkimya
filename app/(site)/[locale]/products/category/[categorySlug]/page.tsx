import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {Breadcrumbs} from '@/components/content/breadcrumbs'
import {PageHero} from '@/components/content/page-hero'
import {PortableTextRenderer} from '@/components/content/portable-text'
import {SectionHeading} from '@/components/content/section-heading'
import {MobileProductFilters} from '@/components/product/mobile-product-filters'
import {ProductFilters} from '@/components/product/product-filters'
import {ProductGrid} from '@/components/product/product-grid'
import {getDictionary} from '@/lib/i18n/get-dictionary'
import {isLocale, locales, type Locale} from '@/lib/i18n/locales'
import {firstParam, formatResultsCount} from '@/lib/products/seo'
import type {FilterOption, ProductCardData} from '@/lib/products/types'
import {buildPageMetadata} from '@/lib/seo/metadata'
import {
  getCategorySlugs,
  getFilterIndustries,
  getProductCategories,
  getProductCategoryBySlug,
  getProducts,
} from '@/sanity/lib/products'

type PageProps = {
  params: Promise<{locale: string; categorySlug: string}>
  searchParams: Promise<{[key: string]: string | string[] | undefined}>
}

export async function generateStaticParams() {
  try {
    const slugs = await getCategorySlugs()
    return locales.flatMap((locale) => slugs.map((categorySlug) => ({locale, categorySlug})))
  } catch {
    return []
  }
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale: localeParam, categorySlug} = await params
  if (!isLocale(localeParam)) return {}
  const dictionary = await getDictionary(localeParam)
  const category = await getProductCategoryBySlug(localeParam, categorySlug)
  const title =
    category && typeof category === 'object' && 'title' in category && typeof category.title === 'string'
      ? category.title
      : categorySlug

  return buildPageMetadata({
    locale: localeParam,
    fallbackTitle: title,
    fallbackDescription: dictionary.products.description,
    seo: category && typeof category === 'object' && 'seo' in category ? (category.seo as never) : null,
    path: `/products/category/${categorySlug}`,
  })
}

export default async function ProductCategoryPage({params, searchParams}: PageProps) {
  const {locale: localeParam, categorySlug} = await params
  if (!isLocale(localeParam)) notFound()

  const locale = localeParam as Locale
  const dictionary = await getDictionary(locale)
  const category = await getProductCategoryBySlug(locale, categorySlug)

  if (!category || typeof category !== 'object' || !('title' in category) || !category.title) {
    notFound()
  }

  const data = category as {
    title: string
    summary?: string | null
    body?: unknown
  }

  const query = await searchParams
  const filters = {
    category: categorySlug,
    industry: firstParam(query.industry),
    q: firstParam(query.q),
  }
  const basePath = `/products/category/${categorySlug}`

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
            {href: `/${locale}/products`, label: dictionary.products.title},
            {label: data.title},
          ]}
        />
        <div className="animate-product-rise mt-6">
          <SectionHeading as="h1" heading={data.title} description={data.summary} />
        </div>
      </PageHero>

      <section className="border-b border-border section-space">
        <div className="container-site">
          {data.body ? (
            <div className="mb-10 max-w-3xl">
              <PortableTextRenderer value={data.body} />
            </div>
          ) : null}

          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <aside className="hidden lg:block">
              <div className="sticky top-[var(--sticky-offset)] z-10 max-h-[calc(100vh-var(--sticky-offset)-1rem)] overflow-y-auto">
                <ProductFilters
                  locale={locale}
                  dictionary={dictionary}
                  categories={categoryOptions}
                  industries={industryOptions}
                  current={filters}
                  basePath={basePath}
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
                basePath={basePath}
              />
              <div className="flex items-end justify-between gap-4 border-b border-border pb-3">
                <p className="text-sm font-medium tracking-wide text-foreground">{resultsLabel}</p>
                {filters.industry || filters.q ? (
                  <p className="text-xs text-muted">{dictionary.filters.activeFilters}</p>
                ) : null}
              </div>
              <ProductGrid
                locale={locale}
                products={productList}
                detailLabel={dictionary.products.detail}
                emptyLabel={dictionary.filters.noResults}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
