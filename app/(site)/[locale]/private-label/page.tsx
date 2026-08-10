import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {PageHero} from '@/components/content/page-hero'
import {QuoteForm} from '@/components/forms/quote-form'
import {getDictionary} from '@/lib/i18n/get-dictionary'
import {isLocale, locales, type Locale} from '@/lib/i18n/locales'
import {DEFAULT_CONTACT} from '@/lib/navigation'
import {buildPageMetadata} from '@/lib/seo/metadata'
import {getSiteSettings} from '@/sanity/lib/site-settings'

type PageProps = {
  params: Promise<{locale: string}>
}

export function generateStaticParams() {
  return locales.map((locale) => ({locale}))
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale: localeParam} = await params
  if (!isLocale(localeParam)) return {}
  const dictionary = await getDictionary(localeParam)
  return buildPageMetadata({
    locale: localeParam,
    fallbackTitle: dictionary.pages.privateLabelTitle,
    fallbackDescription: dictionary.pages.privateLabelDescription,
    path: '/private-label',
  })
}

export default async function PrivateLabelQuotePage({params}: PageProps) {
  const {locale: localeParam} = await params
  if (!isLocale(localeParam)) notFound()

  const locale = localeParam as Locale
  const dictionary = await getDictionary(locale)
  const siteSettings = await getSiteSettings(locale)
  const phone =
    siteSettings?.contactChannels?.find((channel) => channel.phone)?.phone || DEFAULT_CONTACT.phone
  const email =
    siteSettings?.contactChannels?.find((channel) => channel.email)?.email || DEFAULT_CONTACT.email
  const phoneHref = phone.replace(/[^\d+]/g, '').startsWith('+')
    ? `tel:${phone.replace(/[^\d+]/g, '')}`
    : DEFAULT_CONTACT.phoneHref

  const steps = [
    {
      title: dictionary.privateLabelPage.step1Title,
      body: dictionary.privateLabelPage.step1Body,
    },
    {
      title: dictionary.privateLabelPage.step2Title,
      body: dictionary.privateLabelPage.step2Body,
    },
    {
      title: dictionary.privateLabelPage.step3Title,
      body: dictionary.privateLabelPage.step3Body,
    },
  ]

  return (
    <main id="main-content">
      <PageHero>
        <p className="animate-product-rise text-xs font-semibold tracking-[0.22em] text-accent uppercase">
          {dictionary.privateLabelPage.eyebrow}
        </p>
        <h1
          className="animate-product-rise mt-4 max-w-3xl font-display text-4xl text-foreground sm:text-5xl lg:text-6xl"
          style={{animationDelay: '60ms'}}
        >
          {dictionary.pages.privateLabelTitle}
        </h1>
        <p
          className="animate-product-rise mt-4 max-w-2xl text-base text-muted sm:text-lg"
          style={{animationDelay: '120ms'}}
        >
          {dictionary.pages.privateLabelDescription}
        </p>
      </PageHero>

      <section className="border-b border-border">
        <div className="container-site grid lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="border-border py-12 lg:border-e lg:py-16 lg:pe-12">
            <ol className="space-y-8">
              {steps.map((step, index) => (
                <li
                  key={step.title}
                  className="animate-product-rise border-s-2 border-accent/70 ps-4"
                  style={{animationDelay: `${140 + index * 70}ms`}}
                >
                  <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h2 className="mt-2 font-display text-xl text-foreground sm:text-2xl">
                    {step.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
                </li>
              ))}
            </ol>

            <div
              className="animate-product-rise mt-12 border-t border-border pt-8"
              style={{animationDelay: '360ms'}}
            >
              <p className="text-xs font-semibold tracking-[0.18em] text-muted uppercase">
                {dictionary.privateLabelPage.directContact}
              </p>
              <div className="mt-4 flex flex-col gap-2 text-sm">
                <a
                  href={phoneHref}
                  className="text-foreground no-underline transition hover:text-accent"
                  dir="ltr"
                >
                  {phone}
                </a>
                <a
                  href={`mailto:${email}`}
                  className="text-muted no-underline transition hover:text-foreground"
                  dir="ltr"
                >
                  {email}
                </a>
              </div>
              <p className="mt-5 text-xs tracking-wide text-muted">
                {dictionary.privateLabelPage.responseTime}
              </p>
            </div>
          </aside>

          <div className="py-12 lg:py-16 lg:ps-12">
            <div className="animate-product-rise" style={{animationDelay: '180ms'}}>
              <h2 className="font-display text-3xl text-foreground">
                {dictionary.privateLabelPage.formTitle}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
                {dictionary.privateLabelPage.formHint}
              </p>
            </div>

            <div
              className="animate-product-rise relative mt-8 overflow-hidden border border-border bg-surface p-5 sm:p-8"
              style={{animationDelay: '240ms'}}
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent"
                aria-hidden
              />
              <QuoteForm labels={dictionary.forms} locale={locale} privateLabel />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
