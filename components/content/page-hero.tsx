import type {ReactNode} from 'react'

import {HeroBackdrop, type HeroPattern} from '@/components/content/hero-backdrop'

type PageHeroProps = {
  children: ReactNode
  className?: string
  compact?: boolean
  /** Page-specific decorative backdrop for the title / breadcrumb band. */
  pattern?: HeroPattern
}

/** Shared inner-page title band (breadcrumbs + heading). */
export function PageHero({
  children,
  className = '',
  compact = false,
  pattern = 'default',
}: PageHeroProps) {
  return (
    <section className={`relative overflow-hidden border-b border-border ${className}`.trim()}>
      <HeroBackdrop pattern={pattern} />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/75 to-transparent"
        aria-hidden
      />
      <div
        className={`container-site relative ${compact ? 'py-6 sm:py-8 lg:py-10' : 'py-8 sm:py-10 lg:py-14'}`}
      >
        {children}
      </div>
    </section>
  )
}
