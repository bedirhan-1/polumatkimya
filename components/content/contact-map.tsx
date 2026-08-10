'use client'

import {useState} from 'react'

type ContactMapProps = {
  src: string
  title: string
  /** Opens the location in Google Maps (new tab). */
  mapsUrl?: string
  openInMapsLabel?: string
}

/** Grayscale by default; full color while the pointer is over the map area. */
export function ContactMap({src, title, mapsUrl, openInMapsLabel}: ContactMapProps) {
  const [hot, setHot] = useState(false)

  return (
    <div
      className="relative min-h-[320px] w-full overflow-hidden bg-surface sm:min-h-[420px]"
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
    >
      <iframe
        title={title}
        src={src}
        className={`absolute inset-0 h-full w-full border-0 transition-[filter] duration-300 ease-out ${
          hot ? 'grayscale-0 contrast-100' : 'grayscale contrast-125'
        }`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      {mapsUrl && openInMapsLabel ? (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute end-3 bottom-3 z-10 inline-flex min-h-10 items-center bg-background/95 px-3.5 py-2 text-xs font-semibold tracking-wide text-foreground no-underline shadow-sm ring-1 ring-border transition hover:text-accent"
        >
          {openInMapsLabel}
        </a>
      ) : null}
    </div>
  )
}
