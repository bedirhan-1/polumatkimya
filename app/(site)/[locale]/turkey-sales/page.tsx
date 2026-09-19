import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {PageHero} from '@/components/content/page-hero'
import {SectionHeading} from '@/components/content/section-heading'
import {TurkeySalesMap} from '@/components/content/turkey-sales-map'
import {getDictionary} from '@/lib/i18n/get-dictionary'
import {isLocale, locales, type Locale} from '@/lib/i18n/locales'
import {asSeo, asString} from '@/lib/sanity/content'
import {buildPageMetadata} from '@/lib/seo/metadata'
import {getTurkeySalesPage} from '@/sanity/lib/turkey-sales-page'

type PageProps = {
  params: Promise<{locale: string}>
}

type SalesContact = {
  _key?: string | null
  name?: string | null
  role?: string | null
  phone?: string | null
  email?: string | null
}

type TurkeySalesPageData = {
  eyebrow?: string | null
  title?: string | null
  intro?: string | null
  mapTitle?: string | null
  mapDescription?: string | null
  highlights?: Array<{
    _key?: string | null
    title?: string | null
    description?: string | null
  } | null> | null
  contactEyebrow?: string | null
  contactTitle?: string | null
  contactDescription?: string | null
  contacts?: Array<SalesContact | null> | null
  seo?: unknown
}

type ResolvedContact = {
  _key: string
  name: string
  role: string
  phone: string
  email: string
}

function resolveContact(
  contact: SalesContact | null | undefined,
  fallbackKey: string,
): ResolvedContact | null {
  if (!contact?.name || !contact.phone) return null
  return {
    _key: contact._key || fallbackKey,
    name: contact.name,
    role: contact.role?.trim() || '',
    phone: contact.phone,
    email: contact.email?.trim() || '',
  }
}

function teamGridClass(count: number) {
  if (count <= 1) return 'grid gap-4'
  if (count === 2) return 'grid gap-4 sm:grid-cols-2'
  return 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
}

function ContactCard({
  contact,
  phoneLabel,
  emailLabel,
  featured = false,
}: {
  contact: ResolvedContact
  phoneLabel: string
  emailLabel: string
  featured?: boolean
}) {
  const phoneHref = `tel:${contact.phone.replace(/[^\d+]/g, '')}`

  return (
    <article
      className={`relative h-full border border-border bg-background ${
        featured ? 'p-6 sm:p-8' : 'p-6 sm:p-7'
      }`}
    >
      <div className={`absolute inset-y-0 start-0 bg-accent ${featured ? 'w-1.5' : 'w-1'}`} aria-hidden />
      {contact.role ? (
        <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">{contact.role}</p>
      ) : null}
      <h2
        className={`font-display leading-tight text-foreground ${contact.role ? 'mt-3' : ''} ${
          featured ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
        }`}
      >
        {contact.name}
      </h2>
      <div className={`grid gap-5 ${featured ? 'mt-7 sm:mt-8' : 'mt-7'}`}>
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">{phoneLabel}</p>
          <a
            href={phoneHref}
            className={`mt-2 inline-flex w-full min-h-11 items-center justify-between gap-3 border px-4 py-2.5 text-sm font-semibold whitespace-nowrap no-underline transition ${
              featured
                ? 'border-accent bg-accent text-white shadow-[0_0_24px_var(--accent-glow)] hover:brightness-110'
                : 'border-border bg-surface text-foreground hover:border-accent hover:text-accent'
            }`}
            dir="ltr"
          >
            <span>{contact.phone}</span>
            <span aria-hidden>→</span>
          </a>
        </div>
        {contact.email ? (
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">{emailLabel}</p>
            <a
              href={`mailto:${contact.email}`}
              className="mt-2 inline-flex w-full min-h-11 items-center justify-between gap-3 border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground whitespace-nowrap no-underline transition hover:border-accent hover:text-accent"
              dir="ltr"
            >
              <span className="truncate">{contact.email}</span>
              <span className="shrink-0" aria-hidden>
                →
              </span>
            </a>
          </div>
        ) : null}
      </div>
    </article>
  )
}

export function generateStaticParams() {
  return locales.map((locale) => ({locale}))
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale: localeParam} = await params
  if (!isLocale(localeParam)) return {}

  const [dictionary, page] = await Promise.all([
    getDictionary(localeParam),
    getTurkeySalesPage(localeParam),
  ])
  const data = page && typeof page === 'object' ? (page as TurkeySalesPageData) : null

  return buildPageMetadata({
    locale: localeParam,
    fallbackTitle: asString(data?.title, dictionary.turkeySalesPage.title),
    fallbackDescription: asString(data?.intro, dictionary.turkeySalesPage.intro),
    seo: asSeo(data?.seo),
    path: '/turkey-sales',
  })
}

