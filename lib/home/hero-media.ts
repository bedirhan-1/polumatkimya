import type {resolveSimpleCta} from '@/sanity/lib/link-resolver'

export type HomeHeroImage = {
  asset?: {_ref?: string; _id?: string} | null
  alt?: string | null
  hotspot?: {x?: number; y?: number} | null
  crop?: unknown
}

export type HomeHeroTrustItem = {
  _key?: string
  title?: string | null
  description?: string | null
}

export type HomeHeroData = {
  eyebrow?: string | null
  headingLead?: string | null
  headingAccent?: string | null
  headingTail?: string | null
  description?: string | null
  desktopImage?: HomeHeroImage | null
  mobileImage?: HomeHeroImage | null
  primaryCta?: Parameters<typeof resolveSimpleCta>[1]
  secondaryCta?: Parameters<typeof resolveSimpleCta>[1]
  trustItems?: HomeHeroTrustItem[] | null
}

export function getHomeHero(page: unknown): HomeHeroData | null {
  if (!page || typeof page !== 'object') return null
  const hero = (page as {hero?: HomeHeroData | null}).hero
  if (!hero || typeof hero !== 'object') return null
  return hero
}
