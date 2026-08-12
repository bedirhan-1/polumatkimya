/**
 * Puts MDF Kit Activator first in the homepage 6-product grid (TR/EN/AR).
 *
 *   npx tsx migration/scripts/pin-home-mdf-kit.ts
 *   npx tsx migration/scripts/pin-home-mdf-kit.ts --dataset=all
 */
import {createClient} from '@sanity/client'
import {existsSync, readFileSync} from 'node:fs'
import path from 'node:path'

function loadEnvFile(filePath: string) {
  if (!existsSync(filePath)) return
  for (const rawLine of readFileSync(filePath, 'utf8').split('\n')) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq <= 0) continue
    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!(key in process.env)) process.env[key] = value
  }
}

loadEnvFile(path.resolve(process.cwd(), '.env.local'))
loadEnvFile(path.resolve(process.cwd(), '.env'))

const MDF_SLUG = 'mdf-kit-activator'

async function pinDataset(dataset: string) {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!projectId || !token) throw new Error('Missing Sanity credentials')

  const client = createClient({
    projectId,
    dataset,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-08-02',
    token,
    useCdn: false,
  })

  const mdf = await client.fetch<{_id: string} | null>(
    `*[_type=="product" && slug.current==$slug][0]{_id}`,
    {slug: MDF_SLUG},
  )
  if (!mdf?._id) throw new Error(`Product not found: ${MDF_SLUG}`)

  const homes = await client.fetch<
    Array<{
      _id: string
      language?: string
      products?: Array<{_key?: string; _ref?: string; _type?: string; slug?: string}>
    }>
  >(
    `*[_type=="homePage"]{
      _id,
      language,
      "products": productsSection.products[]{_key, _type, _ref, "slug": @->slug.current}
    }`,
  )

  console.log(`\nPinning ${MDF_SLUG} first → ${dataset}`)

  for (const home of homes) {
    const current = (home.products || []).filter((item) => item._ref)
    if (!current.length) {
      console.log(`- ${home._id}: no products`)
      continue
    }

    const mdfRef = current.find((item) => item.slug === MDF_SLUG || item._ref === mdf._id)
    const others = current.filter((item) => item.slug !== MDF_SLUG && item._ref !== mdf._id)
    const next = [
      mdfRef || {_type: 'reference', _ref: mdf._id, _key: mdfRef?._key},
      ...others,
    ]
      .filter((item): item is NonNullable<typeof item> => Boolean(item?._ref))
      .slice(0, 6)
      .map((item, index) => ({
        _type: 'reference' as const,
        _ref: item._ref as string,
        _key: item._key || `featured-${index}`,
      }))

    await client
      .patch(home._id)
      .set({'productsSection.products': next})
      .commit({autoGenerateArrayKeys: false})
    try {
      await client.delete(`drafts.${home._id}`)
    } catch {
      // ignore
    }

    const order = next.map((item) => {
      const match = current.find((row) => row._ref === item._ref)
      return match?.slug || item._ref
    })
    console.log(`✓ ${home._id} (${home.language}) → ${order.join(', ')}`)
  }
}

async function main() {
  const arg = process.argv.find((item) => item.startsWith('--dataset='))
  const requested = arg?.split('=')[1] || process.env.NEXT_PUBLIC_SANITY_DATASET || 'development'
  const datasets = requested === 'all' ? ['development', 'production'] : [requested]
  for (const dataset of datasets) {
    await pinDataset(dataset)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
