/**
 * Aligns EN/AR CMS content with the Turkish originals:
 * shared homepage images/sections, full corporate copy, product i18n, blog.
 *
 *   npx tsx migration/scripts/sync-locale-content.ts
 *   npx tsx migration/scripts/sync-locale-content.ts --dataset=all
 */
import {createClient, type SanityClient} from '@sanity/client'
import {randomBytes} from 'node:crypto'
import {existsSync, readFileSync} from 'node:fs'
import path from 'node:path'

import {foldTr, textToPortableText} from './lib'
import {productLocaleTitles} from './locale-titles'
import {productDescriptionI18n} from './product-copy-i18n'
import {specLabelI18n, localizeSpecValue, localizeSpecUnit} from './product-field-i18n'
import {PAGES} from './seed-corporate-pages'

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
  return randomBytes(6).toString('hex')
}

type Locale = 'tr' | 'en' | 'ar'
type I18nItem = {_key?: string; _type?: string; language?: string; value?: unknown}

const TURKISH_RE = /[ğüşıöçĞÜŞİÖÇ]/
const PLACEHOLDER_RE = /^\s*\[(EN|AR)\]\s*/i

const QUALITY_ITEMS: Record<Locale, string[]> = {
  tr: [
    'Seçilmiş hammadde',
    'Kontrollü üretim',
    'Performans testleri',
    'Kalite kontrol süreçleri',
    'Müşteri odaklı hizmet',
  ],
  en: [
    'Selected raw materials',
    'Controlled production',
    'Performance tests',
    'Quality control processes',
    'Customer-focused service',
  ],
  ar: [
    'مواد خام مختارة',
    'إنتاج خاضع للرقابة',
    'اختبارات أداء',
    'عمليات مراقبة الجودة',
    'خدمة تركز على رضا العملاء',
  ],
}

const ABOUT_STATS: Record<Locale, Array<{value: string; label: string}>> = {
  tr: [
    {value: '50+', label: 'Ülkeye ihracat'},
    {value: '5', label: "Kıta'da iş ortaklığı"},
    {value: 'Modern', label: 'Üretim tesisi'},
    {value: 'Profesyonel', label: 'Ürün gamı'},
    {value: 'Private Label', label: 'Üretim desteği'},
  ],
  en: [
    {value: '50+', label: 'Export countries'},
    {value: '5', label: 'Continents in partnership'},
    {value: 'Modern', label: 'Production facility'},
    {value: 'Professional', label: 'Product range'},
    {value: 'Private Label', label: 'Production support'},
  ],
  ar: [
    {value: '+50', label: 'دول نصدر إليها'},
    {value: '5', label: 'قارات بشراكات'},
    {value: 'حديث', label: 'مرفق الإنتاج'},
    {value: 'احترافي', label: 'مجموعة المنتجات'},
    {value: 'العلامة الخاصة', label: 'دعم الإنتاج'},
  ],
}

