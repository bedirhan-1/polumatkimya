'use client'

import {useEffect, useId, useRef, useState} from 'react'
import {createPortal} from 'react-dom'

import {SanityImage} from '@/components/content/sanity-image'
import type {GalleryImageData} from '@/components/sections/gallery-showcase-section'

type GalleryLightboxProps = {
  images: GalleryImageData[]
  index: number
  labels: {
    close: string
    previous: string
    next: string
    of: string
  }
  onClose: () => void
  onChange: (index: number) => void
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="square"
      />
    </svg>
  )
}

function ChevronIcon({direction}: {direction: 'prev' | 'next'}) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <path
        d={direction === 'prev' ? 'M15 5L8 12l7 7' : 'M9 5l7 7-7 7'}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  )
}

export function GalleryLightbox({
  images,
  index,
  labels,
  onClose,
  onChange,
}: GalleryLightboxProps) {
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const item = images[index]
  const total = images.length
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (total <= 1) return
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        onChange((index - 1 + total) % total)
        return
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        onChange((index + 1) % total)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [index, onChange, onClose, total])

  if (!mounted || !item) return null

  const alt = item.image?.alt || item.title || ''
  const counter = labels.of.replace('{current}', String(index + 1)).replace('{total}', String(total))

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex flex-col bg-black/92"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="relative z-20 flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-6">
        <p id={titleId} className="min-w-0 truncate text-sm text-white/80">
          {item.title || alt || counter}
          {item.title || alt ? <span className="ms-3 text-white/45">{counter}</span> : null}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={labels.close}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-white/20 text-white transition hover:border-white/50 hover:bg-white/10"
        >
          <CloseIcon />
        </button>
      </div>

      <div
        className="relative z-10 flex min-h-0 flex-1 items-center justify-center px-4 py-6 sm:px-16 sm:py-10"
        onClick={onClose}
      >
        {total > 1 ? (
          <>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onChange((index - 1 + total) % total)
              }}
              aria-label={labels.previous}
              className="absolute start-3 top-1/2 z-20 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/20 bg-black/45 text-white transition hover:border-white/50 hover:bg-white/10 sm:start-5"
            >
              <ChevronIcon direction="prev" />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onChange((index + 1) % total)
              }}
              aria-label={labels.next}
              className="absolute end-3 top-1/2 z-20 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/20 bg-black/45 text-white transition hover:border-white/50 hover:bg-white/10 sm:end-5"
            >
              <ChevronIcon direction="next" />
            </button>
          </>
        ) : null}

        <div
          className="relative h-full w-full max-w-6xl"
          onClick={(event) => event.stopPropagation()}
        >
          <SanityImage
            image={item.image}
            alt={alt}
            fill
            fit="max"
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>
      </div>
    </div>,
    document.body,
  )
}
