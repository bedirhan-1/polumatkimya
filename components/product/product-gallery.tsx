'use client'

import {useState} from 'react'

import {SanityImage} from '@/components/content/sanity-image'

import styles from './product-gallery.module.css'

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
    return <div className={`${styles.stage} ${className}`} aria-hidden />
  }

  const current = valid[Math.min(active, valid.length - 1)]!

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className={styles.stage}>
        <SanityImage
          image={current}
          fill
          fit="max"
          width={900}
          priority
          className={styles.image}
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
                className={`${styles.thumb}${index === active ? ` ${styles.thumbActive}` : ''}`}
              >
                <SanityImage
                  image={image}
                  fill
                  fit="max"
                  width={200}
                  className={styles.thumbImage}
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
