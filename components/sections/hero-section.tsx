import type {Locale} from '@/lib/i18n/locales'
import {ButtonLink} from '@/components/ui/button-link'
import {SectionHeading} from '@/components/content/section-heading'
import {SanityImage} from '@/components/content/sanity-image'
import {resolveSimpleCta} from '@/sanity/lib/link-resolver'

type HeroSectionProps = {
  locale: Locale
  block: {
    _key: string
    eyebrow?: string | null
    heading?: string | null
    description?: string | null
    primaryCta?: Parameters<typeof resolveSimpleCta>[1]
    secondaryCta?: Parameters<typeof resolveSimpleCta>[1]
    media?: {asset?: {_ref?: string}; alt?: string | null} | null
    trustItems?: Array<{_key: string; label?: string | null}> | null
  }
}

export function HeroSection({locale, block}: HeroSectionProps) {
  const primary = resolveSimpleCta(locale, block.primaryCta)
  const secondary = resolveSimpleCta(locale, block.secondaryCta)

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="container-site section-space grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-6">
          <SectionHeading
            as="h1"
            eyebrow={block.eyebrow}
            heading={block.heading}
            description={block.description}
          />
          {(primary || secondary) && (
            <div className="flex flex-wrap gap-3">
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
          {block.trustItems?.length ? (
            <ul className="flex flex-wrap gap-3 pt-2">
              {block.trustItems.map((item) => (
                <li
                  key={item._key}
                  className="border border-border bg-surface px-3 py-1.5 text-xs tracking-wide text-muted uppercase"
                >
                  {item.label}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="frame-accent relative min-h-72 overflow-hidden bg-surface sm:min-h-96">
          {block.media?.asset ? (
            <SanityImage
              image={block.media}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          ) : (
            <div className="absolute inset-3 border border-accent/30" />
          )}
        </div>
      </div>
    </section>
  )
}
