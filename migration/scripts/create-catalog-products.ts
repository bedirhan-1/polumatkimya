/**
 * Creates the products that are in the new catalog (Silikon Grubu) but not yet
 * on the site: Poliüretan Mastik Sosis, Poliüretan Mastik, Foam Köpük, Montage Fix,
 * Silikon Tabancası.
 *
 * - Content (TR/EN/AR) comes from the catalog pages.
 * - Images come from migration/assets/silicone (<key>-card.jpg / <key>-packshot.png).
 * - Category and application areas are copied from an existing sibling product
 *   (REFERENCE_SLUG) so they can be adjusted in Studio afterwards.
 * - Documents are created as Sanity DRAFTS (`drafts.<id>`) with status "published",
 *   so nothing appears on the site until someone clicks Publish in Studio.
 * - Products that already exist (draft or published) are skipped.
 *
 * Defaults to dry-run. Never writes unless --write is passed.
 *
 * Usage:
 *   bun run create:catalog-products
 *   bun run create:catalog-products -- --write
 *   bun run create:catalog-products -- --write --only=montage-fix
 *   bun run create:catalog-products -- --write --dataset=development
 */
import {createClient, type SanityClient} from '@sanity/client'
import {randomBytes} from 'node:crypto'
import {existsSync, readFileSync} from 'node:fs'
import path from 'node:path'

import {localizedPortableText, localizedString, localizedText} from './lib'
import {localizeSpecLabel, localizeSpecValue, uiCopy} from './product-field-i18n'

type Loc = {tr: string; en: string; ar: string}
type Row = {label: Loc; value: Loc}

type NewProduct = {
  slug: string
  assetKey: string
  title: Loc
  description: Loc
  features: Loc[]
  packaging: string[]
  specs: Row[]
}

/** Existing product whose category / application areas are copied. */
const REFERENCE_SLUG = 'siliconized-sealant'
const ASSET_DIR = path.resolve(process.cwd(), 'migration/assets/silicone')

const L = (tr: string, en: string, ar: string): Loc => ({tr, en, ar})
const row = (label: Loc, value: Loc): Row => ({label, value})
/** Same value in all languages (numbers, codes). */
const same = (value: string): Loc => ({tr: value, en: value, ar: value})
/** Label / value localized with the helpers the existing products use. */
const stock = (labelTr: string, valueRaw: string): Row => ({
  label: localizeSpecLabel(labelTr),
  value: localizeSpecValue(valueRaw),
})

const POLYURETHANE_TEXT = L(
  'Tek bileşenli, havanın nemiyle kürlenen poliüretan esaslı yapıştırma ve sızdırmazlık mastiğidir. Yapı birleşim derzlerinde kullanılır; kalıcı esnekliğe sahiptir ve boyanabilir.',
  'One-component, moisture-curing polyurethane bonding and sealing compound for construction connection joints. Remains flexible and can be painted.',
  'مانع تسرب ولصق أحادي المكون على أساس البولي يوريثان، يتصلب برطوبة الهواء. يستخدم لفواصل الوصلات الإنشائية، ويبقى مرنا وقابلا للطلاء.',
)

const CHEMICAL_BASE = L('Kimyasal baz', 'Chemical Base', 'الأساس الكيميائي')
const POLYURETHANE = L('Poliüretan', 'Polyurethane', 'بولي يوريثان')
const DENSITY = L('Yoğunluk', 'Density', 'الكثافة')
const SURFACE_DRYING = L('Yüzey kuruma', 'Surface Drying', 'زمن جفاف السطح')
const CURE_RATE = L('Kürlenme', 'Cure Rate', 'معدل التصلب')
const COLOUR = L('Renk', 'Colour', 'اللون')
const PACKAGING = L('Ambalaj', 'Packaging', 'العبوة')
const TEST_CONDITIONS = L('Ölçüm koşulları', 'Test conditions', 'شروط القياس')
const TEST_CONDITIONS_VALUE = L(
  '23 °C ve %50 bağıl nem',
  '23 °C and 50% relative humidity',
  '23 °م ورطوبة نسبية 50%',
)

