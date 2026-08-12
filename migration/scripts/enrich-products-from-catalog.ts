/**
 * Enrich all Sanity products from the official Polumat catalog PDF data.
 * Updates title, shortDescription, body, benefits, features, packaging, specs
 * in TR/EN/AR. Preserves images, categories, documents, status, slug.
 *
 *   npx tsx migration/scripts/enrich-products-from-catalog.ts
 *   npx tsx migration/scripts/enrich-products-from-catalog.ts --dataset=all
 *   npx tsx migration/scripts/enrich-products-from-catalog.ts --dry-run
 */
import {createClient, type SanityClient} from '@sanity/client'
import {randomBytes} from 'node:crypto'
import {existsSync, readFileSync} from 'node:fs'
import path from 'node:path'

import {localizedPortableText, localizedString, localizedText} from './lib'
import {CATALOG_PRODUCTS, type CatalogProduct, type Loc} from './catalog-enrichment-data'
import {uiCopy} from './product-field-i18n'

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

loadEnvFile(path.resolve(process.cwd(), '.env.local'))
loadEnvFile(path.resolve(process.cwd(), '.env'))

function key() {
  return randomBytes(6).toString('hex')
}

function feature(title: Loc, description: Loc) {
  return {
    _key: key(),
    _type: 'featureItem',
    title: localizedString(title),
    description: localizedText(description),
  }
}

function packagingVariant(item: CatalogProduct['packaging'][number]) {
  return {
    _key: key(),
    _type: 'packagingVariant',
    label: localizedString(item.label),
    volume: item.volume,
  }
}

function specificationItem(item: CatalogProduct['specs'][number]) {
  return {
    _key: key(),
    _type: 'specificationItem',
    label: localizedString(item.label),
    value: localizedString(item.value),
    ...(item.unit ? {unit: localizedString(item.unit)} : {}),
    ...(item.note ? {note: localizedString(item.note)} : {}),
  }
}

function buildPatch(catalog: CatalogProduct) {
  return {
    title: localizedString(catalog.title),
    shortDescription: localizedText(catalog.shortDescription),
    body: localizedPortableText({
      tr: catalog.body.tr,
      en: catalog.body.en,
      ar: catalog.body.ar,
    }),
    benefits: catalog.benefits.map((item) => feature(item.title, item.description)),
    features: catalog.features.map((item) => feature(item.title, item.description)),
    packagingVariants: catalog.packaging.map(packagingVariant),
    specificationGroups: [
      {
        _key: key(),
        _type: 'specificationGroup',
        title: localizedString(uiCopy.specsHeading),
        items: catalog.specs.map(specificationItem),
      },
    ],
  }
}

async function enrichDataset(client: SanityClient, dryRun: boolean) {
  const products = await client.fetch<Array<{_id: string; slug?: string | null}>>(
    `*[_type == "product"]{_id, "slug": slug.current}`,
  )
  const bySlug = new Map(products.map((product) => [product.slug || '', product._id]))

  let updated = 0
  let skipped = 0

  for (const catalog of CATALOG_PRODUCTS) {
    const id = bySlug.get(catalog.slug)
    if (!id) {
      console.log(`· missing in Sanity: ${catalog.slug}`)
      skipped += 1
      continue
    }

    const patch = buildPatch(catalog)
    if (dryRun) {
      console.log(
        `DRY ${catalog.slug}: benefits=${patch.benefits.length} features=${patch.features.length} specs=${catalog.specs.length} packs=${catalog.packaging.length}`,
      )
      updated += 1
      continue
    }

    await client.patch(id).set(patch).commit({autoGenerateArrayKeys: false})
    try {
      await client.delete(`drafts.${id}`)
    } catch {
      // ignore
    }
    console.log(`✓ ${catalog.slug}`)
    updated += 1
  }

  // Products in Sanity but not in catalog (e.g. mold-release) — leave untouched
  for (const product of products) {
    if (!CATALOG_PRODUCTS.some((entry) => entry.slug === product.slug)) {
      console.log(`~ not in catalog (kept as-is): ${product.slug}`)
    }
  }

  console.log(`Updated ${updated} · skipped ${skipped}`)
}

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!projectId || !token) throw new Error('Missing Sanity project id or write token')

  const dryRun = process.argv.includes('--dry-run')
  const datasetArg = process.argv.find((argument) => argument.startsWith('--dataset='))
  const requested =
    datasetArg?.slice('--dataset='.length) ||
    process.env.NEXT_PUBLIC_SANITY_DATASET ||
    'development'
  const datasets = requested === 'all' ? ['development', 'production'] : [requested]

  for (const dataset of datasets) {
    console.log(`\n=== ${dataset}${dryRun ? ' (dry-run)' : ''} ===`)
    const client = createClient({
      projectId,
      dataset,
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-08-02',
      token,
      useCdn: false,
    })
    await enrichDataset(client, dryRun)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
