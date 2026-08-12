/**
 * Enrich the MDF Kit Activator product from the official Polumat 2025 catalog.
 *
 * Defaults to dry-run and preserves images, categories, documents and all
 * unrelated product fields. The mutation is revision-guarded to avoid
 * overwriting concurrent Studio edits.
 *
 * Usage:
 *   npx tsx migration/scripts/enrich-mdf-kit-activator.ts
 *   npx tsx migration/scripts/enrich-mdf-kit-activator.ts --write
 *   npx tsx migration/scripts/enrich-mdf-kit-activator.ts --verify
 */
import {createClient, type SanityClient} from '@sanity/client'
import {randomBytes} from 'node:crypto'
import {existsSync, readFileSync} from 'node:fs'
import path from 'node:path'

const PRODUCT_SLUG = 'mdf-kit-activator'
const LANGUAGES = ['tr', 'en', 'ar'] as const

type Language = (typeof LANGUAGES)[number]
type LocalizedCopy = Record<Language, string>

type ProductDocument = {
  _id: string
  _rev: string
  _type: 'product'
  seo?: Record<string, unknown>
  [key: string]: unknown
}

type RichBlock = {
  text: string
  style?: 'normal' | 'h2' | 'h3'
  listItem?: 'bullet' | 'number'
}

function loadEnvFile(filePath: string) {
  if (!existsSync(filePath)) return

  for (const rawLine of readFileSync(filePath, 'utf8').split('\n')) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue

    const separator = line.indexOf('=')
    if (separator <= 0) continue

    const name = line.slice(0, separator).trim()
    let value = line.slice(separator + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!(name in process.env)) process.env[name] = value
  }
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

function localizedText(values: LocalizedCopy) {
  return LANGUAGES.map((language) => ({
    _key: arrayKey(),
    _type: 'internationalizedArrayTextValue',
    language,
    value: values[language],
  }))
}

function portableTextBlock(block: RichBlock) {
  return {
    _key: arrayKey(),
    _type: 'block',
    children: [
      {
        _key: arrayKey(),
        _type: 'span',
        marks: [],
        text: block.text,
      },
    ],
    markDefs: [],
    style: block.style || 'normal',
    ...(block.listItem ? {level: 1, listItem: block.listItem} : {}),
  }
}

function localizedPortableText(values: Record<Language, RichBlock[]>) {
  return LANGUAGES.map((language) => ({
    _key: arrayKey(),
    _type: 'internationalizedArrayPortableTextValue',
    language,
    value: values[language].map(portableTextBlock),
  }))
}

function feature(title: LocalizedCopy, description: LocalizedCopy) {
  return {
    _key: arrayKey(),
    _type: 'featureItem',
    title: localizedString(title),
    description: localizedText(description),
  }
}

function specification(
  label: LocalizedCopy,
  value: string | LocalizedCopy,
  options: {unit?: string | LocalizedCopy; note?: LocalizedCopy} = {},
) {
  const valueCopy = typeof value === 'string' ? {tr: value, en: value, ar: value} : value
  const unitCopy =
    typeof options.unit === 'string'
      ? {tr: options.unit, en: options.unit, ar: options.unit}
      : options.unit
  return {
    _key: arrayKey(),
    _type: 'specificationItem',
    label: localizedString(label),
    value: localizedString(valueCopy),
    ...(unitCopy ? {unit: localizedString(unitCopy)} : {}),
    ...(options.note ? {note: localizedString(options.note)} : {}),
  }
}

function packagingVariant(label: LocalizedCopy, volume: string) {
  return {
    _key: arrayKey(),
    _type: 'packagingVariant',
    label: localizedString(label),
    volume,
  }
}

function getClient(): SanityClient {
  loadEnvFile(path.resolve(process.cwd(), '.env.local'))
  loadEnvFile(path.resolve(process.cwd(), '.env'))

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
  const token = process.env.SANITY_API_WRITE_TOKEN
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-08-02'

  if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
  if (!token) throw new Error('Missing SANITY_API_WRITE_TOKEN')

  return createClient({projectId, dataset, apiVersion, token, useCdn: false})
}

async function getProduct(client: SanityClient) {
  return client.fetch<ProductDocument | null>(
    `*[
      _type == "product" &&
      !(_id in path("drafts.**")) &&
      slug.current == $slug
    ][0]{_id, _rev, _type, seo}`,
    {slug: PRODUCT_SLUG},
    {perspective: 'raw'},
  )
}

