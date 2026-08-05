/**
 * Re-extracts public content from the live Polumat site into a local snapshot.
 * Does not write to Sanity.
 *
 * Usage: npm run migrate:extract
 */
import {legacyBlogSlugMap, legacyProductSlugMap} from '../../lib/redirects/legacy'
import {
  cleanExtractedText,
  ensureDirs,
  extractedDir,
  foldTr,
  isJunkText,
  writeJson,
} from './lib'

const ORIGIN = 'https://polumatkimya.com'

async function fetchHtml(url: string) {
  const response = await fetch(url, {
    headers: {'User-Agent': 'PolumatMigrationBot/1.0'},
  })
  if (!response.ok) throw new Error(`Failed ${url}: ${response.status}`)
  return response.text()
}

function stripChrome(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
}

function cleanHtmlText(value: string) {
  return cleanExtractedText(value.replace(/<[^>]+>/g, ' '))
}

function extractTitle(html: string) {
  const match = html.match(/<h3 class="title">(.*?)<\/h3>/is)
  return match ? cleanHtmlText(match[1]) : null
}

function extractParagraphs(html: string) {
  const cleaned = stripChrome(html)
  return [...cleaned.matchAll(/<p[^>]*>(.*?)<\/p>/gis)]
    .map((m) => cleanHtmlText(m[1] || ''))
    .filter((p) => !isJunkText(p))
}

function isFeaturesHeading(text: string) {
  return foldTr(text).includes('urun ozellikleri')
}

function extractProductCopy(html: string, title: string) {
  const cleaned = stripChrome(html)
  const rawParagraphs = [...cleaned.matchAll(/<p[^>]*>(.*?)<\/p>/gis)].map((m) => m[1] || '')

  const paragraphs = rawParagraphs
    .map((raw) => cleanHtmlText(raw))
    .map((p) => p.replace(new RegExp(`^(?:Ana Sayfa\\s+)?(?:${title}\\s*)+`, 'i'), '').trim())
    .filter((p) => p && foldTr(p) !== foldTr(title))
    .filter((p) => !isJunkText(p) || isFeaturesHeading(p))

  const unique: string[] = []
  for (const block of paragraphs) {
    if (!unique.includes(block)) unique.push(block)
  }

  const description =
    unique.find((p) => !isFeaturesHeading(p) && !/güvenlik|guvenlik/i.test(p)) || ''

  let features: string[] = []
  const featuresBlock = unique.find((p) => isFeaturesHeading(p)) || ''
  if (featuresBlock) {
    features = featuresBlock
      .replace(/ürün\s+özellikleri/gi, '')
      .replace(/&bull;/gi, '•')
      .split(/•|·|\n/)
      .map((part) => part.trim())
      .filter((part) => part.length > 8 && !isFeaturesHeading(part))
  }

  // Fallback: parse bullets from raw HTML of the features paragraph
  if (!features.length) {
    const rawFeatures = rawParagraphs.find((raw) => isFeaturesHeading(cleanHtmlText(raw)))
    if (rawFeatures) {
      features = rawFeatures
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/?strong>/gi, '')
        .split(/\n|&bull;|•/)
        .map((part) => cleanHtmlText(part))
        .filter((part) => part && !isFeaturesHeading(part) && part.length > 8)
    }
  }

  return {description, features, paragraphs: unique}
}

