/**
 * Migrates homePage.qualitySection.items from plain strings → {label} objects.
 * Also normalizes badges and drops null entries.
 *
 * Usage:
 *   npx tsx migration/scripts/fix-home-quality-items.ts
 *   npx tsx migration/scripts/fix-home-quality-items.ts --dataset=all
 */
import {createClient, type SanityClient} from '@sanity/client'
import {randomBytes} from 'node:crypto'
import {existsSync, readFileSync} from 'node:fs'
import path from 'node:path'

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

function key() {
  return randomBytes(4).toString('hex')
}

function normalizeItems(items: unknown): Array<{_key: string; _type: string; label: string}> {
  if (!Array.isArray(items)) return []
  return items.flatMap((item) => {
    if (typeof item === 'string' && item.trim()) {
      return [{_key: key(), _type: 'homeQualityItem', label: item.trim()}]
    }
    if (item && typeof item === 'object' && 'label' in item) {
      const label = (item as {label?: unknown}).label
      if (typeof label === 'string' && label.trim()) {
        const existingKey =
          typeof (item as {_key?: unknown})._key === 'string'
            ? (item as {_key: string})._key
            : key()
        return [
          {
            _key: existingKey,
            _type: 'homeQualityItem',
            label: label.trim(),
            ...((item as {icon?: unknown}).icon
              ? {icon: (item as {icon: unknown}).icon}
              : {}),
          },
        ]
      }
    }
    return []
  })
}

function normalizeBadges(
  badges: unknown,
): Array<{_key: string; _type: string; label: string; image?: unknown}> {
  if (!Array.isArray(badges)) return []
  return badges.flatMap((item) => {
    if (!item || typeof item !== 'object' || !('label' in item)) return []
    const label = (item as {label?: unknown}).label
    if (typeof label !== 'string' || !label.trim()) return []
    const existingKey =
      typeof (item as {_key?: unknown})._key === 'string'
        ? (item as {_key: string})._key
        : key()
    return [
      {
        _key: existingKey,
        _type: 'homeQualityBadge',
        label: label.trim(),
        ...((item as {image?: unknown}).image
          ? {image: (item as {image: unknown}).image}
          : {}),
      },
    ]
  })
}

async function fixDataset(dataset: string) {
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
  })

  const docs = await client.fetch<
    Array<{
      _id: string
      language?: string
      qualitySection?: {items?: unknown; badges?: unknown} | null
    }>
  >(`*[_type=="homePage"]{_id, language, qualitySection}`)

  console.log(`\nFixing home quality items → ${dataset} (${docs.length} docs)`)

  for (const doc of docs) {
    const items = normalizeItems(doc.qualitySection?.items)
    const badges = normalizeBadges(doc.qualitySection?.badges)
    await client
      .patch(doc._id)
      .set({
        'qualitySection.items': items,
        ...(badges.length ? {'qualitySection.badges': badges} : {}),
      })
      .commit({autoGenerateArrayKeys: false})
    console.log(`✓ ${doc._id} (${doc.language || '?'}) → ${items.length} items`)
  }
}

async function main() {
  const arg = process.argv.find((item) => item.startsWith('--dataset='))
  const requested = arg?.split('=')[1] || process.env.NEXT_PUBLIC_SANITY_DATASET || 'development'
  const datasets = requested === 'all' ? ['development', 'production'] : [requested]
  for (const dataset of datasets) {
    await fixDataset(dataset)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