export default async function TurkeySalesPage({params}: PageProps) {
  const {locale: localeParam} = await params
  if (!isLocale(localeParam)) notFound()

  const locale = localeParam as Locale
  const [dictionary, page] = await Promise.all([
    getDictionary(locale),
    getTurkeySalesPage(locale),
  ])
  const data = page && typeof page === 'object' ? (page as TurkeySalesPageData) : null

  const fallbackHighlights = [
    {
      _key: 'nationwide',
      title: dictionary.turkeySalesPage.highlight1Title,
      description: dictionary.turkeySalesPage.highlight1Body,
    },
    {
      _key: 'partners',
      title: dictionary.turkeySalesPage.highlight2Title,
      description: dictionary.turkeySalesPage.highlight2Body,
    },
    {
      _key: 'support',
      title: dictionary.turkeySalesPage.highlight3Title,
      description: dictionary.turkeySalesPage.highlight3Body,
    },
  ]
  const highlights =
    data?.highlights
      ?.flatMap((item, index) => {
        if (!item?.title) return []
        return [
          {
            _key: item._key || `highlight-${index}`,
            title: item.title,
            description: item.description || '',
          },
        ]
      }) || fallbackHighlights

  const contacts =
    data?.contacts
      ?.map((contact, index) => resolveContact(contact, `contact-${index}`))
      .filter((contact): contact is ResolvedContact => Boolean(contact)) || []

  const [featuredContact, ...teamContacts] = contacts
  const mapTitle = asString(data?.mapTitle, dictionary.turkeySalesPage.mapTitle)

  return (
    <main id="main-content">
      <PageHero>
        <p className="animate-product-rise text-xs font-semibold tracking-[0.22em] text-accent uppercase">
          {asString(data?.eyebrow, dictionary.turkeySalesPage.eyebrow)}
        </p>
        <h1
          className="animate-product-rise mt-4 max-w-4xl font-display text-[clamp(1.85rem,7vw,3.75rem)] leading-[1.05] text-foreground"
          style={{animationDelay: '60ms'}}
        >
          {asString(data?.title, dictionary.turkeySalesPage.title)}
        </h1>
        <p
          className="animate-product-rise mt-4 max-w-3xl text-base leading-relaxed text-muted sm:text-lg"
          style={{animationDelay: '120ms'}}
        >
          {asString(data?.intro, dictionary.turkeySalesPage.intro)}
        </p>
      </PageHero>

      <section className="border-b border-border">
        <div className="container-site grid lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative overflow-hidden border-border bg-surface px-6 py-10 sm:px-10 sm:py-14 lg:border-e lg:py-16">
            <div
              className="pointer-events-none absolute -end-10 -top-16 h-56 w-56 rounded-full border border-border"
              aria-hidden
            />
            <p className="relative text-xs font-semibold tracking-[0.2em] text-accent uppercase">
              {mapTitle}
            </p>
            <p className="relative mt-3 max-w-md text-sm leading-relaxed text-muted">
              {asString(data?.mapDescription, dictionary.turkeySalesPage.mapDescription)}
            </p>

            <div className="relative mt-8 sm:mt-10">
              <TurkeySalesMap
                title={mapTitle}
                factoryLabel={dictionary.turkeySalesPage.mapFactoryLabel}
                istanbulLabel={dictionary.turkeySalesPage.mapIstanbulLabel}
              />
            </div>
          </div>

          <div className="border-t border-border py-10 sm:py-14 lg:border-t-0 lg:py-16 lg:ps-12">
            <SectionHeading
              eyebrow={asString(data?.contactEyebrow, dictionary.turkeySalesPage.contactEyebrow)}
              heading={asString(data?.contactTitle, dictionary.turkeySalesPage.contactTitle)}
              description={asString(
                data?.contactDescription,
                dictionary.turkeySalesPage.contactDescription,
              )}
            />

            {featuredContact ? (
              <div className="mt-8 flex flex-col gap-4">
                <ContactCard
                  contact={featuredContact}
                  phoneLabel={dictionary.turkeySalesPage.phoneLabel}
                  emailLabel={dictionary.turkeySalesPage.emailLabel}
                  featured
                />

                {teamContacts.length > 0 ? (
                  <div className={teamGridClass(teamContacts.length)}>
                    {teamContacts.map((contact) => (
                      <ContactCard
                        key={contact._key}
                        contact={contact}
                        phoneLabel={dictionary.turkeySalesPage.phoneLabel}
                        emailLabel={dictionary.turkeySalesPage.emailLabel}
                        featured={teamContacts.length === 1}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface/45">
        <div className="container-site py-10 sm:py-14 lg:py-20">
          <ol className="grid gap-px border border-border bg-border md:grid-cols-3">
            {highlights.map((item, index) => (
              <li key={item._key} className="bg-background p-6 sm:p-7">
                <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h2 className="mt-5 font-display text-xl leading-tight text-foreground sm:text-2xl">
                  {item.title}
                </h2>
                {item.description ? (
                  <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  )
}
