'use client'

import {useState} from 'react'

import {SanityImage} from '@/components/content/sanity-image'
import type {HomeImage} from '@/lib/home/content'
import {resolveCloudflareStreamEmbed} from '@/lib/media/video-embed'

import styles from './home-landing.module.css'

type AboutVideoProps = {
  poster?: HomeImage | null
  posterAlt: string
  playLabel: string
  streamUrl?: string | null
  streamVideoId?: string | null
}

export function AboutVideo({
  poster,
  posterAlt,
  playLabel,
  streamUrl,
  streamVideoId,
}: AboutVideoProps) {
  const [active, setActive] = useState(false)
  const embed = resolveCloudflareStreamEmbed({
    externalUrl: streamUrl,
    playbackId: streamVideoId,
  })

  if (active && embed) {
    return (
      <div className={styles.aboutMedia}>
        <iframe
          src={embed.embedUrl}
          title={playLabel}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen
          className={styles.aboutVideoFrame}
        />
      </div>
    )
  }

  return (
    <div className={styles.aboutMedia}>
      {poster?.asset ? (
        <SanityImage
          image={poster}
          alt={posterAlt}
          fill
          sizes="(max-width: 920px) 100vw, 50vw"
          className={styles.aboutImage}
        />
      ) : (
        <div className={styles.aboutPosterFallback} aria-hidden="true" />
      )}

      <div className={styles.aboutPlayScrim} aria-hidden="true" />

      <button
        type="button"
        className={styles.aboutPlay}
        onClick={() => {
          if (embed) setActive(true)
        }}
        aria-label={playLabel}
        disabled={!embed}
      >
        <span className={styles.aboutPlayIcon} aria-hidden="true">
          <svg viewBox="0 0 72 72" width="72" height="72" fill="none">
            <circle cx="36" cy="36" r="33" stroke="currentColor" strokeWidth="2" />
            <path d="M30 24.5v23L50 36 30 24.5Z" fill="currentColor" />
          </svg>
        </span>
        <span className={styles.aboutPlayLabel}>{playLabel}</span>
      </button>
    </div>
  )
}
