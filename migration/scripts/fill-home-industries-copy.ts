/**
 * Fills homePage.industriesSection text fields (TR/EN/AR) and card titles/summaries.
 *
 * Usage:
 *   npx tsx migration/scripts/fill-home-industries-copy.ts
 *   npx tsx migration/scripts/fill-home-industries-copy.ts --dataset=all
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

const SECTION: Record<
  string,
  {
    eyebrow: string
    title: string
    description: string
    detailLabel: string
    viewAll: string
  }
> = {
  tr: {
    eyebrow: 'Uygulama alanları',
    title: 'Her sektör için güvenilir bakım çözümleri',
    description: 'Sektöre özel ürün önerileri ve uygulama senaryolarını keşfedin.',
    detailLabel: 'Çözümleri keşfet',
    viewAll: 'Tüm uygulama alanları',
  },
  en: {
    eyebrow: 'Application areas',
    title: 'Reliable maintenance solutions for every sector',
    description: 'Discover sector-specific product recommendations and application scenarios.',
    detailLabel: 'Explore solutions',
    viewAll: 'All application areas',
  },
  ar: {
    eyebrow: 'مجالات التطبيق',
    title: 'حلول صيانة موثوقة لكل قطاع',
    description: 'اكتشف توصيات المنتجات وسيناريوهات التطبيق لكل قطاع.',
    detailLabel: 'استكشف الحلول',
    viewAll: 'كل مجالات التطبيق',
  },
}

type AreaDoc = {
  _id: string
  slug?: string | null
  sortOrder?: number | null
  title?: string | null
  summary?: string | null
}

async function fillDataset(dataset: string) {
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
  })

  const homePages = await client.fetch<Array<{_id: string; language?: string; industriesSection?: {areas?: unknown}}>>(
    `*[_type=="homePage"]{_id, language, industriesSection}`,
  )

  console.log(`\nFilling industries copy → ${dataset}`)

  for (const doc of homePages) {
    const language = doc.language || 'tr'
    const copy = SECTION[language] || SECTION.tr

    const areas = await client.fetch<AreaDoc[]>(
      `*[_type=="applicationArea" && defined(slug.current)]|order(sortOrder asc, title[language==$locale || _key==$locale][0].value asc)[0...6]{
        _id,
        "slug": slug.current,
        sortOrder,
        "title": title[language==$locale || _key==$locale][0].value,
        "summary": summary[language==$locale || _key==$locale][0].value
      }`,
      {locale: language},
    )

    // Prefer existing card order/refs when present
    const existing = Array.isArray(doc.industriesSection?.areas)
      ? (doc.industriesSection?.areas as Array<{
          _key?: string
          title?: string
          summary?: string
          area?: {_ref?: string}
          _ref?: string
        }>)
      : []

    const cards =
      existing.length > 0
        ? await Promise.all(
            existing.map(async (row) => {
              const ref = row.area?._ref || row._ref
              if (!ref) return null
              const area = await client.fetch<AreaDoc | null>(
                `*[_id==$id][0]{
                  _id,
                  "slug": slug.current,
                  "title": title[language==$locale || _key==$locale][0].value,
                  "summary": summary[language==$locale || _key==$locale][0].value
                }`,
                {id: ref, locale: language},
              )
              if (!area?._id) return null
              return {
                _type: 'homeIndustryCard',
                _key: typeof row._key === 'string' ? row._key : key(),
                area: {_type: 'reference', _ref: area._id},
                title: row.title || area.title || '',
                summary: row.summary || area.summary || '',
              }
            }),
          ).then((rows) => rows.filter(Boolean))
        : areas.map((area) => ({
            _type: 'homeIndustryCard',
            _key: key(),
            area: {_type: 'reference', _ref: area._id},
            title: area.title || '',
            summary: area.summary || '',
          }))

    await client
      .patch(doc._id)
      .set({
        industriesSection: {
          _type: 'homeIndustriesSection',
          eyebrow: copy.eyebrow,
          title: copy.title,
          description: copy.description,
          detailLabel: copy.detailLabel,
          viewAllCta: {
            _type: 'simpleCallToAction',
            label: copy.viewAll,
            linkType: 'internal',
            internalPath: '/industries',
            variant: 'secondary',
          },
          areas: cards,
        },
      })
      .commit({autoGenerateArrayKeys: false})

    console.log(
      `✓ ${doc._id} (${language}) — "${copy.title}" · ${cards.length} cards with titles`,
    )
  }
}

async function main() {
  const arg = process.argv.find((item) => item.startsWith('--dataset='))
  const requested = arg?.split('=')[1] || process.env.NEXT_PUBLIC_SANITY_DATASET || 'development'
  const datasets = requested === 'all' ? ['development', 'production'] : [requested]
  for (const dataset of datasets) {
    await fillDataset(dataset)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
