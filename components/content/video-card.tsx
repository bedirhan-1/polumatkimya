import {LazyVideoEmbed} from '@/components/content/lazy-video-embed'

export type VideoCardData = {
  _id: string
  title?: string | null
  description?: string | null
  provider?: string | null
  externalUrl?: string | null
  playbackId?: string | null
  coverImage?: {asset?: {_ref?: string}; alt?: string | null} | null
}

type VideoCardProps = {
  video: VideoCardData
  playLabel: string
}

export function VideoCard({video, playLabel}: VideoCardProps) {
  return (
    <article className="overflow-hidden border border-border bg-surface">
      <LazyVideoEmbed
        title={video.title}
        provider={video.provider}
        externalUrl={video.externalUrl}
        playbackId={video.playbackId}
        coverImage={video.coverImage}
        playLabel={playLabel}
      />
      <div className="p-5">
        {video.title ? <h2 className="font-display text-xl text-foreground">{video.title}</h2> : null}
        {video.description ? <p className="mt-2 text-sm text-muted">{video.description}</p> : null}
      </div>
    </article>
  )
}
