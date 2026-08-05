'use client'

import {useState} from 'react'

import {SanityImage} from '@/components/content/sanity-image'
import {resolveVideoEmbed} from '@/lib/media/video-embed'

type CoverImage = {
  asset?: {_ref?: string} | null
  alt?: string | null
} | null

type LazyVideoEmbedProps = {
  title?: string | null
  provider?: string | null
  externalUrl?: string | null
  playbackId?: string | null
  coverImage?: CoverImage
  playLabel: string
  className?: string
}

export function LazyVideoEmbed({
  title,
  provider,
  externalUrl,
  playbackId,
  coverImage,
  playLabel,
  className = '',
}: LazyVideoEmbedProps) {
  const [active, setActive] = useState(false)
  const embed = resolveVideoEmbed({provider, externalUrl, playbackId})

  if (!embed) {
    return (
      <div className={`relative aspect-video overflow-hidden border border-border bg-surface-elevated ${className}`}>
        <SanityImage image={coverImage} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
      </div>
    )
  }

  if (active) {
    return (
      <div className={`relative aspect-video overflow-hidden border border-border bg-black ${className}`}>
        <iframe
          src={embed.embedUrl}
          title={title || playLabel}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    )
  }

  return (
    <div className={`relative aspect-video overflow-hidden border border-border bg-surface-elevated ${className}`}>
      <SanityImage
        image={coverImage}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <button
        type="button"
        onClick={() => setActive(true)}
        className="absolute inset-0 flex items-center justify-center bg-background/35 transition hover:bg-background/25"
        aria-label={playLabel}
      >
        <span className="inline-flex min-h-14 min-w-14 items-center justify-center border border-accent bg-accent px-4 text-sm font-semibold tracking-wide text-white uppercase">
          {playLabel}
        </span>
      </button>
    </div>
  )
}
