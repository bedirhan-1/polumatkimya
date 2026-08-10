import type {HomeHeroData} from '@/lib/home/hero-media'
import type {ProductCardData} from '@/lib/products/types'
import type {resolveSimpleCta} from '@/sanity/lib/link-resolver'

export type {HomeHeroData}

export type HomeImage = {
  asset?: {_ref?: string; _id?: string} | null
  alt?: string | null
  hotspot?: {x?: number; y?: number} | null
  crop?: unknown
}

export type HomeTitledItem = {
  _key?: string
  title?: string | null
  description?: string | null
}

export type HomeApplicationArea = {
  _id: string
  title?: string | null
  slug?: string | null
  summary?: string | null
  coverImage?: HomeImage | null
  icon?: HomeImage | null
}

export type HomePageContent = {
  hero?: HomeHeroData | null
  productsSection?: {
    eyebrow?: string | null
    title?: string | null
    description?: string | null
    viewAllLabel?: string | null
    detailLabel?: string | null
    products?: ProductCardData[] | null
  } | null
  strengthsSection?: {
    eyebrow?: string | null
    title?: string | null
    items?: HomeTitledItem[] | null
  } | null
  industriesSection?: {
    eyebrow?: string | null
    title?: string | null
    description?: string | null
    detailLabel?: string | null
    viewAllCta?: Parameters<typeof resolveSimpleCta>[1]
    areas?: Array<{
      _key?: string
      title?: string | null
      summary?: string | null
      area?: HomeApplicationArea | null
    } | HomeApplicationArea> | null
  } | null
  privateLabelSection?: {
    eyebrow?: string | null
    title?: string | null
    description?: string | null
    cta?: Parameters<typeof resolveSimpleCta>[1]
    image?: HomeImage | null
    features?: HomeTitledItem[] | null
    processTitle?: string | null
    process?: HomeTitledItem[] | null
  } | null
  aboutSection?: {
    eyebrow?: string | null
    title?: string | null
    description?: string | null
    cta?: Parameters<typeof resolveSimpleCta>[1]
    image?: HomeImage | null
    videoPlayLabel?: string | null
    streamUrl?: string | null
    streamVideoId?: string | null
    stats?: Array<{
      _key?: string
      value?: string | null
      label?: string | null
      icon?: HomeImage | null
    }> | null
  } | null
  qualitySection?: {
    eyebrow?: string | null
    title?: string | null
    link?: Parameters<typeof resolveSimpleCta>[1]
    items?: Array<{
      _key?: string
      label?: string | null
      icon?: HomeImage | null
    } | string> | null
    badges?: Array<{
      _key?: string
      label?: string | null
      image?: HomeImage | null
    }> | null
  } | null
  ctaSection?: {
    eyebrow?: string | null
    title?: string | null
    description?: string | null
    primaryCta?: Parameters<typeof resolveSimpleCta>[1]
    secondaryCta?: Parameters<typeof resolveSimpleCta>[1]
  } | null
}

export function asHomePageContent(page: unknown): HomePageContent | null {
  if (!page || typeof page !== 'object') return null
  return page as HomePageContent
}
