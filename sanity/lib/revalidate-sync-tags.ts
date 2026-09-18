'use server'

import type {SyncTag} from '@sanity/client'
import {revalidateSyncTags as defaultRevalidateSyncTags} from 'next-sanity/live/server-actions'

/**
 * next-sanity's default action returns void, so `<SanityLive />` never calls
 * `router.refresh()` after tag invalidation. Return `'refresh'` so open tabs
 * update immediately on publish.
 */
export async function revalidateSyncTagsAndRefresh(
  tags: SyncTag[],
): Promise<'refresh'> {
  await defaultRevalidateSyncTags(tags)
  return 'refresh'
}
