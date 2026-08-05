import {PostCard, type PostCardData} from '@/components/content/post-card'
import {SectionHeading} from '@/components/content/section-heading'
import {VideoCard, type VideoCardData} from '@/components/content/video-card'
import type {Locale} from '@/lib/i18n/locales'
import {getLatestPosts, getLatestVideos} from '@/sanity/lib/content'

type LatestContentSectionProps = {
  locale: Locale
  block: {
    _key: string
    heading?: string | null
    description?: string | null
    source?: string | null
  }
  labels: {
    readMore: string
    play: string
    empty: string
  }
  dateLocale: string
}

export async function LatestContentSection({
  locale,
  block,
  labels,
  dateLocale,
}: LatestContentSectionProps) {
  const source = block.source || 'posts'
  const showPosts = source === 'posts' || source === 'both'
  const showVideos = source === 'videos' || source === 'both'

  const [postsRaw, videosRaw] = await Promise.all([
    showPosts ? getLatestPosts(locale, 3) : Promise.resolve(null),
    showVideos ? getLatestVideos(locale, 3) : Promise.resolve(null),
  ])

  const posts = (Array.isArray(postsRaw) ? postsRaw : []) as PostCardData[]
  const videos = (Array.isArray(videosRaw) ? videosRaw : []) as VideoCardData[]
  const hasContent = posts.length > 0 || videos.length > 0

  return (
    <section className="border-b border-border section-space">
      <div className="container-site flex flex-col gap-10">
        <SectionHeading heading={block.heading} description={block.description} />
        {!hasContent ? <p className="text-sm text-muted">{labels.empty}</p> : null}

        {posts.length ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post._id}>
                <PostCard
                  locale={locale}
                  post={post}
                  readMoreLabel={labels.readMore}
                  dateLocale={dateLocale}
                />
              </li>
            ))}
          </ul>
        ) : null}

        {videos.length ? (
          <ul className="grid gap-6 sm:grid-cols-2">
            {videos.map((video) => (
              <li key={video._id}>
                <VideoCard video={video} playLabel={labels.play} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}