function extractSpecTable(html: string) {
  const cleaned = stripChrome(html)
  const tables = [...cleaned.matchAll(/<table[^>]*>([\s\S]*?)<\/table>/gi)]
  if (!tables.length) {
    return {headers: [] as string[], values: [] as string[], extraVolumes: [] as string[]}
  }

  const tableHtml = tables[0]![1]
  const rows = [...tableHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map((m) =>
    [...m[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((cell) => cleanHtmlText(cell[1] || '')),
  )
  const nonEmpty = rows.filter((row) => row.some(Boolean))
  if (nonEmpty.length < 2) {
    return {headers: [] as string[], values: [] as string[], extraVolumes: [] as string[]}
  }

  const headers = nonEmpty[0] || []
  const values = nonEmpty[1] || []
  const extraVolumes: string[] = []
  const volumeLike = (cell: string) =>
    Boolean(cell && /^\s*\d+([.,]\d+)?\s*(ml|mL|lt|L|l|gr|g|kg)\s*$/i.test(cell))

  for (const row of nonEmpty.slice(1)) {
    for (const cell of row) {
      if (volumeLike(cell)) extraVolumes.push(cell)
    }
  }

  return {headers, values, extraVolumes: [...new Set(extraVolumes)]}
}

function extractImages(html: string) {
  const matches = [
    ...html.matchAll(
      /src="((?:https:\/\/polumatkimya\.com)?\/images\/[^"]+\.(?:webp|jpg|jpeg|png))"/gi,
    ),
  ]
  return [
    ...new Set(
      matches
        .map((m) => m[1])
        .filter((src): src is string => Boolean(src))
        .map((src) => (src.startsWith('/') ? `${ORIGIN}${src}` : src))
        .filter((src) => !src.includes('/settings/') && !src.toLowerCase().includes('logo')),
    ),
  ]
}

function extractPdfs(html: string, legacySlug: string) {
  const hrefs = [...html.matchAll(/href="([^"]+\.pdf[^"]*)"/gi)].map((m) => m[1])
  const absolute = hrefs
    .filter(Boolean)
    .map((href) => {
      if (href.startsWith('http')) return href
      if (href.startsWith('/')) return `${ORIGIN}${href}`
      return `${ORIGIN}/${href}`
    })
    .filter((href) => !href.toLowerCase().endsWith('/polumat.pdf') || href.toLowerCase().includes('polumat.pdf'))

  const catalog = absolute.find((href) => /polumat\.pdf$/i.test(href)) || `${ORIGIN}/Polumat.pdf`
  const sds =
    absolute.find(
      (href) =>
        href.toLowerCase().includes(legacySlug) ||
        href.toLowerCase().includes('guvenlik') ||
        href.toLowerCase().includes('güvenlik') ||
        href.toLowerCase().includes('sds'),
    ) || null

  return {catalogUrl: catalog, sdsUrl: sds && !/polumat\.pdf$/i.test(sds) ? sds : null}
}

function packagingFromSpecs(headers: string[], values: string[], extraVolumes: string[]) {
  const packs: Array<{labelTr: string; volume: string}> = []
  for (const volume of extraVolumes) {
    if (!volume.trim()) continue
    if (!packs.some((pack) => pack.volume === volume)) {
      packs.push({labelTr: volume, volume})
    }
  }
  if (!packs.length) {
    const gramajIndex = headers.findIndex((header) => /gramaj/i.test(header))
    if (gramajIndex >= 0 && values[gramajIndex]?.trim()) {
      packs.push({labelTr: values[gramajIndex]!, volume: values[gramajIndex]!})
    }
  }
  return packs
}

const spraySlugs = new Set([
  'fren-balata-temizleme-spreyi',
  'pas-sokucu-sprey',
  'motor-temizleme-spreyi',
  'sivi-gres-zincir-yaglayici',
  'kontak-temizleme-spreyi',
  'lastik-parlatici-sprey',
  'torpido-parlatici-sprey',
  'kalip-ayirici-sprey',
])

async function main() {
  ensureDirs()
  const products = []
  let index = 0
  for (const [legacySlug, slug] of Object.entries(legacyProductSlugMap)) {
    index += 1
    const html = await fetchHtml(`${ORIGIN}/urunler/detay/${legacySlug}`)
    const title = extractTitle(html) || legacySlug
    const copy = extractProductCopy(html, title)
    const specs = extractSpecTable(html)
    const pdfs = extractPdfs(html, legacySlug)
    const packaging = packagingFromSpecs(specs.headers, specs.values, specs.extraVolumes)

    products.push({
      sourceKey: `product:${legacySlug}`,
      legacyId: legacySlug,
      legacySlug,
      slug,
      sortOrder: index,
      categorySlug: spraySlugs.has(legacySlug) ? 'industrial-sprays' : 'construction-chemicals',
      title: {tr: title},
      shortDescription: copy.description ? {tr: copy.description.slice(0, 400)} : {},
      bodyText: copy.description || copy.features.length
        ? {
            tr: [copy.description, copy.features.length ? `ÜRÜN ÖZELLİKLERİ\n• ${copy.features.join('\n• ')}` : '']
              .filter(Boolean)
              .join('\n\n'),
          }
        : {},
      featuresTr: copy.features,
      usageAreasTr: copy.description || '',
      specs: specs.headers.map((header, i) => ({
        labelTr: header,
        value: specs.values[i] || '',
      })).filter((item) => item.labelTr && item.value),
      packaging,
      sdsUrl: pdfs.sdsUrl,
      catalogUrl: pdfs.catalogUrl,
      externalVideoUrl: `${ORIGIN}/sayfa/uygulama-videolari`,
      legacyUrls: [
        `/urunler/detay/${legacySlug}`,
        `/urunler/${legacySlug}`,
        `http://www.polumatkimya.com/urunler/detay/${legacySlug}`,
      ],
      previousSlugs: [legacySlug],
      imageUrls: extractImages(html).slice(0, 6),
      status: 'published',
    })

    console.log(
      `product ${legacySlug} → features=${copy.features.length} specs=${specs.headers.length} packs=${packaging.length} sds=${Boolean(pdfs.sdsUrl)}`,
    )
  }

  const posts = []
  for (const [legacySlug, slug] of Object.entries(legacyBlogSlugMap)) {
    const html = await fetchHtml(`${ORIGIN}/blog/${legacySlug}`)
    const titleMatch =
      html.match(/<h[123][^>]*class="[^"]*title[^"]*"[^>]*>(.*?)<\/h[123]>/is) ||
      html.match(/<h1[^>]*>(.*?)<\/h1>/is)
    const title = titleMatch ? cleanHtmlText(titleMatch[1]) : legacySlug
    const body = extractParagraphs(html)
    posts.push({
      sourceKey: `post:tr:${legacySlug}`,
      legacyId: legacySlug,
      language: 'tr',
      slug,
      title,
      excerpt: body[0]?.slice(0, 280) || '',
      bodyText: body.slice(0, 12).join('\n\n'),
      translationStatus: 'complete',
      legacyUrls: [`/blog/${legacySlug}`, `http://www.polumatkimya.com/blog/${legacySlug}`],
      previousSlugs: [legacySlug],
    })
    console.log(`post ${legacySlug} → ${title}`)
  }

  const aboutHtml = await fetchHtml(`${ORIGIN}/sayfa/hakkimizda`)
  const aboutBody = extractParagraphs(aboutHtml).slice(0, 10).join('\n\n')

  const snapshot = {
    extractedAt: new Date().toISOString(),
    sourceOrigin: ORIGIN,
    categories: [
      {
        sourceKey: 'category:industrial-sprays',
        legacyId: 'endustriyel-spreyler',
        slug: 'industrial-sprays',
        title: {tr: 'Endüstriyel Spreyler', en: 'Industrial Sprays', ar: 'بخاخات صناعية'},
        summary: {
          tr: 'Otomotiv ve endüstriyel bakım spreyleri.',
          en: 'Automotive and industrial maintenance sprays.',
          ar: 'بخاخات صيانة للسيارات والاستخدام الصناعي.',
        },
        legacyUrls: ['/urunler/kategori/endustriyel-spreyler'],
        sortOrder: 1,
      },
      {
        sourceKey: 'category:construction-chemicals',
        legacyId: 'yapi-kimyasallari',
        slug: 'construction-chemicals',
        title: {tr: 'Yapı Kimyasalları', en: 'Construction Chemicals', ar: 'كيماويات البناء'},
        summary: {
          tr: 'Silikon, mastik ve yapı kimyasalları.',
          en: 'Silicones, sealants and construction chemicals.',
          ar: 'سيليكون ومانعات تسرب وكيماويات البناء.',
        },
        legacyUrls: ['/urunler/kategori/yapi-kimyasallari'],
        sortOrder: 2,
      },
    ],
    products,
    posts,
    pages: [
      {
        sourceKey: 'page:tr:about',
        language: 'tr',
        slug: 'about',
        title: 'Hakkımızda',
        bodyText: aboutBody,
        legacyUrls: ['/sayfa/hakkimizda'],
        translationStatus: 'complete',
      },
      {
        sourceKey: 'page:tr:mission-and-vision',
        language: 'tr',
        slug: 'mission-and-vision',
        title: 'Misyon ve Vizyonumuz',
        legacyUrls: ['/sayfa/misyon-ve-vizyonumuz'],
        translationStatus: 'complete',
      },
      {
        sourceKey: 'page:tr:quality-certificates',
        language: 'tr',
        slug: 'quality-certificates',
        title: 'Polumat Kalitesi',
        legacyUrls: ['/sayfa/polumat-kalitesi'],
        translationStatus: 'complete',
      },
      {
        sourceKey: 'page:tr:environmental-responsibility',
        language: 'tr',
        slug: 'environmental-responsibility',
        title: 'Çevreye Duyarlılık',
        legacyUrls: ['/sayfa/cevreye-duyarlilik'],
        translationStatus: 'complete',
      },
      {
        sourceKey: 'page:tr:occupational-health-and-safety',
        language: 'tr',
        slug: 'occupational-health-and-safety',
        title: 'İş Sağlığı ve Güvenliği',
        legacyUrls: ['/sayfa/is-sagligi-ve-guvenligi'],
        translationStatus: 'complete',
      },
      {
        sourceKey: 'page:tr:customer-satisfaction',
        language: 'tr',
        slug: 'customer-satisfaction',
        title: 'Müşteri Memnuniyeti',
        legacyUrls: ['/sayfa/musteri-memnuniyeti'],
        translationStatus: 'complete',
      },
      {
        sourceKey: 'page:tr:human-resources',
        language: 'tr',
        slug: 'human-resources',
        title: 'İnsan Kaynakları',
        legacyUrls: ['/sayfa/insan-kaynaklari'],
        translationStatus: 'complete',
      },
      {
        sourceKey: 'page:tr:return-and-exchange-policy',
        language: 'tr',
        slug: 'return-and-exchange-policy',
        title: 'İade ve Değişim Politikamız',
        legacyUrls: ['/sayfa/iade-ve-degisim-politikamiz'],
        translationStatus: 'complete',
      },
    ],
    contact: {
      companyName: 'Polumat Kimya San.Tic.Ltd.Şti',
      phone: '+90 372 615 77 70',
      email: 'fabrika@polumatkimya.com',
      catalogUrl: `${ORIGIN}/Polumat.pdf`,
    },
    videos: [
      {
        sourceKey: 'video:application-videos',
        title: {tr: 'Uygulama videoları', en: 'Application videos', ar: 'مقاطع فيديو التطبيق'},
        description: {tr: 'Ürün uygulama videoları.'},
        provider: 'youtube',
        externalUrl: null,
        legacyUrls: ['/sayfa/uygulama-videolari'],
      },
    ],
  }

  writeJson(`${extractedDir}/live-snapshot.json`, snapshot)
  console.log(
    `Wrote snapshot. products=${products.length} with avg features=${(
      products.reduce((sum, p) => sum + p.featuresTr.length, 0) / products.length
    ).toFixed(1)}`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
