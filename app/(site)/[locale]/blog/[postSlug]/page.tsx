import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {Breadcrumbs} from '@/components/content/breadcrumbs'
import {PageHero} from '@/components/content/page-hero'
import {PortableTextRenderer} from '@/components/content/portable-text'
import {SanityImage} from '@/components/content/sanity-image'
import {SetLocaleAlternates} from '@/components/i18n/set-locale-alternates'
import {ProductGrid} from '@/components/product/product-grid'
import {JsonLd} from '@/components/seo/json-ld'
import {getDictionary} from '@/lib/i18n/get-dictionary'
import {isLocale, type Locale} from '@/lib/i18n/locales'
import type {ProductCardData} from '@/lib/products/types'
import {buildPageMetadata} from '@/lib/seo/metadata'
import {buildPostLocaleHrefs, getPostBySlug, getPublishedPostParams} from '@/sanity/lib/content'
import {cdnUrlFor} from '@/sanity/lib/image'
import {ensureR2Image} from '@/lib/r2/ensure-image'

type PageProps = {
  params: Promise<{locale: string; postSlug: string}>
}

export async function generateStaticParams() {
  return getPublishedPostParams()
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale: localeParam, postSlug} = await params
  if (!isLocale(localeParam)) return {}
  const dictionary = await getDictionary(localeParam)
  const post = await getPostBySlug(localeParam, postSlug)
  const title =
    post && typeof post === 'object' && 'title' in post && typeof post.title === 'string'
      ? post.title
      : postSlug
  const description =
    post && typeof post === 'object' && 'excerpt' in post && typeof post.excerpt === 'string'
      ? post.excerpt
      : dictionary.blog.description

  const translations =
    post && typeof post === 'object' && '_translations' in post
      ? (post._translations as Array<{
          language?: string | null
          slug?: string | null
          translationStatus?: string | null
        }> | null)
      : null
  const localePaths = buildPostLocaleHrefs(translations, localeParam, postSlug)

  return buildPageMetadata({
    locale: localeParam,
    fallbackTitle: title,
    fallbackDescription: description,
    seo: post && typeof post === 'object' && 'seo' in post ? (post.seo as never) : null,
    path: `/blog/${postSlug}`,
    localePaths,
  })
}

export default async function BlogPostPage({params}: PageProps) {
  const {locale: localeParam, postSlug} = await params
  if (!isLocale(localeParam)) notFound()

  const locale = localeParam as Locale
  const dictionary = await getDictionary(locale)
  const postRaw = await getPostBySlug(locale, postSlug)

  if (!postRaw || typeof postRaw !== 'object' || !('title' in postRaw) || !postRaw.title) {
    notFound()
  }

  const post = postRaw as {
    title: string
    slug?: string | null
    excerpt?: string | null
    publishedAt?: string | null
    category?: string | null
    author?: string | null
    body?: unknown
    coverImage?: {asset?: {_ref?: string}; alt?: string | null} | null
    relatedProducts?: ProductCardData[] | null
    _translations?: Array<{
      language?: string | null
      slug?: string | null
      translationStatus?: string | null
    }> | null
  }

  const localeHrefs = buildPostLocaleHrefs(post._translations, locale, post.slug || postSlug)
  const dateLocale = locale === 'tr' ? 'tr-TR' : locale === 'ar' ? 'ar' : 'en-GB'
  const dateLabel = post.publishedAt
    ? new Intl.DateTimeFormat(dateLocale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(post.publishedAt))
    : null

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://polumatkimya.com').replace(/\/$/, '')
  const pageUrl = `${siteUrl}/${locale}/blog/${post.slug || postSlug}`
  let imageUrl: string | undefined
  if (post.coverImage?.asset) {
    try {
      imageUrl = (await ensureR2Image(post.coverImage)) || cdnUrlFor(post.coverImage)
    } catch {
      imageUrl = cdnUrlFor(post.coverImage, {width: 1200, height: 630, fit: 'crop'})
    }
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || undefined,
    inLanguage: locale,
    datePublished: post.publishedAt || undefined,
    author: post.author
      ? {
          '@type': 'Person',
          name: post.author,
        }
      : {
          '@type': 'Organization',
          name: dictionary.meta.siteName,
        },
    publisher: {
      '@type': 'Organization',
      name: dictionary.meta.siteName,
    },
    mainEntityOfPage: pageUrl,
    ...(imageUrl ? {image: imageUrl} : {}),
  }

  const related = (post.relatedProducts || []).filter(
    (item): item is ProductCardData => Boolean(item?.slug && item?.title),
  )

  return (
    <main id="main-content">
      <SetLocaleAlternates hrefs={localeHrefs} />
      <JsonLd data={jsonLd} />

      <article>
        <PageHero>
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div className="flex flex-col gap-5">
              <Breadcrumbs
                className="mb-0"
                label={dictionary.blog.breadcrumbs}
                items={[
                  {href: `/${locale}`, label: dictionary.common.home},
                  {href: `/${locale}/blog`, label: dictionary.blog.title},
                  {label: post.title},
                ]}
              />
              {post.category ? (
                <p className="text-xs tracking-[0.2em] text-accent uppercase">{post.category}</p>
              ) : null}
              <h1 className="font-display text-4xl text-foreground sm:text-5xl">{post.title}</h1>
              <div className="flex flex-wrap gap-3 text-sm text-muted">
                {dateLabel ? <span dir="ltr">{dateLabel}</span> : null}
                {post.author ? (
                  <span>
                    {dictionary.blog.byAuthor}: {post.author}
                  </span>
                ) : null}
              </div>
              {post.excerpt ? <p className="max-w-2xl text-base text-muted">{post.excerpt}</p> : null}
            </div>
            <div className="relative min-h-72 overflow-hidden border border-white/10 bg-surface lg:min-h-96">
              <SanityImage
                image={post.coverImage}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </div>
          </div>
        </PageHero>

        {post.body ? (
          <section className="border-b border-border section-space">
            <div className="container-site max-w-3xl">
              <PortableTextRenderer value={post.body} />
            </div>
          </section>
        ) : null}

        {related.length ? (
          <section className="border-b border-border section-space">
            <div className="container-site flex flex-col gap-8">
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">
                {dictionary.blog.relatedProducts}
              </h2>
              <ProductGrid
                locale={locale}
                products={related}
                detailLabel={dictionary.products.detail}
                emptyLabel={dictionary.filters.noResults}
              />
            </div>
          </section>
        ) : null}
      </article>
    </main>
  )
}
