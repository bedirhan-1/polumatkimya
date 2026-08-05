'use client'

import {useCallback, useEffect, useId, useState} from 'react'

import {ButtonLink} from '@/components/ui/button-link'
import {SanityImage} from '@/components/content/sanity-image'
import type {Locale} from '@/lib/i18n/locales'
import {resolveSimpleCta} from '@/sanity/lib/link-resolver'

type SlideImage = {
  asset?: {_ref?: string} | null
  alt?: string | null
} | null

type SlideCta = Parameters<typeof resolveSimpleCta>[1]

type HeroSlide = {
  _key: string
  eyebrow?: string | null
  heading?: string | null
  description?: string | null
  desktopImage?: SlideImage
  mobileImage?: SlideImage
  primaryCta?: SlideCta
  secondaryCta?: SlideCta
}

type HeroSliderSectionProps = {
  locale: Locale
  block: {
    _key: string
    accessibilityLabel?: string | null
    rotationMode?: 'automatic' | 'manual' | null
    interval?: number | null
    slides?: HeroSlide[] | null
  }
}

export function HeroSliderSection({locale, block}: HeroSliderSectionProps) {
  const slides = (block.slides || []).filter((slide) => slide.desktopImage?.asset)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const labelId = useId()
  const automatic = block.rotationMode !== 'manual'
  const intervalMs = Math.min(12000, Math.max(4000, block.interval || 6500))

  const goTo = useCallback(
    (next: number) => {
      if (!slides.length) return
      setIndex(((next % slides.length) + slides.length) % slides.length)
    },
    [slides.length],
  )

  useEffect(() => {
    if (!automatic || paused || slides.length < 2) return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches) return
    const timer = window.setInterval(() => goTo(index + 1), intervalMs)
    return () => window.clearInterval(timer)
  }, [automatic, paused, slides.length, intervalMs, index, goTo])

  if (!slides.length) return null

  const active = slides[index]
  const primary = resolveSimpleCta(locale, active.primaryCta)
  const secondary = resolveSimpleCta(locale, active.secondaryCta)

  return (
    <section
      className="relative isolate overflow-hidden border-b border-border"
      aria-roledescription="carousel"
      aria-labelledby={labelId}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setPaused(false)
        }
      }}
    >
      <p id={labelId} className="sr-only">
        {block.accessibilityLabel || 'Featured content'}
      </p>

      <div className="relative min-h-[78vh] lg:min-h-[84vh]">
        {slides.map((slide, slideIndex) => {
          const isActive = slideIndex === index
          return (
            <div
              key={slide._key}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
              aria-hidden={!isActive}
            >
              <div className="absolute inset-0">
                {slide.mobileImage?.asset ? (
                  <>
                    <SanityImage
                      image={slide.desktopImage}
                      fill
                      priority={slideIndex === 0}
                      fit="crop"
                      className="hidden object-cover object-[72%_center] md:block"
                      sizes="100vw"
                    />
                    <SanityImage
                      image={slide.mobileImage}
                      fill
                      priority={slideIndex === 0}
                      fit="crop"
                      className="object-cover object-[68%_center] md:hidden"
                      sizes="100vw"
                    />
                  </>
                ) : (
                  <SanityImage
                    image={slide.desktopImage}
                    fill
                    priority={slideIndex === 0}
                    fit="crop"
                    className="object-cover object-[72%_center]"
                    sizes="100vw"
                  />
                )}
              </div>
            </div>
          )
        })}

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/20 md:via-background/70 md:to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/30"
          aria-hidden
        />
        <div className="product-mesh pointer-events-none absolute inset-0 opacity-20" aria-hidden />

        <div className="container-site relative flex min-h-[78vh] flex-col justify-end py-14 sm:py-18 lg:min-h-[84vh] lg:justify-center lg:py-24">
          <div
            key={active._key}
            className="animate-product-rise max-w-2xl"
          >
            {active.eyebrow ? (
              <p className="text-xs font-semibold tracking-[0.28em] text-accent uppercase">
                {active.eyebrow}
              </p>
            ) : null}
            <h1 className="mt-4 font-display text-4xl text-foreground sm:text-5xl lg:text-6xl">
              {active.heading}
            </h1>
            {active.description ? (
              <p className="mt-4 max-w-xl text-base text-muted sm:text-lg">{active.description}</p>
            ) : null}
            {(primary || secondary) && (
              <div className="mt-8 flex flex-wrap gap-3">
                {primary ? (
                  <ButtonLink href={primary.href} variant={primary.variant}>
                    {primary.label}
                  </ButtonLink>
                ) : null}
                {secondary ? (
                  <ButtonLink href={secondary.href} variant={secondary.variant}>
                    {secondary.label}
                  </ButtonLink>
                ) : null}
              </div>
            )}
          </div>

          {slides.length > 1 ? (
            <div className="mt-10 flex items-center gap-4 lg:mt-14">
              <div className="flex items-center gap-2" role="tablist" aria-label={block.accessibilityLabel || undefined}>
                {slides.map((slide, slideIndex) => {
                  const selected = slideIndex === index
                  return (
                    <button
                      key={slide._key}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-label={`${slideIndex + 1} / ${slides.length}`}
                      className={`h-1.5 transition-all duration-300 ${
                        selected ? 'w-10 bg-accent' : 'w-5 bg-muted/50 hover:bg-muted'
                      }`}
                      onClick={() => goTo(slideIndex)}
                    />
                  )
                })}
              </div>
              <div className="ms-auto flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex size-10 items-center justify-center border border-border bg-surface/80 text-foreground backdrop-blur transition hover:border-accent hover:text-accent"
                  aria-label="Previous slide"
                  onClick={() => goTo(index - 1)}
                >
                  <Chevron dir="prev" />
                </button>
                <button
                  type="button"
                  className="inline-flex size-10 items-center justify-center border border-border bg-surface/80 text-foreground backdrop-blur transition hover:border-accent hover:text-accent"
                  aria-label="Next slide"
                  onClick={() => goTo(index + 1)}
                >
                  <Chevron dir="next" />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

function Chevron({dir}: {dir: 'prev' | 'next'}) {
  const isPrev = dir === 'prev'
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={`h-4 w-4 ${isPrev ? 'rtl:rotate-180' : 'rotate-180 rtl:rotate-0'}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <path d="M10 3.5 5.5 8 10 12.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
