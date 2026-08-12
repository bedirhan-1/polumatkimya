/**
 * Transforms extracted snapshot into Sanity-shaped documents (no writes).
 *
 * Usage: npm run migrate:transform
 */
import path from 'node:path'
import {randomBytes} from 'node:crypto'

import {
  ensureDirs,
  extractedDir,
  humanizeSlug,
  localizedPortableText,
  localizedString,
  localizedText,
  readJson,
  textToPortableText,
  transformedDir,
  writeJson,
} from './lib'
import {industrySeeds, productLocaleTitles} from './locale-titles'
import {productDescriptionI18n, translateFeature} from './product-copy-i18n'
import {
  localizeSpecLabel,
  localizeSpecValue,
  packagingLabelI18n,
  uiCopy,
} from './product-field-i18n'

type Snapshot = {
  categories: Array<{
    sourceKey: string
    legacyId: string
    slug: string
    title: Record<string, string>
    summary?: Record<string, string>
    legacyUrls?: string[]
    sortOrder?: number
  }>
  products: Array<{
    sourceKey: string
    legacyId: string
    slug: string
    sortOrder?: number
    categorySlug: string
    title: Record<string, string>
    shortDescription?: Record<string, string>
    bodyText?: Record<string, string>
    featuresTr?: string[]
    usageAreasTr?: string
    specs?: Array<{labelTr: string; value: string}>
    packaging?: Array<{labelTr: string; volume: string}>
    sdsUrl?: string | null
    catalogUrl?: string | null
    externalVideoUrl?: string | null
    legacyUrls?: string[]
    previousSlugs?: string[]
    imageUrls?: string[]
    status?: string
  }>
  posts: Array<{
    sourceKey: string
    legacyId: string
    language: string
    slug: string
    title: string
    excerpt?: string
    bodyText?: string
    translationStatus?: string
    legacyUrls?: string[]
    previousSlugs?: string[]
  }>
  pages: Array<{
    sourceKey: string
    language: string
    slug: string
    title: string
    bodyText?: string
    translationStatus?: string
    legacyUrls?: string[]
  }>
  contact?: {
    companyName?: string
    phone?: string
    email?: string
    catalogUrl?: string
  }
}

function key() {
  return randomBytes(4).toString('hex')
}

function pageBuilderFromText(title: string, bodyText?: string) {
  const blocks = textToPortableText(bodyText)
  if (!blocks) {
    return [
      {
        _type: 'imageTextSection',
        _key: 'intro',
        heading: title,
        body: [
          {
            _type: 'block',
            _key: 'placeholder',
            style: 'normal',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: 's1',
                text: 'İçerik editör tarafından tamamlanacak.',
                marks: [],
              },
            ],
          },
        ],
      },
    ]
  }

  return [
    {
      _type: 'imageTextSection',
      _key: 'intro',
      heading: title,
      body: blocks,
    },
  ]
}

function industrySlugForCategory(categorySlug: string) {
  if (categorySlug === 'industrial-sprays') {
    return ['automotive', 'industry', 'maintenance-technical-service']
  }
  if (categorySlug === 'construction-chemicals') {
    return ['industry', 'maintenance-technical-service']
  }
  return []
}

