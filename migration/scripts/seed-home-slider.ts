/**
 * Seeds homePage documents (TR/EN/AR) with hero slider + homepage sections.
 *
 * Usage:
 *   npx tsx migration/scripts/seed-home-slider.ts
 *   npx tsx migration/scripts/seed-home-slider.ts --dataset=all
 */
import {createClient, type SanityClient} from '@sanity/client'
import {existsSync, readFileSync} from 'node:fs'
import path from 'node:path'
import {randomBytes} from 'node:crypto'

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

type Locale = 'tr' | 'en' | 'ar'

type SlideSeed = {
  imageFile: string
  productSlug: string
  eyebrow: Record<Locale, string>
  heading: Record<Locale, string>
  description: Record<Locale, string>
  alt: Record<Locale, string>
}

const SLIDES: SlideSeed[] = [
  {
    imageFile: 'public/brand/slides/slide-brake-cleaner.png',
    productSlug: 'brake-cleaner-spray',
    eyebrow: {
      tr: 'Fren Balata Temizleyici • 500 ML',
      en: 'Brake Cleaner Spray • 500 ML',
      ar: 'بخاخ منظف الفرامل • 500 مل',
    },
    heading: {
      tr: 'Kalıntısız temizlik, daha güçlü fren performansı',
      en: 'Residue-free cleaning for stronger braking performance',
      ar: 'تنظيف بلا بقايا لأداء فرامل أقوى',
    },
    description: {
      tr: 'Kir, toz ve yağı hızla temizleyen, çabuk kuruyan formülüyle fren bakımını kolaylaştırır.',
      en: 'Its fast-drying formula removes dirt, dust and oil to make brake maintenance easier.',
      ar: 'تركيبة سريعة الجفاف تزيل الأوساخ والغبار والزيوت لتسهيل صيانة الفرامل.',
    },
    alt: {
      tr: 'Atölye tezgâhında Polumat fren balata temizleyici sprey ve paletli ürün kutuları',
      en: 'Polumat brake cleaner spray on a workshop bench with palletized product boxes',
      ar: 'بخاخ منظف فرامل بولومات على طاولة ورشة مع صناديق منتجات على منصة',
    },
  },
  {
    imageFile: 'public/brand/slides/slide-engine-cleaner.png',
    productSlug: 'engine-cleaner-spray',
    eyebrow: {
      tr: 'Motor Temizleme Spreyi • 500 ML',
      en: 'Engine Cleaning Spray • 500 ML',
      ar: 'بخاخ تنظيف المحرك • 500 مل',
    },
    heading: {
      tr: 'Zorlu motor kirlerine yıkamasız çözüm',
      en: 'A no-rinse solution for stubborn engine dirt',
      ar: 'حل دون شطف لأوساخ المحرك الصعبة',
    },
    description: {
      tr: 'Ulaşılması zor noktalara nüfuz eder; motor yüzeyini temizler, korur ve parlak bir görünüm kazandırır.',
      en: 'It reaches difficult areas to clean, protect and restore a polished finish to engine surfaces.',
      ar: 'يتغلغل في المناطق التي يصعب الوصول إليها لتنظيف أسطح المحرك وحمايتها ومنحها مظهرًا لامعًا.',
    },
    alt: {
      tr: 'Atölye tezgâhında Polumat motor temizleme spreyi ve paletli ürün kutuları',
      en: 'Polumat engine cleaner spray on a workshop bench with palletized product boxes',
      ar: 'بخاخ تنظيف محرك بولومات على طاولة ورشة مع صناديق منتجات على منصة',
    },
  },
  {
    imageFile: 'public/brand/slides/slide-rust-remover.png',
    productSlug: 'rust-remover-spray',
    eyebrow: {
      tr: 'Pas Sökücü Sprey • 400 ML',
      en: 'Rust Remover Spray • 400 ML',
      ar: 'بخاخ مزيل الصدأ • 400 مل',
    },
    heading: {
      tr: 'Pası söker, metali uzun süre korur',
      en: 'Removes rust and protects metal for longer',
      ar: 'يزيل الصدأ ويحمي المعدن لمدة أطول',
    },
    description: {
      tr: 'Su itici 360° formülü pası giderir, sürtünmeyi azaltır ve yüzeyde koruyucu ince bir film bırakır.',
      en: 'Its water-repellent 360° formula removes rust, reduces friction and leaves a thin protective film.',
      ar: 'تركيبة طاردة للماء بزاوية 360° تزيل الصدأ وتقلل الاحتكاك وتترك طبقة حماية رقيقة.',
    },
    alt: {
      tr: 'Atölye tezgâhında Polumat pas sökücü sprey ve paletli ürün kutuları',
      en: 'Polumat rust remover spray on a workshop bench with palletized product boxes',
      ar: 'بخاخ مزيل صدأ بولومات على طاولة ورشة مع صناديق منتجات على منصة',
    },
  },
  {
    imageFile: 'public/brand/slides/slide-tire-shine.png',
    productSlug: 'tire-shine-spray',
    eyebrow: {
      tr: 'Lastik Parlatıcı Sprey • 500 ML',
      en: 'Tire Shine Spray • 500 ML',
      ar: 'بخاخ تلميع الإطارات • 500 مل',
    },
    heading: {
      tr: 'İlk günkü parlaklık, uzun süreli koruma',
      en: 'Day-one shine with long-lasting protection',
      ar: 'لمعان اليوم الأول مع حماية طويلة الأمد',
    },
    description: {
      tr: 'Kir, toz ve yağı temizler; UV ışınlarına, kurumaya ve çatlamaya karşı koruyucu film oluşturur.',
      en: 'It removes dirt, dust and oil, leaving a protective film against UV, drying and cracking.',
      ar: 'يزيل الأوساخ والغبار والزيوت ويكوّن طبقة حماية من الأشعة فوق البنفسجية والجفاف والتشقق.',
    },
    alt: {
      tr: 'Atölye tezgâhında Polumat lastik parlatıcı sprey, lastikler ve paletli ürün kutuları',
      en: 'Polumat tire shine spray beside tires and palletized product boxes in a workshop',
      ar: 'بخاخ تلميع إطارات بولومات بجوار إطارات وصناديق منتجات على منصة داخل ورشة',
    },
  },
  {
    imageFile: 'public/brand/slides/slide-chain-lube.png',
    productSlug: 'chain-lubricant-spray',
    eyebrow: {
      tr: 'Sıvı Gres Zincir Yağlayıcı • 400 ML',
      en: 'Chain Lubricant Spray • 400 ML',
      ar: 'بخاخ تشحيم السلاسل • 400 مل',
    },
    heading: {
      tr: 'Uzun süreli yağlama, daha az aşınma',
      en: 'Long-lasting lubrication with less wear',
      ar: 'تشحيم طويل الأمد مع تآكل أقل',
    },
    description: {
      tr: 'Su itici 360° formülü hareketli parçalarda sürtünmeyi azaltır ve bakım aralıklarını uzatır.',
      en: 'Its water-repellent 360° formula reduces friction in moving parts and extends service intervals.',
      ar: 'تركيبة طاردة للماء بزاوية 360° تقلل الاحتكاك في الأجزاء المتحركة وتطيل فترات الصيانة.',
    },
    alt: {
      tr: 'Atölye tezgâhında Polumat sıvı gres zincir yağlayıcı ve paletli ürün kutuları',
      en: 'Polumat chain lubricant spray on a workshop bench with palletized product boxes',
      ar: 'بخاخ تشحيم سلاسل بولومات على طاولة ورشة مع صناديق منتجات على منصة',
    },
  },
]