const PRODUCT_BODIES: Record<string, {en: string; ar: string}> = {
  'engine-cleaner-spray': {
    en: `${productDescriptionI18n['engine-cleaner-spray'].en}

Product features
• Its advanced formula quickly penetrates and removes oil, grease and stubborn dirt on the engine.
• Does not harm any engine components.
• Besides cleaning, it leaves a glossy appearance and strong protection.
• Does not damage electronic circuits.

Polumat Kimya supplies high-quality chemical solutions for industrial and individual use.`,
    ar: `${productDescriptionI18n['engine-cleaner-spray'].ar}

ميزات المنتج
• تخترق تركيبته المتقدمة بسرعة زيت المحرك والشحوم والأوساخ العنيدة وتزيلها.
• لا يضر أي جزء من أجزاء المحرك.
• إلى جانب التنظيف يمنح المحرك مظهراً لامعاً وحماية قوية.
• لا يضر الدوائر الإلكترونية.

توفر بولومات كيميا حلولاً كيميائية عالية الجودة للاستخدام الصناعي والفردي.`,
  },
  'rust-remover-spray': {
    en: `${productDescriptionI18n['rust-remover-spray'].en}

Product features
• Forms a protective layer between metals and reduces friction.
• Displaces water and protects metal parts from rust for longer.
• Penetrates even hard-to-reach areas.

Polumat Kimya supplies high-quality chemical solutions for industrial and individual use.`,
    ar: `${productDescriptionI18n['rust-remover-spray'].ar}

ميزات المنتج
• يشكّل طبقة واقية بين المعادن ويقلل الاحتكاك.
• يطرد الماء ويحمي الأجزاء المعدنية من الصدأ لفترة أطول.
• يخترق حتى المناطق صعبة الوصول.

توفر بولومات كيميا حلولاً كيميائية عالية الجودة للاستخدام الصناعي والفردي.`,
  },
  'siliconized-sealant': {
    en: `${productDescriptionI18n['siliconized-sealant'].en}

Product features
• Suitable for all porous surfaces such as brick, concrete and wood.
• Resistant to water, wind and moisture on aluminum, wood and PVC frames and windows.
• One-component, thixotropic and easy to apply with a gun.
• Forms a waterproof layer after curing and is weather resistant.
• Keeps its flexibility for a long time. Overpaintable. Oil-free surface.
• Does not affect the filled surface. Elastic, with a glossy, smooth appearance.

Polumat Kimya supplies high-quality chemical solutions for industrial and individual use.`,
    ar: `${productDescriptionI18n['siliconized-sealant'].ar}

ميزات المنتج
• مناسب لجميع الأسطح المسامية مثل الطوب والخرسانة والخشب.
• مقاوم للماء والرياح والرطوبة على إطارات ونوافذ الألمنيوم والخشب وPVC.
• بمكون واحد، تيكسوتروبي وسهل التطبيق بالمسدس.
• يشكّل طبقة عازلة للماء بعد التصلب ومقاوم للعوامل الجوية.
• يحافظ على مرونته لفترة طويلة. قابل للطلاء. سطحه خالٍ من الزيت.
• لا يؤثر على السطح المملوء. مرن بمظهر لامع وأملس.

توفر بولومات كيميا حلولاً كيميائية عالية الجودة للاستخدام الصناعي والفردي.`,
  },
  'e-universal-silicone': {
    en: `${productDescriptionI18n['e-universal-silicone'].en}

Product features
• Solvent-free. 100% silicone.
• Releases very little odor while curing.
• Wide application temperature range.
• Excellent primer-free adhesion on porous and non-porous surfaces.

Polumat Kimya supplies high-quality chemical solutions for industrial and individual use.`,
    ar: `${productDescriptionI18n['e-universal-silicone'].ar}

ميزات المنتج
• خالٍ من المذيبات. سيليكون 100%.
• يطلق رائحة قليلة جداً أثناء التصلب.
• نطاق واسع لدرجة حرارة التطبيق.
• التصاق ممتاز بدون أساس على الأسطح المسامية وغير المسامية.

توفر بولومات كيميا حلولاً كيميائية عالية الجودة للاستخدام الصناعي والفردي.`,
  },
  'high-tack-adhesive': {
    en: `${productDescriptionI18n['high-tack-adhesive'].en}

Product features
• Waterproof.
• One-component.
• Overpaintable.
• No bubbling.
• No volume loss.
• Primer-free (pre-testing recommended).
• Excellent elasticity and very high adhesion.
• Free of solvent, silicone and isocyanate.

Polumat Kimya supplies high-quality chemical solutions for industrial and individual use.`,
    ar: `${productDescriptionI18n['high-tack-adhesive'].ar}

ميزات المنتج
• مقاوم للماء.
• بمكون واحد.
• قابل للطلاء.
• بلا فقاعات.
• بلا فقد حجم.
• بدون أساس (يُنصح باختبار مسبق).
• مرونة ممتازة وقوة التصاق عالية جداً.
• خالٍ من المذيبات والسيليكون والإيزوسيانات.

توفر بولومات كيميا حلولاً كيميائية عالية الجودة للاستخدام الصناعي والفردي.`,
  },
}

const BLOG_COPY: Record<
  string,
  {en: {title: string; excerpt: string; body: string}; ar: {title: string; excerpt: string; body: string}}
