/**
 * Removes the "Yapı ve inşaat" (slug: construction) application area and
 * all references pointing at it.
 *
 * Usage:
 *   npx tsx migration/scripts/delete-construction-application-area.ts
 *   npx tsx migration/scripts/delete-construction-application-area.ts --dataset=all
 *   npx tsx migration/scripts/delete-construction-application-area.ts --dataset=production --dry-run
 */
import {createClient, type SanityClient} from '@sanity/client'
import {existsSync, readFileSync} from 'node:fs'
import path from 'node:path'

const TARGET_SLUG = 'construction'

function loadEnvFile(filePath: string) {
  if (!existsSync(filePath)) return
  for (const rawLine of readFileSync(filePath, 'utf8').split('\n')) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq <= 0) continue
    const keyName = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!(keyName in process.env)) process.env[keyName] = value
  }
}

loadEnvFile(path.resolve(process.cwd(), '.env.local'))
loadEnvFile(path.resolve(process.cwd(), '.env'))

function stripRefs(value: unknown, targetIds: Set<string>): unknown {
  if (Array.isArray(value)) {
    return value
      .map((item) => stripRefs(item, targetIds))
      .filter((item) => {
        if (!item || typeof item !== 'object') return true
        const ref = (item as {_ref?: unknown})._ref
        if (typeof ref === 'string' && targetIds.has(ref)) return false
        // Drop home industry cards whose area pointed at the deleted doc
        const area = (item as {area?: {_ref?: unknown}}).area
        if (area && typeof area._ref === 'string' && targetIds.has(area._ref)) return false
        return true
      })
  }
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>
    if (typeof obj._ref === 'string' && targetIds.has(obj._ref)) {
      return undefined
    }
    const next: Record<string, unknown> = {}
    for (const [key, child] of Object.entries(obj)) {
      const cleaned = stripRefs(child, targetIds)
      if (cleaned !== undefined) next[key] = cleaned
    }
    return next
  }
  return value
}

async function purgeDataset(dataset: string, dryRun: boolean) {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!projectId || !token) {
    throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN')
  }

  const client: SanityClient = createClient({
    projectId,
    dataset,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-08-02',
    token,
    useCdn: false,
    perspective: 'raw',
  })

  const targets = await client.fetch<Array<{_id: string; title?: unknown}>>(
    `*[_type=="applicationArea" && slug.current==$slug]{_id, title}`,
    {slug: TARGET_SLUG},
  )

  if (!targets.length) {
    console.log(`\n[${dataset}] No applicationArea with slug "${TARGET_SLUG}"`)
    return
  }

  const targetIds = new Set(targets.map((doc) => doc._id))
  // Also cover draft/published pairs
  for (const id of [...targetIds]) {
    targetIds.add(id.startsWith('drafts.') ? id.slice('drafts.'.length) : `drafts.${id}`)
  }

  console.log(
    `\n[${dataset}] Target docs (${targets.length}): ${targets.map((d) => d._id).join(', ')}`,
  )

  const referrers = await client.fetch<Array<{_id: string; _type: string}>>(
    `*[references($ids)]{_id, _type}`,
    {ids: [...targetIds]},
  )

  console.log(`[${dataset}] Referrers: ${referrers.length}`)
  for (const ref of referrers) {
    console.log(`  - ${ref._type} ${ref._id}`)
  }

  if (dryRun) {
    console.log(`[${dataset}] Dry run — no writes`)
    return
  }

  for (const ref of referrers) {
    if (targetIds.has(ref._id)) continue
    const doc = await client.getDocument(ref._id)
    if (!doc) continue
    const {_id, _rev, _createdAt, _updatedAt, ...rest} = doc
    const cleaned = stripRefs(rest, targetIds) as Record<string, unknown>
    await client.createOrReplace({_id, ...cleaned})
    console.log(`✓ stripped refs from ${doc._type} ${_id}`)
  }

  // Re-check before delete
  const remaining = await client.fetch<Array<{_id: string}>>(`*[references($ids)]{_id}`, {
    ids: [...targetIds],
  })
  const blockers = remaining.filter((doc) => !targetIds.has(doc._id))
  if (blockers.length) {
    throw new Error(
      `[${dataset}] Still referenced by: ${blockers.map((d) => d._id).join(', ')}`,
    )
  }

  for (const id of targetIds) {
    try {
      await client.delete(id)
      console.log(`✓ deleted ${id}`)
    } catch (error) {
      // Missing draft/published twin is fine
      const message = error instanceof Error ? error.message : String(error)
      if (/not found|does not exist/i.test(message)) {
        console.log(`· skip missing ${id}`)
        continue
      }
      throw error
    }
  }
}

async function main() {
  const dryRun = process.argv.includes('--dry-run')
  const arg = process.argv.find((item) => item.startsWith('--dataset='))
  const requested = arg?.split('=')[1] || process.env.NEXT_PUBLIC_SANITY_DATASET || 'development'
  const datasets = requested === 'all' ? ['development', 'production'] : [requested]

  for (const dataset of datasets) {
    await purgeDataset(dataset, dryRun)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
