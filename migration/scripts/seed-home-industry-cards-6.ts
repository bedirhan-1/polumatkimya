/**
 * Ensures the 6 homepage industry cards exist (TR/EN/AR) and wires them
 * into homePage.industriesSection for every locale.
 *
 * Usage:
 *   npx tsx migration/scripts/seed-home-industry-cards-6.ts
 *   npx tsx migration/scripts/seed-home-industry-cards-6.ts --dataset=all
 */
import {createClient, type SanityClient} from '@sanity/client'
import {randomBytes} from 'node:crypto'
import {existsSync, readFileSync} from 'node:fs'
import path from 'node:path'

import {localizedString, localizedText} from './lib'

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

const SECTION = {
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
} as const

const CARDS = [
  {
    slug: 'automotive',
    sortOrder: 10,
    title: {
      tr: 'Otomotiv',
      en: 'Automotive',
      ar: 'السيارات',
    },
    summary: {
      tr: 'Fren, motor, kontak ve bakım spreyleri.',
      en: 'Brake, engine, contact and maintenance sprays.',
      ar: 'بخاخات الفرامل والمحرك ونقاط التلامس والصيانة.',
    },
  },
  {
    slug: 'industry',
    sortOrder: 20,
    title: {
      tr: 'Endüstri',
      en: 'Industry',
      ar: 'الصناعة',
    },
    summary: {
      tr: 'Endüstriyel üretim ve tesis bakım çözümleri.',
      en: 'Industrial production and plant maintenance solutions.',
      ar: 'حلول الإنتاج الصناعي وصيانة المنشآت.',
    },
    /** Prefer renaming this existing slug when present */
    aliases: ['industrial-maintenance'],
  },
  {
    slug: 'maintenance-technical-service',
    sortOrder: 30,
    title: {
      tr: 'Bakım & Teknik Servis',
      en: 'Maintenance & Technical Service',
      ar: 'الصيانة والخدمة الفنية',
    },
    summary: {
      tr: 'Saha bakımı ve teknik servis uygulamaları.',
      en: 'Field maintenance and technical service applications.',
      ar: 'تطبيقات الصيانة الميدانية والخدمة الفنية.',
    },
  },
  {
    slug: 'electric-electronic',
    sortOrder: 40,
    title: {
      tr: 'Elektrik & Elektronik',
      en: 'Electric & Electronic',
      ar: 'الكهرباء والإلكترونيات',
    },
    summary: {
      tr: 'Kontak, panel ve elektronik bakım kimyasalları.',
      en: 'Contact, panel and electronics maintenance chemicals.',
      ar: 'كيماويات صيانة نقاط التلامس واللوحات والإلكترونيات.',
    },
  },
  {
    slug: 'motorcycle-bicycle',
    sortOrder: 50,
    title: {
      tr: 'Motosiklet & Bisiklet',
      en: 'Motorcycle & Bicycle',
      ar: 'الدراجات النارية والهوائية',
    },
    summary: {
      tr: 'Motosiklet ve bisiklet bakım-yağlama çözümleri.',
      en: 'Motorcycle and bicycle care and lubrication solutions.',
      ar: 'حلول العناية والتشحيم للدراجات النارية والهوائية.',
    },
  },
  {
    slug: 'agriculture-heavy-equipment',
    sortOrder: 60,
    title: {
      tr: 'Tarım & Ağır Ekipman',
      en: 'Agriculture & Heavy Equipment',
      ar: 'الزراعة والمعدات الثقيلة',
    },
    summary: {
      tr: 'Tarım makineleri ve ağır ekipman bakım ürünleri.',
      en: 'Agricultural machinery and heavy equipment care products.',
      ar: 'منتجات العناية بآلات الزراعة والمعدات الثقيلة.',
    },
  },
] as const

async function ensureArea(
  client: SanityClient,
  card: (typeof CARDS)[number],
): Promise<string> {
  const aliases = 'aliases' in card ? [...card.aliases] : []
  const slugs = [card.slug, ...aliases]

  const existing = await client.fetch<{_id: string; slug?: string} | null>(
    `*[_type=="applicationArea" && slug.current in $slugs]|order(slug.current asc)[0]{_id, "slug": slug.current}`,
    {slugs},
  )

  const payload = {
    _type: 'applicationArea' as const,
    title: localizedString(card.title),
    summary: localizedText(card.summary),
    slug: {_type: 'slug' as const, current: card.slug},
    sortOrder: card.sortOrder,
    translationStatus: 'complete',
  }

  if (existing?._id) {
    await client.patch(existing._id).set(payload).commit()
    console.log(`  ✓ area ${card.slug} (${existing._id})`)
    return existing._id
  }

  const created = await client.create(payload)
  console.log(`  + area ${card.slug} (${created._id})`)
  return created._id
}

async function seedDataset(dataset: string) {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!projectId || !token) {
    throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN')
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-08-02',
    token,
    useCdn: false,
  })

  console.log(`\nSeeding 6 industry cards → ${dataset}`)

  const areaIds: string[] = []
  for (const card of CARDS) {
    areaIds.push(await ensureArea(client, card))
  }

  for (const language of ['tr', 'en', 'ar'] as const) {
    const docId = `homePage-${language}`
    const copy = SECTION[language]
    const areas = CARDS.map((card, index) => ({
      _type: 'homeIndustryCard',
      _key: key(),
      area: {_type: 'reference', _ref: areaIds[index]},
      title: card.title[language],
      summary: card.summary[language],
    }))

    const exists = await client.fetch<string | null>(`*[_id==$id][0]._id`, {id: docId})
    if (!exists) {
      console.warn(`  ! skip missing ${docId}`)
      continue
    }

    await client
      .patch(docId)
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
          areas,
        },
      })
      .commit({autoGenerateArrayKeys: false})

    console.log(`  ✓ ${docId} → 6 cards`)
  }
}

async function main() {
  const arg = process.argv.find((item) => item.startsWith('--dataset='))
  const requested = arg?.split('=')[1] || process.env.NEXT_PUBLIC_SANITY_DATASET || 'development'
  const datasets = requested === 'all' ? ['development', 'production'] : [requested]
  for (const dataset of datasets) {
    await seedDataset(dataset)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
