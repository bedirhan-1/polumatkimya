import Image from 'next/image'

import {urlFor} from '@/sanity/lib/image'

type SanityImageValue = {
  asset?: {_ref?: string; _id?: string} | null
  alt?: string | null
  hotspot?: {x?: number; y?: number} | null
  crop?: unknown
}

type SanityImageProps = {
  image?: SanityImageValue | null
  alt?: string
  width?: number
  height?: number
  sizes?: string
  priority?: boolean
  className?: string
  fill?: boolean
  /** Sanity CDN fit mode. Use `max` for packshots so tall assets are not cropped. */
  fit?: 'crop' | 'max' | 'fill' | 'min' | 'scale'
}

export function SanityImage({
  image,
  alt,
  width = 1200,
  height = 800,
  sizes = '(max-width: 768px) 100vw, 50vw',
  priority = false,
  className,
  fill = false,
  fit = 'crop',
}: SanityImageProps) {
  if (!image?.asset) return null

  const altText = alt ?? image.alt ?? ''
  let builder = urlFor(image).auto('format')

  if (fit === 'max') {
    // Preserve original aspect ratio — important for tall product packshots.
    builder = builder.width(width).fit('max')
  } else {
    builder = builder.width(width).height(height).fit(fit)
  }

  if (fill) {
    return (
      <Image
        src={builder.url()}
        alt={altText}
        fill
        sizes={sizes}
        priority={priority}
        className={className}
      />
    )
  }

  return (
    <Image
      src={builder.url()}
      alt={altText}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  )
}
