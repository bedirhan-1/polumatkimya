import type {Metadata} from 'next'
import type {ReactNode} from 'react'
import {notFound} from 'next/navigation'

import {PageBuilder} from '@/components/content/page-builder'
import {PageHero} from '@/components/content/page-hero'
import {ContactMap} from '@/components/content/contact-map'
import {ContactForm} from '@/components/forms/contact-form'
import {ButtonLink} from '@/components/ui/button-link'
import {getDictionary} from '@/lib/i18n/get-dictionary'
import {isLocale, locales, type Locale} from '@/lib/i18n/locales'
import {DEFAULT_CONTACT, DEALER_PORTAL_URL} from '@/lib/navigation'
import {asPageBuilderBlocks, asSeo, asString} from '@/lib/sanity/content'
import {buildPageMetadata} from '@/lib/seo/metadata'
import {getContactPage} from '@/sanity/lib/pages'
import {getSiteSettings} from '@/sanity/lib/site-settings'

type PageProps = {
  params: Promise<{locale: string}>
}

const CONTACT = {
  phones: [
    {label: 'Fabrika', value: '+90 372 615 77 70', href: 'tel:+903726157770'},
    {label: 'Mobil', value: '+90 533 897 28 24', href: 'tel:+905338972824'},
    {label: 'Mobil', value: '+90 543 877 81 35', href: 'tel:+905438778135'},
  ],
  emails: [
    {label: 'Fabrika', value: 'fabrika@polumatkimya.com', href: 'mailto:fabrika@polumatkimya.com'},
    {label: 'Export', value: 'export@polumat.com', href: 'mailto:export@polumat.com'},
  ],
}

const LOCATIONS = [
  {
    id: 'factory',
    address: 'Velioğlu OSB Mahallesi, 11 Nolu Sokak No: 3',
    city: 'Çaycuma / Zonguldak',
    postal: '67900',
    mapEmbed:
      'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d24969.54637002056!2d32.134079!3d41.404388!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x409c9df2982d432d%3A0x199446ced2931174!2sPolumat%20Kimya%20San.Tic.Ltd.%C5%9Eti!5e1!3m2!1str!2sus!4v1786290800135!5m2!1str!2sus',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Polumat%20Kimya%20San.Tic.Ltd.%C5%9Eti%20%C3%87aycuma',
  },
  {
    id: 'istanbul',
    address: 'İkitelli OSB, Pik Dökümcüler A4 Blok Sk No: 3',
    city: 'Başakşehir / İstanbul',
    postal: '34490',
    mapEmbed:
      'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12026.965978698898!2d28.799019679427147!3d41.096494452493765!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caaf6f18d96aa9%3A0x3f34d103a6f7ecb5!2zxLBraXRlbGxpIE9TQiwgUGlrIETDtmvDvG1jw7xsZXIgQTQgQmxvayBTayBObzozLCAzNDQ5MCBCYcWfYWvFn2VoaXIvxLBzdGFuYnVs!5e0!3m2!1str!2str!4v1786531849261!5m2!1str!2str',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=%C4%B0kitelli%20OSB%20Pik%20D%C3%B6k%C3%BCmc%C3%BCler%20A4%20Blok%20Sk%20No:3%20Ba%C5%9Fak%C5%9Fehir%20%C4%B0stanbul',
  },
] as const

export function generateStaticParams() {
  return locales.map((locale) => ({locale}))
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale: localeParam} = await params
  if (!isLocale(localeParam)) return {}
  const dictionary = await getDictionary(localeParam)
  const page = await getContactPage(localeParam)
  return buildPageMetadata({
    locale: localeParam,
    fallbackTitle: dictionary.nav.contact,
    fallbackDescription: dictionary.pages.contactDescription,
    seo: asSeo(page && typeof page === 'object' ? (page as {seo?: unknown}).seo : null),
    path: '/contact',
  })
}

