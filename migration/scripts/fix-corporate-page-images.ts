/**
 * Removes duplicate imageTextSection images on corporate pages
 * (hero already shows the page photo).
 *
 *   npx tsx migration/scripts/fix-corporate-page-images.ts --dataset=all
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

const CORPORATE_SLUGS = [
  'about',
  'mission-and-vision',
  'quality-certificates',
  'environmental-responsibility',
  'occupational-health-and-safety',
  'customer-satisfaction',
  'human-resources',
]

async function fixDataset(dataset: string) {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!projectId || !token) throw new Error('Missing Sanity project id or write token')

  const client = createClient({
    projectId,
    dataset,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-08-02',
    token,
    useCdn: false,
  })

  console.log(`\nFixing corporate page images → ${dataset}`)

  const pages = await client.fetch<
    Array<{
      _id: string
      slug: string
      pageBuilder?: Array<{
        _key: string
        _type: string
        heading?: string
        body?: unknown
        image?: unknown
        [key: string]: unknown
      }>
    }>
  >(
    `*[_type=="page" && slug.current in $slugs]{_id, "slug": slug.current, pageBuilder}`,
    {slugs: CORPORATE_SLUGS},
  )

  for (const page of pages) {
    if (!page.pageBuilder?.length) continue
    const next = page.pageBuilder.map((block) => {
      if (block._type !== 'imageTextSection') return block
      const {_key, _type, body, cta} = block
      return {
        _key,
        _type,
        body,
        ...(cta ? {cta} : {}),
      }
    })
    await client.patch(page._id).set({pageBuilder: next}).commit()
    try {
      await client.delete(`drafts.${page._id}`)
    } catch {
      // ignore
    }
    console.log(`✓ ${page.slug} ${page._id}`)
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
