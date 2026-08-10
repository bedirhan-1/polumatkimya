import {dataset, projectId} from '@/sanity/env'

import {getR2PublicBaseUrl} from './env'

export type SanityAssetLike = {
  asset?: {_ref?: string | null; _id?: string | null} | null
  _ref?: string | null
  _id?: string | null
}

/**
 * Sanity image asset ids look like:
 *   image-{id}-{width}x{height}-{format}
 * CDN object names look like:
 *   {id}-{width}x{height}.{format}
 */
const ASSET_ID_RE = /^image-(.+)-(\d+x\d+)-([a-z0-9]+)$/i
const OBJECT_KEY_RE = /^(.+)-(\d+x\d+)\.([a-z0-9]+)$/i

function normalizeExt(format: string) {
  const lower = format.toLowerCase()
  return lower === 'jpeg' ? 'jpg' : lower
}

export function getSanityAssetId(source: SanityAssetLike | string | null | undefined) {
  if (!source) return null
  if (typeof source === 'string') {
    return source.startsWith('image-') ? source : null
  }
  return source.asset?._ref || source.asset?._id || source._ref || source._id || null
}

export function sanityAssetIdToObjectKey(assetId: string) {
  const match = assetId.match(ASSET_ID_RE)
  if (!match) return null
  const [, id, dimensions, format] = match
  return `${id}-${dimensions}.${normalizeExt(format)}`
}

export function objectKeyToSanityCdnUrl(key: string) {
  const match = key.match(OBJECT_KEY_RE)
  if (!match) return null
  const [, id, dimensions, ext] = match
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${normalizeExt(ext)}`
}

export function getR2ObjectKey(source: SanityAssetLike | string | null | undefined) {
  const assetId = getSanityAssetId(source)
  if (!assetId) return null
  return sanityAssetIdToObjectKey(assetId)
}

export function getR2PublicUrl(key: string) {
  const base = getR2PublicBaseUrl()
  if (!base) return null
  return `${base}/${key}`
}

export function getMediaProxyPath(key: string) {
  return `/api/media/${encodeURIComponent(key)}`
}

export function contentTypeForKey(key: string) {
  const ext = key.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'webp':
      return 'image/webp'
    case 'gif':
      return 'image/gif'
    case 'svg':
      return 'image/svg+xml'
    case 'avif':
      return 'image/avif'
    default:
      return 'application/octet-stream'
  }
}
