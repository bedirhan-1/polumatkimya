export type VideoProvider = 'youtube' | 'vimeo' | 'mux'

export type EmbedInfo = {
  provider: VideoProvider
  embedUrl: string
  watchUrl?: string
}

function youtubeId(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.replace(/^\//, '') || null
    }
    if (parsed.hostname.includes('youtube.com')) {
      return parsed.searchParams.get('v') || parsed.pathname.split('/embed/')[1]?.split('/')[0] || null
    }
  } catch {
    return null
  }
  return null
}

function vimeoId(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (!parsed.hostname.includes('vimeo.com')) return null
    const parts = parsed.pathname.split('/').filter(Boolean)
    return parts[0] || null
  } catch {
    return null
  }
  return null
}

export function resolveVideoEmbed(input: {
  provider?: string | null
  externalUrl?: string | null
  playbackId?: string | null
}): EmbedInfo | null {
  const provider = input.provider as VideoProvider | null | undefined

  if (provider === 'mux' && input.playbackId) {
    return {
      provider: 'mux',
      embedUrl: `https://player.mux.com/${input.playbackId}`,
      watchUrl: `https://player.mux.com/${input.playbackId}`,
    }
  }

  if (!input.externalUrl) return null

  if (provider === 'youtube' || (!provider && youtubeId(input.externalUrl))) {
    const id = youtubeId(input.externalUrl)
    if (!id) return null
    return {
      provider: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`,
      watchUrl: `https://www.youtube.com/watch?v=${id}`,
    }
  }

  if (provider === 'vimeo' || (!provider && vimeoId(input.externalUrl))) {
    const id = vimeoId(input.externalUrl)
    if (!id) return null
    return {
      provider: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1`,
      watchUrl: `https://vimeo.com/${id}`,
    }
  }

  return null
}
