import {ButtonLink} from '@/components/ui/button-link'
import {getDictionary} from '@/lib/i18n/get-dictionary'
import {isLocale, type Locale} from '@/lib/i18n/locales'
import {notFound} from 'next/navigation'

type HomePageProps = {
  params: Promise<{locale: string}>
}

export default async function HomePage({params}: HomePageProps) {
  const {locale: localeParam} = await params
  if (!isLocale(localeParam)) {
    notFound()
  }

  const locale = localeParam as Locale
  const dictionary = await getDictionary(locale)

  return (
    <main id="main-content">
      <section className="relative overflow-hidden border-b border-border">
        <div className="container-site section-space grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-6">
            <p className="text-xs font-semibold tracking-[0.28em] text-accent uppercase">
              {dictionary.home.eyebrow}
            </p>
            <h1 className="max-w-3xl text-5xl text-foreground sm:text-6xl lg:text-7xl">
              {dictionary.home.headline}
            </h1>
            <p className="max-w-2xl text-lg text-muted">{dictionary.home.supporting}</p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={`/${locale}/products`}>{dictionary.nav.products}</ButtonLink>
              <ButtonLink href={`/${locale}/request-a-quote`} variant="secondary">
                {dictionary.nav.requestQuote}
              </ButtonLink>
            </div>
          </div>

          <div className="frame-accent relative min-h-72 bg-surface p-6 sm:min-h-96">
            <div className="absolute inset-3 border border-accent/30" />
            <div className="relative flex h-full min-h-60 flex-col justify-end gap-3">
              <p className="font-display text-sm tracking-[0.2em] text-accent uppercase">
                {dictionary.home.panelLabel}
              </p>
              <p className="max-w-sm text-sm text-muted">{dictionary.home.panelText}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
