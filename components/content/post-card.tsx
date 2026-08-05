import Link from 'next/link'

import {SanityImage} from '@/components/content/sanity-image'
import type {Locale} from '@/lib/i18n/locales'

export type PostCardData = {
  _id: string
  title?: string | null
  slug?: string | null
  excerpt?: string | null
  publishedAt?: string | null
  category?: string | null
  author?: string | null
  coverImage?: {asset?: {_ref?: string}; alt?: string | null} | null
}

type PostCardProps = {
  locale: Locale
  post: PostCardData
  readMoreLabel: string
  dateLocale: string
}

export function PostCard({locale, post, readMoreLabel, dateLocale}: PostCardProps) {
  if (!post.slug || !post.title) return null

  const dateLabel = post.publishedAt
    ? new Intl.DateTimeFormat(dateLocale, {year: 'numeric', month: 'short', day: 'numeric'}).format(
        new Date(post.publishedAt),
      )
    : null

  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className="group flex h-full flex-col border border-border bg-surface no-underline transition hover:border-accent"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-elevated">
        <SanityImage
          image={post.coverImage}
          fill
          className="object-cover transition group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs tracking-wide text-muted uppercase">
          {post.category ? <span className="text-accent">{post.category}</span> : null}
          {dateLabel ? <span dir="ltr">{dateLabel}</span> : null}
        </div>
        <h2 className="font-display text-xl text-foreground">{post.title}</h2>
        {post.excerpt ? <p className="line-clamp-3 text-sm text-muted">{post.excerpt}</p> : null}
        <span className="mt-auto pt-3 text-sm font-semibold text-accent">{readMoreLabel}</span>
      </div>
    </Link>
  )
}
