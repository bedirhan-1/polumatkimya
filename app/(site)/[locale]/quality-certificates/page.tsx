import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {MarketingFallback} from '@/components/content/marketing-fallback'
import {PageBuilder} from '@/components/content/page-builder'
import {SectionHeading} from '@/components/content/section-heading'
import {SanityImage} from '@/components/content/sanity-image'
import {getDictionary} from '@/lib/i18n/get-dictionary'
import {isLocale, locales, type Locale} from '@/lib/i18n/locales'
import {asPageBuilderBlocks, asSeo} from '@/lib/sanity/content'
import {buildPageMetadata} from '@/lib/seo/metadata'
import {getCertificates, getPageBySlug} from '@/sanity/lib/pages'

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
  const page = await getPageBySlug(localeParam, 'quality-certificates')
  return buildPageMetadata({
    locale: localeParam,
    fallbackTitle: dictionary.footer.quality,
    fallbackDescription: dictionary.pages.qualityDescription,
    seo: asSeo(page && typeof page === 'object' ? (page as {seo?: unknown}).seo : null),
    path: '/quality-certificates',
  })
}

export default async function QualityCertificatesPage({params}: PageProps) {
  const {locale: localeParam} = await params
  if (!isLocale(localeParam)) notFound()

  const locale = localeParam as Locale
  const dictionary = await getDictionary(locale)
  const page = await getPageBySlug(locale, 'quality-certificates')
  const certificates = await getCertificates(locale)
  const blocks = asPageBuilderBlocks(
    page && typeof page === 'object' ? (page as {pageBuilder?: unknown}).pageBuilder : null,
  )

  return (
    <main id="main-content">
      {blocks ? <PageBuilder locale={locale} dictionary={dictionary} blocks={blocks} /> : null}

      {!blocks ? (
        <MarketingFallback
          locale={locale}
          dictionary={dictionary}
          title={dictionary.footer.quality}
          description={dictionary.pages.qualityDescription}
          showQuoteCta={false}
        />
      ) : null}

      {Array.isArray(certificates) && certificates.length > 0 ? (
        <section className="border-b border-border section-space">
          <div className="container-site flex flex-col gap-8">
            <SectionHeading heading={dictionary.footer.quality} />
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {certificates.map((certificate) => {
                const item = certificate as {
                  _id: string
                  name?: string | null
                  issuer?: string | null
                  certificateNumber?: string | null
                  logo?: {asset?: {_ref?: string}; alt?: string | null} | null
                  file?: {asset?: {url?: string | null}} | null
                }
                return (
                  <li
                    key={item._id}
                    className="flex flex-col gap-4 border border-border bg-surface p-5"
                  >
                    <div className="relative h-16 w-16 bg-surface-elevated">
                      <SanityImage
                        image={item.logo}
                        fill
                        className="object-contain p-2"
                        sizes="64px"
                      />
                    </div>
                    <div>
                      <h2 className="font-display text-xl text-foreground">{item.name}</h2>
                      {item.issuer ? <p className="text-sm text-muted">{item.issuer}</p> : null}
                      {item.certificateNumber ? (
                        <p className="mt-1 text-xs text-muted" dir="ltr">
                          {item.certificateNumber}
                        </p>
                      ) : null}
                    </div>
                    {item.file?.asset?.url ? (
                      <a
                        href={item.file.asset.url}
                        className="text-sm font-semibold text-accent"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        PDF
                      </a>
                    ) : null}
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
