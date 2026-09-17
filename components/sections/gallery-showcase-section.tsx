import {SectionHeading} from '@/components/content/section-heading'
import {SanityImage} from '@/components/content/sanity-image'
import {ButtonLink} from '@/components/ui/button-link'
import type {Locale} from '@/lib/i18n/locales'

export type GalleryImageData = {
  _key: string
  title?: string | null
  image?: {asset?: {_ref?: string}; alt?: string | null} | null
}

type GalleryShowcaseSectionProps = {
  locale: Locale
  block: {
    _key: string
    heading?: string | null
    description?: string | null
    showViewAll?: boolean | null
    images?: GalleryImageData[] | null
  }
  viewAllLabel: string
}

export function GalleryShowcaseSection({
  locale,
  block,
  viewAllLabel,
}: GalleryShowcaseSectionProps) {
  const images = (block.images || []).filter((item) => item?.image?.asset)
  if (!images.length && !block.heading) return null

  return (
    <section className="border-b border-border section-space">
      <div className="container-site flex flex-col gap-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading heading={block.heading} description={block.description} />
          {block.showViewAll !== false ? (
            <ButtonLink href={`/${locale}/gallery`} variant="secondary" className="shrink-0 self-start sm:self-auto">
              {viewAllLabel}
            </ButtonLink>
          ) : null}
        </div>
        {images.length ? (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((item) => (
              <li key={item._key} className="group relative aspect-[4/3] overflow-hidden border border-border bg-surface">
                <SanityImage
                  image={item.image}
                  alt={item.image?.alt || item.title || ''}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {item.title ? (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3.5 pt-10">
                    <p className="font-display text-lg text-white">{item.title}</p>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}