> = {
  'a-new-breath-for-global-economy': {
    en: {
      title: 'A new breath for the global economy',
      excerpt:
        'Polumat continues to grow through international partnerships, aiming for a stronger position in the global market with recent strategic agreements.',
      body: `Polumat continues to grow through international partnerships

Polumat keeps expanding in the chemical sector through international collaborations and innovative solutions. With recent strategic agreements, the company aims for a stronger position in the global market.

Innovative product development
International partnerships help Polumat expand its portfolio and develop new products. In this way the company aims to offer customers a wider, higher-quality range and reinforce its leading position in the sector.

Polumat Kimya supplies high-quality chemical solutions for industrial and individual use.`,
    },
    ar: {
      title: 'نفس جديد للاقتصاد العالمي',
      excerpt:
        'تواصل بولومات النمو عبر الشراكات الدولية، وتهدف إلى موقع أقوى في السوق العالمية من خلال اتفاقات استراتيجية أخيرة.',
      body: `تواصل بولومات النمو عبر الشراكات الدولية

تواصل بولومات التوسع في قطاع الكيمياء عبر التعاون الدولي والحلول المبتكرة. وتهدف من خلال اتفاقات استراتيجية أخيرة إلى موقع أقوى في السوق العالمية.

تطوير منتجات مبتكرة
تساعد الشراكات الدولية بولومات على توسيع محفظتها وتطوير منتجات جديدة. وبهذا تهدف الشركة إلى تقديم مجموعة أوسع وأعلى جودة لعملائها وتعزيز موقعها الريادي في القطاع.

توفر بولومات كيميا حلولاً كيميائية عالية الجودة للاستخدام الصناعي والفردي.`,
    },
  },
  'innovative-solutions-in-construction-chemicals': {
    en: {
      title: 'Innovative solutions in construction chemicals',
      excerpt:
        'The construction chemicals sector continually seeks innovative solutions that raise the quality and durability of building projects. Polumat aims to deliver sustainable, effective answers in this field.',
      body: `Innovative solutions in construction chemicals

The construction chemicals sector continually seeks innovative solutions that raise the quality and durability of building projects. As one of the pioneering companies in this field, Polumat aims to deliver sustainable and effective solutions.

Our silicones and sealants
Our universal silicones can be used with confidence in mechanical and construction projects and cover a wide range of needs. Specialty silicones are designed for every kind of assembly and sealing requirement.

Specialty silicones
Aquarium silicone: excellent results in aquarium projects that need watertight, durable joints.
Universal silicone: a multi-purpose product with a wide range of uses.
Shower-enclosure silicone: formulated to solve sealing issues in shower cabins.
Mirror silicone: designed for safe mounting and fixing of mirrors.

Acrylic sealants and grout fillers
Our acrylic sealants and grout fillers bring both flexibility and durability to construction and decoration projects, helping them last longer.

Flexibility: excellent adhesion on different surfaces and ideal for moving building elements.
Durability: does not crack or fade over time, so project quality is preserved.

Our products offer reliable solutions at every stage of your project. Designed for assembly and sealing needs, they help make projects stronger and more durable.

Polumat Kimya supplies high-quality chemical solutions for industrial and individual use.`,
    },
    ar: {
      title: 'حلول مبتكرة في كيماويات البناء',
      excerpt:
        'يسعى قطاع كيماويات البناء باستمرار إلى حلول مبتكرة ترفع جودة المشاريع ومتانتها. وتهدف بولومات إلى تقديم إجابات مستدامة وفعّالة في هذا المجال.',
      body: `حلول مبتكرة في كيماويات البناء

يسعى قطاع كيماويات البناء باستمرار إلى حلول مبتكرة ترفع جودة المشاريع الإنشائية ومتانتها. وبولومات، بوصفها من الشركات الرائدة في هذا المجال، تهدف إلى تقديم حلول مستدامة وفعّالة.

السيليكون والمانعات
يمكن استخدام سيليكوننا العام بثقة في مشاريع الميكانيكا والبناء، وهو يغطي نطاقاً واسعاً من الاحتياجات. وتُصمَّم أنواع السيليكون الخاصة لكل متطلبات التركيب والسدم.

أنواع السيليكون الخاصة
سيليكون أحواض الأسماك: نتائج ممتازة في مشاريع الأحواض التي تحتاج إغلاقاً محكماً ومتانة.
السيليكون العام: منتج متعدد الأغراض واسع الاستخدام.
سيليكون كابينة الدش: مُركَّب لحل مشكلات السدم في كبائن الدش.
سيليكون المرايا: مصمم لتركيب المرايا وتثبيتها بأمان.

المانعات الأكريليكية وحشو الفواصل
تمنح مانعاتنا الأكريليكية وحشو الفواصل المرونة والمتانة لمشاريع البناء والديكور وتساعدها على الاستمرار لفترة أطول.

المرونة: التصاق ممتاز على أسطح مختلفة ومثالي للعناصر الإنشائية المتحركة.
المتانة: لا يتشقق ولا يبهت مع الزمن، فيُحفظ جودة المشروع.

تقدم منتجاتنا حلولاً موثوقة في كل مرحلة من مشروعك. وهي مصممة لاحتياجات التركيب والسدم لتساعد على جعل المشاريع أقوى وأكثر متانة.

توفر بولومات كيميا حلولاً كيميائية عالية الجودة للاستخدام الصناعي والفردي.`,
    },
  },
  'next-generation-polumat-industrial-sprays': {
    en: {
      title: 'Next-generation Polumat industrial sprays',
      excerpt:
        'Polumat is preparing to reshape the sector with next-generation spray technologies that combine environmental care with high performance.',
      body: `Next-generation Polumat industrial sprays: technology that changes the field

Polumat, known for innovative industrial solutions, is preparing to reshape the sector with next-generation spray technologies. These new sprays stand out for both their environmentally conscious profile and their high performance.

High performance and durability
Polumat sprays are not only environmentally conscious; they also deliver impressive performance. Fast cleaning, lubrication, polishing and drying help save time and cost in industrial applications. Their durability keeps performance stable even in long-term use.

Wide application range
Next-generation Polumat sprays cover a wide range of uses. They are widely applicable in automotive, construction, electronics and furniture, and they deliver excellent results on different surfaces. With a diverse product range, Polumat offers flexible solutions for every sector and need.

Polumat Kimya supplies high-quality chemical solutions for industrial and individual use.`,
    },
    ar: {
      title: 'بخاخات بولومات الصناعية من الجيل الجديد',
      excerpt:
        'تستعد بولومات لإعادة تشكيل القطاع بتقنيات بخاخ من الجيل الجديد تجمع بين مراعاة البيئة والأداء العالي.',
      body: `بخاخات بولومات الصناعية من الجيل الجديد: تقنية تغيّر الميدان

تستعد بولومات، المعروفة بحلولها الصناعية المبتكرة، لإعادة تشكيل القطاع بتقنيات بخاخ من الجيل الجديد. وتبرز هذه البخاخات الجديدة بملامحها المراعية للبيئة وبأدائها العالي.

أداء عالٍ ومتانة
بخاخات بولومات ليست مراعية للبيئة فحسب؛ بل تقدم أيضاً أداءً لافتاً. يساعد التنظيف والتشحيم والتلميع والجفاف السريع على توفير الوقت والتكلفة في التطبيقات الصناعية. وتحافظ متانتها على الأداء حتى مع الاستخدام طويل الأمد.

نطاق استخدام واسع
تغطي بخاخات بولومات من الجيل الجديد نطاقاً واسعاً من الاستخدامات. وهي قابلة للتطبيق على نطاق واسع في السيارات والبناء والإلكترونيات والأثاث، وتقدم نتائج ممتازة على أسطح مختلفة. وبمجموعة منتجات متنوعة تقدم بولومات حلولاً مرنة لكل قطاع واحتياج.

توفر بولومات كيميا حلولاً كيميائية عالية الجودة للاستخدام الصناعي والفردي.`,
    },
  },
  'why-choose-polumat': {
    en: {
      title: 'Why choose Polumat?',
      excerpt:
        'Polumat invests heavily in R&D, develops more effective and environmentally conscious products, and keeps quality and safety at the centre of every formula.',
      body: `Polumat’s innovative approach

Polumat invests heavily in R&D. It continually works to develop more effective, environmentally conscious products. Customer satisfaction comes first, and every product is aligned with quality and safety standards.

Quality assurance: every product goes through strict quality-control processes.
Innovation: continuous development and integration of new technologies.
Customer focus: professional support with solutions tailored to your needs.

Polumat Kimya remains your trusted partner in the chemical industry. With products that combine innovation and quality, you can make your processes more efficient.

Polumat Kimya supplies high-quality chemical solutions for industrial and individual use.`,
    },
    ar: {
      title: 'لماذا تختار بولومات؟',
      excerpt:
        'تستثمر بولومات بقوة في البحث والتطوير، وتطور منتجات أكثر فعالية ومراعاة للبيئة، وتضع الجودة والسلامة في صميم كل تركيبة.',
      body: `نهج بولومات المبتكر

تستثمر بولومات بقوة في البحث والتطوير. وتعمل باستمرار على تطوير منتجات أكثر فعالية ومراعاة للبيئة. رضا العملاء يأتي أولاً، وكل منتج يتوافق مع معايير الجودة والسلامة.

ضمان الجودة: يمر كل منتج بعمليات رقابة جودة صارمة.
الابتكار: تطوير مستمر ودمج لتقنيات جديدة.
التركيز على العميل: دعم احترافي بحلول مخصصة لاحتياجاتكم.

تبقى بولومات كيميا شريككم الموثوق في صناعة الكيمياء. وبمنتجات تجمع الابتكار والجودة يمكنكم جعل عملياتكم أكثر كفاءة.

توفر بولومات كيميا حلولاً كيميائية عالية الجودة للاستخدام الصناعي والفردي.`,
    },
  },
}

