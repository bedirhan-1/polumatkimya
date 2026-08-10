/**
 * Assigns application areas to products based on product use-case research,
 * then syncs each applicationArea.products list from those assignments.
 *
 * Usage:
 *   npx tsx migration/scripts/assign-product-application-areas.ts
 *   npx tsx migration/scripts/assign-product-application-areas.ts --dataset=all
 *   npx tsx migration/scripts/assign-product-application-areas.ts --dataset=all --dry-run
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

/** Product slug → application area slugs (researched use cases). */
const PRODUCT_AREAS: Record<string, string[]> = {
  // Industrial sprays
  'brake-cleaner-spray': [
    'automotive',
    'motorcycle-bicycle',
    'maintenance-technical-service',
    'agriculture-heavy-equipment',
  ],
  'rust-remover-spray': [
    'industry',
    'maintenance-technical-service',
    'agriculture-heavy-equipment',
    'automotive',
  ],
  'engine-cleaner-spray': [
    'automotive',
    'motorcycle-bicycle',
    'agriculture-heavy-equipment',
    'maintenance-technical-service',
  ],
  'chain-lubricant-spray': [
    'motorcycle-bicycle',
    'industry',
    'agriculture-heavy-equipment',
    'maintenance-technical-service',
    'automotive',
  ],
  'contact-cleaner-spray': [
    'electric-electronic',
    'automotive',
    'industry',
    'maintenance-technical-service',
  ],
  'tire-shine-spray': ['automotive', 'motorcycle-bicycle'],
  'dashboard-polish-spray': ['automotive'],
  'mold-release-spray': ['industry'],

  // Sealants / silicones / adhesives (construction area removed)
  'siliconized-sealant': ['industry', 'maintenance-technical-service'],
  'acrylic-sealant': ['industry', 'maintenance-technical-service'],
  'high-temperature-rtv-silicone': [
    'automotive',
    'industry',
    'agriculture-heavy-equipment',
    'maintenance-technical-service',
  ],
  'aquarium-silicone': ['industry'],
  'shower-enclosure-silicone': ['industry', 'maintenance-technical-service'],
  'mirror-silicone': ['industry', 'maintenance-technical-service'],
  'universal-silicone': ['industry', 'maintenance-technical-service', 'automotive'],
  'e-universal-silicone': [
    'electric-electronic',
    'industry',
    'maintenance-technical-service',
  ],
  'high-tack-adhesive': ['industry', 'automotive', 'maintenance-technical-service'],
  'mdf-kit-activator': ['industry', 'maintenance-technical-service'],
  'grout-filler': ['industry', 'maintenance-technical-service'],
}

/** Preferred display order of recommended products per area. */
const AREA_PRODUCT_ORDER: Record<string, string[]> = {
  automotive: [
    'brake-cleaner-spray',
    'engine-cleaner-spray',
    'tire-shine-spray',
    'dashboard-polish-spray',
    'contact-cleaner-spray',
    'chain-lubricant-spray',
    'high-temperature-rtv-silicone',
    'rust-remover-spray',
  ],
  industry: [
    'mold-release-spray',
    'rust-remover-spray',
    'contact-cleaner-spray',
    'chain-lubricant-spray',
    'universal-silicone',
    'high-tack-adhesive',
    'siliconized-sealant',
    'mdf-kit-activator',
  ],
  'maintenance-technical-service': [
    'rust-remover-spray',
    'brake-cleaner-spray',
    'contact-cleaner-spray',
    'chain-lubricant-spray',
    'engine-cleaner-spray',
    'universal-silicone',
    'high-temperature-rtv-silicone',
    'high-tack-adhesive',
  ],
  'electric-electronic': [
    'contact-cleaner-spray',
    'e-universal-silicone',
    'rust-remover-spray',
  ],
  'motorcycle-bicycle': [
    'chain-lubricant-spray',
    'brake-cleaner-spray',
    'engine-cleaner-spray',
    'tire-shine-spray',
    'contact-cleaner-spray',
  ],
  'agriculture-heavy-equipment': [
    'rust-remover-spray',
    'chain-lubricant-spray',
    'engine-cleaner-spray',
    'brake-cleaner-spray',
    'high-temperature-rtv-silicone',
    'contact-cleaner-spray',
  ],
}