function hasEveryLanguage(value: unknown) {
  if (!Array.isArray(value)) return false
  return LANGUAGES.every((language) =>
    value.some(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        'language' in item &&
        item.language === language &&
        'value' in item &&
        item.value !== null &&
        item.value !== '',
    ),
  )
}

function verifyEnrichment(product: ProductDocument) {
  const localizedFields = [
    'title',
    'badge',
    'shortDescription',
    'body',
    'usageAreas',
    'applicationInstructions',
    'warnings',
  ]
  const missing = localizedFields.filter((field) => !hasEveryLanguage(product[field]))

  const benefits = Array.isArray(product.benefits) ? product.benefits : []
  const features = Array.isArray(product.features) ? product.features : []
  const packagingVariants = Array.isArray(product.packagingVariants)
    ? product.packagingVariants
    : []
  const specificationGroups = Array.isArray(product.specificationGroups)
    ? product.specificationGroups
    : []
  const seo =
    typeof product.seo === 'object' && product.seo !== null
      ? (product.seo as Record<string, unknown>)
      : {}

  const featureCopyComplete = [...benefits, ...features].every(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      'title' in item &&
      hasEveryLanguage(item.title) &&
      'description' in item &&
      hasEveryLanguage(item.description),
  )
  const packagingCopyComplete = packagingVariants.every(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      'label' in item &&
      hasEveryLanguage(item.label),
  )
  const specificationCopyComplete = specificationGroups.every((group) => {
    if (typeof group !== 'object' || group === null) return false
    if (!('title' in group) || !hasEveryLanguage(group.title)) return false
    if (!('items' in group) || !Array.isArray(group.items)) return false
    return group.items.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        'label' in item &&
        hasEveryLanguage(item.label),
    )
  })
  const specificationCount = specificationGroups.reduce(
    (total, group) =>
      total +
      (typeof group === 'object' &&
      group !== null &&
      'items' in group &&
      Array.isArray(group.items)
        ? group.items.length
        : 0),
    0,
  )

  if (missing.length) throw new Error(`Missing localized fields: ${missing.join(', ')}`)
  if (benefits.length !== 4 || features.length !== 4 || !featureCopyComplete) {
    throw new Error('Benefits/features verification failed')
  }
  if (packagingVariants.length !== 2 || !packagingCopyComplete) {
    throw new Error('Packaging verification failed')
  }
  if (
    specificationGroups.length !== 2 ||
    specificationCount !== 10 ||
    !specificationCopyComplete
  ) {
    throw new Error('Specification verification failed')
  }
  if (!hasEveryLanguage(seo.title) || !hasEveryLanguage(seo.description)) {
    throw new Error('SEO localization verification failed')
  }

  return {
    benefits: benefits.length,
    features: features.length,
    packagingVariants: packagingVariants.length,
    specificationGroups: specificationGroups.length,
    specifications: specificationCount,
  }
}

