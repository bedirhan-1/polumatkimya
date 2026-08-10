export type VideoProvider = 'youtube' | 'vimeo' | 'mux' | 'cloudflare'

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

/** Build Cloudflare Stream iframe URL from a full URL or video UID + customer code. */
export function resolveCloudflareStreamEmbed(input: {
  externalUrl?: string | null
  playbackId?: string | null
  customerCode?: string | null
}): EmbedInfo | null {
  const customerCode =
    input.customerCode?.trim() ||
    process.env.NEXT_PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE?.trim() ||
    null

  if (input.externalUrl) {
    try {
      const parsed = new URL(input.externalUrl)
      if (!parsed.hostname.includes('cloudflarestream.com')) return null
      const parts = parsed.pathname.split('/').filter(Boolean)
      const uid = parts[0]
      if (!uid) return null
      const embedUrl = new URL(`${parsed.origin}/${uid}/iframe`)
      embedUrl.searchParams.set('autoplay', 'true')
      return {
        provider: 'cloudflare',
        embedUrl: embedUrl.toString(),
        watchUrl: input.externalUrl,
      }
    } catch {
      return null
    }
  }

  const uid = input.playbackId?.trim()
  if (!uid || !customerCode) return null

  const origin = `https://customer-${customerCode.replace(/^customer-/, '')}.cloudflarestream.com`
  const embedUrl = new URL(`${origin}/${uid}/iframe`)
  embedUrl.searchParams.set('autoplay', 'true')

  return {
    provider: 'cloudflare',
    embedUrl: embedUrl.toString(),
    watchUrl: `${origin}/${uid}/watch`,
  }
}

export function resolveVideoEmbed(input: {
  provider?: string | null
  externalUrl?: string | null
  playbackId?: string | null
  customerCode?: string | null
}): EmbedInfo | null {
  const provider = input.provider as VideoProvider | null | undefined

  if (provider === 'mux' && input.playbackId) {
    return {
      provider: 'mux',
      embedUrl: `https://player.mux.com/${input.playbackId}`,
      watchUrl: `https://player.mux.com/${input.playbackId}`,
    }
  }

  if (
    provider === 'cloudflare' ||
    (!provider && input.externalUrl?.includes('cloudflarestream.com'))
  ) {
    const cloudflare = resolveCloudflareStreamEmbed(input)
    if (cloudflare) return cloudflare
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
