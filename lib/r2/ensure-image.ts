import {GetObjectCommand, HeadObjectCommand, PutObjectCommand} from '@aws-sdk/client-s3'

import {getR2Client} from './client'
import {
  contentTypeForKey,
  getR2ObjectKey,
  getR2PublicUrl,
  objectKeyToSanityCdnUrl,
  type SanityAssetLike,
} from './sanity-asset'
import {getR2BucketName, isR2WriteConfigured} from './env'

/** Per-instance memo so concurrent renders don't re-check / re-upload the same key. */
const ensuredKeys = new Set<string>()
const inFlight = new Map<string, Promise<string>>()

function isNotFound(error: unknown) {
  const name = error instanceof Error ? error.name : ''
  const status = (error as {$metadata?: {httpStatusCode?: number}})?.$metadata?.httpStatusCode
  return name === 'NotFound' || name === 'NoSuchKey' || status === 404
}

async function headObject(key: string) {
  await getR2Client().send(
    new HeadObjectCommand({
      Bucket: getR2BucketName(),
      Key: key,
    }),
  )
}

async function uploadFromSanity(key: string) {
  const sanityUrl = objectKeyToSanityCdnUrl(key)
  if (!sanityUrl) {
    throw new Error(`Invalid R2 object key: ${key}`)
  }

  const response = await fetch(sanityUrl)
  if (!response.ok) {
    throw new Error(`Failed to download Sanity asset (${response.status}): ${sanityUrl}`)
  }

  const body = Buffer.from(await response.arrayBuffer())
  const contentType = response.headers.get('content-type') || contentTypeForKey(key)

  await getR2Client().send(
    new PutObjectCommand({
      Bucket: getR2BucketName(),
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  )
}

/**
 * Ensure the Sanity asset exists in the R2 bucket (upload once on miss via S3 API).
 * Returns the public R2 URL when configured (for metadata); serving uses S3 GetObject.
 */
export async function ensureR2ImageByKey(key: string): Promise<string> {
  if (!isR2WriteConfigured()) {
    throw new Error(
      'R2 credentials missing. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY.',
    )
  }

  const publicUrl = getR2PublicUrl(key) || key

  if (ensuredKeys.has(key)) return publicUrl

  const existing = inFlight.get(key)
  if (existing) return existing

  const task = (async () => {
    try {
      await headObject(key)
      ensuredKeys.add(key)
      return publicUrl
    } catch (error) {
      if (!isNotFound(error)) throw error
    }

    await uploadFromSanity(key)
    ensuredKeys.add(key)
    return publicUrl
  })().finally(() => {
    inFlight.delete(key)
  })

  inFlight.set(key, task)
  return task
}

export async function ensureR2Image(
  source: SanityAssetLike | string | null | undefined,
): Promise<string | null> {
  const key = getR2ObjectKey(source)
  if (!key) return null
  return ensureR2ImageByKey(key)
}

/** Read object bytes from R2 (after ensure). Does not touch Sanity CDN. */
export async function readR2Object(key: string) {
  if (!isR2WriteConfigured()) {
    throw new Error('R2 credentials missing')
  }

  const response = await getR2Client().send(
    new GetObjectCommand({
      Bucket: getR2BucketName(),
      Key: key,
    }),
  )

  const bytes = await response.Body?.transformToByteArray()
  if (!bytes?.byteLength) {
    throw new Error(`Empty R2 object: ${key}`)
  }

  return {
    buffer: Buffer.from(bytes),
    contentType: response.ContentType || contentTypeForKey(key),
  }
}