function buildPatch(product: ProductDocument) {
  const title = {
    tr: 'MDF Kit Aktivatör',
    en: 'MDF Kit Activator',
    ar: 'منشّط لاصق MDF',
  }

  const shortDescription = {
    tr: 'Yüksek viskoziteli yapıştırıcı ve aktivatörden oluşan MDF Kit; ahşap, MDF, kauçuk, deri ve plastik yüzeylerde hızlı, güçlü ve kontrollü yapışma sağlar.',
    en: 'A high-viscosity adhesive and activator kit for fast, strong and controlled bonding on wood, MDF, rubber, leather and plastic surfaces.',
    ar: 'طقم من لاصق عالي اللزوجة ومنشّط، يوفّر التصاقاً سريعاً وقوياً ومحكماً على الخشب وMDF والمطاط والجلد والأسطح البلاستيكية.',
  }

  return {
    title: localizedString(title),
    badge: localizedString({
      tr: 'İki Bileşenli Hızlı Yapıştırıcı',
      en: 'Two-Component Fast Adhesive',
      ar: 'لاصق سريع ثنائي المكوّن',
    }),
    shortDescription: localizedText(shortDescription),
    body: localizedPortableText({
      tr: [
        {
          text: 'MDF Kit Aktivatör; ahşap parçaların montajı ve tamiratı ile MDF, kauçuk, deri ve plastik yüzeylerin yapıştırılması için geliştirilmiş hızlı yapıştırıcı setidir. Özellikle hızlı kürleşme gereken uygulamalarda tercih edilir.',
        },
        {
          text: 'Yüksek viskoziteli yapıştırıcı, gözenekli ve yapıştırılması zor yüzeylerde kontrollü uygulamaya yardımcı olur. Dikey yüzeylerde akma ve sıçrama yapmadan güçlü bir bağ elde edilmesini destekler.',
        },
        {
          text: 'Uygulama sonrasında aktivatör, kuruma süresini hızlandırır ve uygulanan yüzeyde yapışma gücünün artmasına yardımcı olur.',
        },
      ],
      en: [
        {
          text: 'MDF Kit Activator is a fast adhesive set developed for assembling and repairing wooden parts and for bonding MDF, rubber, leather and plastic surfaces. It is especially suitable for applications that require fast curing.',
        },
        {
          text: 'The high-viscosity adhesive supports controlled application on porous and difficult-to-bond surfaces. It helps create a strong bond on vertical surfaces without running or splashing.',
        },
        {
          text: 'After application, the activator helps shorten drying time and increase adhesion strength on the treated surface.',
        },
      ],
      ar: [
        {
          text: 'منشّط لاصق MDF هو طقم لاصق سريع طُوّر لتجميع وإصلاح الأجزاء الخشبية ولصق أسطح MDF والمطاط والجلد والبلاستيك. ويُفضّل خصوصاً في التطبيقات التي تتطلب تصلباً سريعاً.',
        },
        {
          text: 'يساعد اللاصق عالي اللزوجة على التطبيق المحكم فوق الأسطح المسامية وصعبة اللصق. كما يدعم تكوين التصاق قوي على الأسطح العمودية من دون سيلان أو تناثر.',
        },
        {
          text: 'بعد التطبيق، يساعد المنشّط على تقصير زمن الجفاف وزيادة قوة الالتصاق على السطح المعالج.',
        },
      ],
    }),
    benefits: [
      feature(
        {tr: 'Daha hızlı kürleşme', en: 'Faster curing', ar: 'تصلب أسرع'},
        {
          tr: 'Aktivatör, uygulama sonrasında kuruma süresinin kısalmasına yardımcı olur.',
          en: 'The activator helps shorten drying time after application.',
          ar: 'يساعد المنشّط على تقصير زمن الجفاف بعد التطبيق.',
        },
      ),
      feature(
        {tr: 'Yüksek yapışma gücü', en: 'High adhesion strength', ar: 'قوة التصاق عالية'},
        {
          tr: 'Montaj ve tamirat uygulamalarında güçlü ve kalıcı bir bağ oluşmasını destekler.',
          en: 'Supports a strong, durable bond in assembly and repair applications.',
          ar: 'يدعم تكوين التصاق قوي ومتين في أعمال التجميع والإصلاح.',
        },
      ),
      feature(
        {
          tr: 'Dikey yüzeylerde kontrollü uygulama',
          en: 'Controlled vertical application',
          ar: 'تطبيق محكم على الأسطح العمودية',
        },
        {
          tr: 'Akma ve sıçrama yapmadan uygulama kolaylığı sağlar.',
          en: 'Provides easier application without running or splashing.',
          ar: 'يسهّل التطبيق من دون سيلان أو تناثر.',
        },
      ),
      feature(
        {
          tr: 'Zor yüzeylerde güçlü performans',
          en: 'Strong performance on difficult surfaces',
          ar: 'أداء قوي على الأسطح الصعبة',
        },
        {
          tr: 'Yüksek viskozitesi sayesinde gözenekli ve yapıştırılması zor yüzeylerde yapışmayı destekler.',
          en: 'Its high viscosity supports bonding on porous and difficult-to-bond surfaces.',
          ar: 'تدعم لزوجته العالية الالتصاق على الأسطح المسامية وصعبة اللصق.',
        },
      ),
    ],
    features: [
      feature(
        {
          tr: 'Yapıştırıcı ve aktivatör seti',
          en: 'Adhesive and activator set',
          ar: 'طقم لاصق ومنشّط',
        },
        {
          tr: 'Hızlı yapıştırma uygulamaları için iki parçalı set halinde sunulur.',
          en: 'Supplied as a two-part set for fast bonding applications.',
          ar: 'يُقدّم كطقم من جزأين لتطبيقات اللصق السريع.',
        },
      ),
      feature(
        {tr: 'Ahşap ve MDF uyumu', en: 'Wood and MDF compatibility', ar: 'متوافق مع الخشب وMDF'},
        {
          tr: 'Ahşap parçaların montaj ve tamiratında, MDF yüzeylerin yapıştırılmasında kullanılır.',
          en: 'Used for assembling and repairing wood parts and for bonding MDF surfaces.',
          ar: 'يستخدم لتجميع وإصلاح الأجزاء الخشبية ولصق أسطح MDF.',
        },
      ),
      feature(
        {
          tr: 'Çoklu yüzey kullanımı',
          en: 'Multi-surface use',
          ar: 'استخدام على أسطح متعددة',
        },
        {
          tr: 'Kauçuk, deri ve plastik yüzeylerde kullanıma uygundur.',
          en: 'Suitable for rubber, leather and plastic surfaces.',
          ar: 'مناسب لأسطح المطاط والجلد والبلاستيك.',
        },
      ),
      feature(
        {tr: 'Yüksek viskozite', en: 'High viscosity', ar: 'لزوجة عالية'},
        {
          tr: '25 °C’de 1500 - 5000 cP viskozite aralığı ile kontrollü uygulamaya yardımcı olur.',
          en: 'A viscosity range of 1500 - 5000 cP at 25 °C supports controlled application.',
          ar: 'يساعد نطاق لزوجة 1500 - 5000 cP عند 25 درجة مئوية على التطبيق المحكم.',
        },
      ),
    ],
    usageAreas: localizedPortableText({
      tr: [
        {text: 'MDF Kit Aktivatör aşağıdaki montaj, onarım ve hızlı yapıştırma uygulamalarında kullanılır:'},
        {text: 'Ahşap parçaların montajı ve tamiratı', listItem: 'bullet'},
        {text: 'MDF ve mobilya bileşenlerinin yapıştırılması', listItem: 'bullet'},
        {text: 'Kauçuk, deri ve plastik yüzeylerin birleştirilmesi', listItem: 'bullet'},
        {text: 'Gözenekli ve yapıştırılması zor yüzeyler', listItem: 'bullet'},
        {text: 'Dikey yüzeyler ve hızlı kürleşme gereken uygulamalar', listItem: 'bullet'},
      ],
      en: [
        {text: 'MDF Kit Activator is intended for the following assembly, repair and fast-bonding applications:'},
        {text: 'Assembly and repair of wooden parts', listItem: 'bullet'},
        {text: 'Bonding MDF and furniture components', listItem: 'bullet'},
        {text: 'Joining rubber, leather and plastic surfaces', listItem: 'bullet'},
        {text: 'Porous and difficult-to-bond surfaces', listItem: 'bullet'},
        {text: 'Vertical surfaces and applications requiring fast curing', listItem: 'bullet'},
      ],
      ar: [
        {text: 'يُستخدم منشّط لاصق MDF في تطبيقات التجميع والإصلاح واللصق السريع التالية:'},
        {text: 'تجميع وإصلاح الأجزاء الخشبية', listItem: 'bullet'},
        {text: 'لصق MDF ومكوّنات الأثاث', listItem: 'bullet'},
        {text: 'ربط أسطح المطاط والجلد والبلاستيك', listItem: 'bullet'},
        {text: 'الأسطح المسامية وصعبة اللصق', listItem: 'bullet'},
        {text: 'الأسطح العمودية والتطبيقات التي تتطلب تصلباً سريعاً', listItem: 'bullet'},
      ],
    }),
    applicationInstructions: localizedPortableText({
      tr: [
        {text: 'Yüzeylerin kuru, temiz, tozdan ve yağdan arındırılmış olduğundan emin olun.', listItem: 'number'},
        {text: 'Yapıştırıcıyı ve aktivatörü ürün etiketindeki talimatlara göre birlikte kullanın. Uygulama miktarı ve bekleme süresi yüzeye ve ortam koşullarına göre değişebilir.', listItem: 'number'},
        {text: 'Parçaları doğru konumda bir araya getirip bağ oluşana kadar sabit tutun.', listItem: 'number'},
        {text: 'Hassas veya görünür yüzeylerde kullanmadan önce küçük bir alanda ön deneme yapın.', listItem: 'number'},
      ],
      en: [
        {text: 'Ensure that the surfaces are dry, clean and free of dust and grease.', listItem: 'number'},
        {text: 'Use the adhesive and activator together according to the product label. Application amount and waiting time may vary with the surface and ambient conditions.', listItem: 'number'},
        {text: 'Align and join the parts, then hold them in position until the bond forms.', listItem: 'number'},
        {text: 'Pre-test on a small area before use on sensitive or visible surfaces.', listItem: 'number'},
      ],
      ar: [
        {text: 'تأكد من أن الأسطح جافة ونظيفة وخالية من الغبار والشحوم.', listItem: 'number'},
        {text: 'استخدم اللاصق والمنشّط معاً وفق تعليمات ملصق المنتج. قد تختلف كمية التطبيق ومدة الانتظار بحسب السطح والظروف المحيطة.', listItem: 'number'},
        {text: 'حاذِ القطع واجمعها، ثم ثبّتها في مكانها حتى يتكوّن الالتصاق.', listItem: 'number'},
        {text: 'اختبر المنتج أولاً على مساحة صغيرة من الأسطح الحساسة أو الظاهرة.', listItem: 'number'},
      ],
    }),
    warnings: localizedPortableText({
      tr: [
        {text: 'Kullanmadan önce ürün etiketini ve güvenlik bilgi formunu okuyun.', listItem: 'bullet'},
        {text: 'İyi havalandırılmış bir ortamda kullanın; göz ve cilt temasından kaçının.', listItem: 'bullet'},
        {text: 'Isı, kıvılcım, açık alev ve doğrudan güneş ışığından uzakta kullanın ve saklayın.', listItem: 'bullet'},
        {text: 'Çocukların ulaşamayacağı yerde saklayın.', listItem: 'bullet'},
      ],
      en: [
        {text: 'Read the product label and safety data sheet before use.', listItem: 'bullet'},
        {text: 'Use in a well-ventilated area and avoid contact with eyes and skin.', listItem: 'bullet'},
        {text: 'Use and store away from heat, sparks, open flames and direct sunlight.', listItem: 'bullet'},
        {text: 'Keep out of reach of children.', listItem: 'bullet'},
      ],
      ar: [
        {text: 'اقرأ ملصق المنتج وورقة بيانات السلامة قبل الاستخدام.', listItem: 'bullet'},
        {text: 'استخدمه في مكان جيد التهوية وتجنّب ملامسة العينين والجلد.', listItem: 'bullet'},
        {text: 'استخدمه وخزّنه بعيداً عن الحرارة والشرر واللهب المكشوف وأشعة الشمس المباشرة.', listItem: 'bullet'},
        {text: 'احفظه بعيداً عن متناول الأطفال.', listItem: 'bullet'},
      ],
    }),
    packagingVariants: [
      packagingVariant(
        {
          tr: '400ml + 80gr',
          en: '400ml + 80gr',
          ar: '400ml + 80gr',
        },
        '400ml + 80gr',
      ),
      packagingVariant(
        {
          tr: '200ml + 40gr',
          en: '200ml + 40gr',
          ar: '200ml + 40gr',
        },
        '200ml + 40gr',
      ),
    ],
    specificationGroups: [
      {
        _key: arrayKey(),
        _type: 'specificationGroup',
        title: localizedString({
          tr: 'Teknik özellikler',
          en: 'Technical specifications',
          ar: 'المواصفات التقنية',
        }),
        items: [
          specification(
            {tr: 'Renk', en: 'Color', ar: 'اللون'},
            {tr: 'Şeffaf', en: 'Transparent', ar: 'شفاف'},
          ),
          specification(
            {tr: 'Koku', en: 'Odor', ar: 'الرائحة'},
            {tr: 'Karakteristik', en: 'Characteristic', ar: 'مميزة'},
          ),
          specification(
            {tr: 'Yoğunluk', en: 'Density', ar: 'الكثافة'},
            '1.3',
            {unit: {tr: 'g/cm³', en: 'g/cm³', ar: 'غ/سم³'}},
          ),
          specification(
            {tr: 'Viskozite', en: 'Viscosity', ar: 'اللزوجة'},
            '1500 - 5000',
            {
              unit: {tr: 'cP', en: 'cP', ar: 'سنتي بواز'},
              note: {tr: '25 °C’de', en: 'At 25 °C', ar: 'عند 25 درجة مئوية'},
            },
          ),
          specification({tr: 'pH değeri', en: 'pH value', ar: 'قيمة الأس الهيدروجيني'}, '8'),
          specification(
            {tr: 'Kuruma süresi', en: 'Drying time', ar: 'زمن الجفاف'},
            '30 - 60',
            {unit: {tr: 'dk', en: 'min', ar: 'دقيقة'}},
          ),
          specification(
            {tr: 'Parlama noktası', en: 'Flash point', ar: 'نقطة الوميض'},
            '> 60',
            {unit: {tr: '°C', en: '°C', ar: '°م'}},
          ),
          specification(
            {tr: 'Donma noktası', en: 'Freezing point', ar: 'نقطة التجمد'},
            {tr: '-15 ile -5', en: '-15 to -5', ar: '-15 إلى -5'},
            {unit: {tr: '°C', en: '°C', ar: '°م'}},
          ),
        ],
      },
      {
        _key: arrayKey(),
        _type: 'specificationGroup',
        title: localizedString({
          tr: 'Ambalaj ve lojistik',
          en: 'Packaging and logistics',
          ar: 'التعبئة والخدمات اللوجستية',
        }),
        items: [
          specification(
            {tr: 'Büyük set', en: 'Large set', ar: 'الطقم الكبير'},
            {tr: '400ml + 80gr', en: '400ml + 80g', ar: '400 مل + 80 غ'},
            {
              note: {
                tr: '24 adet/koli · 80 koli/palet',
                en: '24 units/case · 80 cases/pallet',
                ar: '24 وحدة/كرتون · 80 كرتون/منصة',
              },
            },
          ),
          specification(
            {tr: 'Küçük set', en: 'Small set', ar: 'الطقم الصغير'},
            {tr: '200ml + 40gr', en: '200ml + 40g', ar: '200 مل + 40 غ'},
            {
              note: {
                tr: '24 adet/koli · 96 koli/palet',
                en: '24 units/case · 96 cases/pallet',
                ar: '24 وحدة/كرتون · 96 كرتون/منصة',
              },
            },
          ),
        ],
      },
    ],
    seo: {
      ...(product.seo || {}),
      _type: 'localizedSeo',
      title: localizedString({
        tr: 'MDF Kit Aktivatör | Hızlı ve Güçlü Yapıştırıcı',
        en: 'MDF Kit Activator | Fast, Strong Adhesive',
        ar: 'منشّط لاصق MDF | لصق سريع وقوي',
      }),
      description: localizedText({
        tr: 'Ahşap, MDF, kauçuk, deri ve plastik yüzeylerde hızlı ve güçlü yapışma sağlayan yüksek viskoziteli MDF Kit Aktivatör setini inceleyin.',
        en: 'Explore the high-viscosity MDF Kit Activator set for fast, strong bonding on wood, MDF, rubber, leather and plastic surfaces.',
        ar: 'اكتشف طقم منشّط لاصق MDF عالي اللزوجة للالتصاق السريع والقوي على الخشب وMDF والمطاط والجلد والبلاستيك.',
      }),
    },
  }
}

