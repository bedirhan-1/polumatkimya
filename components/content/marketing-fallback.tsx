import {ButtonLink} from '@/components/ui/button-link'
import {SectionHeading} from '@/components/content/section-heading'
import type {Dictionary} from '@/lib/i18n/get-dictionary'
import type {Locale} from '@/lib/i18n/locales'

type MarketingFallbackProps = {
  locale: Locale
  dictionary: Dictionary
  title: string
  description: string
  showQuoteCta?: boolean
}

/** Temporary marketing shell when Sanity document is missing or incomplete. */
export function MarketingFallback({
  locale,
  dictionary,
  title,
  description,
  showQuoteCta = true,
}: MarketingFallbackProps) {
  return (
    <section className="border-b border-border section-space">
      <div className="container-site flex max-w-3xl flex-col gap-6">
        <SectionHeading as="h1" eyebrow={dictionary.meta.siteName} heading={title} description={description} />
        {showQuoteCta ? (
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={`/${locale}/request-a-quote`}>{dictionary.nav.requestQuote}</ButtonLink>
            <ButtonLink href={`/${locale}/products`} variant="secondary">
              {dictionary.nav.products}
            </ButtonLink>
          </div>
        ) : null}
      </div>
    </section>
  )
}
