'use client'

import {useRef, useState, type KeyboardEvent, type TouchEvent} from 'react'

import styles from './featured-product-showcase.module.css'

export type FeaturedProductSlide = {
  _key: string
  tag: string
  title: string
  description: string
}

type FeaturedProductSliderProps = {
  slides: FeaturedProductSlide[]
  label: string
  carouselLabel: string
  previousLabel: string
  nextLabel: string
  goToLabel: string
  direction: 'ltr' | 'rtl'
}

export function FeaturedProductSlider({
  slides,
  label,
  carouselLabel,
  previousLabel,
  nextLabel,
  goToLabel,
  direction,
}: FeaturedProductSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)

  if (!slides.length) return null

  const previous = () => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length)
  }
  const next = () => {
    setActiveIndex((current) => (current + 1) % slides.length)
  }
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      previous()
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      next()
    }
  }
  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null
  }
  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return
    const endX = event.changedTouches[0]?.clientX
    if (typeof endX !== 'number') return
    const distance = endX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(distance) < 42) return
    if (distance < 0) next()
    else previous()
  }

  return (
    <div
      className={styles.slider}
      role="region"
      aria-roledescription={carouselLabel}
      aria-label={label}
    >
      <div className={styles.sliderHeader}>
        <span>{label}</span>
        <span className={styles.slideCount} aria-live="polite">
          {String(activeIndex + 1).padStart(2, '0')}
          <i aria-hidden="true" />
          {String(slides.length).padStart(2, '0')}
        </span>
      </div>

      <div
        className={styles.sliderViewport}
        dir="ltr"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className={styles.sliderTrack}
          style={{transform: `translate3d(-${activeIndex * 100}%, 0, 0)`}}
        >
          {slides.map((slide, index) => (
            <article
              className={styles.slide}
              key={slide._key}
              aria-hidden={index !== activeIndex}
              dir={direction}
            >
              <span className={styles.slideTag}>{slide.tag}</span>
              <h3>{slide.title}</h3>
              <p>{slide.description}</p>
            </article>
          ))}
        </div>
      </div>

      <div className={styles.sliderNav}>
        <div className={styles.sliderDots}>
          {slides.map((slide, index) => (
            <button
              type="button"
              className={`${styles.sliderDot} ${index === activeIndex ? styles.sliderDotActive : ''}`}
              key={slide._key}
              aria-label={`${goToLabel} ${index + 1}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
        <div className={styles.sliderControls} dir="ltr">
          <button type="button" onClick={previous} aria-label={previousLabel}>
            <SliderArrow direction="previous" />
          </button>
          <button type="button" onClick={next} aria-label={nextLabel}>
            <SliderArrow direction="next" />
          </button>
        </div>
      </div>
    </div>
  )
}

function SliderArrow({direction}: {direction: 'previous' | 'next'}) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d={direction === 'previous' ? 'm14.5 6-6 6 6 6' : 'm9.5 6 6 6-6 6'} />
    </svg>
  )
}