async function main() {
  const write = process.argv.includes('--write')
  const verify = process.argv.includes('--verify')
  const client = getClient()
  const product = await getProduct(client)

  if (!product) throw new Error(`Published product not found: ${PRODUCT_SLUG}`)

  const draft = await client.getDocument(`drafts.${product._id}`)
  if (draft) {
    throw new Error(
      `A draft exists for ${PRODUCT_SLUG}. Publish or discard it before running this targeted enrichment.`,
    )
  }

  if (verify) {
    const completeProduct = await client.getDocument<ProductDocument>(product._id)
    if (!completeProduct) throw new Error(`Product disappeared during verification: ${product._id}`)
    const counts = verifyEnrichment(completeProduct)
    console.log(`Verified revision: ${completeProduct._rev}`)
    console.log(`Languages: ${LANGUAGES.join(', ')}`)
    console.log(
      `Benefits: ${counts.benefits} · Features: ${counts.features} · Packaging variants: ${counts.packagingVariants}`,
    )
    console.log(
      `Specification groups: ${counts.specificationGroups} · Specification rows: ${counts.specifications}`,
    )
    console.log('All localized MDF Kit Activator fields are complete.')
    return
  }

  const patch = buildPatch(product)
  console.log(`Product: ${PRODUCT_SLUG}`)
  console.log(`Document: ${product._id}`)
  console.log(`Revision: ${product._rev}`)
  console.log(`Languages: ${LANGUAGES.join(', ')}`)
  console.log(`Fields to update: ${Object.keys(patch).join(', ')}`)

  if (!write) {
    console.log('Dry run only. Re-run with --write to apply the enrichment.')
    return
  }

  const result = await client
    .patch(product._id)
    .ifRevisionId(product._rev)
    .set(patch)
    .commit({returnDocuments: true})

  console.log(`Updated revision: ${result._rev}`)
  console.log('MDF Kit Activator enrichment completed.')
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