export const NEW_PRODUCTS: NewProduct[] = [
  {
    slug: 'polyurethane-sealant-sausage',
    assetKey: 'pu-sealant-sausage',
    title: L(
      'Poliüretan Mastik Sosis',
      'Polyurethane Sealant - Sausage',
      'مانع تسرب من البولي يوريثان - عبوة مرنة',
    ),
    description: POLYURETHANE_TEXT,
    features: [
      L('Poliüretan', 'Polyurethane', 'بولي يوريثان'),
      L('Sosis', 'Sausage', 'عبوة مرنة'),
    ],
    packaging: ['600 ml'],
    specs: [
      row(CHEMICAL_BASE, POLYURETHANE),
      row(DENSITY, same('1,30 ±0,04 g/cm³')),
      row(L('Shore A', 'Shore A', 'صلادة شور A'), same('40')),
      row(SURFACE_DRYING, L('60 dk.', '60 min', '60 دقيقة')),
      row(CURE_RATE, L('3 mm / 24 saat', '3 mm / 24 h', '3 mm / 24 h')),
      row(COLOUR, L('Beyaz / Gri / Siyah', 'White / Grey / Black', 'أبيض / رمادي / أسود')),
      row(PACKAGING, L('Sosis', 'Foil sausage', 'عبوة مرنة')),
      row(
        L('Net ağırlık (600 ml)', 'Net Weight (600 ml)', 'الوزن الصافي (600 مل)'),
        same('750 g'),
      ),
      row(TEST_CONDITIONS, TEST_CONDITIONS_VALUE),
      stock('GRAMAJ', '600 ml / 750 g'),
      stock('KOLİ', '20 Adet'),
      stock('PALET', '60 Koli'),
    ],
  },
  {
    slug: 'polyurethane-sealant',
    assetKey: 'pu-sealant-280',
    title: L('Poliüretan Mastik', 'Polyurethane Sealant', 'مانع تسرب من البولي يوريثان'),
    description: POLYURETHANE_TEXT,
    features: [
      L('Poliüretan', 'Polyurethane', 'بولي يوريثان'),
      L('Sızdırmazlık', 'Sealing', 'إحكام العزل'),
    ],
    packaging: ['280 ml'],
    specs: [
      row(CHEMICAL_BASE, POLYURETHANE),
      row(DENSITY, same('1,30 ±0,04 g/cm³')),
      row(L('Shore A', 'Shore A', 'صلادة شور A'), same('40')),
      row(SURFACE_DRYING, L('60 dk.', '60 min', '60 دقيقة')),
      row(CURE_RATE, L('3 mm / 24 saat', '3 mm / 24 h', '3 mm / 24 h')),
      row(COLOUR, L('Beyaz / Gri / Siyah', 'White / Grey / Black', 'أبيض / رمادي / أسود')),
      row(PACKAGING, L('Alüminyum kartuş', 'Aluminium cartridge', 'خرطوشة المنيوم')),
      row(TEST_CONDITIONS, TEST_CONDITIONS_VALUE),
      stock('GRAMAJ', '280 ml'),
      stock('KOLİ', '24 Adet'),
      stock('PALET', '100 Koli'),
    ],
  },
  {
    slug: 'polyurethane-foam',
    assetKey: 'pu-foam',
    title: L('Foam Köpük', 'Polyurethane Foam', 'رغوة البولي يوريثان'),
    description: L(
      'Tek bileşenli, kendiliğinden genleşen poliüretan montaj ve dolgu köpüğüdür. Kapı ve pencere çevresindeki boşlukların doldurulmasında, boru ve kablo geçişlerinde kullanılır. Isı ve ses yalıtımına katkı sağlar.',
      'One-component, self-expanding polyurethane mounting and filling foam. For gaps around doors and windows, pipe insulation and cable penetrations. Provides thermal and acoustic insulation.',
      'رغوة بولي يوريثان أحادية المكون وذاتية التمدد للتركيب والحشو. تستخدم لملء الفراغات حول الأبواب والنوافذ وعند مرور الأنابيب والكابلات، وتوفر عزلا حراريا وصوتيا.',
    ),
    features: [
      L('Montaj', 'Mounting', 'تركيب'),
      L('Dolgu', 'Filling', 'حشو'),
      L('Isı Yalıtımı', 'Thermal Insulation', 'العزل الحراري'),
    ],
    packaging: ['750 ml', '500 ml', '300 ml'],
    specs: [
      row(CHEMICAL_BASE, POLYURETHANE),
      row(DENSITY, same('20 ±3 kg/m³')),
      row(L('Kesilme süresi', 'Cutting Time', 'زمن القطع'), L('45-60 dk.', '45-60 min', '45-60 دقيقة')),
      row(L('Tam kürlenme', 'Full Cure', 'التصلب الكامل'), L('24 saat', '24 h', '24 h')),
      row(L('Yangın sınıfı', 'Fire Class', 'فئة الحريق'), same('B3')),
      row(L('Ambalaj hacmi', 'Pack Volume', 'حجم العبوة'), same('750 / 500 / 300 ml')),
      row(TEST_CONDITIONS, TEST_CONDITIONS_VALUE),
      stock('GRAMAJ', '750 / 500 / 300 ml'),
      stock('KOLİ', '12 Adet'),
      stock('PALET', '120 / 120 / 140 Koli'),
    ],
  },
  {
    slug: 'montage-fix',
    assetKey: 'montage-fix',
    title: L('Montage Fix', 'Montage Fix Clear Mounting Adhesive', 'لاصق تركيب شفاف'),
    description: L(
      'Şeffaf montaj yapıştırıcısıdır. 290 ml kartuş, uygun mastik tabancasıyla uygulanır. Montaj ve yapıştırma öncesinde yüzeyler temiz, kuru ve sağlam hazırlanmalıdır.',
      'Clear mounting adhesive in a 290 ml cartridge, applied with a suitable sealant gun. Prepare clean, dry and sound surfaces before assembly and bonding.',
      'لاصق تركيب شفاف بخرطوشة سعة 290 مل، يُطبّق باستخدام مسدس مناسب. يجب تجهيز أسطح نظيفة وجافة ومتماسكة قبل التركيب واللصق.',
    ),
    features: [
      L('Montaj', 'Mounting', 'تركيب'),
      L('Şeffaf', 'Clear', 'شفاف'),
      L('Kartuş', 'Cartridge', 'خرطوشة'),
    ],
    packaging: ['290 ml'],
    specs: [
      row(
        L('Ürün grubu', 'Product Type', 'نوع المنتج'),
        L('Şeffaf montaj yapıştırıcısı', 'Clear mounting adhesive', 'لاصق تركيب شفاف'),
      ),
      row(L('Ambalaj türü', 'Pack Type', 'نوع العبوة'), L('Kartuş', 'Cartridge', 'خرطوشة')),
      row(L('Net hacim', 'Net Volume', 'الحجم الصافي'), same('290 ml')),
      row(CHEMICAL_BASE, POLYURETHANE),
      row(DENSITY, same('1.12 ±0.04 g/cm³')),
      row(SURFACE_DRYING, L('5-10 dk.', '5-10 min', '5–10 دقائق')),
      row(CURE_RATE, L('3 mm / 24 saat', '3 mm / 24 h', '3 مم / 24 ساعة')),
      row(TEST_CONDITIONS, TEST_CONDITIONS_VALUE),
      stock('GRAMAJ', '290 ml'),
      stock('KOLİ', '24 Adet'),
      stock('PALET', '100 Koli'),
    ],
  },
  {
    slug: 'caulking-gun',
    assetKey: 'caulking-gun',
    title: L('Silikon Tabancası', 'Caulking Gun', 'مسدس السيليكون'),
    description: L(
      'Ergonomik tasarımı ve dayanıklı metal gövdesiyle silikon, mastik ve diğer yapıştırıcıların uygulamasında hassasiyet ve kolaylık sağlar. Kolay sıkma mekanizması uzun ömürlü kullanım sunar. Akış kontrolüyle temiz ve düzenli uygulama yapılmasına yardımcı olur. İnşaat, tamirat, sızdırmazlık ve montaj işlerinde profesyonel ve hobi amaçlı kullanıma uygundur.',
      'An ergonomic caulking gun with a durable metal body for precise, easy application of silicone, sealants and other adhesives. Its easy-squeeze mechanism supports long service life. Flow control helps achieve clean, controlled application. Suitable for professional and DIY construction, repair, sealing and assembly work.',
      'يتميز بتصميم مريح وهيكل متين، مما يجعله مناسبًا للاستخدام المهني والمنزلي. يوفر سهولة ودقة في تطبيق السيليكون والماستيك وأنواع المواد اللاصقة الأخرى. يتمتع بهيكل معدني وآلية ضغط سهلة الاستخدام لضمان عمر افتراضي طويل، كما يتيح التحكم في تدفق المادة أثناء التطبيق للحصول على نتائج نظيفة ومتناسقة. يُستخدم في أعمال البناء والإصلاح والعزل والتركيب.',
    ),
    features: [
      L('Metal Gövde', 'Metal Body', 'هيكل معدني'),
      L('Kolay Kullanım', 'Easy to Use', 'سهل الاستخدام'),
      L('Uzun Ömür', 'Long Service Life', 'عمر خدمة طويل'),
    ],
    packaging: [],
    specs: [
      row(L('Gövde', 'Body', 'الهيكل'), L('Metal', 'Metal', 'معدن')),
      row(
        L('Uygulama', 'Application', 'التطبيق'),
        L(
          'Silikon / mastik / yapıştırıcı',
          'Silicone / Sealant / Adhesive',
          'سيليكون / مانع تسرب / لاصق',
        ),
      ),
      row(L('Mekanizma', 'Mechanism', 'الآلية'), L('Kolay sıkma', 'Easy squeeze', 'ضغط سهل')),
      row(
        L('Akış kontrolü', 'Flow Control', 'التحكم بالتدفق'),
        L('Hassas uygulama', 'Precise application', 'تطبيق دقيق'),
      ),
      row(
        L('Kullanım', 'Use', 'الاستخدام'),
        L('Profesyonel / hobi', 'Professional / DIY', 'مهني / منزلي'),
      ),
      stock('KOLİ', '50 Adet'),
      stock('PALET', '18 Koli'),
    ],
  },
]

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