function upsertLocale(
  items: I18nItem[] | undefined,
  language: Locale,
  value: unknown,
  type: string,
): I18nItem[] {
  const next = (Array.isArray(items) ? items : []).filter(
    (item) => item.language !== language && item._key !== language,
  )
  next.push({
    _key: key(),
    _type: type,
    language,
    value,
  })
  return next
}

function translateSpecLabel(label: string, lang: 'en' | 'ar'): string {
  const trimmed = label.trim()
  if (!trimmed) return trimmed
  const direct = specLabelI18n[trimmed] || specLabelI18n[trimmed.toLocaleUpperCase('tr-TR')]
  if (direct) return direct[lang]
  const folded = foldTr(trimmed)
  for (const [source, translated] of Object.entries(specLabelI18n)) {
    if (foldTr(source) === folded) return translated[lang]
  }
  if (lang === 'en' && TURKISH_RE.test(trimmed)) return trimmed
  return trimmed
}

function needsTranslation(text: string | null | undefined, lang: 'en' | 'ar') {
  if (!text?.trim()) return true
  if (PLACEHOLDER_RE.test(text)) return true
  if (TURKISH_RE.test(text)) return true
  if (lang === 'ar' && !/[\u0600-\u06FF]/.test(text) && text.length > 8) return true
  return false
}

