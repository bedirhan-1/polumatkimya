import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {PageHero} from '@/components/content/page-hero'
import {SectionHeading} from '@/components/content/section-heading'
import {getDictionary} from '@/lib/i18n/get-dictionary'
import {isLocale, locales, type Locale} from '@/lib/i18n/locales'
import {asSeo, asString} from '@/lib/sanity/content'
import {buildPageMetadata} from '@/lib/seo/metadata'
import {getExportPage} from '@/sanity/lib/export-page'

type PageProps = {
  params: Promise<{locale: string}>
}

type ExportContact = {
  _key?: string | null
  name?: string | null
  role?: string | null
  phone?: string | null
  email?: string | null
}

type ExportPageData = {
  eyebrow?: string | null
  title?: string | null
  intro?: string | null
  countryCount?: string | null
  countryLabel?: string | null
  activityEyebrow?: string | null
  activityTitle?: string | null
  activityDescription?: string | null
  activities?: Array<{
    _key?: string | null
    title?: string | null
    description?: string | null
  } | null> | null
  contactEyebrow?: string | null
  contactTitle?: string | null
  contactDescription?: string | null
  leadContact?: ExportContact | null
  regionalContacts?: Array<ExportContact | null> | null
  /** @deprecated Prefer leadContact + regionalContacts */
  contacts?: Array<ExportContact | null> | null
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
  contact: ExportContact | null | undefined,
  fallbackKey: string,
  fallbackRole: string,
): ResolvedContact | null {
  if (!contact?.name || !contact.phone) return null
  return {
    _key: contact._key || fallbackKey,
    name: contact.name,
    role: contact.role || fallbackRole,
    phone: contact.phone,
    email: contact.email?.trim() || '',
  }
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
      className={`relative h-full overflow-hidden border border-border bg-background ${
        featured ? 'p-7 sm:p-9 lg:p-10' : 'p-6 sm:p-7'
      }`}
    >
      <div className={`absolute inset-y-0 start-0 bg-accent ${featured ? 'w-1.5' : 'w-1'}`} aria-hidden />
      <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">{contact.role}</p>
      <h2
        className={`mt-3 font-display leading-tight text-foreground ${
          featured ? 'text-3xl sm:text-4xl' : 'text-xl sm:text-2xl'
        }`}
      >
        {contact.name}
      </h2>
      <div className={`grid gap-5 ${featured ? 'mt-8 sm:mt-10 sm:grid-cols-2' : 'mt-7'}`}>
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">{phoneLabel}</p>
          <a
            href={phoneHref}
            className={`mt-2 inline-flex min-h-11 items-center gap-2 border px-4 py-2.5 text-sm font-semibold no-underline transition sm:text-base ${
              featured
                ? 'border-accent bg-accent text-white shadow-[0_0_24px_var(--accent-glow)] hover:brightness-110'
                : 'border-border bg-surface text-foreground hover:border-accent hover:text-accent'
            }`}
            dir="ltr"
          >
            {contact.phone}
            <span aria-hidden>→</span>
          </a>
        </div>
        {contact.email ? (
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">{emailLabel}</p>
            <a
              href={`mailto:${contact.email}`}
              className="mt-2 inline-flex min-h-11 items-center gap-2 border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground no-underline transition hover:border-accent hover:text-accent sm:text-base"
              dir="ltr"
            >
              {contact.email}
              <span aria-hidden>→</span>
            </a>
          </div>
        ) : null}
      </div>
    </article>
  )
}

function EmptyTeamSlot({label}: {label: string}) {
  return (
    <div className="flex min-h-[12rem] items-center justify-center border border-dashed border-border bg-background/60 px-5 py-8 text-center sm:min-h-[14rem]">
      <p className="max-w-[12rem] text-xs font-semibold tracking-[0.14em] text-muted uppercase">
        {label}
      </p>
    </div>
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
    getExportPage(localeParam),
  ])
  const data = page && typeof page === 'object' ? (page as ExportPageData) : null

  return buildPageMetadata({
    locale: localeParam,
    fallbackTitle: asString(data?.title, dictionary.exportPage.title),
    fallbackDescription: asString(data?.intro, dictionary.exportPage.intro),
    seo: asSeo(data?.seo),
    path: '/export',
  })
}