const HOME_COPY: Record<
  Locale,
  {
    title: string
    seoTitle: string
    seoDescription: string
    sliderLabel: string
    productsHeading: string
    productsDescription: string
    industriesHeading: string
    industriesDescription: string
    blogHeading: string
    blogDescription: string
    ctaHeading: string
    ctaDescription: string
    ctaLabel: string
    primaryCta: string
    secondaryCta: string
  }
> = {
  tr: {
    title: 'Ana sayfa',
    seoTitle: 'Polumat Kimya | Endüstriyel Spreyler - Yapı Kimyasalları',
    seoDescription:
      'Endüstriyel spreyler ve yapı kimyasallarında profesyonel üretim. Çaycuma / Zonguldak.',
    sliderLabel: 'Öne çıkan ürünler',
    productsHeading: 'Öne çıkan ürünler',
    productsDescription: 'Atölye ve şantiye ekipleri için seçili Polumat çözümleri.',
    industriesHeading: 'Uygulama alanları',
    industriesDescription: 'Sektöre özel ürün önerileri ve kullanım senaryoları.',
    blogHeading: 'Blog',
    blogDescription: 'Üretim, uygulama ve sektör notları.',
    ctaHeading: 'Teklif alın',
    ctaDescription: 'Ürün veya toplu sipariş talebinizi iletin; ekibimiz size dönüş yapsın.',
    ctaLabel: 'Teklif Al',
    primaryCta: 'Teklif Al',
    secondaryCta: 'Ürün detayı',
  },
  en: {
    title: 'Home',
    seoTitle: 'Polumat Kimya | Industrial Sprays - Construction Chemicals',
    seoDescription:
      'Professional manufacturing for industrial sprays and construction chemicals. Çaycuma / Zonguldak.',
    sliderLabel: 'Featured products',
    productsHeading: 'Featured products',
    productsDescription: 'Selected Polumat solutions for workshop and jobsite teams.',
    industriesHeading: 'Industries',
    industriesDescription: 'Sector-specific recommendations and application scenarios.',
    blogHeading: 'Blog',
    blogDescription: 'Notes on production, application and industry practice.',
    ctaHeading: 'Request a quote',
    ctaDescription: 'Send a product or bulk-order request and our team will follow up.',
    ctaLabel: 'Request a quote',
    primaryCta: 'Request a quote',
    secondaryCta: 'View product',
  },
  ar: {
    title: 'الرئيسية',
    seoTitle: 'بولومات كيميا | بخاخات صناعية - كيماويات البناء',
    seoDescription: 'تصنيع احترافي للبخاخات الصناعية وكيماويات البناء. تشايكوما / زونغولداق.',
    sliderLabel: 'منتجات مميزة',
    productsHeading: 'منتجات مميزة',
    productsDescription: 'حلول بولومات المختارة لفرق الورش والمواقع.',
    industriesHeading: 'مجالات التطبيق',
    industriesDescription: 'توصيات حسب القطاع وسيناريوهات الاستخدام.',
    blogHeading: 'المدونة',
    blogDescription: 'ملاحظات حول التصنيع والتطبيق والممارسات الصناعية.',
    ctaHeading: 'اطلب عرض سعر',
    ctaDescription: 'أرسل طلب المنتج أو الطلب بالجملة وسيتواصل فريقنا معك.',
    ctaLabel: 'اطلب عرض سعر',
    primaryCta: 'اطلب عرض سعر',
    secondaryCta: 'تفاصيل المنتج',
  },
}

