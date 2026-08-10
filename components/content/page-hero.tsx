import type {ReactNode} from 'react'

type PageHeroProps = {
  children: ReactNode
  className?: string
  compact?: boolean
}

/** Shared inner-page title band (breadcrumbs + heading). */
export function PageHero({children, className = '', compact = false}: PageHeroProps) {
  return (
    <section
      className={`product-hero-panel relative overflow-hidden border-b border-border ${className}`.trim()}
    >
      <div className="product-mesh pointer-events-none absolute inset-0 opacity-90" aria-hidden />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/75 to-transparent"
        aria-hidden
      />
      <div
        className={`container-site relative ${compact ? 'py-8 sm:py-10' : 'py-10 sm:py-14'}`}
      >
        {children}
      </div>
    </section>
  )
}