export default async function ExportPage({params}: PageProps) {
  const {locale: localeParam} = await params
  if (!isLocale(localeParam)) notFound()

  const locale = localeParam as Locale
  const [dictionary, page] = await Promise.all([
    getDictionary(locale),
    getExportPage(locale),
  ])
  const data = page && typeof page === 'object' ? (page as ExportPageData) : null

  const fallbackActivities = [
    {
      _key: 'distributor-network',
      title: dictionary.exportPage.initiative1Title,
      description: dictionary.exportPage.initiative1Body,
    },
    {
      _key: 'new-markets',
      title: dictionary.exportPage.initiative2Title,
      description: dictionary.exportPage.initiative2Body,
    },
    {
      _key: 'private-label',
      title: dictionary.exportPage.initiative3Title,
      description: dictionary.exportPage.initiative3Body,
    },
  ]
  const activities =
    data?.activities
      ?.flatMap((activity, index) => {
        if (!activity?.title) return []
        return [
          {
            _key: activity._key || `activity-${index}`,
            title: activity.title,
            description: activity.description || '',
          },
        ]
      }) || fallbackActivities

  const legacyContacts =
    data?.contacts
      ?.map((contact, index) =>
        resolveContact(contact, `legacy-contact-${index}`, dictionary.exportPage.contactRole),
      )
      .filter((contact): contact is ResolvedContact => Boolean(contact)) || []

  const leadContact =
    resolveContact(data?.leadContact, 'lead-contact', dictionary.exportPage.leadRole) ||
    legacyContacts[0] || {
      _key: 'lead-contact',
      name: dictionary.exportPage.leadName,
      role: dictionary.exportPage.leadRole,
      phone: '+90 555 555 55 55',
      email: 'export@polumat.com',
    }

  const regionalFromCms =
    data?.regionalContacts
      ?.map((contact, index) =>
        resolveContact(contact, `regional-${index}`, dictionary.exportPage.regionalRole),
      )
      .filter((contact): contact is ResolvedContact => Boolean(contact)) || []

  const regionalContacts =
    regionalFromCms.length > 0
      ? regionalFromCms.slice(0, 3)
      : legacyContacts.length > 1
        ? legacyContacts.slice(1, 4)
        : [
            {
              _key: 'regional-1',
              name: dictionary.exportPage.regionalName,
              role: dictionary.exportPage.regionalRole,
              phone: '+90 555 555 55 56',
              email: 'export@polumat.com',
            },
          ]

  const regionalSlots = Array.from({length: 3}, (_, index) => regionalContacts[index] || null)

  return (
    <main id="main-content">
      <PageHero>
        <p className="animate-product-rise text-xs font-semibold tracking-[0.22em] text-accent uppercase">
          {asString(data?.eyebrow, dictionary.exportPage.eyebrow)}
        </p>
        <h1
          className="animate-product-rise mt-4 max-w-4xl font-display text-[clamp(1.85rem,7vw,3.75rem)] leading-[1.05] text-foreground"
          style={{animationDelay: '60ms'}}
        >
          {asString(data?.title, dictionary.exportPage.title)}
        </h1>
        <p
          className="animate-product-rise mt-4 max-w-3xl text-base leading-relaxed text-muted sm:text-lg"
          style={{animationDelay: '120ms'}}
        >
          {asString(data?.intro, dictionary.exportPage.intro)}
        </p>
      </PageHero>

      <section className="border-b border-border">
        <div className="container-site grid lg:grid-cols-[0.72fr_1.28fr]">
          <div className="relative overflow-hidden border-border bg-accent px-6 py-10 text-white sm:px-10 sm:py-14 lg:border-e lg:py-20">
            <div
              className="pointer-events-none absolute -end-16 -top-20 h-64 w-64 rounded-full border border-white/15"
              aria-hidden
            />
            <p className="relative font-display text-[clamp(4.5rem,15vw,8.5rem)] leading-none tracking-[-0.06em]">
              {asString(data?.countryCount, '50+')}
            </p>
            <p className="relative mt-4 max-w-xs text-sm font-semibold tracking-[0.18em] text-white/85 uppercase sm:text-base">
              {asString(data?.countryLabel, dictionary.exportPage.countryLabel)}
            </p>
          </div>

          <div className="border-t border-border py-10 sm:py-14 lg:border-t-0 lg:py-20 lg:ps-14">
            <SectionHeading
              eyebrow={asString(data?.activityEyebrow, dictionary.exportPage.activityEyebrow)}
              heading={asString(data?.activityTitle, dictionary.exportPage.activityTitle)}
              description={asString(
                data?.activityDescription,
                dictionary.exportPage.activityDescription,
              )}
            />

            <ol className="mt-10 grid gap-px border border-border bg-border md:grid-cols-3">
              {activities.map((activity, index) => (
                <li key={activity._key} className="bg-background p-6 sm:p-7">
                  <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h2 className="mt-5 font-display text-xl leading-tight text-foreground sm:text-2xl">
                    {activity.title}
                  </h2>
                  {activity.description ? (
                    <p className="mt-3 text-sm leading-relaxed text-muted">{activity.description}</p>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface/45">
        <div className="container-site py-10 sm:py-14 lg:py-20">
          <SectionHeading
            eyebrow={asString(data?.contactEyebrow, dictionary.exportPage.contactEyebrow)}
            heading={asString(data?.contactTitle, dictionary.exportPage.contactTitle)}
            description={asString(
              data?.contactDescription,
              dictionary.exportPage.contactDescription,
            )}
          />

          <div className="mt-10 flex flex-col gap-4">
            <ContactCard
              contact={leadContact}
              phoneLabel={dictionary.exportPage.phoneLabel}
              emailLabel={dictionary.exportPage.emailLabel}
              featured
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {regionalSlots.map((contact, index) =>
                contact ? (
                  <ContactCard
                    key={contact._key}
                    contact={contact}
                    phoneLabel={dictionary.exportPage.phoneLabel}
                    emailLabel={dictionary.exportPage.emailLabel}
                  />
                ) : (
                  <EmptyTeamSlot
                    key={`empty-slot-${index}`}
                    label={dictionary.exportPage.openSlot}
                  />
                ),
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
