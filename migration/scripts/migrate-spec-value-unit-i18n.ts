/**
 * Convert product specification value/unit fields to internationalized arrays
 * and fill TR/EN/AR copy for every product (including missing spec groups).
 *
 *   npx tsx migration/scripts/migrate-spec-value-unit-i18n.ts
 *   npx tsx migration/scripts/migrate-spec-value-unit-i18n.ts --dataset=all
 *   npx tsx migration/scripts/migrate-spec-value-unit-i18n.ts --dataset=production
 */
import {createClient, type SanityClient} from '@sanity/client'
import {randomBytes} from 'node:crypto'
import {existsSync, readFileSync} from 'node:fs'
import path from 'node:path'

import {extractedDir, localizedString, readJson} from './lib'
import {
  localizeSpecLabel,
  localizeSpecUnit,
  localizeSpecValue,
  uiCopy,
} from './product-field-i18n'

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

type I18nItem = {_key?: string; _type?: string; language?: string; value?: unknown}
type SpecItem = {
  _key?: string
  _type?: string
  label?: I18nItem[]
  value?: I18nItem[] | string
  unit?: I18nItem[] | string
  note?: I18nItem[]
}
type SpecGroup = {
  _key?: string
  _type?: string
  title?: I18nItem[]
  items?: SpecItem[]
}

type SnapshotProduct = {
  slug: string
  specs?: Array<{labelTr?: string; value?: string}>
}

function pickLocale(items: I18nItem[] | undefined, locale: 'tr' | 'en' | 'ar') {
  if (!items?.length) return ''
  const hit =
    items.find((item) => item.language === locale || item._key === locale) ||
    (locale === 'tr' ? items[0] : undefined)
  return typeof hit?.value === 'string' ? hit.value : ''
}

function asI18nArray(field: I18nItem[] | string | undefined): I18nItem[] {
  if (Array.isArray(field)) return field
  if (typeof field === 'string' && field.trim()) {
    return [
      {
        _key: key(),
        _type: 'internationalizedArrayStringValue',
        language: 'tr',
        value: field.trim(),
      },
    ]
  }
  return []
}

function localizeField(
  field: I18nItem[] | string | undefined,
  localize: (raw: string) => {tr: string; en: string; ar: string},
) {
  const current = asI18nArray(field)
  const source =
    pickLocale(current, 'tr') ||
    pickLocale(current, 'en') ||
    pickLocale(current, 'ar') ||
    (typeof field === 'string' ? field : '')
  if (!source.trim()) return undefined
  return localizedString(localize(source.trim()))
}

function buildGroupsFromSnapshot(specs: Array<{labelTr?: string; value?: string}>): SpecGroup[] {
  const items = specs
    .filter((spec) => spec.labelTr?.trim() && spec.value?.trim())
    .map((spec) => ({
      _key: key(),
      _type: 'specificationItem',
      label: localizedString(localizeSpecLabel(spec.labelTr!.trim())),
      value: localizedString(localizeSpecValue(spec.value!.trim())),
    }))

  if (!items.length) return []

  return [
    {
      _key: key(),
      _type: 'specificationGroup',
      title: localizedString(uiCopy.specsHeading),
      items,
    },
  ]
}

function migrateGroups(groups: SpecGroup[]): SpecGroup[] {
  return groups.map((group) => {
    const titleTr = pickLocale(group.title, 'tr') || 'Teknik özellikler'
    return {
      ...group,
      _type: group._type || 'specificationGroup',
      _key: group._key || key(),
      title: localizedString(
        titleTr.toLocaleLowerCase('tr-TR').includes('ambalaj') ||
          titleTr.toLocaleLowerCase('en-US').includes('packaging')
          ? {
              tr: 'Ambalaj ve lojistik',
              en: 'Packaging and logistics',
              ar: 'التعبئة والخدمات اللوجستية',
            }
          : uiCopy.specsHeading,
      ),
      items: (group.items || []).map((item) => {
        const labelTr = pickLocale(item.label, 'tr') || pickLocale(item.label, 'en')
        const next: SpecItem = {
          ...item,
          _type: item._type || 'specificationItem',
          _key: item._key || key(),
          label: labelTr
            ? localizedString(localizeSpecLabel(labelTr))
            : item.label,
          value: localizeField(item.value, localizeSpecValue),
        }

        const unit = localizeField(item.unit, localizeSpecUnit)
        if (unit) next.unit = unit
        else delete next.unit

        if (item.note?.length) next.note = item.note
        return next
      }),
    }
  })
}

async function migrateDataset(client: SanityClient, snapshotBySlug: Map<string, SnapshotProduct>) {
  const products = await client.fetch<
    Array<{_id: string; slug?: string | null; specificationGroups?: SpecGroup[]}>
  >(`*[_type == "product"]{_id, "slug": slug.current, specificationGroups}`)

  let updated = 0
  for (const product of products) {
    const slug = product.slug || ''
    let groups = product.specificationGroups || []

    if (!groups.length) {
      const snapshot = snapshotBySlug.get(slug)
      if (snapshot?.specs?.length) {
        groups = buildGroupsFromSnapshot(snapshot.specs)
        console.log(`+ ${slug}: restored ${groups[0]?.items?.length || 0} specs from snapshot`)
      } else {
        console.log(`· ${slug}: no specs`)
        continue
      }
    }

    const nextGroups = migrateGroups(groups)
    await client.patch(product._id).set({specificationGroups: nextGroups}).commit({
      autoGenerateArrayKeys: false,
    })
    try {
      await client.delete(`drafts.${product._id}`)
    } catch {
      // ignore missing drafts
    }
    updated += 1
    console.log(`✓ ${slug}`)
  }

  console.log(`Updated ${updated}/${products.length} products`)
}

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!projectId || !token) throw new Error('Missing Sanity project id or write token')

  const snapshot = readJson<{products: SnapshotProduct[]}>(
    path.join(extractedDir, 'live-snapshot.json'),
  )
  const snapshotBySlug = new Map(snapshot.products.map((product) => [product.slug, product]))

  const datasetArg = process.argv.find((argument) => argument.startsWith('--dataset='))
  const requested =
    datasetArg?.slice('--dataset='.length) ||
    process.env.NEXT_PUBLIC_SANITY_DATASET ||
    'development'
  const datasets = requested === 'all' ? ['development', 'production'] : [requested]

  for (const dataset of datasets) {
    console.log(`\n=== ${dataset} ===`)
    const client = createClient({
      projectId,
      dataset,
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-08-02',
      token,
      useCdn: false,
    })
    await migrateDataset(client, snapshotBySlug)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
