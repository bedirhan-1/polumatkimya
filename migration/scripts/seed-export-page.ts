/**
 * Creates the field-level localized Export page singleton.
 * Existing content is left untouched so editorial changes are never overwritten.
 *
 * Usage:
 *   npm run seed:export-page
 *   npm run seed:export-page -- --dataset=production
 *   npm run seed:export-page -- --dataset=all
 */
import {createClient} from '@sanity/client'
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

function activity(
  title: {tr: string; en: string; ar: string},
  description: {tr: string; en: string; ar: string},
) {
  return {
    _key: key(),
    _type: 'exportActivity',
    title: localizedString(title),
    description: localizedText(description),
  }
}

function contact(name: string, phone: string) {
  return {
    _key: key(),
    _type: 'exportContact',
    name,
    role: localizedString({
      tr: 'İhracat Departmanı',
      en: 'Export Department',
      ar: 'قسم التصدير',
    }),
    phone,
  }
}

function buildDocument() {
  return {
    _id: 'exportPage',
    _type: 'exportPage',
    eyebrow: localizedString({
      tr: 'Uluslararası satış',
      en: 'International sales',
      ar: 'المبيعات الدولية',
    }),
    title: localizedString({
      tr: 'İhracat Departmanı',
      en: 'Export Department',
      ar: 'قسم التصدير',
    }),
    intro: localizedText({
      tr: 'Polumat ürünlerini güçlü dağıtım ortaklıkları, esnek üretim çözümleri ve hedef pazara özel destekle dünya pazarlarına ulaştırıyoruz.',
      en: 'We bring Polumat products to global markets through strong distribution partnerships, flexible manufacturing and market-specific support.',
      ar: 'نوصل منتجات بولومات إلى الأسواق العالمية عبر شراكات توزيع قوية وتصنيع مرن ودعم مخصص لكل سوق.',
    }),
    countryCount: '50+',
    countryLabel: localizedString({
      tr: 'ülkeye ihracat',
      en: 'export countries',
      ar: 'دولة نصدر إليها',
    }),
    activityEyebrow: localizedString({
      tr: 'Aktif çalışmalarımız',
      en: 'Our active work',
      ar: 'أعمالنا النشطة',
    }),
    activityTitle: localizedString({
      tr: 'Uluslararası pazarlarda büyüyen iş birlikleri',
      en: 'Growing partnerships in international markets',
      ar: 'شراكات متنامية في الأسواق الدولية',
    }),
    activityDescription: localizedText({
      tr: 'Mevcut dağıtım ağımızı güçlendirirken yeni pazarlar ve uzun vadeli iş ortaklıkları için aktif olarak çalışıyoruz.',
      en: 'We strengthen our current distribution network while actively developing new markets and long-term partnerships.',
      ar: 'نعزز شبكة التوزيع الحالية ونعمل باستمرار على تطوير أسواق جديدة وشراكات طويلة الأمد.',
    }),
    activities: [
      activity(
        {tr: 'Distribütör ağı', en: 'Distributor network', ar: 'شبكة الموزعين'},
        {
          tr: 'Mevcut pazarlarda satış ve dağıtım ortaklarımızla sürdürülebilir büyüme planları yürütüyoruz.',
          en: 'We build sustainable growth plans with our sales and distribution partners in established markets.',
          ar: 'نضع خطط نمو مستدامة مع شركائنا في المبيعات والتوزيع ضمن الأسواق الحالية.',
        },
      ),
      activity(
        {tr: 'Yeni pazarlar', en: 'New markets', ar: 'أسواق جديدة'},
        {
          tr: 'Avrupa, Orta Doğu ve Kuzey Afrika’da yeni ülke ve kanal görüşmelerimizi sürdürüyoruz.',
          en: 'We continue country and channel discussions across Europe, the Middle East and North Africa.',
          ar: 'نواصل مباحثات الدول وقنوات البيع في أوروبا والشرق الأوسط وشمال أفريقيا.',
        },
      ),
      activity(
        {tr: 'Private Label projeleri', en: 'Private Label projects', ar: 'مشاريع العلامات الخاصة'},
        {
          tr: 'Hedef pazara uygun ürün, ambalaj ve etiket seçenekleriyle markalara özel üretim desteği sunuyoruz.',
          en: 'We support brands with market-ready products, packaging and labelling options.',
          ar: 'ندعم العلامات التجارية بمنتجات وتعبئة وملصقات مناسبة للأسواق المستهدفة.',
        },
      ),
    ],
    contactEyebrow: localizedString({
      tr: 'Doğrudan iletişim',
      en: 'Direct contact',
      ar: 'تواصل مباشر',
    }),
    contactTitle: localizedString({
      tr: 'İhracat departmanımızdan bilgi alın',
      en: 'Get information from our export department',
      ar: 'احصل على المعلومات من قسم التصدير',
    }),
    contactDescription: localizedText({
      tr: 'Ürünler, distribütörlük, hedef pazarlar ve özel marka üretimi hakkında ihracat ekibimizle görüşün.',
      en: 'Speak with our export team about products, distribution, target markets and private-label manufacturing.',
      ar: 'تواصل مع فريق التصدير بخصوص المنتجات والتوزيع والأسواق المستهدفة وتصنيع العلامات الخاصة.',
    }),
    contacts: [
      contact('İhracat Yetkilisi 1', '+90 555 555 55 55'),
      contact('İhracat Yetkilisi 2', '+90 555 555 55 56'),
    ],
    seo: {
      _type: 'localizedSeo',
      title: localizedString({
        tr: 'İhracat Departmanı | Polumat Kimya',
        en: 'Export Department | Polumat Kimya',
        ar: 'قسم التصدير | بولومات كيميا',
      }),
      description: localizedText({
        tr: 'Polumat Kimya ihracat ağı, aktif uluslararası pazar çalışmaları ve ihracat departmanı iletişim bilgileri.',
        en: 'Polumat Kimya export network, active international market development and export department contacts.',
        ar: 'شبكة تصدير بولومات كيميا وتطوير الأسواق الدولية وبيانات التواصل مع قسم التصدير.',
      }),
      noIndex: false,
    },
  }
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

  const existing = await client.getDocument('exportPage')
  if (existing) {
    console.log(`Export page already exists on ${dataset}; keeping editorial content.`)
    return
  }

  await client.create(buildDocument())
  console.log(`Export page created on ${dataset}.`)
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
