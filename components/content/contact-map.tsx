'use client'

import {useEffect, useState} from 'react'

type ContactMapProps = {
  src: string
  title: string
  label?: string
  /** Opens the location in Google Maps (new tab). */
  mapsUrl?: string
  openInMapsLabel?: string
  enableMapLabel?: string
}

/** Grayscale by default; full color while the pointer is over the map area. */
export function ContactMap({
  src,
  title,
  label,
  mapsUrl,
  openInMapsLabel,
  enableMapLabel,
}: ContactMapProps) {
  const [hot, setHot] = useState(false)
  const [coarse, setCoarse] = useState(false)
  const [unlocked, setUnlocked] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(hover: none), (pointer: coarse)')
    const sync = () => {
      setCoarse(media.matches)
      if (!media.matches) setUnlocked(false)
    }
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  const vivid = hot || (coarse && unlocked)

  return (
    <div
      className="relative min-h-[220px] w-full overflow-hidden bg-surface sm:min-h-[300px] lg:min-h-[420px]"
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
    >
      <iframe
        title={title}
        src={src}
        className={`absolute inset-0 h-full w-full border-0 transition-[filter] duration-300 ease-out ${
          vivid ? 'grayscale-0 contrast-100' : 'grayscale contrast-125'
        } ${coarse && !unlocked ? 'pointer-events-none' : ''}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      {coarse && !unlocked ? (
        <button
          type="button"
          className="absolute inset-0 z-[5] flex items-end justify-center bg-black/15 pb-14"
          aria-label={enableMapLabel || title}
          onClick={() => setUnlocked(true)}
        >
          <span className="bg-background/95 px-3 py-2 text-[0.7rem] font-semibold tracking-[0.08em] text-foreground uppercase shadow-sm ring-1 ring-border">
            {enableMapLabel || title}
          </span>
        </button>
      ) : null}
      {label ? (
        <p className="pointer-events-none absolute start-3 top-3 z-10 max-w-[min(100%-1.5rem,16rem)] bg-background/95 px-3 py-1.5 text-[0.65rem] font-semibold tracking-[0.12em] text-foreground uppercase shadow-sm ring-1 ring-border sm:px-3.5 sm:py-2 sm:text-xs sm:tracking-[0.14em]">
          {label}
        </p>
      ) : null}
      {mapsUrl && openInMapsLabel ? (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute end-3 bottom-3 z-10 inline-flex min-h-10 items-center bg-background/95 px-3 py-2 text-[0.7rem] font-semibold tracking-wide text-foreground no-underline shadow-sm ring-1 ring-border transition hover:text-accent sm:px-3.5 sm:text-xs"
        >
          {openInMapsLabel}
        </a>
      ) : null}
    </div>
  )
}
