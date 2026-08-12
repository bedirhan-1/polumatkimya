import type {Metadata} from 'next'
import type {ReactNode} from 'react'
import {notFound} from 'next/navigation'

import {PageHero} from '@/components/content/page-hero'
import {ContactMap} from '@/components/content/contact-map'
import {ContactForm} from '@/components/forms/contact-form'
import {ButtonLink} from '@/components/ui/button-link'
import {getDictionary} from '@/lib/i18n/get-dictionary'
import {isLocale, locales, type Locale} from '@/lib/i18n/locales'
import {DEFAULT_CONTACT, DEALER_PORTAL_URL} from '@/lib/navigation'
import {asSeo, asString} from '@/lib/sanity/content'
import {buildPageMetadata} from '@/lib/seo/metadata'
import {getContactPage} from '@/sanity/lib/pages'

type PageProps = {
  params: Promise<{locale: string}>
}

type ContactPageData = {
  eyebrow?: string | null
  title?: string | null
  intro?: string | null
  phonesSectionTitle?: string | null
  emailsSectionTitle?: string | null
  corporateSectionTitle?: string | null
  corporatePhone?: string | null
  corporateEmail?: string | null
  phones?: Array<{
    _key?: string | null
    label?: string | null
    phone?: string | null
  } | null> | null
  emails?: Array<{
    _key?: string | null
    label?: string | null
    email?: string | null
  } | null> | null
  locations?: Array<{
    _key?: string | null
    locationId?: string | null
    label?: string | null
    addressLine?: string | null
    city?: string | null
    postalCode?: string | null
    mapEmbedUrl?: string | null
    mapsUrl?: string | null
    mapTitle?: string | null
  } | null> | null
  formTitle?: string | null
  formDescription?: string | null
  openInMapsLabel?: string | null
  seo?: unknown
}

const FALLBACK_PHONES = [
  {labelKey: 'factory' as const, value: '+90 372 615 77 70'},
  {labelKey: 'mobile' as const, value: '+90 533 897 28 24'},
  {labelKey: 'mobile' as const, value: '+90 543 877 81 35'},
]

const FALLBACK_EMAILS = [
  {labelKey: 'factory' as const, value: 'fabrika@polumatkimya.com'},
  {labelKey: 'export' as const, value: 'export@polumat.com'},
]

const FALLBACK_LOCATIONS = [
  {
    locationId: 'factory',
    addressLine: 'Velioğlu OSB Mahallesi, 11 Nolu Sokak No: 3',
    city: 'Çaycuma / Zonguldak',
    postalCode: '67900',
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d24969.54637002056!2d32.134079!3d41.404388!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x409c9df2982d432d%3A0x199446ced2931174!2sPolumat%20Kimya%20San.Tic.Ltd.%C5%9Eti!5e1!3m2!1str!2sus!4v1786290800135!5m2!1str!2sus',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Polumat%20Kimya%20San.Tic.Ltd.%C5%9Eti%20%C3%87aycuma',
  },
  {
    locationId: 'istanbul',
    addressLine: 'İkitelli OSB, Pik Dökümcüler A4 Blok Sk No: 3',
    city: 'Başakşehir / İstanbul',
    postalCode: '34490',
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12026.965978698898!2d28.799019679427147!3d41.096494452493765!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caaf6f18d96aa9%3A0x3f34d103a6f7ecb5!2zxLBraXRlbGxpIE9TQiwgUGlrIETDtmvDvG1jw7xsZXIgQTQgQmxvayBTayBObzozLCAzNDQ5MCBCYcWfYWvFn2VoaXIvxLBzdGFuYnVs!5e0!3m2!1str!2str!4v1786531849261!5m2!1str!2str',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=%C4%B0kitelli%20OSB%20Pik%20D%C3%B6k%C3%BCmc%C3%BCler%20A4%20Blok%20Sk%20No:3%20Ba%C5%9Fak%C5%9Fehir%20%C4%B0stanbul',
  },
] as const

function toTelHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, '')
  return `tel:${digits}`
}

export function generateStaticParams() {
  return locales.map((locale) => ({locale}))
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale: localeParam} = await params
  if (!isLocale(localeParam)) return {}
  const dictionary = await getDictionary(localeParam)
  const page = await getContactPage(localeParam)
  const data = page && typeof page === 'object' ? (page as ContactPageData) : null
  return buildPageMetadata({
    locale: localeParam,
    fallbackTitle: asString(data?.title, dictionary.nav.contact),
    fallbackDescription: asString(data?.intro, dictionary.pages.contactDescription),
    seo: asSeo(data?.seo),
    path: '/contact',
  })
}

export default async function ContactPage({params}: PageProps) {
  const {locale: localeParam} = await params
  if (!isLocale(localeParam)) notFound()

  const locale = localeParam as Locale
  const dictionary = await getDictionary(locale)
  const page = await getContactPage(locale)
  const data = page && typeof page === 'object' ? (page as ContactPageData) : null

  const eyebrow = asString(data?.eyebrow, dictionary.meta.siteName)
  const title = asString(data?.title, dictionary.nav.contact)
  const intro = asString(data?.intro, dictionary.pages.contactDescription)
  const phonesSectionTitle = asString(data?.phonesSectionTitle, dictionary.contactPage.phone)
  const emailsSectionTitle = asString(data?.emailsSectionTitle, dictionary.contactPage.email)
  const corporateSectionTitle = asString(
    data?.corporateSectionTitle,
    dictionary.contactPage.channels,
  )
  const formTitle = asString(data?.formTitle, dictionary.contactPage.writeUs)
  const formDescription = asString(
    data?.formDescription,
    dictionary.contactPage.writeUsDescription,
  )
  const openInMapsLabel = asString(data?.openInMapsLabel, dictionary.contactPage.openInMaps)

  const phones =
    data?.phones
      ?.flatMap((item, index) => {
        if (!item?.phone) return []
        return [
          {
            _key: item._key || `phone-${index}`,
            label: asString(item.label, ''),
            phone: item.phone,
          },
        ]
      }) ??
    FALLBACK_PHONES.map((item, index) => ({
      _key: `fallback-phone-${index}`,
      label:
        item.labelKey === 'factory'
          ? dictionary.contactPage.factory
          : locale === 'en'
            ? 'Mobile'
            : locale === 'ar'
              ? 'الجوال'
              : 'Mobil',
      phone: item.value,
    }))

  const emails =
    data?.emails
      ?.flatMap((item, index) => {
        if (!item?.email) return []
        return [
          {
            _key: item._key || `email-${index}`,
            label: asString(item.label, ''),
            email: item.email,
          },
        ]
      }) ??
    FALLBACK_EMAILS.map((item, index) => ({
      _key: `fallback-email-${index}`,
      label:
        item.labelKey === 'factory'
          ? dictionary.contactPage.factory
          : locale === 'en'
            ? 'Export'
            : locale === 'ar'
              ? 'التصدير'
              : 'Export',
      email: item.value,
    }))

  const locations =
    data?.locations
      ?.flatMap((item, index) => {
        if (!item?.mapEmbedUrl || !item.mapsUrl || !item.addressLine) return []
        return [
          {
            _key: item._key || `location-${index}`,
            locationId: item.locationId || `location-${index}`,
            label: asString(
              item.label,
              item.locationId === 'istanbul'
                ? dictionary.contactPage.istanbulOffice
                : dictionary.contactPage.factory,
            ),
            addressLine: item.addressLine,
            city: asString(item.city, ''),
            postalCode: asString(item.postalCode, ''),
            mapEmbedUrl: item.mapEmbedUrl,
            mapsUrl: item.mapsUrl,
            mapTitle: asString(
              item.mapTitle,
              item.locationId === 'istanbul'
                ? dictionary.contactPage.mapIstanbul
                : dictionary.contactPage.map,
            ),
          },
        ]
      }) ??
    FALLBACK_LOCATIONS.map((item, index) => ({
      _key: `fallback-location-${index}`,
      locationId: item.locationId,
      label:
        item.locationId === 'istanbul'
          ? dictionary.contactPage.istanbulOffice
          : dictionary.contactPage.factory,
      addressLine: item.addressLine,
      city: item.city,
      postalCode: item.postalCode,
      mapEmbedUrl: item.mapEmbedUrl,
      mapsUrl: item.mapsUrl,
      mapTitle:
        item.locationId === 'istanbul'
          ? dictionary.contactPage.mapIstanbul
          : dictionary.contactPage.map,
    }))

  const corporatePhone = asString(data?.corporatePhone, DEFAULT_CONTACT.phone)
  const corporateEmail = asString(data?.corporateEmail, DEFAULT_CONTACT.email)

  return (
    <main id="main-content">
      <PageHero>
        <p className="text-xs font-semibold tracking-[0.22em] text-accent uppercase">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl font-display text-[clamp(1.85rem,7vw,3.75rem)] leading-[1.05] text-foreground">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted sm:text-lg">{intro}</p>
      </PageHero>

      <section className="border-b border-border">
        <div className="container-site grid lg:grid-cols-[0.95fr_1.05fr]">
          <aside className="border-border py-8 sm:py-12 lg:border-e lg:py-16 lg:pe-12">
            <dl className="space-y-8">
              {locations.map((location) => (
                <Fact
                  key={location._key}
                  title={location.label}
                  items={[location.addressLine, location.city, location.postalCode].filter(Boolean)}
                />
              ))}
              <Fact
                title={phonesSectionTitle}
                items={phones.map((item) => (
                  <a
                    key={item._key}
                    href={toTelHref(item.phone)}
                    className="text-foreground no-underline hover:text-accent"
                  >
                    {item.label ? <span className="text-muted">{item.label}: </span> : null}
                    <span dir="ltr" className="inline-block [unicode-bidi:isolate]">
                      {item.phone}
                    </span>
                  </a>
                ))}
              />
              <Fact
                title={emailsSectionTitle}
                items={emails.map((item) => (
                  <a
                    key={item._key}
                    href={`mailto:${item.email}`}
                    className="text-foreground no-underline hover:text-accent"
                  >
                    {item.label ? <span className="text-muted">{item.label}: </span> : null}
                    <span dir="ltr" className="inline-block [unicode-bidi:isolate]">
                      {item.email}
                    </span>
                  </a>
                ))}
              />
              <Fact
                title={corporateSectionTitle}
                items={[
                  <a
                    key="corporate-phone"
                    href={toTelHref(corporatePhone)}
                    className="inline-block text-foreground no-underline hover:text-accent [unicode-bidi:isolate]"
                    dir="ltr"
                  >
                    {corporatePhone}
                  </a>,
                  <a
                    key="corporate-email"
                    href={`mailto:${corporateEmail}`}
                    className="inline-block text-foreground no-underline hover:text-accent [unicode-bidi:isolate]"
                    dir="ltr"
                  >
                    {corporateEmail}
                  </a>,
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
            <h2 className="font-display text-3xl text-foreground">{formTitle}</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{formDescription}</p>
            <div className="mt-8 border border-border bg-surface p-5 sm:p-7">
              <ContactForm labels={dictionary.forms} locale={locale} />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="grid lg:grid-cols-2">
          {locations.map((location, index) => (
            <div
              key={location._key}
              className={index > 0 ? 'border-t border-border lg:border-t-0 lg:border-s' : undefined}
            >
              <ContactMap
                src={location.mapEmbedUrl}
                title={location.mapTitle}
                label={location.label}
                mapsUrl={location.mapsUrl}
                openInMapsLabel={openInMapsLabel}
              />
            </div>
          ))}
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
