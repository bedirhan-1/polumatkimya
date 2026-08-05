import {PortableTextRenderer} from '@/components/content/portable-text'
import {SectionHeading} from '@/components/content/section-heading'
import {SanityImage} from '@/components/content/sanity-image'
import {ButtonLink} from '@/components/ui/button-link'
import type {Locale} from '@/lib/i18n/locales'
import {resolveSimpleCta} from '@/sanity/lib/link-resolver'

type ImageTextSectionProps = {
  locale: Locale
  block: {
    _key: string
    heading?: string | null
    body?: unknown
    image?: {asset?: {_ref?: string}; alt?: string | null} | null
    cta?: Parameters<typeof resolveSimpleCta>[1]
  }
}

export function ImageTextSection({locale, block}: ImageTextSectionProps) {
  const cta = resolveSimpleCta(locale, block.cta)
  const hasImage = Boolean(block.image?.asset)

  return (
    <section className="border-b border-border section-space">
      <div
        className={`container-site grid items-center gap-10 ${hasImage ? 'lg:grid-cols-2' : 'max-w-3xl'}`}
      >
        {hasImage ? (
          <div className="relative min-h-72 overflow-hidden border border-border bg-surface lg:min-h-96">
            <SanityImage
              image={block.image}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        ) : null}
        <div className="flex flex-col gap-4">
          <SectionHeading heading={block.heading} />
          <PortableTextRenderer value={block.body} />
          {cta ? (
            <div className="pt-2">
              <ButtonLink href={cta.href} variant={cta.variant}>
                {cta.label}
              </ButtonLink>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
