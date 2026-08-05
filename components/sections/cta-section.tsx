import {SectionHeading} from '@/components/content/section-heading'
import {ButtonLink} from '@/components/ui/button-link'
import type {Locale} from '@/lib/i18n/locales'
import {resolveSimpleCta} from '@/sanity/lib/link-resolver'

type CtaSectionProps = {
  locale: Locale
  block: {
    _key: string
    heading?: string | null
    description?: string | null
    cta?: Parameters<typeof resolveSimpleCta>[1]
  }
}

export function CtaSection({locale, block}: CtaSectionProps) {
  const cta = resolveSimpleCta(locale, block.cta)

  return (
    <section className="border-b border-border section-space">
      <div className="container-site">
        <div className="frame-accent flex flex-col items-start gap-6 bg-surface px-6 py-10 sm:px-10 sm:py-14 lg:flex-row lg:items-center lg:justify-between">
          <SectionHeading heading={block.heading} description={block.description} />
          {cta ? (
            <ButtonLink href={cta.href} variant={cta.variant} className="shrink-0">
              {cta.label}
            </ButtonLink>
          ) : null}
        </div>
      </div>
    </section>
  )
}
