import Image from 'next/image'

import {getMediaProxyPath, getR2ObjectKey} from '@/lib/r2/sanity-asset'
import {isR2PublicConfigured} from '@/lib/r2/env'
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
  /** Kept for API compatibility; R2 serves originals, next/image handles sizing. */
  fit?: 'crop' | 'max' | 'fill' | 'min' | 'scale'
}

function resolveImageSrc(image: SanityImageValue, width: number, height: number, fit: string) {
  const key = getR2ObjectKey(image)

  // Always serve via /api/media → R2 (auto-uploads from Sanity on first miss).
  // Streams bytes from R2 so next/image works without the public r2.dev hostname.
  if (key && isR2PublicConfigured()) {
    return getMediaProxyPath(key)
  }

  let builder = urlFor(image).auto('format')
  if (fit === 'max') {
    builder = builder.width(width).fit('max')
  } else {
    builder = builder.width(width).height(height).fit(fit as 'crop')
  }
  return builder.url()
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
  const src = resolveImageSrc(image, width, height, fit)

  if (fill) {
    return (
      <Image
        src={src}
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
      src={src}
      alt={altText}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  )
}
