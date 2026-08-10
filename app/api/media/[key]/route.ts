import {NextResponse} from 'next/server'

import {ensureR2ImageByKey, readR2Object} from '@/lib/r2/ensure-image'
import {getR2PublicUrl, objectKeyToSanityCdnUrl} from '@/lib/r2/sanity-asset'
import {isR2WriteConfigured} from '@/lib/r2/env'

export const runtime = 'nodejs'

type RouteContext = {
  params: Promise<{key: string}>
}

/**
 * Ensure object is on R2 (upload from Sanity on miss), then stream bytes from R2.
 * next/image requires a real image body from local routes — no redirects.
 */
export async function GET(request: Request, context: RouteContext) {
  const {key: rawKey} = await context.params
  const key = decodeURIComponent(rawKey)

  if (!objectKeyToSanityCdnUrl(key)) {
    return NextResponse.json({error: 'Invalid media key'}, {status: 400})
  }

  if (!isR2WriteConfigured()) {
    return NextResponse.json(
      {
        error:
          'R2 credentials are not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY.',
      },
      {status: 503},
    )
  }

  try {
    await ensureR2ImageByKey(key)

    const wantJson = new URL(request.url).searchParams.get('format') === 'json'
    if (wantJson) {
      return NextResponse.json({
        key,
        url: getR2PublicUrl(key),
        source: 'r2',
      })
    }

    const {buffer, contentType} = await readR2Object(key)
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Source': 'cloudflare-r2',
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error(`[r2] media route failed for ${key}:`, message)
    return NextResponse.json({error: message, key}, {status: 500})
  }
}
