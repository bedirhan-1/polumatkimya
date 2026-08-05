import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {Breadcrumbs} from '@/components/content/breadcrumbs'
import {SectionHeading} from '@/components/content/section-heading'
import {VideoCard, type VideoCardData} from '@/components/content/video-card'
import {getDictionary} from '@/lib/i18n/get-dictionary'
import {isLocale, locales, type Locale} from '@/lib/i18n/locales'
import {buildPageMetadata} from '@/lib/seo/metadata'
import {getVideos} from '@/sanity/lib/content'

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
    fallbackTitle: dictionary.videos.title,
    fallbackDescription: dictionary.videos.description,
    path: '/videos',
  })
}

export default async function VideosPage({params}: PageProps) {
  const {locale: localeParam} = await params
  if (!isLocale(localeParam)) notFound()

  const locale = localeParam as Locale
  const dictionary = await getDictionary(locale)
  const videosRaw = await getVideos(locale)
  const videos = (Array.isArray(videosRaw) ? videosRaw : []) as VideoCardData[]

  return (
    <main id="main-content">
      <section className="border-b border-border section-space">
        <div className="container-site flex flex-col gap-10">
          <Breadcrumbs
            label={dictionary.videos.breadcrumbs}
            items={[
              {href: `/${locale}`, label: dictionary.common.home},
              {label: dictionary.videos.title},
            ]}
          />
          <SectionHeading
            as="h1"
            heading={dictionary.videos.title}
            description={dictionary.videos.description}
          />

          {videos.length ? (
            <ul className="grid gap-6 sm:grid-cols-2">
              {videos.map((video) => (
                <li key={video._id}>
                  <VideoCard video={video} playLabel={dictionary.videos.play} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="border border-border bg-surface px-5 py-8 text-sm text-muted">
              {dictionary.videos.empty}
            </p>
          )}
        </div>
      </section>
    </main>
  )
}
