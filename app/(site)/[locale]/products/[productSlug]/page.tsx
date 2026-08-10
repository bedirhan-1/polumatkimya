import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'

import {Breadcrumbs} from '@/components/content/breadcrumbs'
import {PageHero} from '@/components/content/page-hero'
import {PortableTextRenderer} from '@/components/content/portable-text'
import {DocumentDownloads} from '@/components/product/document-downloads'
import {ProductGallery} from '@/components/product/product-gallery'
import {ProductSpecifications} from '@/components/product/product-specifications'
import {RelatedProductsSlider} from '@/components/product/related-products-slider'
import {JsonLd} from '@/components/seo/json-ld'
import {ButtonLink} from '@/components/ui/button-link'
import {getDictionary} from '@/lib/i18n/get-dictionary'
import {isLocale, locales, type Locale} from '@/lib/i18n/locales'
import {buildProductJsonLd, buildWhatsAppHref} from '@/lib/products/seo'
import type {ProductCardData, ProductDetailData} from '@/lib/products/types'
import {buildPageMetadata} from '@/lib/seo/metadata'
import {resolveHref} from '@/sanity/lib/link-resolver'
import {getProductBySlug, getPublishedProductSlugs} from '@/sanity/lib/products'
import {getSiteSettings} from '@/sanity/lib/site-settings'

type PageProps = {
  params: Promise<{locale: string; productSlug: string}>
}

export async function generateStaticParams() {
  try {
    const slugs = await getPublishedProductSlugs()
    return locales.flatMap((locale) => slugs.map((productSlug) => ({locale, productSlug})))
  } catch {
    return []
  }
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale: localeParam, productSlug} = await params
  if (!isLocale(localeParam)) return {}
  const dictionary = await getDictionary(localeParam)
  const product = await getProductBySlug(localeParam, productSlug)
  const title =
    product && typeof product === 'object' && 'title' in product && typeof product.title === 'string'
      ? product.title
      : productSlug
  const description =
    product &&
    typeof product === 'object' &&
    'shortDescription' in product &&
    typeof product.shortDescription === 'string'
      ? product.shortDescription
      : dictionary.products.description

  return buildPageMetadata({
    locale: localeParam,
    fallbackTitle: title,
    fallbackDescription: description,
    seo: product && typeof product === 'object' && 'seo' in product ? (product.seo as never) : null,
    path: `/products/${productSlug}`,
  })
}

