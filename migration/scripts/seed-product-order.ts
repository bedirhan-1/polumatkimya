/**
 * Creates/updates the `productOrder` singleton from current product sortOrder.
 *
 * Usage:
 *   npx tsx migration/scripts/seed-product-order.ts
 *   npx tsx migration/scripts/seed-product-order.ts --dataset=all
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

async function seedDataset(dataset: string) {
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

  const products = await client.fetch<Array<{_id: string; slug: string; sortOrder?: number}>>(
    `*[_type=="product" && !(_id in path("drafts.**"))]
      | order(coalesce(sortOrder, 9999) asc, coalesce(slug.current, "") asc){
        _id,
        "slug": slug.current,
        sortOrder
      }`,
  )

  const existing = await client.fetch<{products?: Array<{_ref: string}>} | null>(
    `*[_id=="productOrder"][0]{products}`,
  )

  // Keep any already-ordered IDs first (preserve manual order if re-run),
  // then append missing products in sortOrder sequence.
  const existingRefs = (existing?.products || [])
    .map((item) => item._ref)
    .filter((id): id is string => Boolean(id))
  const productIds = new Set(products.map((p) => p._id))
  const kept = existingRefs.filter((id) => productIds.has(id))
  const keptSet = new Set(kept)
  const appended = products.filter((p) => !keptSet.has(p._id)).map((p) => p._id)
  const orderedIds = [...kept, ...appended]

  const refs = orderedIds.map((id) => ({
    _type: 'reference' as const,
    _ref: id,
    _key: key(),
  }))

  await client.createOrReplace({
    _id: 'productOrder',
    _type: 'productOrder',
    title: 'Product order',
    products: refs,
  })

  console.log(
    `[${dataset}] productOrder → ${refs.length} products` +
      (kept.length ? ` (kept ${kept.length}, appended ${appended.length})` : ''),
  )
  for (const [index, id] of orderedIds.entries()) {
    const product = products.find((item) => item._id === id)
    console.log(`  ${String(index + 1).padStart(2, '0')}. ${product?.slug || id}`)
  }
}

async function main() {
  const arg = process.argv.find((item) => item.startsWith('--dataset='))
  const requested = arg?.split('=')[1] || process.env.NEXT_PUBLIC_SANITY_DATASET || 'development'
  const datasets = requested === 'all' ? ['development', 'production'] : [requested]
  for (const dataset of datasets) {
    await seedDataset(dataset)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