function imageWithAlt(image: unknown, alt: string) {
  if (!image || typeof image !== 'object') return undefined
  const asset = (image as {asset?: {_ref?: string}}).asset
  if (!asset?._ref) return undefined
  return {
    _type: 'image',
    asset: {_type: 'reference', _ref: asset._ref},
    hotspot: (image as {hotspot?: unknown}).hotspot,
    crop: (image as {crop?: unknown}).crop,
    alt,
  }
}

async function syncHomes(client: SanityClient) {
  const tr = await client.fetch<{
    hero?: {desktopImage?: unknown}
    privateLabelSection?: {image?: unknown}
    aboutSection?: {image?: unknown}
    industriesSection?: {areas?: Array<{_key?: string; area?: {_ref?: string}}>}
  }>(
    `*[_id=="homePage-tr"][0]{
      hero{desktopImage},
      privateLabelSection{image},
      aboutSection{image},
      industriesSection{areas[]{_key, area}}
    }`,
  )

  const areaIds = (tr?.industriesSection?.areas || [])
    .map((row) => row.area?._ref)
    .filter((id): id is string => Boolean(id))

  for (const language of ['en', 'ar'] as const) {
    const areas = areaIds.length
      ? await Promise.all(
          (tr.industriesSection?.areas || []).map(async (row) => {
            const id = row.area?._ref
            if (!id) return null
            const area = await client.fetch<{title?: string; summary?: string} | null>(
              `*[_id==$id][0]{
                "title": title[language==$locale || _key==$locale][0].value,
                "summary": summary[language==$locale || _key==$locale][0].value
              }`,
              {id, locale: language},
            )
            return {
              _type: 'homeIndustryCard',
              _key: row._key || key(),
              area: {_type: 'reference', _ref: id},
              title: area?.title || '',
              summary: area?.summary || '',
            }
          }),
        ).then((rows) => rows.filter(Boolean))
      : []

    const patch: Record<string, unknown> = {
      'hero.desktopImage': imageWithAlt(
        tr?.hero?.desktopImage,
        language === 'en'
          ? 'Polumat professional aerosol product family'
          : 'عائلة منتجات بخاخات بولومات المهنية',
      ),
      'privateLabelSection.image': imageWithAlt(
        tr?.privateLabelSection?.image,
        language === 'en' ? 'Your brand' : 'علامتك',
      ),
      'aboutSection.image': imageWithAlt(
        tr?.aboutSection?.image,
        language === 'en'
          ? 'Polumat production facility and logistics area'
          : 'منشأة إنتاج بولومات ومنطقة الخدمات اللوجستية',
      ),
      'aboutSection.videoPlayLabel':
        language === 'en' ? 'Watch the promo video' : 'شاهد فيديو التعريف',
      'aboutSection.stats': ABOUT_STATS[language].map((stat) => ({
        _key: key(),
        _type: 'homeAboutStat',
        value: stat.value,
        label: stat.label,
      })),
      'qualitySection.items': QUALITY_ITEMS[language].map((label) => ({
        _key: key(),
        _type: 'homeQualityItem',
        label,
      })),
    }

    if (areas.length) {
      patch['industriesSection.areas'] = areas
    }

    if (language === 'ar') {
      patch['hero.headingAccent'] = 'أعلى'
      patch['hero.headingTail'] = 'أداء'
    }

    await client.patch(`homePage-${language}`).set(patch).commit({autoGenerateArrayKeys: false})
    try {
      await client.delete(`drafts.homePage-${language}`)
    } catch {
      // ignore
    }
    console.log(`✓ homePage-${language} images + sections synced`)
  }
}

