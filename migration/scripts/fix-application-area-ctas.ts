/**
 * Repairs incomplete applicationArea.cta objects (empty i18n values, missing linkType).
 *
 * Usage:
 *   npx tsx migration/scripts/fix-application-area-ctas.ts
 *   npx tsx migration/scripts/fix-application-area-ctas.ts --dataset=production
 */
import {createClient} from '@sanity/client'
import {existsSync, readFileSync} from 'node:fs'
import path from 'node:path'

import {localizedString} from './lib'
import {uiCopy} from './product-field-i18n'

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

function productCta() {
  return {
    _type: 'callToAction',
    label: localizedString(uiCopy.ctaLabel),
    variant: 'primary',
    link: {
      _type: 'internalOrExternalLink',
      label: localizedString(uiCopy.ctaLabel),
      linkType: 'internal',
      internalPath: '/request-a-quote',
      openInNewTab: false,
    },
  }
}

function hasLocalizedValues(value: unknown): boolean {
  if (!Array.isArray(value)) return false
  return value.some(
    (item) =>
      item &&
      typeof item === 'object' &&
      typeof (item as {value?: string}).value === 'string' &&
      (item as {value: string}).value.trim().length > 0,
  )
}

function ctaNeedsRepair(cta: unknown): boolean {
  if (!cta || typeof cta !== 'object') return false
  const value = cta as {
    label?: unknown
    link?: {linkType?: string; label?: unknown; internalPath?: string}
  }
  if (!hasLocalizedValues(value.label)) return true
  if (!value.link) return true
  if (!value.link.linkType) return true
  if (value.link.linkType === 'internal' && !value.link.internalPath?.trim()) return true
  if (!hasLocalizedValues(value.link.label)) return true
  return false
}

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

  console.log(`\nFixing application area CTAs → ${dataset}`)

  const areas = await client.fetch<Array<{_id: string; slug: string; cta?: unknown}>>(
    `*[_type=="applicationArea"]{ _id, "slug": slug.current, cta }`,
    {},
    {perspective: 'raw'},
  )

  let fixed = 0
  for (const area of areas) {
    if (!ctaNeedsRepair(area.cta)) continue
    await client.patch(area._id).set({cta: productCta()}).commit({autoGenerateArrayKeys: true})
    console.log(`- repaired ${area.slug} (${area._id})`)
    fixed += 1
  }

  if (fixed === 0) console.log('- no incomplete CTAs found')
}

async function main() {
  const arg = process.argv.find((item) => item.startsWith('--dataset='))
  const dataset =
    arg?.split('=')[1] || process.env.NEXT_PUBLIC_SANITY_DATASET || 'development'
  await fixDataset(dataset)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