function getFlagValue(name: string) {
  const prefix = `--${name}=`
  return process.argv.find((argument) => argument.startsWith(prefix))?.slice(prefix.length)
}

const key = () => randomBytes(6).toString('hex')

export function buildDocument(
  product: NewProduct,
  images: {cardId: string; packId: string},
  taxonomy: {primaryCategory?: unknown; categories?: unknown; applicationAreas?: unknown},
) {
  const alt = localizedString(product.title)
  const image = (assetId: string) => ({
    _type: 'image',
    asset: {_type: 'reference', _ref: assetId},
    alt,
  })

  return {
    _type: 'product',
    title: localizedString(product.title),
    slug: {_type: 'slug', current: product.slug},
    status: 'published',
    shortDescription: localizedText(product.description),
    body: localizedPortableText(product.description),
    features: product.features.map((feature) => ({
      _key: key(),
      _type: 'featureItem',
      title: localizedString(feature),
    })),
    ...(product.packaging.length > 0
      ? {
          packagingVariants: product.packaging.map((volume) => ({
            _key: key(),
            _type: 'packagingVariant',
            label: localizedString(same(volume)),
            volume,
          })),
        }
      : {}),
    specificationGroups: [
      {
        _key: key(),
        _type: 'specificationGroup',
        title: localizedString(uiCopy.specsHeading),
        items: product.specs.map((item) => ({
          _key: key(),
          _type: 'specificationItem',
          label: localizedString(item.label),
          value: localizedString(item.value),
        })),
      },
    ],
    cardImage: image(images.cardId),
    packshot: image(images.packId),
    ...taxonomy,
  }
}