async function syncCorporatePages(client: SanityClient) {
  for (const page of PAGES) {
    for (const language of ['en', 'ar'] as const) {
      const existing = await client.fetch<{
        _id: string
        pageBuilder?: Array<Record<string, unknown>>
      } | null>(
        `*[_type=="page" && language==$language && slug.current==$slug][0]{_id, pageBuilder}`,
        {language, slug: page.slug},
      )
      if (!existing?._id) continue

      const body = page.bodies[language]
      const lead = body.split('\n\n')[0]?.slice(0, 180)
      const nextBuilder = (existing.pageBuilder || []).map((block) => {
        if (block._type === 'heroSection') {
          return {...block, heading: page.titles[language], description: lead}
        }
        if (block._type === 'imageTextSection') {
          return {...block, body: textToPortableText(body)}
        }
        return block
      })

      await client
        .patch(existing._id)
        .set({
          title: page.titles[language],
          translationStatus: 'complete',
          pageBuilder: nextBuilder,
          seo: {
            _type: 'seo',
            title: `${page.titles[language]} | Polumat Kimya`,
            description: page.seoDescriptions[language],
            noIndex: false,
          },
        })
        .commit({autoGenerateArrayKeys: false})
      try {
        await client.delete(`drafts.${existing._id}`)
      } catch {
        // ignore
      }
      console.log(`✓ ${language} ${page.slug}`)
    }
  }

  const returnPages = await client.fetch<Array<{_id: string; language: string}>>(
    `*[_type=="page" && slug.current=="return-and-exchange-policy"]{_id, language}`,
  )
  for (const doc of returnPages) {
    if (doc.language === 'ar') {
      await client.patch(doc._id).set({title: 'سياسة الإرجاع والاستبدال'}).commit()
      console.log('✓ ar return-and-exchange-policy title')
    }
  }
}

