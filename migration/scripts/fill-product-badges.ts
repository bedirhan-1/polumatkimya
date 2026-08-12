/**
 * Fills empty product badge fields from the primary category.
 *
 *   npx tsx migration/scripts/fill-product-badges.ts
 *   npx tsx migration/scripts/fill-product-badges.ts --write
 *   npx tsx migration/scripts/fill-product-badges.ts --write --dataset=all
 */
import {createClient, type SanityClient} from '@sanity/client'
import {randomBytes} from 'node:crypto'
import {existsSync, readFileSync} from 'node:fs'
import path from 'node:path'

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

const LANGUAGES = ['tr', 'en', 'ar'] as const
type Language = (typeof LANGUAGES)[number]
type LocalizedCopy = Record<Language, string>
type I18nItem = {language?: string; value?: string}

const BADGE_BY_CATEGORY: Record<string, LocalizedCopy> = {
  'industrial-sprays': uiCopy.badgeSpray,
  'construction-chemicals': uiCopy.badgeConstruction,
}

function arrayKey() {
  return randomBytes(6).toString('hex')
}

function localizedString(values: LocalizedCopy) {
  return LANGUAGES.map((language) => ({
    _key: arrayKey(),
    _type: 'internationalizedArrayStringValue',
    language,
    value: values[language],
  }))
}

function hasBadge(items: I18nItem[] | undefined) {
  return (items || []).some((item) => Boolean(item.value?.trim()))
}

function getClient(dataset: string): SanityClient {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!projectId || !token) throw new Error('Missing Sanity credentials')
  return createClient({
    projectId,
    dataset,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-08-02',
    token,
    useCdn: false,
  })
}

async function fillDataset(dataset: string, write: boolean) {
  const client = getClient(dataset)
  const products = await client.fetch<
    Array<{
      _id: string
      slug?: string
      title?: string
      badge?: I18nItem[]
      categorySlug?: string
    }>
  >(`*[_type=="product" && !(_id in path("drafts.**"))]{
    _id,
    "slug": slug.current,
    "title": title[language=="tr" || _key=="tr"][0].value,
    badge,
    "categorySlug": primaryCategory->slug.current
  } | order(title asc)`)

  console.log(`\n${dataset} (${write ? 'write' : 'dry-run'})`)

  for (const product of products) {
    if (hasBadge(product.badge)) continue
    const copy = product.categorySlug ? BADGE_BY_CATEGORY[product.categorySlug] : undefined
    if (!copy) {
      console.log(`- skip ${product.slug}: no badge mapping for ${product.categorySlug || 'missing category'}`)
      continue
    }
    console.log(`- ${product.slug} → ${copy.tr}`)
    if (!write) continue
    await client.patch(product._id).set({badge: localizedString(copy)}).commit()
    try {
      await client.delete(`drafts.${product._id}`)
    } catch {
      // ignore missing drafts
    }
  }
}

async function main() {
  const write = process.argv.includes('--write')
  const arg = process.argv.find((item) => item.startsWith('--dataset='))
  const requested = arg?.split('=')[1] || process.env.NEXT_PUBLIC_SANITY_DATASET || 'development'
  const datasets = requested === 'all' ? ['development', 'production'] : [requested]
  for (const dataset of datasets) {
    await fillDataset(dataset, write)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
