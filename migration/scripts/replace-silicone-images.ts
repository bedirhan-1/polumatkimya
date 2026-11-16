/**
 * Replaces `cardImage` and `packshot` of the products in the new "Silikon Grubu"
 * catalog page and "Otomotiv Grubu" catalog pages (rendered at 600 dpi) with the new product renders.
 *
 * Assets live in migration/assets/silicone:
 *   <key>-packshot.png  transparent product render  → product.packshot
 *   <key>-card.jpg      4:3 dark composite          → product.cardImage
 *
 * Existing alt texts are preserved. Hotspot/crop of the old image are dropped.
 * Published documents are patched; an existing draft is patched too so Studio
 * does not show stale images. Drafts are never created.
 *
 * Defaults to dry-run. Never writes unless --write is passed.
 *
 * Usage:
 *   bun run replace:silicone-images
 *   bun run replace:silicone-images -- --only=universal-silicone
 *   bun run replace:silicone-images -- --write
 *   bun run replace:silicone-images -- --write --dataset=development
 */
import {createClient, type SanityClient} from '@sanity/client'
import {existsSync, readFileSync} from 'node:fs'
import path from 'node:path'

type Mapping = {slug: string; key: string; label: string}

/** Sanity product slug → asset key. Slug must match exactly. */
const MAPPINGS: Mapping[] = [
  {slug: 'siliconized-sealant', key: 'siliconized-sealant', label: 'P400 Silikonize Mastik'},
  {slug: 'universal-silicone', key: 'universal-silicone', label: 'P104 Universal Silikon'},
  {slug: 'shower-enclosure-silicone', key: 'shower-enclosure-silicone', label: 'P102 Duşakabin Silikonu'},
  {slug: 'high-tack-adhesive', key: 'high-tack-adhesive', label: 'P105 High-Tack Silikon'},
  {slug: 'mirror-silicone', key: 'mirror-silicone', label: 'P103 Ayna Silikonu'},
  {slug: 'high-temperature-rtv-silicone', key: 'high-temperature-rtv-silicone', label: 'P50 RTV Yüksek Isı Silikonu'},
  {slug: 'aquarium-silicone', key: 'aquarium-silicone', label: 'P101 Akvaryum Silikonu'},
  {slug: 'grout-filler', key: 'grout-filler', label: 'P-DZ40 Derz Dolgu'},
  // Otomotiv Grubu
  {slug: 'rust-remover-spray', key: 'rust-remover-spray', label: 'Pas Sökücü Sprey'},
  {slug: 'brake-cleaner-spray', key: 'brake-cleaner-spray', label: 'Fren Balata Temizleyici Sprey'},
  {slug: 'mdf-kit-activator', key: 'mdf-kit-activator', label: 'MDF Kit Hızlı Yapıştırıcı'},
  {slug: 'engine-cleaner-spray', key: 'engine-cleaner-spray', label: 'Motor Temizleme Spreyi'},
  {slug: 'chain-lubricant-spray', key: 'chain-lubricant-spray', label: 'Sıvı Gres Zincir Yağlayıcı Sprey'},
  {slug: 'tire-shine-spray', key: 'tire-shine-spray', label: 'Lastik Parlatıcı Sprey'},
  {slug: 'dashboard-polish-spray', key: 'dashboard-polish-spray', label: 'Torpido Parlatıcı Sprey'},
]

/** In the PDF, but no Sanity product mapped yet — confirm slugs before adding. */
const UNMAPPED_ASSETS = [
  {key: 'pu-sealant-sausage', label: 'Poliüretan Mastik Sosis'},
  {key: 'pu-sealant-280', label: 'Poliüretan Mastik 280 ml'},
  {key: 'pu-foam', label: 'Foam Köpük 750 ml'},
  {key: 'montage-fix', label: 'Montage Fix'},
]

const ASSET_DIR = path.resolve(process.cwd(), 'migration/assets/silicone')

type ImageValue = {asset?: {_ref?: string}; alt?: unknown} | null | undefined
type ProductDoc = {
  _id: string
  _rev: string
  slug?: {current?: string}
  cardImage?: ImageValue
  packshot?: ImageValue
}

