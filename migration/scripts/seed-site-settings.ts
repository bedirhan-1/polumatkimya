/**
 * Fills the siteSettings singleton with Polumat company data, nav, contact, logos.
 *
 * Usage:
 *   npx tsx migration/scripts/seed-site-settings.ts
 *   npx tsx migration/scripts/seed-site-settings.ts --dataset=production
 *   npx tsx migration/scripts/seed-site-settings.ts --dataset=all
 */
import {createClient, type SanityClient} from '@sanity/client'
import {existsSync, readFileSync} from 'node:fs'
import path from 'node:path'
import {randomBytes} from 'node:crypto'

import {localizedString, localizedText} from './lib'

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

function key() {
  return randomBytes(4).toString('hex')
}

function navLink(
  labels: {tr: string; en: string; ar: string},
  opts:
    | {linkType: 'internal'; internalPath: string}
    | {linkType: 'external'; externalUrl: string; openInNewTab?: boolean},
) {
  return {
    _key: key(),
    _type: 'internalOrExternalLink',
    label: localizedString(labels),
    linkType: opts.linkType,
    internalPath: opts.linkType === 'internal' ? opts.internalPath : undefined,
    externalUrl: opts.linkType === 'external' ? opts.externalUrl : undefined,
    openInNewTab: opts.linkType === 'external' ? Boolean(opts.openInNewTab) : false,
  }
}

function channel(
  department: {tr: string; en: string; ar: string},
  phone?: string,
  email?: string,
) {
  return {
    _key: key(),
    _type: 'contactChannel',
    department: localizedString(department),
    phone,
    email,
  }
}

async function uploadLocalImage(
  client: SanityClient,
  relativePath: string,
  alt: string,
): Promise<{_type: 'image'; asset: {_type: 'reference'; _ref: string}; alt: string}> {
  const absolute = path.resolve(process.cwd(), relativePath)
  if (!existsSync(absolute)) throw new Error(`Missing image: ${relativePath}`)
  const buffer = readFileSync(absolute)
  const filename = path.basename(absolute)
  const asset = await client.assets.upload('image', buffer, {filename})
  return {
    _type: 'image',
    asset: {_type: 'reference', _ref: asset._id},
    alt,
  }
}

