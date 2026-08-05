import Image from 'next/image'
import Link from 'next/link'

import {SectionHeading} from '@/components/content/section-heading'
import {SanityImage} from '@/components/content/sanity-image'
import {getApplicationAreaFallbackImage} from '@/lib/application-area-images'
import type {Locale} from '@/lib/i18n/locales'

type ApplicationGridSectionProps = {
  locale: Locale
  block: {
    _key: string
    heading?: string | null
    description?: string | null
    applicationAreas?: Array<{
      _id: string
      title?: string | null
      slug?: string | null
      summary?: string | null
      coverImage?: {asset?: {_ref?: string}; alt?: string | null} | null
    }> | null
  }
}

export function ApplicationGridSection({locale, block}: ApplicationGridSectionProps) {
  return (
    <section className="border-b border-border section-space">
      <div className="container-site flex flex-col gap-10">
        <SectionHeading heading={block.heading} description={block.description} />
        {block.applicationAreas?.length ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {block.applicationAreas.map((area) => {
              if (!area.slug || !area.title) return null
              const fallbackImage = getApplicationAreaFallbackImage(area.slug)
              return (
                <li key={area._id}>
                  <Link
                    href={`/${locale}/industries/${area.slug}`}
                    className="group relative flex min-h-44 flex-col justify-end overflow-hidden border border-border bg-surface p-5 no-underline transition hover:border-accent"
                  >
                    {area.coverImage?.asset ? (
                      <SanityImage
                        image={area.coverImage}
                        fill
                        className="object-cover opacity-30 transition group-hover:opacity-45"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : fallbackImage ? (
                      <Image
                        src={fallbackImage}
                        alt=""
                        fill
                        className="object-cover opacity-30 transition group-hover:opacity-45"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : null}
                    <div className="relative z-10">
                      <h3 className="font-display text-2xl text-foreground">{area.title}</h3>
                      {area.summary ? (
                        <p className="mt-2 line-clamp-2 text-sm text-muted">{area.summary}</p>
                      ) : null}
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : null}
      </div>
    </section>
  )
}