function loadEnvFile(filePath: string) {
  if (!existsSync(filePath)) return
  for (const rawLine of readFileSync(filePath, 'utf8').split('\n')) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const separator = line.indexOf('=')
    if (separator <= 0) continue
    const key = line.slice(0, separator).trim()
    let value = line.slice(separator + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!(key in process.env)) process.env[key] = value
  }
}

function getFlagValue(name: string) {
  const prefix = `--${name}=`
  return process.argv.find((argument) => argument.startsWith(prefix))?.slice(prefix.length)
}

function getClient(): {client: SanityClient; dataset: string} {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = getFlagValue('dataset') || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
  const token = process.env.SANITY_API_WRITE_TOKEN
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-08-02'

  if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
  if (!token) throw new Error('Missing SANITY_API_WRITE_TOKEN')

  return {client: createClient({projectId, dataset, apiVersion, token, useCdn: false}), dataset}
}

async function fetchProduct(client: SanityClient, slug: string) {
  const docs = await client.fetch<ProductDoc[]>(
    `*[_type == "product" && slug.current == $slug]{_id, _rev, slug, cardImage, packshot}`,
    {slug},
    {perspective: 'raw'},
  )
  const published = docs.find((doc) => !doc._id.startsWith('drafts.'))
  const draft = docs.find((doc) => doc._id.startsWith('drafts.'))
  return {published, draft}
}

async function upload(client: SanityClient, filename: string, contentType: string) {
  const filePath = path.join(ASSET_DIR, filename)
  if (!existsSync(filePath)) throw new Error(`Missing asset file: ${filePath}`)
  const asset = await client.assets.upload('image', readFileSync(filePath), {filename, contentType})
  return asset._id
}

function imageValue(assetId: string, alt: unknown) {
  return {
    _type: 'image',
    asset: {_type: 'reference', _ref: assetId},
    ...(alt ? {alt} : {}),
  }
}

async function main() {
  loadEnvFile(path.resolve(process.cwd(), '.env.local'))
  loadEnvFile(path.resolve(process.cwd(), '.env'))

  const write = process.argv.includes('--write')
  const only = getFlagValue('only')
  const {client, dataset} = getClient()
  const mappings = only ? MAPPINGS.filter((mapping) => mapping.slug === only) : MAPPINGS

  if (only && mappings.length === 0) throw new Error(`No mapping for slug: ${only}`)

  console.log(`Dataset: ${dataset}`)
  console.log(write ? 'Mode: WRITE' : 'Mode: dry-run (pass --write to apply)')
  console.log('')

  let updated = 0
  const missing: string[] = []

  for (const mapping of mappings) {
    const {published, draft} = await fetchProduct(client, mapping.slug)
    if (!published) {
      missing.push(mapping.slug)
      console.log(`✗ ${mapping.label}: no published product with slug "${mapping.slug}"`)
      continue
    }

    console.log(
      `✓ ${mapping.label} → ${published._id}${draft ? ' (+ draft)' : ''}\n` +
        `    old card: ${published.cardImage?.asset?._ref ?? '—'}\n` +
        `    old pack: ${published.packshot?.asset?._ref ?? '—'}`,
    )

    if (!write) continue

    const cardId = await upload(client, `${mapping.key}-card.jpg`, 'image/jpeg')
    const packId = await upload(client, `${mapping.key}-packshot.png`, 'image/png')

    const transaction = client.transaction()
    for (const doc of [published, draft]) {
      if (!doc) continue
      transaction.patch(doc._id, (patch) =>
        patch.set({
          cardImage: imageValue(cardId, doc.cardImage?.alt ?? published.cardImage?.alt),
          packshot: imageValue(packId, doc.packshot?.alt ?? published.packshot?.alt),
        }),
      )
    }
    await transaction.commit({autoGenerateArrayKeys: false})
    updated += 1
    console.log(`    new card: ${cardId}\n    new pack: ${packId}`)
  }

  console.log('')
  if (missing.length) console.log(`Slugs not found in Sanity: ${missing.join(', ')}`)
  console.log(
    `Assets in the PDF with no mapped product: ${UNMAPPED_ASSETS.map((asset) => asset.label).join(', ')}`,
  )
  console.log(write ? `Updated ${updated} product(s).` : 'Dry run only. Nothing was changed.')
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