async function syncProducts(client: SanityClient) {
  const products = await client.fetch<
    Array<{
      _id: string
      slug: string
      title?: I18nItem[]
      shortDescription?: I18nItem[]
      body?: I18nItem[]
      specificationGroups?: Array<{
        _key?: string
        title?: I18nItem[]
        items?: Array<{
          _key?: string
          label?: I18nItem[]
          value?: I18nItem[] | string
          unit?: I18nItem[] | string
          note?: I18nItem[]
        }>
      }>
    }>
  >(
    `*[_type=="product"]{
      _id, "slug": slug.current, title, shortDescription, body, specificationGroups
    }`,
  )

  for (const product of products) {
    const patch: Record<string, unknown> = {}
    let title = product.title
    let shortDescription = product.shortDescription
    let body = product.body

    const names = productLocaleTitles[product.slug]
    if (names) {
      if (needsTranslation(String(title?.find((i) => i.language === 'en')?.value || ''), 'en')) {
        title = upsertLocale(title, 'en', names.en, 'internationalizedArrayStringValue')
      }
      if (needsTranslation(String(title?.find((i) => i.language === 'ar')?.value || ''), 'ar')) {
        title = upsertLocale(title, 'ar', names.ar, 'internationalizedArrayStringValue')
      }
    }

    const copy = PRODUCT_BODIES[product.slug]
    const intro = productDescriptionI18n[product.slug]
    for (const lang of ['en', 'ar'] as const) {
      const full = copy?.[lang] || intro?.[lang]
      if (!full) continue
      const currentShort = String(
        shortDescription?.find((item) => item.language === lang || item._key === lang)?.value || '',
      )
      const currentBody = body?.find((item) => item.language === lang || item._key === lang)?.value
      const currentBodyText = Array.isArray(currentBody)
        ? currentBody
            .map((block) =>
              Array.isArray((block as {children?: Array<{text?: string}>}).children)
                ? (block as {children: Array<{text?: string}>}).children.map((c) => c.text || '').join('')
                : '',
            )
            .join('\n')
        : String(currentBody || '')

      if (needsTranslation(currentShort, lang)) {
        shortDescription = upsertLocale(
          shortDescription,
          lang,
          intro?.[lang] || full.split('\n\n')[0],
          'internationalizedArrayTextValue',
        )
      }
      if (needsTranslation(currentBodyText, lang)) {
        body = upsertLocale(body, lang, textToPortableText(full), 'internationalizedArrayPortableTextValue')
      }
    }

    if (title) patch.title = title
    if (shortDescription) patch.shortDescription = shortDescription
    if (body) patch.body = body

    if (product.specificationGroups?.length) {
      patch.specificationGroups = product.specificationGroups.map((group) => ({
        ...group,
        title: ['en', 'ar'].reduce(
          (acc, lang) => {
            const current = String(
              acc?.find((item) => item.language === lang || item._key === lang)?.value || '',
            )
            if (!needsTranslation(current, lang as 'en' | 'ar') && current) return acc
            const trTitle = String(
              acc?.find((item) => item.language === 'tr' || item._key === 'tr')?.value ||
                'Teknik özellikler',
            )
            return upsertLocale(
              acc,
              lang as Locale,
              translateSpecLabel(trTitle, lang as 'en' | 'ar') ||
                (lang === 'en' ? 'Technical specifications' : 'المواصفات التقنية'),
              'internationalizedArrayStringValue',
            )
          },
          group.title || [],
        ),
        items: (group.items || []).map((item) => {
          const toArray = (field: I18nItem[] | string | undefined): I18nItem[] => {
            if (Array.isArray(field)) return field
            if (typeof field === 'string' && field.trim()) {
              return [
                {
                  _key: key(),
                  _type: 'internationalizedArrayStringValue',
                  language: 'tr',
                  value: field,
                },
              ]
            }
            return []
          }

          const sourceValue = toArray(item.value)
          const sourceUnit = toArray(item.unit)
          const trValue = String(
            sourceValue.find((entry) => entry.language === 'tr' || entry._key === 'tr')?.value ||
              sourceValue[0]?.value ||
              '',
          )
          const trUnit = String(
            sourceUnit.find((entry) => entry.language === 'tr' || entry._key === 'tr')?.value ||
              sourceUnit[0]?.value ||
              '',
          )
          const localizedValue = trValue ? localizeSpecValue(trValue) : null
          const localizedUnit = trUnit ? localizeSpecUnit(trUnit) : null

          return {
            ...item,
            label: ['en', 'ar'].reduce(
              (acc, lang) => {
                const current = String(
                  acc?.find((entry) => entry.language === lang || entry._key === lang)?.value || '',
                )
                const trLabel = String(
                  acc?.find((entry) => entry.language === 'tr' || entry._key === 'tr')?.value ||
                    current,
                )
                if (!needsTranslation(current, lang as 'en' | 'ar') && current) return acc
                return upsertLocale(
                  acc,
                  lang as Locale,
                  translateSpecLabel(trLabel || current, lang as 'en' | 'ar'),
                  'internationalizedArrayStringValue',
                )
              },
              item.label || [],
            ),
            value: localizedValue
              ? (['tr', 'en', 'ar'] as const).reduce(
                  (acc, lang) =>
                    upsertLocale(acc, lang, localizedValue[lang], 'internationalizedArrayStringValue'),
                  sourceValue,
                )
              : sourceValue,
            unit: localizedUnit
              ? (['tr', 'en', 'ar'] as const).reduce(
                  (acc, lang) =>
                    upsertLocale(acc, lang, localizedUnit[lang], 'internationalizedArrayStringValue'),
                  sourceUnit,
                )
              : sourceUnit.length
                ? sourceUnit
                : undefined,
          }
        }),
      }))
    }

    if (Object.keys(patch).length) {
      await client.patch(product._id).set(patch).commit({autoGenerateArrayKeys: false})
      try {
        await client.delete(`drafts.${product._id}`)
      } catch {
        // ignore
      }
      console.log(`✓ product ${product.slug}`)
    }
  }
}

