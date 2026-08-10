'use client'

import Link from 'next/link'
import {useRef} from 'react'

import {ProductCard} from '@/components/product/product-card'
import type {Locale} from '@/lib/i18n/locales'
import type {ProductCardData} from '@/lib/products/types'

type RelatedProductsSliderProps = {
  locale: Locale
  products: ProductCardData[]
  detailLabel: string
  heading: string
  allProductsHref: string
  allProductsLabel: string
}

export function RelatedProductsSlider(props: RelatedProductsSliderProps) {
  const {
    locale,
    products,
    detailLabel,
    heading,
    allProductsHref,
    allProductsLabel,
  } = props
  const scrollerRef = useRef<HTMLUListElement>(null)

  const scrollBy = (direction: -1 | 1) => {
    const node = scrollerRef.current
    if (!node) return
    const rtl = getComputedStyle(node).direction === 'rtl'
    const amount = Math.min(360, node.clientWidth * 0.85) * direction * (rtl ? -1 : 1)
    node.scrollBy({left: amount, behavior: 'smooth'})
  }

  if (!products.length) return null

  return (
    <section className="border-b border-border section-space">
      <div className="container-site flex flex-col gap-6">
        <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <h2 className="font-display text-3xl text-foreground sm:text-4xl">{heading}</h2>
          <div className="flex items-center gap-2">
            <Link
              href={allProductsHref}
              className="me-auto text-sm font-semibold text-accent no-underline hover:underline sm:me-0"
            >
              {allProductsLabel}
            </Link>
            <button
              type="button"
              aria-label="Previous"
              onClick={() => scrollBy(-1)}
              className="inline-flex h-10 w-10 items-center justify-center border border-border text-foreground transition hover:border-accent"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => scrollBy(1)}
              className="inline-flex h-10 w-10 items-center justify-center border border-border text-foreground transition hover:border-accent"
            >
              ›
            </button>
          </div>
        </div>

        <ul
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            <li
              key={product._id}
              className="w-[min(78vw,260px)] shrink-0 snap-start sm:w-[300px]"
            >
              <ProductCard locale={locale} product={product} detailLabel={detailLabel} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
