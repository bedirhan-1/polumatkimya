/**
 * Seeds missing applicationArea fields (body, benefits, products, cta, coverImage).
 *
 * Usage:
 *   npx tsx migration/scripts/seed-application-areas.ts
 *   npx tsx migration/scripts/seed-application-areas.ts --dataset=production
 */
import {createClient, type SanityClient} from '@sanity/client'
import {createHash, randomBytes} from 'node:crypto'
import {existsSync, readFileSync} from 'node:fs'
import path from 'node:path'

import {localizedPortableText, localizedString, localizedText} from './lib'
import {uiCopy} from './product-field-i18n'

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

function feature(
  title: {tr: string; en: string; ar: string},
  description?: {tr: string; en: string; ar: string},
) {
  return {
    _key: key(),
    _type: 'featureItem',
    title: localizedString(title),
    description: description ? localizedText(description) : undefined,
  }
}

function productCta() {
  return {
    _type: 'callToAction',
    label: localizedString(uiCopy.ctaLabel),
    variant: 'primary',
    link: {
      _type: 'internalOrExternalLink',
      label: localizedString(uiCopy.ctaLabel),
      linkType: 'internal',
      internalPath: '/request-a-quote',
      openInNewTab: false,
    },
  }
}

type AreaSeed = {
  slug: string
  coverUrl: string
  body: {tr: string; en: string; ar: string}
  benefits: Array<{
    title: {tr: string; en: string; ar: string}
    description: {tr: string; en: string; ar: string}
  }>
  /** Prefer these product slugs when present; otherwise fall back to category. */
  productSlugs: string[]
  categorySlug: string
}

