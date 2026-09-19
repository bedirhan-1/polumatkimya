import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {Breadcrumbs} from '@/components/content/breadcrumbs'
import {GalleryGrid} from '@/components/content/gallery-grid'
import {PageHero} from '@/components/content/page-hero'
import {SectionHeading} from '@/components/content/section-heading'
import type {GalleryImageData} from '@/components/sections/gallery-showcase-section'
import {getDictionary} from '@/lib/i18n/get-dictionary'
import {isLocale, locales, type Locale} from '@/lib/i18n/locales'
import {buildPageMetadata} from '@/lib/seo/metadata'
import {getGalleryImages} from '@/sanity/lib/content'

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
    fallbackTitle: dictionary.gallery.title,
    fallbackDescription: dictionary.gallery.description,
    path: '/gallery',
  })
}

export default async function GalleryPage({params}: PageProps) {
  const {locale: localeParam} = await params
  if (!isLocale(localeParam)) notFound()

  const locale = localeParam as Locale
  const dictionary = await getDictionary(locale)
  const imagesRaw = await getGalleryImages(locale)
  const images = (Array.isArray(imagesRaw) ? imagesRaw : []).filter(
    (item): item is GalleryImageData =>
      Boolean(item && typeof item === 'object' && '_key' in item && item._key),
  )

  return (
    <main id="main-content">
      <PageHero pattern="gallery">
        <Breadcrumbs
          className="mb-0"
          label={dictionary.gallery.breadcrumbs}
          items={[
            {href: `/${locale}`, label: dictionary.common.home},
            {href: `/${locale}/about`, label: dictionary.nav.corporate},
            {label: dictionary.gallery.title},
          ]}
        />
        <div className="animate-product-rise mt-6">
          <SectionHeading
            as="h1"
            heading={dictionary.gallery.title}
            description={dictionary.gallery.description}
          />
        </div>
      </PageHero>

      <section className="border-b border-border section-space">
        <div className="container-site">
          <GalleryGrid
            images={images}
            emptyLabel={dictionary.gallery.empty}
            lightboxLabels={{
              close: dictionary.gallery.lightboxClose,
              previous: dictionary.gallery.lightboxPrevious,
              next: dictionary.gallery.lightboxNext,
              of: dictionary.gallery.lightboxOf,
              open: dictionary.gallery.lightboxOpen,
            }}
          />
        </div>
      </section>
    </main>
  )
}