export default async function ProductDetailPage({params}: PageProps) {
  const {locale: localeParam, productSlug} = await params
  if (!isLocale(localeParam)) notFound()

  const locale = localeParam as Locale
  const dictionary = await getDictionary(locale)
  const [productRaw, siteSettings] = await Promise.all([
    getProductBySlug(locale, productSlug),
    getSiteSettings(locale),
  ])

  if (!productRaw || typeof productRaw !== 'object' || !('title' in productRaw) || !productRaw.title) {
    notFound()
  }

  const product = productRaw as ProductDetailData
  const galleryImages = [product.packshot, ...(product.gallery || [])].filter(
    (image): image is NonNullable<typeof image> => Boolean(image?.asset),
  )

  const ctaHref = product.productCta?.link ? resolveHref(locale, product.productCta.link) : null
  const quoteHref = `/${locale}/request-a-quote?product=${encodeURIComponent(product.slug || productSlug)}`
  const whatsappMessage = [
    siteSettings?.whatsappMessage,
    product.title ? `${product.title}${product.sku ? ` (${product.sku})` : ''}` : null,
  ]
    .filter(Boolean)
    .join(' — ')
  const whatsappHref = buildWhatsAppHref(siteSettings?.whatsappNumber, whatsappMessage || null)

  const related = (product.relatedProducts || []).filter(
    (item): item is ProductCardData => Boolean(item?.slug && item?.title),
  )

  const featureItems = [
    ...(product.features || []),
    ...(product.benefits || []).filter(
      (benefit) => !(product.features || []).some((feature) => feature.title === benefit.title),
    ),
  ]

  const hasGuidance =
    Boolean(product.usageAreas) ||
    Boolean(product.applicationInstructions) ||
    Boolean(product.warnings)

  const jsonLd = buildProductJsonLd({
    locale,
    product,
    path: `/products/${productSlug}`,
    siteName: dictionary.meta.siteName,
    productsLabel: dictionary.products.title,
  })

  return (
    <main id="main-content">
      <JsonLd data={jsonLd} />

      {/* Industrial title band */}
      <PageHero compact>
        <Breadcrumbs
          className="mb-0"
          label={dictionary.products.breadcrumbs}
          items={[
            {href: `/${locale}`, label: dictionary.common.home},
            {href: `/${locale}/products`, label: dictionary.products.title},
            ...(product.primaryCategory?.slug && product.primaryCategory.title
              ? [
                  {
                    href: `/${locale}/products/category/${product.primaryCategory.slug}`,
                    label: product.primaryCategory.title,
                  },
                ]
              : []),
            {label: product.title!},
          ]}
        />
        <div className="animate-product-rise mt-5 max-w-4xl">
          {product.primaryCategory?.title || product.badge ? (
            <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-accent uppercase">
              {[product.badge, product.primaryCategory?.title].filter(Boolean).join(' · ')}
            </p>
          ) : null}
          <h1 className="font-display text-[clamp(1.85rem,7vw,3.75rem)] leading-[1.05] text-foreground">
            {product.title}
          </h1>
          {product.sku ? (
            <p className="mt-3 text-sm text-muted" dir="ltr">
              {dictionary.products.sku}: {product.sku}
            </p>
          ) : null}
        </div>
      </PageHero>

      {/* One composition: packshot + technical summary */}
      <section className="border-b border-border">
        <div className="container-site py-10 sm:py-14">
          <div className="grid min-w-0 items-start gap-8 sm:gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
            <div className="animate-product-rise min-w-0 lg:sticky lg:top-24">
              <ProductGallery images={galleryImages} />
            </div>

            <div
              className="animate-product-rise flex min-w-0 flex-col gap-8"
              style={{animationDelay: '80ms'}}
            >
              {product.shortDescription ? (
                <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
                  {product.shortDescription}
                </p>
              ) : null}

              {featureItems.length ? (
                <div>
                  <h2 className="mb-4 text-xs font-semibold tracking-[0.18em] text-muted uppercase">
                    {dictionary.products.features}
                  </h2>
                  <ul className="flex flex-col gap-2.5 border-s-2 border-accent/70 ps-4">
                    {featureItems.map((item) => (
                      <li key={item._key} className="text-sm leading-relaxed text-foreground sm:text-[0.95rem]">
                        <span className="me-2 text-accent" aria-hidden>
                          •
                        </span>
                        {item.title}
                        {item.description ? (
                          <span className="mt-0.5 block ps-4 text-muted">{item.description}</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {product.specificationGroups?.length ? (
                <ProductSpecifications
                  groups={product.specificationGroups}
                  heading={dictionary.products.specifications}
                  embedded
                />
              ) : null}

              {product.packagingVariants?.length ? (
                <div>
                  <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-muted uppercase">
                    {dictionary.products.packaging}
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {product.packagingVariants.map((variant) => (
                      <li
                        key={variant._key}
                        className="border border-border bg-surface px-3 py-2 text-sm text-foreground"
                      >
                        <span className="font-medium">{variant.label || variant.volume}</span>
                        {variant.sku ? (
                          <span className="ms-2 text-muted" dir="ltr">
                            {variant.sku}
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {(product.categories?.length || product.applicationAreas?.length) ? (
                <div className="flex flex-col gap-4">
                  {product.categories?.length ? (
                    <TagRow
                      label={dictionary.products.categories}
                      items={product.categories}
                      hrefFor={(slug) => `/${locale}/products/category/${slug}`}
                    />
                  ) : null}
                  {product.applicationAreas?.length ? (
                    <TagRow
                      label={dictionary.products.industries}
                      items={product.applicationAreas}
                      hrefFor={(slug) => `/${locale}/industries/${slug}`}
                    />
                  ) : null}
                </div>
              ) : null}

              <DocumentDownloads
                documents={product.documents || []}
                heading={dictionary.products.documents}
                downloadLabel={siteSettings?.uiLabels?.download || dictionary.products.download}
                embedded
              />

              <div className="flex flex-wrap gap-3 border-t border-border pt-6">
                {ctaHref && product.productCta?.label ? (
                  <ButtonLink href={ctaHref} className="min-w-44">
                    {product.productCta.label}
                  </ButtonLink>
                ) : (
                  <ButtonLink href={quoteHref} className="min-w-44">
                    {dictionary.nav.requestQuote}
                  </ButtonLink>
                )}
                {whatsappHref ? (
                  <ButtonLink href={whatsappHref} variant="secondary" target="_blank" rel="noopener noreferrer">
                    {dictionary.products.whatsapp}
                  </ButtonLink>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {hasGuidance ? (
        <section className="border-b border-border section-space">
          <div className="container-site grid gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-3">
            {product.usageAreas ? (
              <GuidanceBlock heading={dictionary.products.usageAreas} value={product.usageAreas} />
            ) : null}
            {product.applicationInstructions ? (
              <GuidanceBlock
                heading={dictionary.products.applicationInstructions}
                value={product.applicationInstructions}
              />
            ) : null}
            {product.warnings ? (
              <GuidanceBlock heading={dictionary.products.warnings} value={product.warnings} tone="warn" />
            ) : null}
          </div>
        </section>
      ) : null}

      {related.length ? (
        <RelatedProductsSlider
          locale={locale}
          products={related}
          detailLabel={dictionary.products.detail}
          heading={dictionary.products.related}
          allProductsHref={`/${locale}/products`}
          allProductsLabel={dictionary.products.title}
        />
      ) : null}
    </main>
  )
}

function GuidanceBlock({
  heading,
  value,
  tone = 'default',
}: {
  heading: string
  value: unknown
  tone?: 'default' | 'warn'
}) {
  return (
    <div
      className={`border-s-2 ps-4 ${
        tone === 'warn' ? 'border-danger bg-danger/5 py-3 pe-3' : 'border-border'
      }`}
    >
      <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-muted uppercase">
        {tone === 'warn' ? (
          <span
            className="inline-flex h-5 w-5 shrink-0 items-center justify-center text-danger"
            aria-hidden
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M12 3.2 1.8 20.5h20.4L12 3.2Zm0 5.3c.6 0 1 .5 1 1.1v4.2c0 .6-.4 1.1-1 1.1s-1-.5-1-1.1V9.6c0-.6.4-1.1 1-1.1Zm0 8.2a1.15 1.15 0 1 0 0-2.3 1.15 1.15 0 0 0 0 2.3Z" />
            </svg>
          </span>
        ) : null}
        {heading}
      </h2>
      <div className="text-sm text-muted [&_p]:leading-relaxed">
        <PortableTextRenderer value={value} />
      </div>
    </div>
  )
}

function TagRow({
  label,
  items,
  hrefFor,
}: {
  label: string
  items: Array<{_id: string; title?: string | null; slug?: string | null}>
  hrefFor: (slug: string) => string
}) {
  return (
    <div>
      <p className="mb-2 text-xs tracking-[0.18em] text-muted uppercase">{label}</p>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => {
          if (!item.title) return null
          if (!item.slug) {
            return (
              <li key={item._id} className="border border-border px-3 py-1.5 text-sm text-muted">
                {item.title}
              </li>
            )
          }
          return (
            <li key={item._id}>
              <Link
                href={hrefFor(item.slug)}
                className="inline-flex border border-border px-3 py-1.5 text-sm text-muted no-underline transition hover:border-accent hover:text-foreground"
              >
                {item.title}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
