/**
 * Replaces the home page hero image (hero.desktopImage) with the new
 * composition in migration/assets/hero/home-hero.webp.
 *
 * - Patches every `homePage` document (one per language) and its draft, if any.
 * - Existing alt text is preserved; hotspot/crop of the old image are dropped.
 * - The mobile image is left alone unless --mobile is passed (then it is set to
 *   the same image; the site crops it with object-cover on phones).
 *
 * Defaults to dry-run. Never writes unless --write is passed.
 *
 * Usage:
 *   bun run replace:home-hero
 *   bun run replace:home-hero -- --write
 *   bun run replace:home-hero -- --write --mobile
 *   bun run replace:home-hero -- --write --dataset=development
 */
import {createClient} from '@sanity/client'
import {existsSync, readFileSync} from 'node:fs'
import path from 'node:path'

const IMAGE_FILE = path.resolve(process.cwd(), 'migration/assets/hero/home-hero.webp')

type HomeDoc = {
  _id: string
  language?: string
  hero?: {
    desktopImage?: {asset?: {_ref?: string}; alt?: string}
    mobileImage?: {asset?: {_ref?: string}; alt?: string}
  }
}

function loadEnvFile(filePath: string) {
  if (!existsSync(filePath)) return
  for (const rawLine of readFileSync(filePath, 'utf8').split('\n')) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const separator = line.indexOf('=')
    if (separator <= 0) continue
    const keyName = line.slice(0, separator).trim()
    let value = line.slice(separator + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!(keyName in process.env)) process.env[keyName] = value
  }
}

function getFlagValue(name: string) {
  const prefix = `--${name}=`
  return process.argv.find((argument) => argument.startsWith(prefix))?.slice(prefix.length)
}

async function main() {
  loadEnvFile(path.resolve(process.cwd(), '.env.local'))
  loadEnvFile(path.resolve(process.cwd(), '.env'))

  const write = process.argv.includes('--write')
  const alsoMobile = process.argv.includes('--mobile')
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const token = process.env.SANITY_API_WRITE_TOKEN
  const dataset = getFlagValue('dataset') || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-08-02'
  if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
  if (!token) throw new Error('Missing SANITY_API_WRITE_TOKEN')
  if (!existsSync(IMAGE_FILE)) throw new Error(`Missing image file: ${IMAGE_FILE}`)

  const client = createClient({projectId, dataset, apiVersion, token, useCdn: false})
  const docs = await client.fetch<HomeDoc[]>(
    `*[_type == "homePage"]{_id, language, hero{desktopImage{asset, alt}, mobileImage{asset, alt}}}`,
    {},
    {perspective: 'raw'},
  )

  console.log(`Dataset: ${dataset}`)
  console.log(write ? 'Mode: WRITE' : 'Mode: dry-run (pass --write to apply)')
  console.log(`Mobile image: ${alsoMobile ? 'will be replaced too' : 'left unchanged'}\n`)

  if (docs.length === 0) throw new Error('No homePage documents found')
  for (const doc of docs) {
    console.log(
      `${doc._id} [${doc.language ?? '?'}]\n` +
        `    old desktop: ${doc.hero?.desktopImage?.asset?._ref ?? '—'}\n` +
        `    old mobile : ${doc.hero?.mobileImage?.asset?._ref ?? '—'}`,
    )
  }

  if (!write) {
    console.log('\nDry run only. Nothing was changed.')
    return
  }

  const asset = await client.assets.upload('image', readFileSync(IMAGE_FILE), {
    filename: 'home-hero.webp',
    contentType: 'image/webp',
  })
  console.log(`\nUploaded asset: ${asset._id}`)

  const image = (alt?: string) => ({
    _type: 'image',
    asset: {_type: 'reference', _ref: asset._id},
    ...(alt ? {alt} : {}),
  })

  const transaction = client.transaction()
  for (const doc of docs) {
    transaction.patch(doc._id, (patch) =>
      patch.set({
        'hero.desktopImage': image(doc.hero?.desktopImage?.alt),
        ...(alsoMobile ? {'hero.mobileImage': image(doc.hero?.mobileImage?.alt)} : {}),
      }),
    )
  }
  await transaction.commit({autoGenerateArrayKeys: false})
  console.log(`Updated ${docs.length} document(s).`)
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
