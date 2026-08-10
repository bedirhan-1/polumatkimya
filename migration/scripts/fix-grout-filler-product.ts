/**
 * Repairs the corrupted Derz Dolgusu draft and attaches its canonical image.
 *
 * The published document is the source of truth for the product copy. The
 * legacy draft contains pre-v5 internationalized-array values without a
 * `language` property and scraped CSS/navigation content, so it cannot be
 * repaired field-by-field safely.
 *
 * Defaults to dry-run. Never writes unless --write is passed.
 *
 * Usage:
 *   npm run fix:grout-filler
 *   npm run fix:grout-filler -- --write
 *   npm run fix:grout-filler -- --write --dataset=development
 */
import {createClient, type SanityClient} from '@sanity/client'
import {existsSync, readFileSync} from 'node:fs'
import path from 'node:path'

const LEGACY_ID = 'derz-dolgusu'
const CURRENT_SLUG = 'grout-filler'
const IMAGE_URL = 'https://www.polumatkimya.com/images/urunler/1740342195.webp'
const IMAGE_FILENAME = 'derz-dolgusu-1740342195.webp'

type InternationalizedValue = {
  _key?: string
  _type?: string
  language?: string
  value?: unknown
}

type ProductDocument = {
  _id: string
  _type: 'product'
  _rev: string
  _createdAt?: string
  _updatedAt?: string
  legacyId?: string
  slug?: {current?: string}
  title?: InternationalizedValue[]
  shortDescription?: InternationalizedValue[]
  body?: InternationalizedValue[]
  [key: string]: unknown
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

  return {
    client: createClient({projectId, dataset, apiVersion, token, useCdn: false}),
    dataset,
  }
}

function hasInvalidLocalizedValues(values: unknown) {
  return (
    Array.isArray(values) &&
    values.some(
      (item) =>
        typeof item !== 'object' ||
        item === null ||
        !('language' in item) ||
        typeof item.language !== 'string' ||
        !item.language,
    )
  )
}

function portableTextToPlainText(values: unknown) {
  if (!Array.isArray(values)) return ''

  return values
    .flatMap((localizedValue) => {
      if (typeof localizedValue !== 'object' || localizedValue === null) return []
      const value = 'value' in localizedValue ? localizedValue.value : undefined
      if (!Array.isArray(value)) return []
      return value.flatMap((block) => {
        if (typeof block !== 'object' || block === null || !('children' in block)) return []
        if (!Array.isArray(block.children)) return []
        return block.children.flatMap((child) => {
          if (typeof child !== 'object' || child === null || !('text' in child)) return []
          return typeof child.text === 'string' ? [child.text] : []
        })
      })
    })
    .join(' ')
}

function isKnownCorruptedDraft(draft: ProductDocument) {
  const copy = [
    portableTextToPlainText(draft.shortDescription),
    portableTextToPlainText(draft.body),
  ].join(' ')

  return (
    hasInvalidLocalizedValues(draft.title) ||
    hasInvalidLocalizedValues(draft.shortDescription) ||
    hasInvalidLocalizedValues(draft.body) ||
    /position:\s*relative|z-index:\s*\d|background-color:\s*rgba|\.header\s*\{/i.test(copy)
  )
}

function localizedAlt() {
  return [
    {
      _key: 'tr',
      _type: 'internationalizedArrayStringValue',
      language: 'tr',
      value: 'Derz Dolgusu',
    },
    {
      _key: 'en',
      _type: 'internationalizedArrayStringValue',
      language: 'en',
      value: 'Grout Filler',
    },
    {
      _key: 'ar',
      _type: 'internationalizedArrayStringValue',
      language: 'ar',
      value: 'حشو الفواصل',
    },
  ]
}

async function getProduct(client: SanityClient) {
  return client.fetch<ProductDocument | null>(
    `*[
      _type == "product" &&
      !(_id in path("drafts.**")) &&
      (legacyId == $legacyId || slug.current == $slug)
    ][0]`,
    {legacyId: LEGACY_ID, slug: CURRENT_SLUG},
    {perspective: 'raw'},
  )
}

async function getDraft(client: SanityClient, publishedId: string) {
  return client.getDocument<ProductDocument>(`drafts.${publishedId}`)
}

function withoutSystemFields(product: ProductDocument) {
  const content: Omit<ProductDocument, '_id' | '_rev'> &
    Partial<Pick<ProductDocument, '_id' | '_rev'>> = {...product}
  delete content._id
  delete content._rev
  delete content._createdAt
  delete content._updatedAt
  return content
}

async function uploadCanonicalImage(client: SanityClient) {
  const response = await fetch(IMAGE_URL)
  if (!response.ok) {
    throw new Error(`Image download failed (${response.status}): ${IMAGE_URL}`)
  }

  const imageBuffer = Buffer.from(await response.arrayBuffer())
  const asset = await client.assets.upload('image', imageBuffer, {
    filename: IMAGE_FILENAME,
    contentType: response.headers.get('content-type') || 'image/webp',
  })

  return {
    assetId: asset._id,
    image: {
      _type: 'image',
      asset: {_type: 'reference', _ref: asset._id},
      alt: localizedAlt(),
    },
  }
}

async function main() {
  loadEnvFile(path.resolve(process.cwd(), '.env.local'))
  loadEnvFile(path.resolve(process.cwd(), '.env'))

  const write = process.argv.includes('--write')
  const {client, dataset} = getClient()
  const published = await getProduct(client)

  if (!published) {
    throw new Error(`Published product not found: ${LEGACY_ID} / ${CURRENT_SLUG}`)
  }

  const draft = await getDraft(client, published._id)
  const draftIsCorrupted = draft ? isKnownCorruptedDraft(draft) : false

  console.log(`Dataset: ${dataset}`)
  console.log(`Published product: ${published._id}`)
  console.log(`Draft: ${draft ? draft._id : 'none'}`)
  console.log(`Known corrupted draft: ${draftIsCorrupted ? 'yes' : 'no'}`)
  console.log(`Canonical image: ${IMAGE_URL}`)

  if (!write) {
    console.log('Dry run only. Re-run with --write to apply the repair.')
    return
  }

  if (draft && !draftIsCorrupted) {
    throw new Error(
      'The current draft no longer matches the known corruption pattern. Aborting to protect newer edits.',
    )
  }

  const {assetId, image} = await uploadCanonicalImage(client)

  await client
    .transaction()
    .patch(published._id, (patch) =>
      patch.ifRevisionId(published._rev).set({cardImage: image, packshot: image}),
    )
    .createOrReplace({
      ...withoutSystemFields(published),
      _id: `drafts.${published._id}`,
      cardImage: image,
      packshot: image,
    })
    .commit({autoGenerateArrayKeys: false})

  console.log(`Uploaded asset: ${assetId}`)
  console.log('Repaired the published product image and replaced the corrupted draft with clean content.')
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
