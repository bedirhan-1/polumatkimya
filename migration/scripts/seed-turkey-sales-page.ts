/**
 * Creates the Turkey Sales page singleton and inserts nav/footer links.
 * Existing page content is left untouched so editorial changes are never overwritten.
 * Nav/footer links are inserted only when missing.
 *
 * Usage:
 *   bun run seed:turkey-sales-page
 *   bun run seed:turkey-sales-page -- --dataset=production
 *   bun run seed:turkey-sales-page -- --dataset=all
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

const TURKEY_SALES_PATH = '/turkey-sales'
const TURKEY_SALES_LABELS = {
  tr: 'Türkiye Satış',
  en: 'Turkey Sales',
  ar: 'مبيعات تركيا',
} as const

function highlight(
  title: {tr: string; en: string; ar: string},
  description: {tr: string; en: string; ar: string},
) {
  return {
    _key: key(),
    _type: 'turkeySalesHighlight',
    title: localizedString(title),
    description: localizedText(description),
  }
}

function contact(
  name: string,
  role: {tr: string; en: string; ar: string},
  phone: string,
  email: string,
) {
  return {
    _key: key(),
    _type: 'turkeySalesContact',
    name,
    role: localizedString(role),
    phone,
    email,
  }
}

function navLink() {
  return {
    _key: key(),
    _type: 'internalOrExternalLink',
    label: localizedString(TURKEY_SALES_LABELS),
    linkType: 'internal' as const,
    internalPath: TURKEY_SALES_PATH,
    openInNewTab: false,
  }
}

function navItem() {
  return {
    _key: key(),
    _type: 'navigationItem',
    label: localizedString(TURKEY_SALES_LABELS),
    linkType: 'internal' as const,
    internalPath: TURKEY_SALES_PATH,
    openInNewTab: false,
  }
}

function buildDocument() {
  return {
    _id: 'turkeySalesPage',
    _type: 'turkeySalesPage',
    eyebrow: localizedString({
      tr: 'Yurt içi satış',
      en: 'Domestic sales',
      ar: 'المبيعات المحلية',
    }),
    title: localizedString({
      tr: 'Türkiye Satış',
      en: 'Turkey Sales',
      ar: 'مبيعات تركيا',
    }),
    intro: localizedText({
      tr: 'Türkiye genelindeki bayi ve satış ağımız için doğrudan Türkiye satış müdürümüzle iletişime geçin.',
      en: 'Contact our Turkey sales manager directly for dealer and sales network support across the country.',
      ar: 'تواصل مباشرة مع مدير مبيعات تركيا لدعم شبكة الوكلاء والمبيعات في جميع أنحاء البلاد.',
    }),
    mapTitle: localizedString({
      tr: 'Türkiye satış ağı',
      en: 'Turkey sales network',
      ar: 'شبكة المبيعات في تركيا',
    }),
    mapDescription: localizedText({
      tr: 'Çaycuma / Zonguldak üretim üssümüzden Türkiye’nin her bölgesine satış ve dağıtım desteği sunuyoruz.',
      en: 'From our Çaycuma / Zonguldak production base we support sales and distribution across every region of Turkey.',
      ar: 'من قاعدة الإنتاج في تشايكوما / زونغولداق ندعم المبيعات والتوزيع في كل مناطق تركيا.',
    }),
    highlights: [
      highlight(
        {tr: 'Ulusal kapsama', en: 'Nationwide coverage', ar: 'تغطية وطنية'},
        {
          tr: 'Türkiye’nin tüm bölgelerinde bayi ve iş ortaklarımızla sürdürülebilir satış yapısı kuruyoruz.',
          en: 'We build sustainable sales structures with dealers and partners in every region of Turkey.',
          ar: 'نبني هياكل مبيعات مستدامة مع الوكلاء والشركاء في كل مناطق تركيا.',
        },
      ),
      highlight(
        {tr: 'Bayi desteği', en: 'Dealer support', ar: 'دعم الوكلاء'},
        {
          tr: 'Ürün bilgilendirme, stok planlama ve saha satış süreçlerinde bayilerimize yakın destek sağlıyoruz.',
          en: 'We stay close to our dealers with product guidance, stock planning and field sales support.',
          ar: 'نبقى قريبين من وكلائنا عبر الإرشاد حول المنتجات وتخطيط المخزون ودعم المبيعات الميدانية.',
        },
      ),
      highlight(
        {tr: 'Hızlı yanıt', en: 'Fast response', ar: 'استجابة سريعة'},
        {
          tr: 'Teklif, teknik bilgi ve sipariş talepleriniz için Türkiye satış ekibimizle doğrudan görüşebilirsiniz.',
          en: 'Reach our Turkey sales team directly for quotes, technical information and order requests.',
          ar: 'تواصل مباشرة مع فريق مبيعات تركيا لعروض الأسعار والمعلومات الفنية وطلبات الطلبات.',
        },
      ),
    ],
    contactEyebrow: localizedString({
      tr: 'Doğrudan iletişim',
      en: 'Direct contact',
      ar: 'تواصل مباشر',
    }),
    contactTitle: localizedString({
      tr: 'Türkiye satış müdürümüzle görüşün',
      en: 'Speak with our Turkey sales manager',
      ar: 'تحدث مع مدير مبيعات تركيا',
    }),
    contactDescription: localizedText({
      tr: 'Yurt içi satış, bayi ilişkileri ve ürün talepleri için Aydın ÇAKAR ile iletişime geçebilirsiniz.',
      en: 'Contact Aydın ÇAKAR for domestic sales, dealer relations and product requests.',
      ar: 'تواصل مع أيدن تشاكار بخصوص المبيعات المحلية وعلاقات الوكلاء وطلبات المنتجات.',
    }),
    contacts: [
      contact(
        'Aydın ÇAKAR',
        {
          tr: 'Türkiye Satış Müdürü',
          en: 'Turkey Sales Manager',
          ar: 'مدير مبيعات تركيا',
        },
        '+90 533 897 28 24',
        'aydin@polumatkimya.com',
      ),
    ],
    seo: {
      _type: 'localizedSeo',
      title: localizedString({
        tr: 'Türkiye Satış | Polumat Kimya',
        en: 'Turkey Sales | Polumat Kimya',
        ar: 'مبيعات تركيا | بولومات كيميا',
      }),
      description: localizedText({
      tr: 'Polumat Kimya Türkiye satış ağı ve Türkiye satış müdürü Aydın ÇAKAR iletişim bilgileri.',
      en: 'Polumat Kimya Turkey sales network and Turkey sales manager Aydın ÇAKAR contact details.',
      ar: 'شبكة مبيعات بولومات كيميا في تركيا وبيانات التواصل مع مدير مبيعات تركيا أيدن تشاكار.',
    }),
      noIndex: false,
    },
  }
}

function pathOf(item: {_type?: string; internalPath?: string; children?: unknown[]} | null) {
  return typeof item?.internalPath === 'string' ? item.internalPath : ''
}

function hasTurkeySalesLink(items: Array<{internalPath?: string; children?: unknown[]}> | undefined) {
  if (!items?.length) return false
  return items.some((item) => {
    if (pathOf(item) === TURKEY_SALES_PATH) return true
    const children = Array.isArray(item.children) ? item.children : []
    return children.some((child) => pathOf(child as {internalPath?: string}) === TURKEY_SALES_PATH)
  })
}

function insertAfterExport<T extends {internalPath?: string}>(items: T[], link: T): T[] {
  const exportIndex = items.findIndex((item) => pathOf(item) === '/export')
  if (exportIndex >= 0) {
    const next = [...items]
    next.splice(exportIndex + 1, 0, link)
    return next
  }

  const contactIndex = items.findIndex((item) => pathOf(item) === '/contact')
  if (contactIndex >= 0) {
    const next = [...items]
    next.splice(contactIndex, 0, link)
    return next
  }

  return [...items, link]
}

async function ensureNavigation(client: SanityClient, dataset: string) {
  const settings = await client.fetch<{
    headerNavigation?: Array<{
      _key?: string
      _type?: string
      internalPath?: string
      children?: Array<{_key?: string; internalPath?: string}>
    }>
    footerColumns?: Array<{
      _key?: string
      title?: Array<{language?: string; _key?: string; value?: string}>
      links?: Array<{_key?: string; internalPath?: string}>
    }>
  } | null>(`*[_id == "siteSettings"][0]{headerNavigation, footerColumns}`)

  if (!settings) {
    console.log(`siteSettings missing on ${dataset}; skip nav/footer patch.`)
    return
  }

  const patch: Record<string, unknown> = {}

  const header = settings.headerNavigation || []
  if (!hasTurkeySalesLink(header)) {
    patch.headerNavigation = insertAfterExport(header, navItem())
  }

  const columns = settings.footerColumns || []
  if (columns.length) {
    const alreadyInFooter = columns.some((column) => hasTurkeySalesLink(column.links))
    if (!alreadyInFooter) {
      patch.footerColumns = columns.map((column, index) => {
        // Prefer the first (Kurumsal / Company) column.
        if (index !== 0) return column
        const links = column.links || []
        const contactIndex = links.findIndex((link) => pathOf(link) === '/contact')
        const nextLinks = [...links]
        if (contactIndex >= 0) {
          nextLinks.splice(contactIndex, 0, navLink())
        } else {
          nextLinks.push(navLink())
        }
        return {...column, links: nextLinks}
      })
    }
  }

  if (!Object.keys(patch).length) {
    console.log(`Nav/footer already include Turkey Sales on ${dataset}.`)
    return
  }

  await client.patch('siteSettings').set(patch).commit()
  console.log(`Nav/footer updated with Turkey Sales on ${dataset}.`)
}

async function seedDataset(dataset: string) {
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

  const existing = await client.getDocument('turkeySalesPage')
  if (existing) {
    console.log(`Turkey Sales page already exists on ${dataset}; keeping editorial content.`)
  } else {
    await client.create(buildDocument())
    console.log(`Turkey Sales page created on ${dataset}.`)
  }

  await ensureNavigation(client, dataset)
}

async function main() {
  const datasetArg = process.argv.find((argument) => argument.startsWith('--dataset='))
  const requested =
    datasetArg?.slice('--dataset='.length) ||
    process.env.NEXT_PUBLIC_SANITY_DATASET ||
    'development'
  const datasets = requested === 'all' ? ['development', 'production'] : [requested]

  for (const dataset of datasets) await seedDataset(dataset)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
