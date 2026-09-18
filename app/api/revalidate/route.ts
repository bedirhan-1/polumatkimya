import {revalidatePath, revalidateTag} from 'next/cache'
import {type NextRequest, NextResponse} from 'next/server'
import {parseBody} from 'next-sanity/webhook'

import {locales} from '@/lib/i18n/locales'

type WebhookPayload = {
  _type?: string
  tags?: string[]
}

/**
 * Sanity webhook → on-demand cache bust.
 * Production `defineLive` caches forever (`revalidate: false`) until tags are
 * invalidated. Live events only fire when a browser has `<SanityLive />` open;
 * this endpoint covers publish-with-no-visitors.
 */
export async function POST(req: NextRequest) {
  try {
    const secret = process.env.SANITY_REVALIDATE_SECRET
    if (!secret) {
      return new Response('Missing SANITY_REVALIDATE_SECRET', {status: 500})
    }

    const {isValidSignature, body} = await parseBody<WebhookPayload>(
      req,
      secret,
      true,
    )

    if (!isValidSignature) {
      return new Response('Invalid signature', {status: 401})
    }

    // Default tag applied by defineLive sanityFetch
    revalidateTag('sanity', {expire: 0})
    revalidateTag('sanity:fetch-sync-tags', {expire: 0})

    for (const tag of body?.tags ?? []) {
      if (typeof tag === 'string' && tag.length > 0) {
        revalidateTag(tag, {expire: 0})
      }
    }

    for (const locale of locales) {
      revalidatePath(`/${locale}`, 'layout')
    }

    return NextResponse.json({
      revalidated: true,
      type: body?._type ?? null,
      now: Date.now(),
    })
  } catch (error) {
    return new Response((error as Error).message, {status: 500})
  }
}
