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
  contacts?: Array<{
    _key?: string | null
    name?: string | null
    role?: string | null
    phone?: string | null
  } | null> | null
  seo?: unknown
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
        return [{
          _key: activity._key || `activity-${index}`,
          title: activity.title,
          description: activity.description || '',
        }]
      }) || fallbackActivities

  const fallbackContacts = [
    {
      _key: 'export-contact-1',
      name: dictionary.exportPage.contact1Name,
      role: dictionary.exportPage.contactRole,
      phone: '+90 555 555 55 55',
    },
    {
      _key: 'export-contact-2',
      name: dictionary.exportPage.contact2Name,
      role: dictionary.exportPage.contactRole,
      phone: '+90 555 555 55 56',
    },
  ]
  const contacts =
    data?.contacts
      ?.flatMap((contact, index) => {
        if (!contact?.name || !contact.phone) return []
        return [{
          _key: contact._key || `contact-${index}`,
          name: contact.name,
          role: contact.role || dictionary.exportPage.contactRole,
          phone: contact.phone,
        }]
      }) || fallbackContacts

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
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {activity.description}
                    </p>
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

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {contacts.map((contact) => {
              const phoneHref = `tel:${contact.phone.replace(/[^\d+]/g, '')}`
              return (
                <article
                  key={contact._key}
                  className="relative overflow-hidden border border-border bg-background p-6 sm:p-8"
                >
                  <div className="absolute inset-y-0 start-0 w-1 bg-accent" aria-hidden />
                  <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
                    {contact.role}
                  </p>
                  <h2 className="mt-3 font-display text-2xl text-foreground sm:text-3xl">
                    {contact.name}
                  </h2>
                  <p className="mt-8 text-xs font-semibold tracking-[0.16em] text-muted uppercase">
                    {dictionary.exportPage.phoneLabel}
                  </p>
                  <a
                    href={phoneHref}
                    className="mt-2 inline-flex min-h-11 items-center border border-accent bg-accent px-5 py-2.5 text-base font-semibold text-white no-underline shadow-[0_0_24px_var(--accent-glow)] transition hover:brightness-110"
                    dir="ltr"
                  >
                    {contact.phone}
                    <span aria-hidden>→</span>
                  </a>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
