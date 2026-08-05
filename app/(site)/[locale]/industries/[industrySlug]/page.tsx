import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'

import {PortableTextRenderer} from '@/components/content/portable-text'
import {SanityImage} from '@/components/content/sanity-image'
import {SectionHeading} from '@/components/content/section-heading'
import {ButtonLink} from '@/components/ui/button-link'
import {getDictionary} from '@/lib/i18n/get-dictionary'
import {isLocale, locales, type Locale} from '@/lib/i18n/locales'
import {buildPageMetadata} from '@/lib/seo/metadata'
import {resolveHref} from '@/sanity/lib/link-resolver'
import {client} from '@/sanity/lib/client'
import {getApplicationAreaBySlug} from '@/sanity/lib/pages'
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

export default async function IndustryDetailPage({params}: PageProps) {
  const {locale: localeParam, industrySlug} = await params
  if (!isLocale(localeParam)) notFound()

  const locale = localeParam as Locale
  const dictionary = await getDictionary(locale)
  const area = await getApplicationAreaBySlug(locale, industrySlug)

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
    products?: Array<{
      _id: string
      title?: string | null
      slug?: string | null
      shortDescription?: string | null
      cardImage?: {asset?: {_ref?: string}; alt?: string | null} | null
    }> | null
    cta?: {
      label?: string | null
      variant?: string | null
      link?: {
        linkType?: 'internal' | 'external' | 'reference' | null
        internalPath?: string | null
        externalUrl?: string | null
        reference?: {_type?: string; slug?: string | null} | null
      } | null
    } | null
  }

  const ctaHref = data.cta?.link ? resolveHref(locale, data.cta.link) : null

  return (
    <main id="main-content">
      <section className="relative overflow-hidden border-b border-border">
        <div className="container-site section-space grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-6">
            <SectionHeading as="h1" heading={data.title} description={data.summary} />
            {ctaHref && data.cta?.label ? (
              <ButtonLink href={ctaHref}>{data.cta.label}</ButtonLink>
            ) : (
              <ButtonLink href={`/${locale}/request-a-quote`}>
                {dictionary.nav.requestQuote}
              </ButtonLink>
            )}
          </div>
          <div className="relative min-h-72 overflow-hidden border border-border bg-surface lg:min-h-96">
            <SanityImage
              image={data.coverImage}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          </div>
        </div>
      </section>

      {data.body ? (
        <section className="border-b border-border section-space">
          <div className="container-site max-w-3xl">
            <PortableTextRenderer value={data.body} />
          </div>
        </section>
      ) : null}

      {data.benefits?.length ? (
        <section className="border-b border-border section-space">
          <div className="container-site grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.benefits.map((benefit) => (
              <div key={benefit._key} className="border border-border bg-surface p-5">
                <h2 className="font-display text-xl text-foreground">{benefit.title}</h2>
                {benefit.description ? (
                  <p className="mt-2 text-sm text-muted">{benefit.description}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {data.products?.length ? (
        <section className="border-b border-border section-space">
          <div className="container-site flex flex-col gap-8">
            <SectionHeading heading={dictionary.nav.products} />
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.products.map((product) => {
                if (!product.slug || !product.title) return null
                return (
                  <li key={product._id}>
                    <Link
                      href={`/${locale}/products/${product.slug}`}
                      className="flex h-full flex-col border border-border bg-surface no-underline transition hover:border-accent"
                    >
                      <div className="relative aspect-[4/3] bg-surface-elevated">
                        <SanityImage
                          image={product.cardImage}
                          fill
                          className="object-contain p-6"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="font-display text-xl text-foreground">{product.title}</h3>
                        {product.shortDescription ? (
                          <p className="mt-2 text-sm text-muted">{product.shortDescription}</p>
                        ) : null}
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      ) : null}
    </main>
  )
}