function buildSettingsPayload(images: {
  logoLight: Awaited<ReturnType<typeof uploadLocalImage>>
  logoDark: Awaited<ReturnType<typeof uploadLocalImage>>
  favicon: Awaited<ReturnType<typeof uploadLocalImage>>
  defaultOgImage: Awaited<ReturnType<typeof uploadLocalImage>>
}) {
  const dealerUrl = 'https://polumat.netahsilat.com/auth/sign-in'

  return {
    companyName: 'Polumat Kimya San.Tic.Ltd.Şti',
    shortDescription: localizedText({
      tr: 'Endüstriyel spreyler ve yapı kimyasallarında profesyonel üretim çözümleri.',
      en: 'Professional manufacturing solutions for industrial sprays and construction chemicals.',
      ar: 'حلول تصنيع احترافية للبخاخات الصناعية وكيماويات البناء.',
    }),
    logoLight: images.logoLight,
    logoDark: images.logoDark,
    favicon: {
      _type: 'image',
      asset: images.favicon.asset,
    },
    defaultOgImage: {
      _type: 'image',
      asset: images.defaultOgImage.asset,
    },
    siteUrl: 'https://polumatkimya.com',
    defaultSeo: {
      _type: 'seo',
      title: 'Polumat Kimya | Endüstriyel Spreyler - Yapı Kimyasalları',
      description:
        'Endüstriyel spreyler ve yapı kimyasallarında profesyonel üretim çözümleri. Çaycuma / Zonguldak.',
      noIndex: false,
    },
    headerNavigation: [
      navLink(
        {tr: 'Ürünler', en: 'Products', ar: 'المنتجات'},
        {linkType: 'internal', internalPath: '/products'},
      ),
      navLink(
        {tr: 'Uygulama alanları', en: 'Industries', ar: 'مجالات التطبيق'},
        {linkType: 'internal', internalPath: '/industries'},
      ),
      navLink(
        {tr: 'Hakkımızda', en: 'About', ar: 'من نحن'},
        {linkType: 'internal', internalPath: '/about'},
      ),
      navLink(
        {tr: 'Blog', en: 'Blog', ar: 'المدونة'},
        {linkType: 'internal', internalPath: '/blog'},
      ),
      navLink(
        {tr: 'İletişim', en: 'Contact', ar: 'اتصل بنا'},
        {linkType: 'internal', internalPath: '/contact'},
      ),
      navLink(
        {tr: 'Bayi Girişi', en: 'Dealer login', ar: 'دخول الوكيل'},
        {linkType: 'external', externalUrl: dealerUrl, openInNewTab: true},
      ),
    ],
    footerColumns: [
      {
        _key: key(),
        _type: 'footerColumn',
        title: localizedString({tr: 'Kurumsal', en: 'Company', ar: 'الشركة'}),
        links: [
          navLink(
            {tr: 'Hakkımızda', en: 'About', ar: 'من نحن'},
            {linkType: 'internal', internalPath: '/about'},
          ),
          navLink(
            {tr: 'Kalite ve belgeler', en: 'Quality & certificates', ar: 'الجودة والشهادات'},
            {linkType: 'internal', internalPath: '/quality-certificates'},
          ),
          navLink(
            {tr: 'İletişim', en: 'Contact', ar: 'اتصل بنا'},
            {linkType: 'internal', internalPath: '/contact'},
          ),
        ],
      },
      {
        _key: key(),
        _type: 'footerColumn',
        title: localizedString({tr: 'Kaynaklar', en: 'Resources', ar: 'الموارد'}),
        links: [
          navLink(
            {tr: 'Ürünler', en: 'Products', ar: 'المنتجات'},
            {linkType: 'internal', internalPath: '/products'},
          ),
          navLink(
            {tr: 'Uygulama alanları', en: 'Industries', ar: 'مجالات التطبيق'},
            {linkType: 'internal', internalPath: '/industries'},
          ),
          navLink(
            {tr: 'Blog', en: 'Blog', ar: 'المدونة'},
            {linkType: 'internal', internalPath: '/blog'},
          ),
          navLink(
            {tr: 'Videolar', en: 'Videos', ar: 'مقاطع الفيديو'},
            {linkType: 'internal', internalPath: '/videos'},
          ),
        ],
      },
      {
        _key: key(),
        _type: 'footerColumn',
        title: localizedString({tr: 'Yasal', en: 'Legal', ar: 'قانوني'}),
        links: [
          navLink(
            {tr: 'Gizlilik', en: 'Privacy', ar: 'الخصوصية'},
            {linkType: 'internal', internalPath: '/legal/privacy-policy'},
          ),
          navLink(
            {tr: 'KVKK', en: 'Personal data protection', ar: 'حماية البيانات الشخصية'},
            {linkType: 'internal', internalPath: '/legal/personal-data-protection'},
          ),
          navLink(
            {tr: 'Çerezler', en: 'Cookies', ar: 'ملفات تعريف الارتباط'},
            {linkType: 'internal', internalPath: '/legal/cookie-policy'},
          ),
          navLink(
            {tr: 'Bayi Girişi', en: 'Dealer login', ar: 'دخول الوكيل'},
            {linkType: 'external', externalUrl: dealerUrl, openInNewTab: true},
          ),
        ],
      },
    ],
    quoteCta: {
      _type: 'callToAction',
      label: localizedString({
        tr: 'Teklif Al',
        en: 'Request a quote',
        ar: 'اطلب عرض سعر',
      }),
      variant: 'primary',
      link: {
        _type: 'internalOrExternalLink',
        label: localizedString({
          tr: 'Teklif Al',
          en: 'Request a quote',
          ar: 'اطلب عرض سعر',
        }),
        linkType: 'internal',
        internalPath: '/request-a-quote',
        openInNewTab: false,
      },
    },
    contactChannels: [
      channel(
        {tr: 'Fabrika', en: 'Factory', ar: 'المصنع'},
        '+90 372 615 77 70',
        'fabrika@polumatkimya.com',
      ),
      channel({tr: 'Mobil', en: 'Mobile', ar: 'الجوال'}, '+90 533 897 28 24'),
      channel({tr: 'Mobil', en: 'Mobile', ar: 'الجوال'}, '+90 543 877 81 35'),
      channel(
        {tr: 'Export', en: 'Export', ar: 'التصدير'},
        undefined,
        'export@polumat.com',
      ),
    ],
    whatsappNumber: '905338972824',
    whatsappMessage: localizedText({
      tr: 'Merhaba, Polumat Kimya ürünleri hakkında bilgi almak istiyorum.',
      en: 'Hello, I would like information about Polumat Kimya products.',
      ar: 'مرحباً، أود الحصول على معلومات حول منتجات بولومات كيميا.',
    }),
    address: localizedText({
      tr: 'Velioğlu OSB Mahallesi, 11 Nolu Sokak No: 3\nÇaycuma / Zonguldak 67900',
      en: 'Velioğlu OSB Mahallesi, 11 Nolu Sokak No: 3\nÇaycuma / Zonguldak 67900, Türkiye',
      ar: 'حي فيليو أو إس بي، شارع رقم 11 رقم: 3\nتشايكوما / زونغولداق 67900، تركيا',
    }),
    mapUrl:
      'https://maps.google.com/maps?q=Velio%C4%9Flu%20OSB%20Mahallesi%2011%20Nolu%20Sokak%20No:3%20%C3%87aycuma%20Zonguldak&z=14',
    socialLinks: [
      {
        _key: key(),
        _type: 'socialLink',
        platform: 'facebook',
        url: 'https://www.facebook.com/polumatkimya',
      },
      {
        _key: key(),
        _type: 'socialLink',
        platform: 'instagram',
        url: 'https://www.instagram.com/polumatkimya/',
      },
    ],
    workingHours: localizedText({
      tr: 'Pazartesi – Cuma: 08:30 – 18:00',
      en: 'Monday – Friday: 08:30 – 18:00',
      ar: 'الاثنين – الجمعة: 08:30 – 18:00',
    }),
    footerLegalText: localizedText({
      tr: 'Polumat Kimya San.Tic.Ltd.Şti. Tüm hakları saklıdır.',
      en: 'Polumat Kimya San.Tic.Ltd.Şti. All rights reserved.',
      ar: 'بولومات كيميا. جميع الحقوق محفوظة.',
    }),
    uiLabels: {
      requestQuote: localizedString({
        tr: 'Teklif Al',
        en: 'Request a quote',
        ar: 'اطلب عرض سعر',
      }),
      viewProducts: localizedString({
        tr: 'Ürünleri incele',
        en: 'View products',
        ar: 'عرض المنتجات',
      }),
      readMore: localizedString({
        tr: 'Devamını oku',
        en: 'Read more',
        ar: 'اقرأ المزيد',
      }),
      download: localizedString({
        tr: 'İndir',
        en: 'Download',
        ar: 'تنزيل',
      }),
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

  console.log(`\nSeeding siteSettings → ${dataset}`)

  const [logoLight, logoDark, favicon, defaultOgImage] = await Promise.all([
    uploadLocalImage(client, 'public/brand/polumat-logo-large-light.webp', 'Polumat Kimya'),
    uploadLocalImage(client, 'public/brand/polumat-logo-large-dark.webp', 'Polumat Kimya'),
    uploadLocalImage(client, 'public/brand/favicon-32x32.png', 'Polumat favicon'),
    uploadLocalImage(client, 'public/brand/polumat-mark-512-light.webp', 'Polumat Kimya'),
  ])

  const payload = buildSettingsPayload({logoLight, logoDark, favicon, defaultOgImage})

  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    ...payload,
  })

  // Drop draft if Studio left an incomplete draft behind.
  try {
    await client.delete('drafts.siteSettings')
  } catch {
    // ignore missing draft
  }

  console.log(`✓ siteSettings updated on ${dataset}`)
}

async function main() {
  const arg = process.argv.find((item) => item.startsWith('--dataset='))
  const requested = arg?.split('=')[1] || process.env.NEXT_PUBLIC_SANITY_DATASET || 'development'
  const datasets =
    requested === 'all' ? ['development', 'production'] : [requested]

  for (const dataset of datasets) {
    await seedDataset(dataset)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