const AREA_SEEDS: AreaSeed[] = [
  {
    slug: 'automotive',
    coverUrl: 'https://polumatkimya.com/images/product-category/1740174059.webp',
    categorySlug: 'industrial-sprays',
    productSlugs: [
      'brake-cleaner-spray',
      'engine-cleaner-spray',
      'contact-cleaner-spray',
      'tire-shine-spray',
      'dashboard-polish-spray',
      'chain-lubricant-spray',
    ],
    body: {
      tr: 'Otomotiv bakımında hızlı, güvenilir ve iz bırakmayan kimyasal çözümler kritik önemdedir. Polumat endüstriyel spreyleri; fren, motor, kontak ve iç/dış yüzey bakımında atölye ve filo ekiplerinin günlük ihtiyaçlarına yanıt verir.\n\nDisk ve kampana frenlerden motor temizliğine, lastik parlaticıdan torpido bakımına kadar genişleyen ürün ailesi, üretim kalitesi ve uygulama pratikliği ile sahada zaman kazandırır.',
      en: 'Automotive maintenance depends on fast, reliable and residue-conscious chemical solutions. Polumat industrial sprays support workshop and fleet teams across brake, engine, contact and interior/exterior care.\n\nFrom disc and drum brakes to engine cleaning, tire shine and dashboard care, the range is built for production quality and practical application on the shop floor.',
      ar: 'تعتمد صيانة السيارات على حلول كيميائية سريعة وموثوقة دون بقايا مزعجة. تدعم بخاخات بولومات الصناعية ورش العمل والأساطيل في العناية بالفرامل والمحرك ونقاط التلامس والأسطح الداخلية والخارجية.\n\nمن الفرامل القرصية والطبلية إلى تنظيف المحرك وتلميع الإطارات والعناية بلوحة القيادة، صُممت المجموعة لجودة الإنتاج وسهولة التطبيق في الورشة.',
    },
    benefits: [
      {
        title: {
          tr: 'Atölye temposuna uygun',
          en: 'Built for workshop pace',
          ar: 'مناسب لوتيرة الورشة',
        },
        description: {
          tr: 'Hızlı etki ve pratik uygulama ile bakım sürelerini kısaltır.',
          en: 'Fast action and practical application shorten maintenance time.',
          ar: 'التأثير السريع والتطبيق العملي يختصران زمن الصيانة.',
        },
      },
      {
        title: {
          tr: 'Kritik bileşenlere uyumlu',
          en: 'Compatible with critical parts',
          ar: 'متوافق مع الأجزاء الحرجة',
        },
        description: {
          tr: 'Fren, kontak ve motor aksamında kontrollü formüller.',
          en: 'Controlled formulas for brakes, contacts and engine components.',
          ar: 'تركيبات مضبوطة للفرامل ونقاط التلامس وأجزاء المحرك.',
        },
      },
      {
        title: {
          tr: 'Filo ve servis odaklı',
          en: 'Fleet and service focused',
          ar: 'يركز على الأساطيل والخدمات',
        },
        description: {
          tr: 'Tekrarlayan bakım senaryoları için tutarlı performans.',
          en: 'Consistent performance for recurring maintenance scenarios.',
          ar: 'أداء ثابت لسيناريوهات الصيانة المتكررة.',
        },
      },
    ],
  },
  {
    slug: 'industrial-maintenance',
    coverUrl: 'https://polumatkimya.com/images/about/1740062621.webp',
    categorySlug: 'industrial-sprays',
    productSlugs: [
      'rust-remover-spray',
      'mold-release-spray',
      'chain-lubricant-spray',
      'contact-cleaner-spray',
      'brake-cleaner-spray',
      'mdf-kit-activator',
    ],
    body: {
      tr: 'Endüstriyel bakımda pas, sürtünme, kalıp ayırma ve genel temizlik süreçleri üretimin sürekliliğini doğrudan etkiler. Polumat bakım kimyasalları; metal yüzeylerde koruma, hareketli parçalarda yağlama ve kalıp süreçlerinde ayırma performansı sunar.\n\nÜretim hatları, makine parkları ve bakım ekipleri için formüle edilen ürünler, arıza riskini azaltmaya ve bakım aralıklarını uzatmaya yardımcı olur.',
      en: 'In industrial maintenance, rust, friction, mold release and general cleaning directly affect uptime. Polumat maintenance chemicals protect metal surfaces, lubricate moving parts and support release performance in molding processes.\n\nFormulated for production lines, machine parks and maintenance teams, the range helps reduce failure risk and extend service intervals.',
      ar: 'في الصيانة الصناعية يؤثر الصدأ والاحتكاك وفصل القوالب والتنظيف العام مباشرة على استمرارية الإنتاج. تحمي كيماويات بولومات للصيانة الأسطح المعدنية وتشحّم الأجزاء المتحركة وتدعم أداء الفصل في عمليات القولبة.\n\nمصممة لخطوط الإنتاج وأساطيل الآلات وفرق الصيانة، تساعد المجموعة على تقليل مخاطر الأعطال وإطالة فترات الخدمة.',
    },
    benefits: [
      {
        title: {
          tr: 'Pas ve korozyon kontrolü',
          en: 'Rust and corrosion control',
          ar: 'التحكم في الصدأ والتآكل',
        },
        description: {
          tr: 'Metal parçaları nem ve oksidasyona karşı destekler.',
          en: 'Helps protect metal parts against moisture and oxidation.',
          ar: 'يساعد على حماية الأجزاء المعدنية من الرطوبة والأكسدة.',
        },
      },
      {
        title: {
          tr: 'Sürtünme ve aşınma azaltma',
          en: 'Friction and wear reduction',
          ar: 'تقليل الاحتكاك والتآكل',
        },
        description: {
          tr: 'Hareketli noktalarda yağlama ve koruyucu film oluşturur.',
          en: 'Lubricates moving points and forms a protective film.',
          ar: 'يشحّم النقاط المتحركة ويشكّل فيلماً واقياً.',
        },
      },
      {
        title: {
          tr: 'Kalıp ve hat verimliliği',
          en: 'Mold and line efficiency',
          ar: 'كفاءة القوالب والخطوط',
        },
        description: {
          tr: 'Ayırma ve temizlik adımlarını hızlandırır.',
          en: 'Speeds up release and cleaning steps.',
          ar: 'يُسرّع خطوات الفصل والتنظيف.',
        },
      },
    ],
  },
  {
    slug: 'construction',
    coverUrl: 'https://polumatkimya.com/images/product-category/1740174232.webp',
    categorySlug: 'construction-chemicals',
    productSlugs: [
      'siliconized-sealant',
      'acrylic-sealant',
      'universal-silicone',
      'high-temperature-rtv-silicone',
      'high-tack-adhesive',
      'grout-filler',
      'aquarium-silicone',
      'shower-enclosure-silicone',
    ],
    body: {
      tr: 'Yapı ve inşaat uygulamalarında sızdırmazlık, yapıştırma ve derz dolgu ürünleri uzun ömürlü performans gerektirir. Polumat yapı kimyasalları; silikon, mastik ve yapıştırıcı çözümleriyle iç-dış mekan derzleri, doğrama montajı ve özel yüzey uygulamalarını destekler.\n\nEsneklik, yapışma gücü ve hava şartlarına dayanım odaklı ürün ailesi, şantiye ve atölye ekiplerinin standart iş kalitesini yükseltir.',
      en: 'Construction sealing, bonding and grouting applications need durable performance. Polumat construction chemicals support interior/exterior joints, joinery installation and specialty surfaces with silicones, sealants and adhesives.\n\nFocused on flexibility, adhesion and weather resistance, the range helps jobsite and workshop teams raise everyday work quality.',
      ar: 'تتطلب تطبيقات السدم واللصق وحشو الفواصل في البناء أداءً طويل الأمد. تدعم كيماويات بولومات للبناء المفاصل الداخلية والخارجية وتركيب النجارة والأسطح الخاصة بالسيليكون والمانعات واللاصقات.\n\nتركّز المجموعة على المرونة والالتصاق ومقاومة العوامل الجوية لمساعدة فرق الموقع والورشة على رفع جودة العمل اليومية.',
    },
    benefits: [
      {
        title: {
          tr: 'İç ve dış mekan dayanımı',
          en: 'Indoor and outdoor durability',
          ar: 'متانة للاستخدام الداخلي والخارجي',
        },
        description: {
          tr: 'Hava, nem ve sıcaklık değişimlerine uygun formüller.',
          en: 'Formulas suited to weather, moisture and temperature swings.',
          ar: 'تركيبات مناسبة للطقس والرطوبة وتقلبات الحرارة.',
        },
      },
      {
        title: {
          tr: 'Güçlü yapışma',
          en: 'Strong adhesion',
          ar: 'التصاق قوي',
        },
        description: {
          tr: 'PVC, alüminyum, cam, ahşap ve beton yüzeylerde güvenli tutunma.',
          en: 'Reliable grip on PVC, aluminum, glass, wood and concrete.',
          ar: 'تماسك موثوق على PVC والألمنيوم والزجاج والخشب والخرسانة.',
        },
      },
      {
        title: {
          tr: 'Uygulama kolaylığı',
          en: 'Easy application',
          ar: 'سهولة التطبيق',
        },
        description: {
          tr: 'Kartuş ve tabanca ile hızlı, temiz uygulama.',
          en: 'Fast, clean application with cartridge and gun.',
          ar: 'تطبيق سريع ونظيف بالخرطوشة والمسدس.',
        },
      },
    ],
  },
]

