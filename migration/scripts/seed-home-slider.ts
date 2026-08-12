/**
 * Seeds homePage documents (TR/EN/AR) with homeHero + all homepage sections.
 *
 * Usage:
 *   npx tsx migration/scripts/seed-home-slider.ts
 *   npx tsx migration/scripts/seed-home-slider.ts --dataset=all
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

type Locale = 'tr' | 'en' | 'ar'

const HERO_IMAGE = 'public/brand/slides/hero-product-family-21x9-v4.png'

function cta(label: string, internalPath: string, variant: 'primary' | 'secondary' = 'primary') {
  return {
    _type: 'simpleCallToAction' as const,
    label,
    linkType: 'internal' as const,
    internalPath,
    variant,
  }
}

function titled(title: string, description: string) {
  return {_key: key(), title, description}
}

const COPY: Record<Locale, ReturnType<typeof buildLocale>> = {
  tr: null as never,
  en: null as never,
  ar: null as never,
}

function buildLocale(locale: Locale) {
  const packs = {
    tr: {
      title: 'Ana sayfa',
      seoTitle: 'Polumat Kimya | Endüstriyel Spreyler - Yapı Kimyasalları',
      seoDescription:
        'Endüstriyel spreyler ve yapı kimyasallarında profesyonel üretim. Çaycuma / Zonguldak.',
      hero: {
        eyebrow: 'Endüstriyel spreyler & yapı kimyasalları',
        headingLead: 'Güçlü kimya,',
        headingAccent: 'daha yüksek',
        headingTail: 'performans',
        description:
          'Otomotiv, endüstri, bakım ve teknik servis uygulamaları için geliştirilmiş profesyonel kimyasal çözümler.',
        imageAlt: 'Polumat profesyonel aerosol ürün ailesi',
        primary: 'Ürünleri incele',
        secondary: 'Teklif al',
        trust: [
          titled('Profesyonel kullanım', 'Sahada kanıtlanan formüller'),
          titled('Yüksek performans', 'Zorlu koşullarda güçlü sonuç'),
          titled('Premium kalite', 'Her aşamada kontrollü üretim'),
          titled('50+ ülkeye ihracat', 'Dünyaya yayılan üretim gücü'),
        ],
      },
      products: {
        eyebrow: 'Ürünlerimiz',
        title: 'Profesyonel çözümler, güçlü sonuçlar',
        description: 'Her uygulama için doğru formül, yüksek etki ve güvenilir performans.',
        viewAllLabel: 'Tüm ürünleri gör',
        detailLabel: 'Ürünü incele',
      },
      strengths: {
        eyebrow: 'Neden Polumat?',
        title: 'Profesyonellerin tercih ettiği güçlü çözümler',
        items: [
          titled('Yüksek performans', 'Zorlu koşullarda güçlü etki sağlayan formüller.'),
          titled('Premium kalite', 'Hammadde seçiminden doluma kadar kalite kontrol.'),
          titled('Modern üretim', 'Yüksek kapasiteye sahip modern üretim hatları.'),
          titled('Global deneyim', '50’den fazla ülkeye ulaşan ihracat ağı.'),
          titled('Profesyonel kullanım', 'Bakım ve teknik servis ekipleri için geliştirildi.'),
          titled('Private label', 'Markanıza özel formül, ambalaj ve etiket üretimi.'),
        ],
      },
      industries: {
        eyebrow: 'Uygulama alanları',
        title: 'Her sektör için güvenilir bakım çözümleri',
        description: 'Sektöre özel ürün önerileri ve uygulama senaryolarını keşfedin.',
        detailLabel: 'Çözümleri keşfet',
        viewAll: 'Tüm uygulama alanları',
      },
      privateLabel: {
        eyebrow: 'Private label',
        title: 'Kendi markanızla profesyonel kimyasal ürünler',
        description:
          'İhtiyacınıza uygun formül, ambalaj ve etiket seçenekleriyle markanızı güçlendiren, üretimi bize bırakan çözümler.',
        action: 'Private label teklifi al',
        features: [
          titled('Özel formül', 'Markanıza özel ürün geliştirme'),
          titled('Özel ambalaj', 'Farklı hacim ve kutu seçenekleri'),
          titled('Özel etiket', 'Profesyonel etiket tasarımı'),
          titled('Dolum & paketleme', 'Yüksek kalite dolum ve paketleme'),
          titled('Lojistik destek', 'Zamanında teslimat ve lojistik çözüm'),
        ],
        processTitle: 'Private label süreci',
        process: [
          titled('İhtiyacınızı belirliyoruz', 'Ürün, ambalaj ve hedef pazar analizi.'),
          titled('Formül & numune', 'Size özel formül geliştirme ve numune hazırlığı.'),
          titled('Tasarım & ambalaj', 'Etiket, kutu ve ambalaj tasarımlarının hazırlığı.'),
          titled('Üretim & teslimat', 'Onaylanan ürünlerin üretimi ve sevkiyatı.'),
        ],
      },
      about: {
        eyebrow: 'Hakkımızda',
        title: 'Kimya ve aerosol çözümlerinde güvenilir iş ortağınız',
        description:
          'Polumat, profesyonel kullanıcıların ihtiyacı duyduğu yüksek performanslı aerosol ürünleri modern üretim altyapısı, kalite odaklı yaklaşımı ve uzun vadeli iş ortaklıklarıyla geliştirir.',
        action: 'Hakkımızda daha fazla bilgi',
        imageAlt: 'Polumat üretim tesisi ve lojistik alanı',
        videoPlayLabel: 'Tanıtım videosunu izle',
        stats: [
          {_key: key(), value: '50+', label: 'Ülkeye ihracat'},
          {_key: key(), value: '5', label: "Kıta'da iş ortaklığı"},
          {_key: key(), value: 'Modern', label: 'Üretim tesisi'},
          {_key: key(), value: 'Profesyonel', label: 'Ürün gamı'},
          {_key: key(), value: 'Private Label', label: 'Üretim desteği'},
        ],
      },
      quality: {
        eyebrow: 'Kalite ve güven',
        title: 'Her aşamada kontrol, her üründe güven',
        linkLabel: 'Kalite belgeleri',
        items: [
          {_key: key(), label: 'Seçilmiş hammadde'},
          {_key: key(), label: 'Kontrollü üretim'},
          {_key: key(), label: 'Performans testleri'},
          {_key: key(), label: 'Kalite kontrol süreçleri'},
          {_key: key(), label: 'Müşteri memnuniyeti odaklı hizmet'},
        ],
        badges: [
          {_key: key(), label: '9001:2015'},
          {_key: key(), label: '14001:2015'},
          {_key: key(), label: '45001:2018'},
          {_key: key(), label: 'Made in Türkiye'},
        ],
      },
      cta: {
        eyebrow: 'Doğru çözümü birlikte bulalım',
        title: 'İşletmeniz için doğru kimyasal çözümü bulun',
        description:
          'Ürünlerimiz, özel marka üretimi ve teknik ihtiyaçlarınız için ekibimizle görüşün.',
        quote: 'Teklif al',
        contact: 'Bizimle iletişime geçin',
      },
    },
    en: {
      title: 'Home',
      seoTitle: 'Polumat Kimya | Industrial Sprays - Construction Chemicals',
      seoDescription:
        'Professional manufacturing for industrial sprays and construction chemicals. Çaycuma / Zonguldak.',
      hero: {
        eyebrow: 'Industrial sprays & construction chemicals',
        headingLead: 'Strong chemistry,',
        headingAccent: 'higher',
        headingTail: 'performance',
        description:
          'Professional chemical solutions engineered for automotive, industrial, maintenance and technical service applications.',
        imageAlt: 'Polumat professional aerosol product family',
        primary: 'Browse products',
        secondary: 'Request a quote',
        trust: [
          titled('Professional use', 'Formulas proven in the field'),
          titled('High performance', 'Strong results in demanding conditions'),
          titled('Premium quality', 'Controlled production at every stage'),
          titled('Export to 50+ countries', 'Manufacturing strength worldwide'),
        ],
      },
      products: {
        eyebrow: 'Our products',
        title: 'Professional solutions, powerful results',
        description: 'The right formula, high impact and reliable performance for every application.',
        viewAllLabel: 'View all products',
        detailLabel: 'View product',
      },
      strengths: {
        eyebrow: 'Why Polumat?',
        title: 'Powerful solutions chosen by professionals',
        items: [
          titled('High performance', 'Formulas engineered for demanding conditions.'),
          titled('Premium quality', 'Quality control from raw material to filling.'),
          titled('Modern production', 'High-capacity, modern production lines.'),
          titled('Global experience', 'An export network reaching 50+ countries.'),
          titled('Professional use', 'Developed for maintenance and service teams.'),
          titled('Private label', 'Custom formula, packaging and label production.'),
        ],
      },
      industries: {
        eyebrow: 'Application areas',
        title: 'Reliable maintenance solutions for every sector',
        description: 'Discover sector-specific product recommendations and application scenarios.',
        detailLabel: 'Explore solutions',
        viewAll: 'All application areas',
      },
      privateLabel: {
        eyebrow: 'Private label',
        title: 'Professional chemical products under your own brand',
        description:
          'Strengthen your brand with custom formulas, packaging and label options while we manage production.',
        action: 'Request a private label quote',
        features: [
          titled('Custom formula', 'Product development for your brand'),
          titled('Custom packaging', 'Multiple volume and box options'),
          titled('Custom label', 'Professional label design'),
          titled('Filling & packing', 'High-quality filling and packing'),
          titled('Logistics support', 'On-time delivery solutions'),
        ],
        processTitle: 'Private label process',
        process: [
          titled('Define the need', 'Product, packaging and target market analysis.'),
          titled('Formula & sample', 'Custom formulation and sample preparation.'),
          titled('Design & packaging', 'Label, box and packaging preparation.'),
          titled('Production & delivery', 'Production and dispatch of approved products.'),
        ],
      },
      about: {
        eyebrow: 'About us',
        title: 'Your trusted partner in chemical and aerosol solutions',
        description:
          'Polumat develops high-performance aerosol products with modern production infrastructure, a quality-first approach and long-term partnerships.',
        action: 'Learn more about us',
        imageAlt: 'Polumat production facility and logistics area',
        videoPlayLabel: 'Watch the promo video',
        stats: [
          {_key: key(), value: '50+', label: 'Export countries'},
          {_key: key(), value: '5', label: 'Continents in partnership'},
          {_key: key(), value: 'Modern', label: 'Production facility'},
          {_key: key(), value: 'Professional', label: 'Product range'},
          {_key: key(), value: 'Private Label', label: 'Production support'},
        ],
      },
      quality: {
        eyebrow: 'Quality & trust',
        title: 'Controlled at every stage, trusted in every product',
        linkLabel: 'Quality certificates',
        items: [
          {_key: key(), label: 'Selected raw materials'},
          {_key: key(), label: 'Controlled production'},
          {_key: key(), label: 'Performance tests'},
          {_key: key(), label: 'Quality control processes'},
          {_key: key(), label: 'Customer satisfaction focused service'},
        ],
        badges: [
          {_key: key(), label: '9001:2015'},
          {_key: key(), label: '14001:2015'},
          {_key: key(), label: '45001:2018'},
          {_key: key(), label: 'Made in Türkiye'},
        ],
      },
      cta: {
        eyebrow: 'Let’s find the right solution',
        title: 'Find the right chemical solution for your business',
        description:
          'Talk to our team about our products, private label production and technical needs.',
        quote: 'Get a quote',
        contact: 'Contact us',
      },
    },
    ar: {
      title: 'الرئيسية',
      seoTitle: 'بولومات كيميا | بخاخات صناعية - كيماويات البناء',
      seoDescription: 'تصنيع احترافي للبخاخات الصناعية وكيماويات البناء. تشايكوما / زونغولداق.',
      hero: {
        eyebrow: 'بخاخات صناعية وكيماويات البناء',
        headingLead: 'كيمياء قوية،',
        headingAccent: 'أداء',
        headingTail: 'أعلى',
        description:
          'حلول كيميائية احترافية لتطبيقات السيارات والصناعة والصيانة والخدمات الفنية.',
        imageAlt: 'عائلة منتجات بخاخات بولومات المهنية',
        primary: 'استعرض المنتجات',
        secondary: 'اطلب عرض سعر',
        trust: [
          titled('استخدام احترافي', 'تركيبات مثبتة ميدانياً'),
          titled('أداء عالٍ', 'نتائج قوية في الظروف الصعبة'),
          titled('جودة ممتازة', 'رقابة في كل مرحلة'),
          titled('تصدير إلى أكثر من 50 دولة', 'قوة إنتاج تصل إلى العالم'),
        ],
      },
      products: {
        eyebrow: 'منتجاتنا',
        title: 'حلول احترافية، نتائج قوية',
        description: 'التركيبة المناسبة والتأثير القوي والأداء الموثوق لكل تطبيق.',
        viewAllLabel: 'عرض كل المنتجات',
        detailLabel: 'عرض المنتج',
      },
      strengths: {
        eyebrow: 'لماذا بولومات؟',
        title: 'حلول قوية يختارها المحترفون',
        items: [
          titled('أداء عالٍ', 'تركيبات مصممة للظروف الصعبة.'),
          titled('جودة ممتازة', 'رقابة من المواد الخام حتى التعبئة.'),
          titled('إنتاج حديث', 'خطوط إنتاج حديثة وعالية السعة.'),
          titled('خبرة عالمية', 'شبكة تصدير تصل إلى أكثر من 50 دولة.'),
          titled('استخدام احترافي', 'طُوّرت لفرق الصيانة والخدمة.'),
          titled('العلامة الخاصة', 'تركيبة وعبوة وملصق مخصص لعلامتك.'),
        ],
      },
      industries: {
        eyebrow: 'مجالات التطبيق',
        title: 'حلول صيانة موثوقة لكل قطاع',
        description: 'اكتشف توصيات المنتجات وسيناريوهات التطبيق لكل قطاع.',
        detailLabel: 'استكشف الحلول',
        viewAll: 'كل مجالات التطبيق',
      },
      privateLabel: {
        eyebrow: 'العلامة الخاصة',
        title: 'منتجات كيميائية احترافية بعلامتك التجارية',
        description:
          'عزز علامتك بتركيبات وعبوات وملصقات مخصصة بينما نتولى نحن الإنتاج.',
        action: 'اطلب عرض سعر للعلامة الخاصة',
        features: [
          titled('تركيبة خاصة', 'تطوير منتج لعلامتك'),
          titled('عبوة خاصة', 'خيارات أحجام وعلب متعددة'),
          titled('ملصق خاص', 'تصميم ملصق احترافي'),
          titled('تعبئة وتغليف', 'تعبئة وتغليف بجودة عالية'),
          titled('دعم لوجستي', 'حلول تسليم في الموعد'),
        ],
        processTitle: 'عملية العلامة الخاصة',
        process: [
          titled('تحديد الاحتياج', 'تحليل المنتج والعبوة والسوق.'),
          titled('التركيبة والعينة', 'تطوير التركيبة وتحضير العينة.'),
          titled('التصميم والعبوة', 'إعداد الملصق والعلبة والعبوة.'),
          titled('الإنتاج والتسليم', 'إنتاج وشحن المنتجات المعتمدة.'),
        ],
      },
      about: {
        eyebrow: 'من نحن',
        title: 'شريكك الموثوق في حلول الكيمياء والبخاخات',
        description:
          'تطور بولومات منتجات البخاخات عالية الأداء ببنية إنتاج حديثة ونهج يركز على الجودة وشراكات طويلة الأمد.',
        action: 'اعرف المزيد عنا',
        imageAlt: 'منشأة إنتاج بولومات ومنطقة الخدمات اللوجستية',
        videoPlayLabel: 'شاهد فيديو التعريف',
        stats: [
          {_key: key(), value: '+50', label: 'دول نصدر إليها'},
          {_key: key(), value: '5', label: 'قارات بشراكات'},
          {_key: key(), value: 'حديث', label: 'مرفق الإنتاج'},
          {_key: key(), value: 'احترافي', label: 'مجموعة المنتجات'},
          {_key: key(), value: 'العلامة الخاصة', label: 'دعم الإنتاج'},
        ],
      },
      quality: {
        eyebrow: 'الجودة والثقة',
        title: 'رقابة في كل مرحلة، ثقة في كل منتج',
        linkLabel: 'شهادات الجودة',
        items: [
          {_key: key(), label: 'مواد خام مختارة'},
          {_key: key(), label: 'إنتاج خاضع للرقابة'},
          {_key: key(), label: 'اختبارات أداء'},
          {_key: key(), label: 'عمليات مراقبة الجودة'},
          {_key: key(), label: 'خدمة تركز على رضا العملاء'},
        ],
        badges: [
          {_key: key(), label: '9001:2015'},
          {_key: key(), label: '14001:2015'},
          {_key: key(), label: '45001:2018'},
          {_key: key(), label: 'Made in Türkiye'},
        ],
      },
      cta: {
        eyebrow: 'لنجد الحل المناسب',
        title: 'اعثر على الحل الكيميائي المناسب لأعمالك',
        description:
          'تحدث مع فريقنا حول المنتجات وتصنيع العلامة الخاصة والاحتياجات الفنية.',
        quote: 'اطلب عرض سعر',
        contact: 'تواصل معنا',
      },
    },
  } as const

  return packs[locale]
}

COPY.tr = buildLocale('tr')
COPY.en = buildLocale('en')
COPY.ar = buildLocale('ar')

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

  console.log(`\nSeeding home page → ${dataset}`)

  const industryIds = await client.fetch<string[]>(
    `*[_type=="applicationArea" && defined(slug.current)]|order(sortOrder asc)[0...6]._id`,
  )
  const featuredProductIds = await client.fetch<string[]>(
    `{
      "mdf": *[_type=="product" && slug.current=="mdf-kit-activator"][0]._id,
      "rest": *[_type=="product" && defined(slug.current) && slug.current != "mdf-kit-activator"]|order(sortOrder asc)[0...5]._id
    }`,
  ).then((result: {mdf?: string; rest?: string[]}) =>
    [result.mdf, ...(result.rest || [])].filter((id): id is string => Boolean(id)),
  )

  const sharedHeroImage = await uploadLocalImage(client, HERO_IMAGE, COPY.tr.hero.imageAlt)
  console.log(`✓ uploaded ${path.basename(HERO_IMAGE)}`)

  const refs: Array<{language: string; id: string}> = []

  for (const language of ['tr', 'en', 'ar'] as const) {
    const copy = COPY[language]
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
      hero: {
        _type: 'homeHero',
        eyebrow: copy.hero.eyebrow,
        headingLead: copy.hero.headingLead,
        headingAccent: copy.hero.headingAccent,
        headingTail: copy.hero.headingTail,
        description: copy.hero.description,
        desktopImage: {...sharedHeroImage, alt: copy.hero.imageAlt},
        primaryCta: cta(copy.hero.primary, '/products', 'primary'),
        secondaryCta: cta(copy.hero.secondary, '/request-a-quote', 'secondary'),
        trustItems: copy.hero.trust.map((item) => ({
          ...item,
          _type: 'homeHeroTrustItem',
        })),
      },
      productsSection: {
        _type: 'homeProductsSection',
        ...copy.products,
        products: (featuredProductIds || []).map((id) => ({
          _type: 'reference',
          _ref: id,
          _key: key(),
        })),
      },
      strengthsSection: {
        _type: 'homeStrengthsSection',
        eyebrow: copy.strengths.eyebrow,
        title: copy.strengths.title,
        items: copy.strengths.items.map((item) => ({
          ...item,
          _type: 'homeStrengthItem',
        })),
      },
      industriesSection: {
        _type: 'homeIndustriesSection',
        eyebrow: copy.industries.eyebrow,
        title: copy.industries.title,
        description: copy.industries.description,
        detailLabel: copy.industries.detailLabel,
        viewAllCta: cta(copy.industries.viewAll, '/industries', 'secondary'),
        areas: (industryIds || []).map((id) => ({
          _type: 'homeIndustryCard',
          _key: key(),
          area: {
            _type: 'reference',
            _ref: id,
          },
        })),
      },
      privateLabelSection: {
        _type: 'homePrivateLabelSection',
        eyebrow: copy.privateLabel.eyebrow,
        title: copy.privateLabel.title,
        description: copy.privateLabel.description,
        cta: cta(copy.privateLabel.action, '/private-label', 'primary'),
        features: copy.privateLabel.features.map((item) => ({
          ...item,
          _type: 'homePrivateLabelFeature',
        })),
        processTitle: copy.privateLabel.processTitle,
        process: copy.privateLabel.process.map((item) => ({
          ...item,
          _type: 'homePrivateLabelStep',
        })),
      },
      aboutSection: {
        _type: 'homeAboutSection',
        eyebrow: copy.about.eyebrow,
        title: copy.about.title,
        description: copy.about.description,
        cta: cta(copy.about.action, '/about', 'secondary'),
        videoPlayLabel: copy.about.videoPlayLabel,
        stats: copy.about.stats.map((stat) => ({
          ...stat,
          _type: 'homeAboutStat',
        })),
      },
      qualitySection: {
        _type: 'homeQualitySection',
        eyebrow: copy.quality.eyebrow,
        title: copy.quality.title,
        link: cta(copy.quality.linkLabel, '/quality-certificates', 'primary'),
        items: copy.quality.items.map((item) => ({
          ...item,
          _type: 'homeQualityItem',
        })),
        badges: copy.quality.badges.map((badge) => ({
          ...badge,
          _type: 'homeQualityBadge',
        })),
      },
      ctaSection: {
        _type: 'homeCtaSection',
        eyebrow: copy.cta.eyebrow,
        title: copy.cta.title,
        description: copy.cta.description,
        primaryCta: cta(copy.cta.quote, '/request-a-quote', 'primary'),
        secondaryCta: cta(copy.cta.contact, '/contact', 'secondary'),
      },
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
