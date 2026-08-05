import {LazyVideoEmbed} from '@/components/content/lazy-video-embed'
import {SectionHeading} from '@/components/content/section-heading'

type VideoSectionProps = {
  block: {
    _key: string
    heading?: string | null
    description?: string | null
    videos?: Array<{
      _id: string
      title?: string | null
      description?: string | null
      provider?: string | null
      externalUrl?: string | null
      playbackId?: string | null
      coverImage?: {asset?: {_ref?: string}; alt?: string | null} | null
    }> | null
  }
  playLabel: string
}

export function VideoSection({block, playLabel}: VideoSectionProps) {
  return (
    <section className="border-b border-border section-space">
      <div className="container-site flex flex-col gap-10">
        <SectionHeading heading={block.heading} description={block.description} />
        {block.videos?.length ? (
          <ul className="grid gap-6 sm:grid-cols-2">
            {block.videos.map((video) => (
              <li key={video._id} className="overflow-hidden border border-border bg-surface">
                <LazyVideoEmbed
                  title={video.title}
                  provider={video.provider}
                  externalUrl={video.externalUrl}
                  playbackId={video.playbackId}
                  coverImage={video.coverImage}
                  playLabel={playLabel}
                />
                <div className="p-5">
                  {video.title ? (
                    <h3 className="font-display text-xl text-foreground">{video.title}</h3>
                  ) : null}
                  {video.description ? (
                    <p className="mt-2 text-sm text-muted">{video.description}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}
