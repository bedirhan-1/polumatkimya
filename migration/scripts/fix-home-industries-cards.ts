/**
 * Migrates homePage.industriesSection.areas from bare references
 * to { area, title?, summary? } objects, and ensures text fields exist.
 *
 * Usage:
 *   npx tsx migration/scripts/fix-home-industries-cards.ts
 *   npx tsx migration/scripts/fix-home-industries-cards.ts --dataset=all
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

const COPY: Record<
  string,
  {
    eyebrow: string
    title: string
    description: string
    detailLabel: string
    viewAll: string
  }
> = {
  tr: {
    eyebrow: 'Uygulama alanları',
    title: 'Her sektör için güvenilir bakım çözümleri',
    description: 'Sektöre özel ürün önerileri ve uygulama senaryolarını keşfedin.',
    detailLabel: 'Çözümleri keşfet',
    viewAll: 'Tüm uygulama alanları',
  },
  en: {
    eyebrow: 'Application areas',
    title: 'Reliable maintenance solutions for every sector',
    description: 'Discover sector-specific product recommendations and application scenarios.',
    detailLabel: 'Explore solutions',
    viewAll: 'All application areas',
  },
  ar: {
    eyebrow: 'مجالات التطبيق',
    title: 'حلول صيانة موثوقة لكل قطاع',
    description: 'اكتشف توصيات المنتجات وسيناريوهات التطبيق لكل قطاع.',
    detailLabel: 'استكشف الحلول',
    viewAll: 'كل مجالات التطبيق',
  },
}

function normalizeAreas(areas: unknown) {
  if (!Array.isArray(areas)) return []
  return areas.flatMap((item) => {
    if (!item || typeof item !== 'object') return []

    // Already new shape
    if ('area' in item && (item as {area?: {_ref?: string}}).area?._ref) {
      const row = item as {
        _key?: string
        title?: string
        summary?: string
        area: {_type?: string; _ref: string; _weak?: boolean}
      }
      return [
        {
          _type: 'homeIndustryCard',
          _key: typeof row._key === 'string' ? row._key : key(),
          area: {
            _type: 'reference',
            _ref: row.area._ref,
            ...(row.area._weak ? {_weak: true} : {}),
          },
          ...(row.title ? {title: row.title} : {}),
          ...(row.summary ? {summary: row.summary} : {}),
        },
      ]
    }

    // Legacy bare reference
    if ('_ref' in item && typeof (item as {_ref?: unknown})._ref === 'string') {
      const row = item as {_key?: string; _ref: string; _weak?: boolean}
      return [
        {
          _type: 'homeIndustryCard',
          _key: typeof row._key === 'string' ? row._key : key(),
          area: {
            _type: 'reference',
            _ref: row._ref,
            ...(row._weak ? {_weak: true} : {}),
          },
        },
      ]
    }

    return []
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
      industriesSection?: {
        eyebrow?: string
        title?: string
        description?: string
        detailLabel?: string
        viewAllCta?: unknown
        areas?: unknown
      } | null
    }>
  >(`*[_type=="homePage"]{_id, language, industriesSection}`)

  console.log(`\nFixing home industries section → ${dataset} (${docs.length} docs)`)

  for (const doc of docs) {
    const language = doc.language || 'tr'
    const fallback = COPY[language] || COPY.tr
    const section = doc.industriesSection || {}
    const areas = normalizeAreas(section.areas)

    await client
      .patch(doc._id)
      .set({
        industriesSection: {
          _type: 'homeIndustriesSection',
          eyebrow: section.eyebrow || fallback.eyebrow,
          title: section.title || fallback.title,
          description: section.description || fallback.description,
          detailLabel: section.detailLabel || fallback.detailLabel,
          viewAllCta: section.viewAllCta || {
            _type: 'simpleCallToAction',
            label: fallback.viewAll,
            linkType: 'internal',
            internalPath: '/industries',
            variant: 'secondary',
          },
          areas,
        },
      })
      .commit({autoGenerateArrayKeys: false})

    console.log(`✓ ${doc._id} (${language}) → ${areas.length} cards`)
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