async function uploadLocalImage(client: SanityClient, relativePath: string, alt: string) {
  const absolute = path.resolve(process.cwd(), relativePath)
  if (!existsSync(absolute)) throw new Error(`Missing image: ${relativePath}`)
  const buffer = readFileSync(absolute)
  const filename = path.basename(absolute)
  const asset = await client.assets.upload('image', buffer, {filename})
  return {
    _type: 'image' as const,
    asset: {_type: 'reference' as const, _ref: asset._id},
    alt,
  }
}

function cta(label: string, internalPath: string, variant: 'primary' | 'secondary' = 'primary') {
  return {
    _type: 'simpleCallToAction',
    label,
    linkType: 'internal',
    internalPath,
    variant,
  }
}

async function ensureTranslationMetadata(
  client: SanityClient,
  refs: Array<{language: string; id: string}>,
) {
  const ids = refs.map((ref) => ref.id)
  const existing = await client.fetch<{_id: string} | null>(
    `*[_type == "translation.metadata" && count((translations[].value._ref)[@ in $ids]) > 0][0]{_id}`,
    {ids},
  )
  const translations = refs.map((ref) => ({
    _key: ref.language,
    _type: 'internationalizedArrayReferenceValue',
    language: ref.language,
    value: {_type: 'reference', _ref: ref.id, _weak: true},
  }))
  if (existing?._id) {
    await client.patch(existing._id).set({translations, schemaTypes: ['homePage']}).commit()
  } else {
    await client.create({
      _type: 'translation.metadata',
      schemaTypes: ['homePage'],
      translations,
    })
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

  console.log(`\nSeeding home slider → ${dataset}`)

  const productDocs = await client.fetch<Array<{_id: string; slug: string}>>(
    `*[_type=="product" && slug.current in $slugs]{"_id":_id,"slug":slug.current}`,
    {slugs: SLIDES.map((slide) => slide.productSlug)},
  )
  const productMap = new Map(productDocs.map((item) => [item.slug, item._id]))

  const industryIds = await client.fetch<string[]>(
    `*[_type=="applicationArea" && defined(slug.current)]|order(sortOrder asc)[0...3]._id`,
  )

  const featuredProductIds = (
    await client.fetch<string[]>(
      `*[_type=="product" && defined(slug.current)]|order(sortOrder asc)[0...4]._id`,
    )
  ).map((id) => id)

  // Upload each slide image once per dataset
  const uploaded = new Map<string, Awaited<ReturnType<typeof uploadLocalImage>>>()
  for (const slide of SLIDES) {
    const image = await uploadLocalImage(client, slide.imageFile, slide.alt.tr)
    uploaded.set(slide.imageFile, image)
    console.log(`✓ uploaded ${path.basename(slide.imageFile)}`)
  }

  const refs: Array<{language: string; id: string}> = []

  for (const language of ['tr', 'en', 'ar'] as const) {
    const copy = HOME_COPY[language]
    const slides = SLIDES.map((slide) => {
      const image = uploaded.get(slide.imageFile)!
      return {
        _key: key(),
        _type: 'heroSlide',
        eyebrow: slide.eyebrow[language],
        heading: slide.heading[language],
        description: slide.description[language],
        desktopImage: {...image, alt: slide.alt[language]},
        primaryCta: cta(
          copy.primaryCta,
          `/request-a-quote?product=${slide.productSlug}`,
          'primary',
        ),
        secondaryCta: productMap.has(slide.productSlug)
          ? cta(copy.secondaryCta, `/products/${slide.productSlug}`, 'secondary')
          : cta(copy.secondaryCta, '/products', 'secondary'),
      }
    })

    const pageBuilder = [
      {
        _key: key(),
        _type: 'heroSliderSection',
        accessibilityLabel: copy.sliderLabel,
        rotationMode: 'automatic',
        interval: 6500,
        slides,
      },
      {
        _key: key(),
        _type: 'productShowcaseSection',
        heading: copy.productsHeading,
        description: copy.productsDescription,
        products: featuredProductIds.map((id) => ({
          _type: 'reference',
          _ref: id,
          _key: key(),
        })),
      },
      {
        _key: key(),
        _type: 'applicationGridSection',
        heading: copy.industriesHeading,
        description: copy.industriesDescription,
        applicationAreas: (industryIds || []).map((id) => ({
          _type: 'reference',
          _ref: id,
          _key: key(),
        })),
      },
      {
        _key: key(),
        _type: 'latestContentSection',
        heading: copy.blogHeading,
        description: copy.blogDescription,
        source: 'posts',
      },
      {
        _key: key(),
        _type: 'ctaSection',
        heading: copy.ctaHeading,
        description: copy.ctaDescription,
        cta: cta(copy.ctaLabel, '/request-a-quote', 'primary'),
      },
    ]

    const docId = `homePage-${language}`
    await client.createOrReplace({
      _id: docId,
      _type: 'homePage',
      language,
      translationStatus: 'complete',
      title: copy.title,
      seo: {
        _type: 'seo',
        title: copy.seoTitle,
        description: copy.seoDescription,
        noIndex: false,
      },
      pageBuilder,
    })
    try {
      await client.delete(`drafts.${docId}`)
    } catch {
      // ignore
    }
    refs.push({language, id: docId})
    console.log(`✓ ${docId}`)
  }

  await ensureTranslationMetadata(client, refs)
  console.log('✓ translation.metadata linked')
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
