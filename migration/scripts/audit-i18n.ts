/**
 * Read-only audit: compare TR vs EN/AR content and images.
 *   npx tsx migration/scripts/audit-i18n.ts
 */
import {createClient} from '@sanity/client'
import {existsSync, readFileSync, writeFileSync} from 'node:fs'
import path from 'node:path'

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

const TURKISH_RE = /[ğüşıöçĞÜŞİÖÇ]/
const ARABIC_RE = /[\u0600-\u06FF]/

type I18nItem = {_key?: string; language?: string; value?: unknown}

function loc(items: I18nItem[] | undefined, lang: string): unknown {
  if (!Array.isArray(items)) return undefined
  const hit = items.find((item) => item.language === lang || item._key === lang)
  return hit?.value
}

function ptText(value: unknown): string {
  if (!Array.isArray(value)) return typeof value === 'string' ? value : ''
  return value
    .map((block) => {
      if (!block || typeof block !== 'object') return ''
      const children = (block as {children?: Array<{text?: string}>}).children
      if (!Array.isArray(children)) return ''
      return children.map((c) => c.text || '').join('')
    })
    .filter(Boolean)
    .join('\n\n')
}

function assetRef(image: unknown): string | null {
  if (!image || typeof image !== 'object') return null
  const asset = (image as {asset?: {_ref?: string}}).asset
  return asset?._ref || null
}

function collectImageRefs(value: unknown, acc: string[] = [], prefix = ''): Array<{path: string; ref: string}> {
  const out: Array<{path: string; ref: string}> = []
  if (!value || typeof value !== 'object') return out
  if (Array.isArray(value)) {
    value.forEach((item, i) => out.push(...collectImageRefs(item, acc, `${prefix}[${i}]`)))
    return out
  }
  const obj = value as Record<string, unknown>
  if (obj.asset && typeof obj.asset === 'object' && (obj.asset as {_ref?: string})._ref) {
    out.push({path: prefix || 'image', ref: (obj.asset as {_ref: string})._ref})
  }
  for (const [key, child] of Object.entries(obj)) {
    if (key === 'asset' || key.startsWith('_')) continue
    out.push(...collectImageRefs(child, acc, prefix ? `${prefix}.${key}` : key))
  }
  return out
}

