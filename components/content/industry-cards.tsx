import Link from 'next/link'

import {SanityImage} from '@/components/content/sanity-image'
import {HomeReveal} from '@/components/home/home-reveal'
import type {Locale} from '@/lib/i18n/locales'

import styles from './industry-cards.module.css'

export type IndustryCardItem = {
  _id: string
  title?: string | null
  slug?: string | null
  summary?: string | null
  coverImage?: {
    asset?: {_ref?: string; _id?: string} | null
    alt?: string | null
    hotspot?: {x?: number; y?: number} | null
    crop?: unknown
  } | null
  icon?: {
    asset?: {_ref?: string; _id?: string} | null
    alt?: string | null
  } | null
}

type IndustryCardsProps = {
  locale: Locale
  areas: IndustryCardItem[]
  detailLabel?: string | null
  className?: string
  reveal?: boolean
}

/** Six-up industry cards (homepage + uygulama alanları listing). */
export function IndustryCards({
  locale,
  areas,
  detailLabel,
  className = '',
  reveal = false,
}: IndustryCardsProps) {
  const cards = areas.filter((area) => area.slug && area.title)
  if (!cards.length) return null

  const items = cards.map((area) => (
    <Link
      href={`/${locale}/industries/${area.slug}`}
      className={styles.card}
      key={area._id}
    >
      <span className={styles.media}>
        {area.coverImage?.asset ? (
          <SanityImage
            image={area.coverImage}
            alt={area.coverImage.alt || area.title || ''}
            fill
            sizes="(max-width: 720px) 100vw, (max-width: 1100px) 33vw, 16vw"
            className={styles.image}
          />
        ) : null}
      </span>
      <span className={styles.body}>
        <span className={styles.icon}>
          {area.icon?.asset ? (
            <SanityImage
              image={area.icon}
              alt=""
              width={56}
              height={56}
              fit="max"
              className={styles.iconImage}
            />
          ) : null}
        </span>
        <h3>{area.title}</h3>
        {area.summary ? <p className={styles.summary}>{area.summary}</p> : null}
        {detailLabel ? <span className={styles.action}>{detailLabel}</span> : null}
        <span className={styles.accent} aria-hidden />
      </span>
    </Link>
  ))

  const gridClassName = `${styles.grid} ${className}`.trim()

  if (reveal) {
    return (
      <HomeReveal className={gridClassName} stagger>
        {items}
      </HomeReveal>
    )
  }

  return <div className={gridClassName}>{items}</div>
}