async function uploadImage(client: SanityClient, url: string, filenameHint: string) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Download failed ${url}: ${response.status}`)
  const buffer = Buffer.from(await response.arrayBuffer())
  const filename =
    url.split('/').pop()?.split('?')[0] ||
    `${filenameHint}-${createHash('sha1').update(url).digest('hex').slice(0, 8)}.webp`
  const asset = await client.assets.upload('image', buffer, {filename})
  return {
    _type: 'image',
    asset: {_type: 'reference', _ref: asset._id},
    alt: filenameHint,
  }
}

async function resolveProductIds(
  client: SanityClient,
  seed: AreaSeed,
): Promise<Array<{_type: 'reference'; _ref: string; _key: string}>> {
  const bySlug = await client.fetch<Array<{_id: string; slug: string}>>(
    `*[_type=="product" && slug.current in $slugs]{"_id": _id, "slug": slug.current}`,
    {slugs: seed.productSlugs},
  )
  const map = new Map(bySlug.map((item) => [item.slug, item._id]))
  const ordered = seed.productSlugs
    .map((slug) => map.get(slug))
    .filter((id): id is string => Boolean(id))

  if (ordered.length >= 3) {
    return ordered.slice(0, 8).map((id) => ({_type: 'reference', _ref: id, _key: key()}))
  }

  const byCategory = await client.fetch<string[]>(
    `*[_type=="product" && primaryCategory->slug.current == $category] | order(sortOrder asc)[0...8]._id`,
    {category: seed.categorySlug},
  )
  return (byCategory || []).map((id) => ({_type: 'reference', _ref: id, _key: key()}))
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

  console.log(`\nSeeding application areas → ${dataset}`)

  for (const seed of AREA_SEEDS) {
    const existing = await client.fetch<{_id: string} | null>(
      `*[_type=="applicationArea" && slug.current==$slug][0]{_id}`,
      {slug: seed.slug},
    )
    if (!existing?._id) {
      console.warn(`- skip ${seed.slug}: not found`)
      continue
    }

    const coverImage = await uploadImage(client, seed.coverUrl, seed.slug)
    const products = await resolveProductIds(client, seed)
    const benefits = seed.benefits.map((item) => feature(item.title, item.description))

    await client
      .patch(existing._id)
      .set({
        body: localizedPortableText(seed.body),
        benefits,
        products,
        cta: productCta(),
        coverImage,
        seo: {
          _type: 'localizedSeo',
          title: localizedString({
            tr: seed.slug === 'automotive' ? 'Otomotiv' : seed.slug === 'construction' ? 'Yapı ve inşaat' : 'Endüstriyel bakım',
            en:
              seed.slug === 'automotive'
                ? 'Automotive'
                : seed.slug === 'construction'
                  ? 'Construction'
                  : 'Industrial maintenance',
            ar:
              seed.slug === 'automotive'
                ? 'السيارات'
                : seed.slug === 'construction'
                  ? 'البناء والتشييد'
                  : 'الصيانة الصناعية',
          }),
          description: localizedText({
            tr: seed.body.tr.slice(0, 155),
            en: seed.body.en.slice(0, 155),
            ar: seed.body.ar.slice(0, 155),
          }),
        },
      })
      .commit({autoGenerateArrayKeys: true})

    console.log(
      `- ${seed.slug}: body+benefits(${benefits.length})+products(${products.length})+cta+cover`,
    )
  }
}

async function main() {
  const arg = process.argv.find((item) => item.startsWith('--dataset='))
  const dataset =
    arg?.split('=')[1] || process.env.NEXT_PUBLIC_SANITY_DATASET || 'development'
  await seedDataset(dataset)
  if (!arg) {
    // Also sync production when running default
    if (dataset !== 'production') {
      try {
        await seedDataset('production')
      } catch (error) {
        console.warn('production seed failed:', (error as Error).message)
      }
    }
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
