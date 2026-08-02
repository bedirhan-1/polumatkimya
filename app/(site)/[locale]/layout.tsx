import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import {notFound} from 'next/navigation'
import {VisualEditing} from 'next-sanity/visual-editing'
import type {ReactNode} from 'react'

import {SiteFooter} from '@/components/layout/site-footer'
import {SiteHeader} from '@/components/layout/site-header'
import {getDictionary} from '@/lib/i18n/get-dictionary'
import {getDirection, isLocale, locales, type Locale} from '@/lib/i18n/locales'
import {fontArabic, fontBody, fontDisplay} from '@/lib/fonts'
import {SanityLive} from '@/sanity/lib/live'
import {getSiteSettings, mapHeaderNavigation} from '@/sanity/lib/site-settings'

import '../../globals.css'

type LocaleLayoutProps = {
  children: ReactNode
  params: Promise<{locale: string}>
}

export function generateStaticParams() {
  return locales.map((locale) => ({locale}))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>
}): Promise<Metadata> {
  const {locale: localeParam} = await params
  if (!isLocale(localeParam)) {
    return {}
  }
  const dictionary = await getDictionary(localeParam)
  return {
    title: {
      default: dictionary.meta.siteName,
      template: `%s | ${dictionary.meta.siteName}`,
    },
    description: dictionary.meta.defaultDescription,
  }
}

export default async function LocaleLayout({children, params}: LocaleLayoutProps) {
  const {locale: localeParam} = await params
  if (!isLocale(localeParam)) {
    notFound()
  }

  const locale = localeParam as Locale
  const direction = getDirection(locale)
  const dictionary = await getDictionary(locale)
  const {isEnabled: isDraftMode} = await draftMode()
  const siteSettings = await getSiteSettings(locale)
  const sanityNav = mapHeaderNavigation(locale, siteSettings?.headerNavigation)

  const fontVariables = [
    fontDisplay.variable,
    fontBody.variable,
    locale === 'ar' ? fontArabic.variable : null,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <html lang={locale} dir={direction} className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:inset-inline-start-4 focus:top-4 focus:z-50 focus:bg-surface focus:px-3 focus:py-2"
        >
          {dictionary.a11y.skipToContent}
        </a>
        <SiteHeader locale={locale} dictionary={dictionary} items={sanityNav} />
        <div className="flex-1">{children}</div>
        <SiteFooter locale={locale} dictionary={dictionary} />
        <SanityLive />
        {isDraftMode ? <VisualEditing /> : null}
      </body>
    </html>
  )
}