async function syncPosts(client: SanityClient) {
  for (const [slug, copy] of Object.entries(BLOG_COPY)) {
    const versions = await client.fetch<
      Array<{_id: string; language: string; coverImage?: unknown}>
    >(`*[_type=="post" && slug.current==$slug]{_id, language, coverImage}`, {slug})
    const tr = versions.find((item) => item.language === 'tr')
    for (const language of ['en', 'ar'] as const) {
      const doc = versions.find((item) => item.language === language)
      if (!doc) continue
      const localized = copy[language]
      await client
        .patch(doc._id)
        .set({
          title: localized.title,
          excerpt: localized.excerpt,
          body: textToPortableText(localized.body),
          translationStatus: 'complete',
          coverImage: imageWithAlt(tr?.coverImage, localized.title) || doc.coverImage,
        })
        .commit({autoGenerateArrayKeys: false})
      try {
        await client.delete(`drafts.${doc._id}`)
      } catch {
        // ignore
      }
      console.log(`✓ ${language} post ${slug}`)
    }
  }
}

async function syncDataset(dataset: string) {
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

  console.log(`\nSyncing EN/AR content → ${dataset}`)
  await syncHomes(client)
  await syncCorporatePages(client)
  await syncProducts(client)
  await syncPosts(client)
}

async function main() {
  const arg = process.argv.find((item) => item.startsWith('--dataset='))
  const requested = arg?.split('=')[1] || process.env.NEXT_PUBLIC_SANITY_DATASET || 'development'
  const datasets = requested === 'all' ? ['development', 'production'] : [requested]
  for (const dataset of datasets) {
    await syncDataset(dataset)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