export default async function ContactPage({params}: PageProps) {
  const {locale: localeParam} = await params
  if (!isLocale(localeParam)) notFound()

  const locale = localeParam as Locale
  const dictionary = await getDictionary(locale)
  const [page, siteSettings] = await Promise.all([
    getContactPage(locale),
    getSiteSettings(locale),
  ])
  const blocks = asPageBuilderBlocks(
    page && typeof page === 'object' ? (page as {pageBuilder?: unknown}).pageBuilder : null,
  )
  const title = asString(
    page && typeof page === 'object' ? (page as {title?: unknown}).title : null,
    dictionary.nav.contact,
  )
  const intro = asString(
    page && typeof page === 'object' ? (page as {intro?: unknown}).intro : null,
    dictionary.pages.contactDescription,
  )

  const channelPhone = siteSettings?.contactChannels?.find((c) => c.phone)?.phone
  const channelEmail = siteSettings?.contactChannels?.find((c) => c.email)?.email

  return (
    <main id="main-content">
      {blocks ? <PageBuilder locale={locale} dictionary={dictionary} blocks={blocks} /> : null}

      <PageHero>
        <p className="text-xs font-semibold tracking-[0.22em] text-accent uppercase">
          {dictionary.meta.siteName}
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-[clamp(1.85rem,7vw,3.75rem)] leading-[1.05] text-foreground">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted sm:text-lg">{intro}</p>
      </PageHero>

      {/* MIT-style facts + narrative */}
      <section className="border-b border-border">
        <div className="container-site grid lg:grid-cols-[0.95fr_1.05fr]">
          <aside className="border-border py-8 sm:py-12 lg:border-e lg:py-16 lg:pe-12">
            <dl className="space-y-8">
              <Fact
                title={dictionary.contactPage.factory}
                items={[
                  LOCATIONS[0].address,
                  LOCATIONS[0].city,
                  LOCATIONS[0].postal,
                ]}
              />
              <Fact
                title={dictionary.contactPage.istanbulOffice}
                items={[
                  LOCATIONS[1].address,
                  LOCATIONS[1].city,
                  LOCATIONS[1].postal,
                ]}
              />
              <Fact
                title={dictionary.contactPage.phone}
                items={CONTACT.phones.map((p) => (
                  <a key={p.value} href={p.href} className="text-foreground no-underline hover:text-accent" dir="ltr">
                    <span className="text-muted">{p.label}: </span>
                    {p.value}
                  </a>
                ))}
              />
              <Fact
                title={dictionary.contactPage.email}
                items={CONTACT.emails.map((e) => (
                  <a key={e.value} href={e.href} className="text-foreground no-underline hover:text-accent" dir="ltr">
                    <span className="text-muted">{e.label}: </span>
                    {e.value}
                  </a>
                ))}
              />
              <Fact
                title={dictionary.contactPage.channels}
                items={[
                  channelPhone || DEFAULT_CONTACT.phone,
                  channelEmail || DEFAULT_CONTACT.email,
                ]}
              />
            </dl>

            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href={`/${locale}/request-a-quote`}>
                {dictionary.nav.requestQuote}
              </ButtonLink>
              <a
                href={DEALER_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 border border-border bg-transparent px-5 py-2.5 text-sm font-semibold tracking-wide text-foreground no-underline transition hover:border-accent hover:text-accent"
              >
                {dictionary.nav.dealerLogin}
              </a>
            </div>
          </aside>

          <div className="border-t border-border py-8 sm:border-t-0 sm:py-12 lg:py-16 lg:ps-12">
            <h2 className="font-display text-3xl text-foreground">
              {dictionary.contactPage.writeUs}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
              {dictionary.contactPage.writeUsDescription}
            </p>
            <div className="mt-8 border border-border bg-surface p-5 sm:p-7">
              <ContactForm labels={dictionary.forms} locale={locale} />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="grid lg:grid-cols-2">
          {LOCATIONS.map((location, index) => {
            const isFactory = location.id === 'factory'
            return (
              <div
                key={location.id}
                className={index > 0 ? 'border-t border-border lg:border-t-0 lg:border-s' : undefined}
              >
                <ContactMap
                  src={location.mapEmbed}
                  title={isFactory ? dictionary.contactPage.map : dictionary.contactPage.mapIstanbul}
                  label={isFactory ? dictionary.contactPage.factory : dictionary.contactPage.istanbulOffice}
                  mapsUrl={location.mapsUrl}
                  openInMapsLabel={dictionary.contactPage.openInMaps}
                />
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}

function Fact({
  title,
  items,
}: {
  title: string
  items: Array<string | ReactNode>
}) {
  return (
    <div>
      <dt className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">{title}</dt>
      <dd className="mt-3 space-y-1.5 text-sm text-muted">
        {items.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </dd>
    </div>
  )
}