async function upload(client: SanityClient, filename: string, contentType: string) {
  const filePath = path.join(ASSET_DIR, filename)
  if (!existsSync(filePath)) throw new Error(`Missing asset file: ${filePath}`)
  const asset = await client.assets.upload('image', readFileSync(filePath), {filename, contentType})
  return asset._id
}

async function main() {
  loadEnvFile(path.resolve(process.cwd(), '.env.local'))
  loadEnvFile(path.resolve(process.cwd(), '.env'))

  const write = process.argv.includes('--write')
  const only = getFlagValue('only')
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const token = process.env.SANITY_API_WRITE_TOKEN
  const dataset = getFlagValue('dataset') || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-08-02'
  if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
  if (!token) throw new Error('Missing SANITY_API_WRITE_TOKEN')
  const client = createClient({projectId, dataset, apiVersion, token, useCdn: false})

  const products = only ? NEW_PRODUCTS.filter((product) => product.slug === only) : NEW_PRODUCTS
  if (only && products.length === 0) throw new Error(`Unknown slug: ${only}`)

  console.log(`Dataset: ${dataset}`)
  console.log(write ? 'Mode: WRITE (drafts)' : 'Mode: dry-run (pass --write to apply)')

  const reference = await client.fetch<{
    primaryCategory?: unknown
    categories?: unknown
    applicationAreas?: unknown
  } | null>(
    `*[_type == "product" && slug.current == $slug && !(_id in path("drafts.**"))][0]{primaryCategory, categories, applicationAreas}`,
    {slug: REFERENCE_SLUG},
    {perspective: 'raw'},
  )
  if (!reference?.primaryCategory) {
    throw new Error(`Reference product "${REFERENCE_SLUG}" has no primaryCategory`)
  }
  const taxonomy = {
    primaryCategory: reference.primaryCategory,
    ...(reference.categories ? {categories: reference.categories} : {}),
    ...(reference.applicationAreas ? {applicationAreas: reference.applicationAreas} : {}),
  }
  console.log(`Taxonomy copied from "${REFERENCE_SLUG}"\n`)

  let created = 0
  for (const product of products) {
    const existing = await client.fetch<string[]>(
      `*[_type == "product" && slug.current == $slug]._id`,
      {slug: product.slug},
      {perspective: 'raw'},
    )
    if (existing.length > 0) {
      console.log(`· ${product.slug}: already exists (${existing.join(', ')}), skipped`)
      continue
    }

    console.log(
      `✓ ${product.title.tr} → /products/${product.slug}  (specs=${product.specs.length}, packs=${product.packaging.length})`,
    )
    if (!write) continue

    const cardId = await upload(client, `${product.assetKey}-card.jpg`, 'image/jpeg')
    const packId = await upload(client, `${product.assetKey}-packshot.png`, 'image/png')
    const document = buildDocument(product, {cardId, packId}, taxonomy)
    const id = `drafts.product-${product.slug}`
    await client.createIfNotExists({_id: id, ...document}, {autoGenerateArrayKeys: false})
    created += 1
    console.log(`    draft: ${id}`)
  }

  console.log(
    write
      ? `\nCreated ${created} draft product(s). Publish them in Studio to show them on the site.`
      : '\nDry run only. Nothing was changed.',
  )
}

if (process.argv[1]?.includes('create-catalog-products')) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  })
}
