import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {Breadcrumbs} from '@/components/content/breadcrumbs'
import {PostCard, type PostCardData} from '@/components/content/post-card'
import {SectionHeading} from '@/components/content/section-heading'
import {getDictionary} from '@/lib/i18n/get-dictionary'
import {isLocale, locales, type Locale} from '@/lib/i18n/locales'
import {buildPageMetadata} from '@/lib/seo/metadata'
import {getPosts} from '@/sanity/lib/content'

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
    fallbackTitle: dictionary.blog.title,
    fallbackDescription: dictionary.blog.description,
    path: '/blog',
  })
}

export default async function BlogIndexPage({params}: PageProps) {
  const {locale: localeParam} = await params
  if (!isLocale(localeParam)) notFound()

  const locale = localeParam as Locale
  const dictionary = await getDictionary(locale)
  const postsRaw = await getPosts(locale)
  const posts = (Array.isArray(postsRaw) ? postsRaw : []) as PostCardData[]
  const dateLocale = locale === 'tr' ? 'tr-TR' : locale === 'ar' ? 'ar' : 'en-GB'

  return (
    <main id="main-content">
      <section className="border-b border-border section-space">
        <div className="container-site flex flex-col gap-10">
          <Breadcrumbs
            label={dictionary.blog.breadcrumbs}
            items={[
              {href: `/${locale}`, label: dictionary.common.home},
              {label: dictionary.blog.title},
            ]}
          />
          <SectionHeading
            as="h1"
            heading={dictionary.blog.title}
            description={dictionary.blog.description}
          />

          {posts.length ? (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <li key={post._id}>
                  <PostCard
                    locale={locale}
                    post={post}
                    readMoreLabel={dictionary.blog.readMore}
                    dateLocale={dateLocale}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="border border-border bg-surface px-5 py-8 text-sm text-muted">
              {dictionary.blog.empty}
            </p>
          )}
        </div>
      </section>
    </main>
  )
}