async function assignDataset(dataset: string, dryRun: boolean) {
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

  const areas = await client.fetch<Array<{_id: string; slug: string}>>(
    `*[_type=="applicationArea" && !(_id in path("drafts.**"))]{_id, "slug": slug.current}`,
  )
  const areaBySlug = new Map(areas.map((a) => [a.slug, a._id]))

  const products = await client.fetch<Array<{_id: string; slug: string}>>(
    `*[_type=="product" && !(_id in path("drafts.**"))]{_id, "slug": slug.current}`,
  )
  const productBySlug = new Map(products.map((p) => [p.slug, p._id]))

  console.log(`\n[${dataset}] areas=${areas.length} products=${products.length}`)

  const missingAreas = new Set<string>()
  const unmappedProducts: string[] = []

  for (const product of products) {
    const areaSlugs = PRODUCT_AREAS[product.slug]
    if (!areaSlugs) {
      unmappedProducts.push(product.slug)
      continue
    }
    const refs = areaSlugs
      .map((slug) => {
        const id = areaBySlug.get(slug)
        if (!id) {
          missingAreas.add(slug)
          return null
        }
        return {_type: 'reference' as const, _ref: id, _key: key()}
      })
      .filter((item): item is {_type: 'reference'; _ref: string; _key: string} => Boolean(item))

    console.log(`  ${product.slug} → ${areaSlugs.join(', ')}`)
    if (!dryRun) {
      await client.patch(product._id).set({applicationAreas: refs}).commit()
      const draftId = `drafts.${product._id}`
      const draft = await client.getDocument(draftId)
      if (draft) {
        await client.patch(draftId).set({applicationAreas: refs.map((r) => ({...r, _key: key()}))}).commit()
      }
    }
  }

  for (const [areaSlug, preferred] of Object.entries(AREA_PRODUCT_ORDER)) {
    const areaId = areaBySlug.get(areaSlug)
    if (!areaId) {
      missingAreas.add(areaSlug)
      continue
    }
    const assigned = products
      .filter((p) => PRODUCT_AREAS[p.slug]?.includes(areaSlug))
      .map((p) => p.slug)
    const ordered = [
      ...preferred.filter((slug) => assigned.includes(slug)),
      ...assigned.filter((slug) => !preferred.includes(slug)),
    ].slice(0, 8)
    const refs = ordered
      .map((slug) => {
        const id = productBySlug.get(slug)
        return id ? {_type: 'reference' as const, _ref: id, _key: key()} : null
      })
      .filter((item): item is {_type: 'reference'; _ref: string; _key: string} => Boolean(item))

    console.log(`  area ${areaSlug} recommended ← ${ordered.join(', ')}`)
    if (!dryRun) {
      await client.patch(areaId).set({products: refs}).commit()
    }
  }

  if (unmappedProducts.length) {
    console.warn(`[${dataset}] unmapped products: ${unmappedProducts.join(', ')}`)
  }
  if (missingAreas.size) {
    console.warn(`[${dataset}] missing areas: ${[...missingAreas].join(', ')}`)
  }
}

async function main() {
  const dryRun = process.argv.includes('--dry-run')
  const arg = process.argv.find((item) => item.startsWith('--dataset='))
  const requested = arg?.split('=')[1] || process.env.NEXT_PUBLIC_SANITY_DATASET || 'development'
  const datasets = requested === 'all' ? ['development', 'production'] : [requested]
  for (const dataset of datasets) {
    await assignDataset(dataset, dryRun)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
