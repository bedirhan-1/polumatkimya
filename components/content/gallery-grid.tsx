import {SanityImage} from '@/components/content/sanity-image'
import type {GalleryImageData} from '@/components/sections/gallery-showcase-section'

type GalleryGridProps = {
  images: GalleryImageData[]
  emptyLabel: string
}

export function GalleryGrid({images, emptyLabel}: GalleryGridProps) {
  if (!images.length) {
    return (
      <p className="border border-border bg-surface px-5 py-8 text-sm text-muted">{emptyLabel}</p>
    )
  }

  return (
    <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3">
      {images.map((item) => (
        <li key={item._key} className="mb-4 break-inside-avoid">
          <figure className="overflow-hidden border border-border bg-surface">
            <div className="relative aspect-[4/3] w-full">
              <SanityImage
                image={item.image}
                alt={item.image?.alt || item.title || ''}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            {item.title ? (
              <figcaption className="border-t border-border px-4 py-3">
                <p className="font-display text-lg text-foreground">{item.title}</p>
              </figcaption>
            ) : null}
          </figure>
        </li>
      ))}
    </ul>
  )
}