function langIssues(text: string, lang: 'en' | 'ar') {
  const issues: string[] = []
  if (!text?.trim()) {
    issues.push('empty')
    return issues
  }
  if (lang === 'en' && TURKISH_RE.test(text)) issues.push('has-turkish-chars')
  if (lang === 'en' && ARABIC_RE.test(text)) issues.push('has-arabic')
  if (lang === 'ar' && !ARABIC_RE.test(text) && text.length > 12) issues.push('no-arabic')
  if (lang === 'ar' && TURKISH_RE.test(text)) issues.push('has-turkish-chars')
  return issues
}

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'development'
  const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN
  if (!projectId || !token) throw new Error('Missing Sanity credentials')

  const client = createClient({
    projectId,
    dataset,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-08-02',
    token,
    useCdn: false,
  })

  const report: Record<string, unknown> = {dataset}

  const homePages = await client.fetch<Array<Record<string, unknown>>>(
    `*[_type=="homePage"]{_id, language, translationStatus, title,
      "heroDesktop": hero.desktopImage.asset._ref,
      "heroMobile": hero.mobileImage.asset._ref,
      "plImage": privateLabelSection.image.asset._ref,
      "aboutImage": aboutSection.image.asset._ref,
      "aboutStream": aboutSection.streamUrl,
      "aboutVideoId": aboutSection.streamVideoId,
      hero, productsSection, strengthsSection, industriesSection,
      privateLabelSection, aboutSection, qualitySection, ctaSection, seo}`,
  )
  report.homePages = homePages.map((p) => ({
    _id: p._id,
    language: p.language,
    translationStatus: p.translationStatus,
    heroDesktop: p.heroDesktop,
    heroMobile: p.heroMobile,
    plImage: p.plImage,
    aboutImage: p.aboutImage,
    aboutStream: p.aboutStream,
    aboutVideoId: p.aboutVideoId,
    heroLead: (p.hero as {headingLead?: string})?.headingLead,
    heroAccent: (p.hero as {headingAccent?: string})?.headingAccent,
    aboutTitle: (p.aboutSection as {title?: string})?.title,
    qualityItems: (p.qualitySection as {items?: unknown[]})?.items?.length,
    industryCards: (p.industriesSection as {areas?: unknown[]})?.areas?.length,
    featuredProducts: (p.productsSection as {products?: unknown[]})?.products?.length,
  }))

  const trHome = homePages.find((p) => p.language === 'tr')
  const imageDiffs: string[] = []
  for (const lang of ['en', 'ar']) {
    const other = homePages.find((p) => p.language === lang)
    if (!trHome || !other) {
      imageDiffs.push(`homePage ${lang}: missing document`)
      continue
    }
    for (const field of ['heroDesktop', 'heroMobile', 'plImage', 'aboutImage'] as const) {
      if (trHome[field] !== other[field]) {
        imageDiffs.push(
          `homePage ${lang}.${field}: TR=${trHome[field] || 'none'} vs ${lang}=${other[field] || 'none'}`,
        )
      }
    }
  }

  const pages = await client.fetch<
    Array<{
      _id: string
      language: string
      slug: string
      title: string
      translationStatus: string
      pageBuilder?: unknown[]
    }>
  >(
    `*[_type=="page"]{_id, language, translationStatus, title, "slug": slug.current, pageBuilder}`,
  )

  const pagesBySlug = new Map<string, typeof pages>()
  for (const page of pages) {
    const list = pagesBySlug.get(page.slug) || []
    list.push(page)
    pagesBySlug.set(page.slug, list)
  }

  const pageIssues: unknown[] = []
  for (const [slug, versions] of pagesBySlug) {
    const tr = versions.find((v) => v.language === 'tr')
    const en = versions.find((v) => v.language === 'en')
    const ar = versions.find((v) => v.language === 'ar')
    const trImages = collectImageRefs(tr?.pageBuilder)
    const entry: Record<string, unknown> = {
      slug,
      langs: versions.map((v) => `${v.language}:${v.translationStatus}:${v.title}`),
    }
    for (const lang of ['en', 'ar'] as const) {
      const other = lang === 'en' ? en : ar
      if (!other) {
        entry[`${lang}Missing`] = true
        continue
      }
      const otherImages = collectImageRefs(other.pageBuilder)
      const trRefs = trImages.map((i) => i.ref).join(',')
      const otherRefs = otherImages.map((i) => i.ref).join(',')
      if (trRefs !== otherRefs) {
        entry[`${lang}ImagesDiffer`] = {tr: trImages, [lang]: otherImages}
      }
      const trBody = ptText(
        (tr?.pageBuilder || []).flatMap((b) =>
          b && typeof b === 'object' && (b as {_type?: string})._type === 'imageTextSection'
            ? [(b as {body?: unknown}).body]
            : [],
        ),
      )
      const otherBody = ptText(
        (other.pageBuilder || []).flatMap((b) =>
          b && typeof b === 'object' && (b as {_type?: string})._type === 'imageTextSection'
            ? [(b as {body?: unknown}).body]
            : [],
        ),
      )
      entry[`${lang}BodyLen`] = otherBody.length
      entry.trBodyLen = trBody.length
      if (trBody && otherBody.length < trBody.length * 0.45) {
        entry[`${lang}BodyShort`] = true
      }
      const issues = langIssues(otherBody, lang)
      if (issues.length) entry[`${lang}BodyIssues`] = issues
      if (langIssues(other.title, lang).length) entry[`${lang}TitleIssues`] = langIssues(other.title, lang)
    }
    pageIssues.push(entry)
  }

  const posts = await client.fetch<
    Array<{
      _id: string
      language: string
      slug: string
      title: string
      translationStatus: string
      excerpt?: string
      cover?: string
    }>
  >(
    `*[_type=="post"]{_id, language, translationStatus, title, excerpt, "slug": slug.current, "cover": coverImage.asset._ref}`,
  )
  const postsBySlug = new Map<string, typeof posts>()
  for (const post of posts) {
    const list = postsBySlug.get(post.slug) || []
    list.push(post)
    postsBySlug.set(post.slug, list)
  }
  const postIssues: unknown[] = []
  for (const [slug, versions] of postsBySlug) {
    const tr = versions.find((v) => v.language === 'tr')
    const entry: Record<string, unknown> = {
      slug,
      langs: versions.map((v) => `${v.language}:${v.translationStatus}:${v.title}`),
      covers: Object.fromEntries(versions.map((v) => [v.language, v.cover])),
    }
    for (const lang of ['en', 'ar'] as const) {
      const other = versions.find((v) => v.language === lang)
      if (!other) {
        entry[`${lang}Missing`] = true
        continue
      }
      if (tr?.cover && other.cover !== tr.cover) entry[`${lang}CoverDiffers`] = true
      if (other.excerpt) {
        const issues = langIssues(other.excerpt, lang)
        if (issues.length) entry[`${lang}ExcerptIssues`] = issues
      }
      const titleIssues = langIssues(other.title, lang)
      if (titleIssues.length) entry[`${lang}TitleIssues`] = titleIssues
    }
    postIssues.push(entry)
  }

  const products = await client.fetch<Array<Record<string, unknown>>>(
    `*[_type=="product"]{
      _id, "slug": slug.current, status,
      title, shortDescription, body, badge,
      usageAreas, applicationInstructions, warnings,
      "card": cardImage.asset._ref,
      "pack": packshot.asset._ref,
      gallery[]{asset, "alt": alt},
      benefits[]{title, description},
      features[]{title, description},
      packagingVariants[]{label, volume, sku},
      specificationGroups[]{title, items[]{label, value, unit, note}}
    }`,
  )

  const productIssues: unknown[] = []
  for (const product of products) {
    const slug = product.slug as string
    const entry: Record<string, unknown> = {slug, status: product.status, card: product.card, pack: product.pack}
    for (const lang of ['en', 'ar'] as const) {
      const title = String(loc(product.title as I18nItem[], lang) || '')
      const short = String(loc(product.shortDescription as I18nItem[], lang) || '')
      const body = ptText(loc(product.body as I18nItem[], lang))
      const usage = ptText(loc(product.usageAreas as I18nItem[], lang))
      const instr = ptText(loc(product.applicationInstructions as I18nItem[], lang))
      const warn = ptText(loc(product.warnings as I18nItem[], lang))
      const trTitle = String(loc(product.title as I18nItem[], 'tr') || '')
      const trBody = ptText(loc(product.body as I18nItem[], 'tr'))
      const issues: string[] = []
      issues.push(...langIssues(title, lang).map((i) => `title:${i}`))
      issues.push(...langIssues(short, lang).map((i) => `short:${i}`))
      if (trBody && !body) issues.push('body:empty')
      else issues.push(...langIssues(body, lang).map((i) => `body:${i}`))
      if (trBody && body && body.length < trBody.length * 0.4) issues.push('body:short')
      if (ptText(loc(product.usageAreas as I18nItem[], 'tr')) && !usage) issues.push('usage:empty')
      else if (usage) issues.push(...langIssues(usage, lang).map((i) => `usage:${i}`))
      if (ptText(loc(product.applicationInstructions as I18nItem[], 'tr')) && !instr) issues.push('instr:empty')
      else if (instr) issues.push(...langIssues(instr, lang).map((i) => `instr:${i}`))
      if (ptText(loc(product.warnings as I18nItem[], 'tr')) && !warn) issues.push('warn:empty')
      else if (warn) issues.push(...langIssues(warn, lang).map((i) => `warn:${i}`))
      if (!title && trTitle) issues.push('title:empty')

      const features = (product.features as Array<{title?: I18nItem[]; description?: I18nItem[]}> | undefined) || []
      features.forEach((f, i) => {
        const t = String(loc(f.title, lang) || '')
        const d = String(loc(f.description, lang) || '')
        const trT = String(loc(f.title, 'tr') || '')
        if (trT && !t) issues.push(`feature[${i}].title:empty`)
        issues.push(...langIssues(t, lang).filter((x) => x !== 'empty').map((x) => `feature[${i}].title:${x}`))
        issues.push(...langIssues(d, lang).filter((x) => x !== 'empty').map((x) => `feature[${i}].desc:${x}`))
      })
      const benefits = (product.benefits as Array<{title?: I18nItem[]; description?: I18nItem[]}> | undefined) || []
      benefits.forEach((f, i) => {
        const t = String(loc(f.title, lang) || '')
        const d = String(loc(f.description, lang) || '')
        const trT = String(loc(f.title, 'tr') || '')
        if (trT && !t) issues.push(`benefit[${i}].title:empty`)
        issues.push(...langIssues(t, lang).filter((x) => x !== 'empty').map((x) => `benefit[${i}].title:${x}`))
        issues.push(...langIssues(d, lang).filter((x) => x !== 'empty').map((x) => `benefit[${i}].desc:${x}`))
      })
      const specs =
        (product.specificationGroups as Array<{
          title?: I18nItem[]
          items?: Array<{label?: I18nItem[]; note?: I18nItem[]; value?: string}>
        }> | undefined) || []
      specs.forEach((g, gi) => {
        const t = String(loc(g.title, lang) || '')
        const trT = String(loc(g.title, 'tr') || '')
        if (trT && !t) issues.push(`specGroup[${gi}].title:empty`)
        issues.push(...langIssues(t, lang).filter((x) => x !== 'empty').map((x) => `specGroup[${gi}].title:${x}`))
        ;(g.items || []).forEach((item, ii) => {
          const l = String(loc(item.label, lang) || '')
          const trL = String(loc(item.label, 'tr') || '')
          if (trL && !l) issues.push(`spec[${gi}][${ii}].label:empty`)
          issues.push(...langIssues(l, lang).filter((x) => x !== 'empty').map((x) => `spec[${gi}][${ii}].label:${x}`))
        })
      })
      if (issues.length) entry[lang] = issues
    }
    productIssues.push(entry)
  }

  const areas = await client.fetch<Array<Record<string, unknown>>>(
    `*[_type=="applicationArea"]{
      _id, "slug": slug.current, title, summary, body,
      "cover": coverImage.asset._ref,
      benefits[]{title, description}
    }`,
  )
  const areaIssues: unknown[] = []
  for (const area of areas) {
    const entry: Record<string, unknown> = {slug: area.slug, cover: area.cover}
    for (const lang of ['en', 'ar'] as const) {
      const title = String(loc(area.title as I18nItem[], lang) || '')
      const summary = String(loc(area.summary as I18nItem[], lang) || '')
      const body = ptText(loc(area.body as I18nItem[], lang))
      const trBody = ptText(loc(area.body as I18nItem[], 'tr'))
      const issues: string[] = []
      issues.push(...langIssues(title, lang).map((i) => `title:${i}`))
      issues.push(...langIssues(summary, lang).map((i) => `summary:${i}`))
      if (trBody && !body) issues.push('body:empty')
      else if (body) issues.push(...langIssues(body, lang).map((i) => `body:${i}`))
      if (trBody && body && body.length < trBody.length * 0.45) issues.push('body:short')
      if (issues.length) entry[lang] = issues
    }
    areaIssues.push(entry)
  }

  const categories = await client.fetch<Array<Record<string, unknown>>>(
    `*[_type=="productCategory"]{_id, "slug": slug.current, title, summary, body, "image": image.asset._ref}`,
  )
  const categoryIssues: unknown[] = []
  for (const cat of categories) {
    const entry: Record<string, unknown> = {slug: cat.slug, image: cat.image}
    for (const lang of ['en', 'ar'] as const) {
      const title = String(loc(cat.title as I18nItem[], lang) || '')
      const summary = String(loc(cat.summary as I18nItem[], lang) || '')
      const body = ptText(loc(cat.body as I18nItem[], lang))
      const issues: string[] = []
      issues.push(...langIssues(title, lang).map((i) => `title:${i}`))
      issues.push(...langIssues(summary, lang).map((i) => `summary:${i}`))
      if (body) issues.push(...langIssues(body, lang).map((i) => `body:${i}`))
      if (issues.length) entry[lang] = issues
    }
    categoryIssues.push(entry)
  }

  const videos = await client.fetch<Array<Record<string, unknown>>>(
    `*[_type=="video"]{_id, title, description, "cover": coverImage.asset._ref}`,
  )
  const videoIssues: unknown[] = []
  for (const video of videos) {
    const entry: Record<string, unknown> = {_id: video._id, cover: video.cover}
    for (const lang of ['en', 'ar'] as const) {
      const title = String(loc(video.title as I18nItem[], lang) || '')
      const description = String(loc(video.description as I18nItem[], lang) || '')
      const issues: string[] = []
      issues.push(...langIssues(title, lang).map((i) => `title:${i}`))
      if (description) issues.push(...langIssues(description, lang).map((i) => `desc:${i}`))
      if (issues.length) entry[lang] = issues
    }
    videoIssues.push(entry)
  }

  const contactPage = await client.fetch(
    `*[_id=="contactPage"][0]{eyebrow, title, intro, phones, emails, locations, formTitle}`,
  )
  const exportPage = await client.fetch(`*[_id=="exportPage"][0]{eyebrow, title, intro, activities, contacts}`)

  report.imageDiffs = imageDiffs
  report.pages = pageIssues
  report.posts = postIssues
  report.products = productIssues
  report.areas = areaIssues
  report.categories = categoryIssues
  report.videos = videoIssues
  report.contactPage = {
    title: {
      tr: loc(contactPage?.title, 'tr'),
      en: loc(contactPage?.title, 'en'),
      ar: loc(contactPage?.title, 'ar'),
    },
    intro: {
      tr: loc(contactPage?.intro, 'tr'),
      en: loc(contactPage?.intro, 'en'),
      ar: loc(contactPage?.intro, 'ar'),
    },
    phones: contactPage?.phones?.length || 0,
    emails: contactPage?.emails?.length || 0,
    locations: contactPage?.locations?.length || 0,
  }
  report.exportPage = {
    title: {
      tr: loc(exportPage?.title, 'tr'),
      en: loc(exportPage?.title, 'en'),
      ar: loc(exportPage?.title, 'ar'),
    },
    introLens: {
      tr: String(loc(exportPage?.intro, 'tr') || '').length,
      en: String(loc(exportPage?.intro, 'en') || '').length,
      ar: String(loc(exportPage?.intro, 'ar') || '').length,
    },
    activities: (exportPage?.activities || []).map((a: {title?: I18nItem[]}) => ({
      tr: loc(a.title, 'tr'),
      en: loc(a.title, 'en'),
      ar: loc(a.title, 'ar'),
    })),
  }

  const outPath = path.resolve(process.cwd(), 'migration/reports/i18n-audit.json')
  writeFileSync(outPath, JSON.stringify(report, null, 2))
  console.log(`Wrote ${outPath}`)
  console.log('homePages', report.homePages)
  console.log('imageDiffs', imageDiffs)
  console.log('pages', JSON.stringify(pageIssues, null, 2))
  console.log('posts', JSON.stringify(postIssues, null, 2))
  console.log('areas', JSON.stringify(areaIssues, null, 2))
  console.log('categories', JSON.stringify(categoryIssues, null, 2))
  console.log('videos', JSON.stringify(videoIssues, null, 2))
  console.log('contact', JSON.stringify(report.contactPage, null, 2))
  console.log('export', JSON.stringify(report.exportPage, null, 2))
  console.log(
    'product issue counts',
    productIssues.map((p) => ({
      slug: (p as {slug: string}).slug,
      en: ((p as {en?: string[]}).en || []).length,
      ar: ((p as {ar?: string[]}).ar || []).length,
    })),
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