function featureItems(lines: string[] | undefined) {
  return (lines || [])
    .map((line) => translateFeature(line))
    .filter((line) => !/urun ozellikleri|ürün özellikleri/i.test(line.tr))
    .map((line) => ({
      _key: key(),
      _type: 'featureItem',
      title: localizedString({tr: line.tr, en: line.en, ar: line.ar}),
    }))
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

function main() {
  ensureDirs()
  const snapshot = readJson<Snapshot>(path.join(extractedDir, 'live-snapshot.json'))
  const issues: string[] = []

  const categories = snapshot.categories.map((category) => ({
    _type: 'productCategory',
    sourceKey: category.sourceKey,
    legacyId: category.legacyId,
    slug: {_type: 'slug', current: category.slug},
    title: localizedString(category.title),
    summary: localizedText(category.summary || {}),
    sortOrder: category.sortOrder ?? 0,
    legacyUrls: category.legacyUrls || [],
    seo: {
      _type: 'localizedSeo',
      title: localizedString(category.title),
      description: localizedText(category.summary || {}),
    },
  }))

  const industries = industrySeeds.map((industry) => ({
    _type: 'applicationArea',
    sourceKey: industry.sourceKey,
    slug: {_type: 'slug', current: industry.slug},
    title: localizedString(industry.title),
    summary: localizedText(industry.summary),
    seo: {
      _type: 'localizedSeo',
      title: localizedString(industry.title),
      description: localizedText(industry.summary),
    },
  }))

  const catalogUrl =
    snapshot.contact?.catalogUrl ||
    snapshot.products.find((p) => p.catalogUrl)?.catalogUrl ||
    'https://polumatkimya.com/Polumat.pdf'

  const documents: Array<Record<string, unknown>> = [
    {
      _type: 'downloadableDocument',
      sourceKey: 'doc:catalog:polumat',
      title: 'Polumat Product Catalog',
      documentType: 'catalog',
      legacySourceUrl: catalogUrl,
      label: uiCopy.catalogLabel,
    },
  ]

  for (const product of snapshot.products) {
    if (!product.sdsUrl) continue
    documents.push({
      _type: 'downloadableDocument',
      sourceKey: `doc:sds:${product.slug}`,
      title: `${product.title.tr} SDS`,
      documentType: 'sds',
      legacySourceUrl: product.sdsUrl,
      label: uiCopy.sdsLabel,
      relatedProductSlug: product.slug,
    })
  }

  const products = snapshot.products.map((product) => {
    const localeTitles = productLocaleTitles[product.slug]
    const enTitle = product.title.en || localeTitles?.en || humanizeSlug(product.slug)
    const arTitle = product.title.ar || localeTitles?.ar || enTitle
    if (!product.title.tr) issues.push(`Product ${product.slug} missing TR title`)
    if (!localeTitles) issues.push(`Product ${product.slug} missing locale title map`)

    const descI18n = productDescriptionI18n[product.slug]
    const shortTr = product.shortDescription?.tr?.replace(/^,\s*/, '').trim()
    const shortEn = descI18n?.en || shortTr
    const shortAr = descI18n?.ar || shortTr

    const features = featureItems(product.featuresTr)
    const benefits = features.slice(0, 3).map((item) => ({...item, _key: key()}))

    const untranslatedFeatures = (product.featuresTr || [])
      .map((line) => translateFeature(line))
      .filter((line) => line.en === line.tr && !/urun ozellikleri|ürün özellikleri/i.test(line.tr))
    if (untranslatedFeatures.length) {
      issues.push(
        `Product ${product.slug}: ${untranslatedFeatures.length} feature(s) still parallel TR for EN/AR`,
      )
    }

    const isSpray = product.categorySlug === 'industrial-sprays'
    const badge = localizedString(isSpray ? uiCopy.badgeSpray : uiCopy.badgeConstruction)
    const instructions = isSpray ? uiCopy.defaultInstructionsSpray : uiCopy.defaultInstructionsConstruction

    const usageTr = (product.usageAreasTr || shortTr || '').replace(/^,\s*/, '').trim()
    const usageEn = descI18n?.en || usageTr
    const usageAr = descI18n?.ar || usageTr

    const packagingVariants = (product.packaging || [])
      .filter((pack) => pack.volume?.trim())
      .map((pack) => {
        const labels = packagingLabelI18n(pack.volume)
        return {
          _key: key(),
          _type: 'packagingVariant',
          label: localizedString(labels),
          volume: pack.volume.trim(),
        }
      })

    const specItems = (product.specs || [])
      .filter((spec) => spec.labelTr?.trim() && spec.value?.trim())
      .map((spec) => {
        const label = localizeSpecLabel(spec.labelTr)
        const value = localizeSpecValue(spec.value)
        return {
          _key: key(),
          _type: 'specificationItem',
          label: localizedString(label),
          value: localizedString(value),
        }
      })

    const specificationGroups = specItems.length
      ? [
          {
            _key: key(),
            _type: 'specificationGroup',
            title: localizedString(uiCopy.specsHeading),
            items: specItems,
          },
        ]
      : []

    const documentKeys = ['doc:catalog:polumat']
    if (product.sdsUrl) documentKeys.push(`doc:sds:${product.slug}`)

    const relatedSlugs = snapshot.products
      .filter((other) => other.categorySlug === product.categorySlug && other.slug !== product.slug)
      .slice(0, 4)
      .map((other) => other.slug)

    const bodyTr = product.bodyText?.tr || [shortTr, product.featuresTr?.length ? `ÜRÜN ÖZELLİKLERİ\n• ${product.featuresTr.join('\n• ')}` : '']
      .filter(Boolean)
      .join('\n\n')
    const bodyEn = [shortEn, features.length ? `Product features\n• ${features.map((f) => {
      const tr = Array.isArray(f.title) ? f.title.find((t: {language?: string}) => t.language === 'en')?.value : ''
      return tr
    }).filter(Boolean).join('\n• ')}` : ''].filter(Boolean).join('\n\n')
    const bodyAr = [shortAr, features.length ? `ميزات المنتج\n• ${features.map((f) => {
      const tr = Array.isArray(f.title) ? f.title.find((t: {language?: string}) => t.language === 'ar')?.value : ''
      return tr
    }).filter(Boolean).join('\n• ')}` : ''].filter(Boolean).join('\n\n')

    return {
      _type: 'product',
      sourceKey: product.sourceKey,
      legacyId: product.legacyId,
      slug: {_type: 'slug', current: product.slug},
      status: product.status || 'published',
      sortOrder: product.sortOrder ?? 0,
      title: localizedString({tr: product.title.tr, en: enTitle, ar: arTitle}),
      shortDescription: localizedText({tr: shortTr, en: shortEn, ar: shortAr}),
      body: localizedPortableText({tr: bodyTr, en: bodyEn, ar: bodyAr}) || [],
      badge,
      benefits,
      features,
      usageAreas: localizedPortableText({tr: usageTr, en: usageEn, ar: usageAr}) || [],
      applicationInstructions: localizedPortableText(instructions) || [],
      warnings: localizedPortableText(uiCopy.defaultWarning) || [],
      packagingVariants,
      specificationGroups,
      externalVideoUrl: product.externalVideoUrl || 'https://polumatkimya.com/sayfa/uygulama-videolari',
      productCta: productCta(),
      documentKeys,
      relatedSlugs,
      industrySlugs: industrySlugForCategory(product.categorySlug),
      categorySlug: product.categorySlug,
      seo: {
        _type: 'localizedSeo',
        title: localizedString({tr: product.title.tr, en: enTitle, ar: arTitle}),
        description: localizedText({
          tr: shortTr?.slice(0, 160),
          en: shortEn?.slice(0, 160),
          ar: shortAr?.slice(0, 160),
        }),
      },
      legacyUrls: product.legacyUrls || [],
      previousSlugs: product.previousSlugs || [],
      imageUrls: product.imageUrls || [],
    }
  })

  const posts = snapshot.posts.map((post) => ({
    _type: 'post',
    sourceKey: post.sourceKey,
    legacyId: post.legacyId,
    language: post.language,
    slug: {_type: 'slug', current: post.slug},
    title: post.title,
    excerpt: post.excerpt || '',
    body: textToPortableText(post.bodyText),
    translationStatus: post.translationStatus || 'complete',
    publishedAt: new Date().toISOString(),
    legacyUrls: post.legacyUrls || [],
    previousSlugs: post.previousSlugs || [],
  }))

  const postStubs = snapshot.posts.flatMap((post) =>
    (['en', 'ar'] as const).map((language) => ({
      _type: 'post',
      sourceKey: `post:${language}:${post.legacyId}`,
      legacyId: `${post.legacyId}:${language}`,
      language,
      slug: {_type: 'slug', current: post.slug},
      title: humanizeSlug(post.slug),
      excerpt: '',
      body: undefined,
      translationStatus: 'draft',
      publishedAt: undefined,
      legacyUrls: [],
      previousSlugs: [],
      translationOfLegacyId: post.legacyId,
    })),
  )

  const pages = snapshot.pages.map((page) => ({
    _type: 'page',
    sourceKey: page.sourceKey,
    language: page.language,
    slug: {_type: 'slug', current: page.slug},
    title: page.title,
    translationStatus: page.translationStatus || 'complete',
    pageBuilder: pageBuilderFromText(page.title, page.bodyText),
    legacyUrls: page.legacyUrls || [],
  }))

  const pageStubs = snapshot.pages.flatMap((page) =>
    (['en', 'ar'] as const).map((language) => ({
      _type: 'page',
      sourceKey: `page:${language}:${page.slug}`,
      language,
      slug: {_type: 'slug', current: page.slug},
      title: humanizeSlug(page.slug),
      translationStatus: 'draft',
      pageBuilder: [],
      legacyUrls: [],
      translationOfSourceKey: page.sourceKey,
    })),
  )

  const siteSettings = {
    _type: 'siteSettings',
    sourceKey: 'siteSettings',
    companyName: snapshot.contact?.companyName || 'Polumat Kimya',
    contactChannels: [
      snapshot.contact?.phone || snapshot.contact?.email
        ? {
            _key: 'factory',
            phone: snapshot.contact?.phone || undefined,
            email: snapshot.contact?.email || undefined,
            department: localizedString({tr: 'Fabrika', en: 'Factory', ar: 'المصنع'}),
          }
        : null,
    ].filter(Boolean),
  }

  const payload = {
    transformedAt: new Date().toISOString(),
    categories,
    industries,
    documents,
    products,
    posts,
    postStubs,
    pages,
    pageStubs,
    siteSettings,
    issues,
    counts: {
      categories: categories.length,
      industries: industries.length,
      documents: documents.length,
      products: products.length,
      posts: posts.length,
      postStubs: postStubs.length,
      pages: pages.length,
      pageStubs: pageStubs.length,
    },
  }

  writeJson(path.join(transformedDir, 'documents.json'), payload)
  console.log('Transformed counts:', payload.counts)
  if (issues.length) {
    console.warn('Issues:')
    for (const issue of issues) console.warn(`- ${issue}`)
  }
}

main()
