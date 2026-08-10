import {createImageUrlBuilder, type SanityImageSource} from '@sanity/image-url'

import {getMediaProxyPath, getR2ObjectKey, getR2PublicUrl} from '@/lib/r2/sanity-asset'
import {isR2PublicConfigured} from '@/lib/r2/env'

import {dataset, projectId} from '../env'

const builder = createImageUrlBuilder({projectId, dataset})

/** Sanity CDN URL builder (backfill source only). */
export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

/**
 * Absolute delivery URL for metadata / JSON-LD.
 * Goes through /api/media so the object is ensured on R2 before serving.
 */
export function cdnUrlFor(
  source: SanityImageSource,
  _options?: {width?: number; height?: number; fit?: 'crop' | 'max'},
) {
  const key = getR2ObjectKey(source as {asset?: {_ref?: string; _id?: string}})
  if (key && isR2PublicConfigured()) {
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://polumatkimya.com').replace(
      /\/$/,
      '',
    )
    return `${siteUrl}${getMediaProxyPath(key)}`
  }

  return urlFor(source).auto('format').url()
}

/** Direct R2 public object URL (no ensure proxy). */
export function r2PublicUrlFor(source: SanityImageSource) {
  const key = getR2ObjectKey(source as {asset?: {_ref?: string; _id?: string}})
  if (!key) return null
  return getR2PublicUrl(key)
}
