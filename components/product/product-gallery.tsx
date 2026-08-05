'use client'

import {useState} from 'react'

import {SanityImage} from '@/components/content/sanity-image'

type GalleryImage = {
  asset?: {_ref?: string} | null
  alt?: string | null
} | null

type ProductGalleryProps = {
  images: GalleryImage[]
  className?: string
}

export function ProductGallery({images, className = ''}: ProductGalleryProps) {
  const valid = images.filter((image): image is NonNullable<GalleryImage> => Boolean(image?.asset))
  const [active, setActive] = useState(0)

  if (!valid.length) {
    return (
      <div
        className={`relative aspect-[4/5] overflow-hidden border border-border bg-surface-elevated ${className}`}
      >
        <div className="product-mesh absolute inset-0 opacity-40" aria-hidden />
      </div>
    )
  }

  const current = valid[Math.min(active, valid.length - 1)]!

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="relative aspect-[4/5] overflow-hidden border border-border bg-surface-elevated sm:aspect-[3/4]">
        <div className="product-mesh absolute inset-0 opacity-20" aria-hidden />
        <SanityImage
          image={current}
          fill
          fit="max"
          width={900}
          priority
          className="object-contain object-center p-3 sm:p-4"
          sizes="(max-width: 1024px) 100vw, 40vw"
        />
      </div>
      {valid.length > 1 ? (
        <ul className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {valid.map((image, index) => (
            <li key={`${image.asset?._ref}-${index}`}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-current={index === active ? 'true' : undefined}
                className={`relative aspect-square w-full overflow-hidden border bg-surface-elevated transition ${
                  index === active ? 'border-accent' : 'border-border hover:border-muted'
                }`}
              >
                <SanityImage
                  image={image}
                  fill
                  fit="max"
                  width={200}
                  className="object-contain p-1.5"
                  sizes="96px"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
