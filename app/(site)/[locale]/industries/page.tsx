import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'

import {MarketingFallback} from '@/components/content/marketing-fallback'
import {SanityImage} from '@/components/content/sanity-image'
import {SectionHeading} from '@/components/content/section-heading'
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
  const areas = await getApplicationAreas(locale)

  return (
    <main id="main-content">
      <section className="border-b border-border section-space">
        <div className="container-site flex flex-col gap-10">
          <SectionHeading
            as="h1"
            heading={dictionary.pages.industriesTitle}
            description={dictionary.pages.industriesDescription}
          />

          {Array.isArray(areas) && areas.length > 0 ? (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {areas.map((area) => {
                const item = area as {
                  _id: string
                  title?: string | null
                  slug?: string | null
                  summary?: string | null
                  coverImage?: {asset?: {_ref?: string}; alt?: string | null} | null
                }
                if (!item.slug || !item.title) return null
                return (
                  <li key={item._id}>
                    <Link
                      href={`/${locale}/industries/${item.slug}`}
                      className="group relative flex min-h-48 flex-col justify-end overflow-hidden border border-border bg-surface p-5 no-underline transition hover:border-accent"
                    >
                      {item.coverImage?.asset ? (
                        <SanityImage
                          image={item.coverImage}
                          fill
                          className="object-cover opacity-35 transition group-hover:opacity-50"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : null}
                      <div className="relative z-10">
                        <h2 className="font-display text-2xl text-foreground">{item.title}</h2>
                        {item.summary ? (
                          <p className="mt-2 line-clamp-3 text-sm text-muted">{item.summary}</p>
                        ) : null}
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          ) : (
            <MarketingFallback
              locale={locale}
              dictionary={dictionary}
              title={dictionary.pages.industriesTitle}
              description={dictionary.pages.industriesDescription}
            />
          )}
        </div>
      </section>
    </main>
  )
}
