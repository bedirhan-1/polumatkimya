'use client'

import {useState} from 'react'

import {GalleryLightbox} from '@/components/content/gallery-lightbox'
import {SanityImage} from '@/components/content/sanity-image'
import type {GalleryImageData} from '@/components/sections/gallery-showcase-section'

type GalleryGridProps = {
  images: GalleryImageData[]
  emptyLabel: string
  lightboxLabels: {
    close: string
    previous: string
    next: string
    of: string
    open: string
  }
}

export function GalleryGrid({images, emptyLabel, lightboxLabels}: GalleryGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  if (!images.length) {
    return (
      <p className="border border-border bg-surface px-5 py-8 text-sm text-muted">{emptyLabel}</p>
    )
  }

  return (
    <>
      <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {images.map((item, index) => {
          const alt = item.image?.alt || item.title || ''
          return (
            <li key={item._key} className="mb-4 break-inside-avoid">
              <figure className="overflow-hidden border border-border bg-surface">
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={lightboxLabels.open.replace('{title}', alt || String(index + 1))}
                  className="group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden bg-surface text-start"
                >
                  <SanityImage
                    image={item.image}
                    alt={alt}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </button>
                {item.title ? (
                  <figcaption className="border-t border-border px-4 py-3">
                    <p className="font-display text-lg text-foreground">{item.title}</p>
                  </figcaption>
                ) : null}
              </figure>
            </li>
          )
        })}
      </ul>

      {activeIndex !== null ? (
        <GalleryLightbox
          images={images}
          index={activeIndex}
          labels={lightboxLabels}
          onClose={() => setActiveIndex(null)}
          onChange={setActiveIndex}
        />
      ) : null}
    </>
  )
}
