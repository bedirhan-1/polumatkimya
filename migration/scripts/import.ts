/**
 * Imports transformed documents into Sanity.
 *
 * Defaults to dry-run. Never writes unless --write is passed.
 * Requires SANITY_API_WRITE_TOKEN for --write.
 *
 * Usage:
 *   npm run migrate:import -- --dry-run
 *   npm run migrate:import -- --write
 *   npm run migrate:import -- --write --with-assets
 */
import {createClient, type SanityClient} from '@sanity/client'
import {createHash} from 'node:crypto'
import {existsSync, readFileSync} from 'node:fs'
import path from 'node:path'

import {
  ensureDirs,
  localizedString,
  parseArgs,
  readJson,
  reportsDir,
  transformedDir,
  writeJson,
} from './lib'

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

type Transformed = {
  categories: Array<
    Record<string, unknown> & {
      sourceKey: string
      legacyId?: string
      slug: {_type: string; current: string}
    }
  >
  industries?: Array<
    Record<string, unknown> & {
      sourceKey: string
      slug: {_type: string; current: string}
    }
  >
  documents?: Array<
    Record<string, unknown> & {
      sourceKey: string
      title: string
      documentType: string
      legacySourceUrl: string
      label?: Record<string, string>
      relatedProductSlug?: string
    }
  >
  products: Array<
    Record<string, unknown> & {
      sourceKey: string
      legacyId: string
      slug: {_type: string; current: string}
      categorySlug: string
      industrySlugs?: string[]
      imageUrls?: string[]
      documentKeys?: string[]
      relatedSlugs?: string[]
      title?: unknown
    }
  >
  posts: Array<
    Record<string, unknown> & {
      sourceKey: string
      legacyId?: string
      language: string
      slug: {_type: string; current: string}
    }
  >
  postStubs: Array<
    Record<string, unknown> & {
      sourceKey: string
      language: string
      slug: {_type: string; current: string}
      translationOfLegacyId?: string
    }
  >
  pages: Array<
    Record<string, unknown> & {
      sourceKey: string
      language: string
      slug: {_type: string; current: string}
    }
  >
  pageStubs: Array<
    Record<string, unknown> & {
      sourceKey: string
      language: string
      slug: {_type: string; current: string}
      translationOfSourceKey?: string
    }
  >
  siteSettings: Record<string, unknown> & {
    sourceKey: string
    companyName?: string
    contactChannels?: unknown
  }
}

function getWriteClient(): SanityClient {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
  const token = process.env.SANITY_API_WRITE_TOKEN
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-08-02'
  if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
  if (!token) throw new Error('Missing SANITY_API_WRITE_TOKEN (Editor token with write access)')
  return createClient({projectId, dataset, apiVersion, token, useCdn: false})
}

async function findByLegacyId(client: SanityClient, type: string, legacyId: string) {
  if (!legacyId) return null
  return client.fetch<{_id: string} | null>(
    `*[_type == $type && legacyId == $legacyId][0]{_id}`,
    {type, legacyId},
  )
}

async function findBySlug(client: SanityClient, type: string, slug: string, language?: string) {
  if (language) {
    return client.fetch<{_id: string} | null>(
      `*[_type == $type && language == $language && slug.current == $slug][0]{_id}`,
      {type, language, slug},
    )
  }
  return client.fetch<{_id: string} | null>(
    `*[_type == $type && slug.current == $slug][0]{_id}`,
    {type, slug},
  )
}

function stripMigrationOnlyFields(doc: Record<string, unknown>) {
  const clone = {...doc}
  delete clone.sourceKey
  delete clone.categorySlug
  delete clone.industrySlugs
  delete clone.imageUrls
  delete clone.documentKeys
  delete clone.relatedSlugs
  delete clone.relatedProductSlug
  delete clone.label
  delete clone.translationOfLegacyId
  delete clone.translationOfSourceKey
  delete clone._id
  return clone
}

async function upsert(
  client: SanityClient,
  existingId: string | null | undefined,
  doc: Record<string, unknown>,
  log: string[],
) {
  const sourceKey = String(doc.sourceKey || '')
  const rest = stripMigrationOnlyFields(doc)

  if (existingId) {
    await client.patch(existingId).set(rest).commit({autoGenerateArrayKeys: true})
    log.push(`updated ${rest._type} ${existingId} (${sourceKey})`)
    return existingId
  }

  const created = await client.create(rest, {autoGenerateArrayKeys: true})
  log.push(`created ${rest._type} ${created._id} (${sourceKey})`)
  return created._id
}

async function uploadImage(client: SanityClient, url: string) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Asset download failed ${url}: ${response.status}`)
  const buffer = Buffer.from(await response.arrayBuffer())
  const filename =
    url.split('/').pop()?.split('?')[0] ||
    `asset-${createHash('sha1').update(url).digest('hex').slice(0, 10)}.jpg`
  const asset = await client.assets.upload('image', buffer, {filename})
  return {
    _type: 'image',
    asset: {_type: 'reference', _ref: asset._id},
  }
}

async function uploadPdf(client: SanityClient, url: string) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`PDF download failed ${url}: ${response.status}`)
  const buffer = Buffer.from(await response.arrayBuffer())
  const filename =
    url.split('/').pop()?.split('?')[0] ||
    `doc-${createHash('sha1').update(url).digest('hex').slice(0, 10)}.pdf`
  const asset = await client.assets.upload('file', buffer, {
    filename,
    contentType: 'application/pdf',
  })
  return {
    _type: 'file',
    asset: {_type: 'reference', _ref: asset._id},
  }
}

async function findDocumentByLegacyUrl(client: SanityClient, url: string) {
  return client.fetch<{_id: string} | null>(
    `*[_type == "downloadableDocument" && legacySourceUrl == $url][0]{_id}`,
    {url},
  )
}

function localizedLabelFromCopy(label?: Record<string, string>) {
  if (!label) return undefined
  return localizedString(label as Partial<Record<'tr' | 'en' | 'ar', string>>)
}

async function ensureTranslationMetadata(
  client: SanityClient,
  schemaType: string,
  refs: Array<{language: string; id: string}>,
  log: string[],
) {
  if (refs.length < 2) return
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
    await client.patch(existing._id).set({translations, schemaTypes: [schemaType]}).commit()
    log.push(`updated translation.metadata ${existing._id}`)
  } else {
    const created = await client.create({
      _type: 'translation.metadata',
      schemaTypes: [schemaType],
      translations,
    })
    log.push(`created translation.metadata ${created._id}`)
  }
}

async function main() {
  ensureDirs()
  const args = parseArgs(process.argv.slice(2))
  const payload = readJson<Transformed>(path.join(transformedDir, 'documents.json'))
  const log: string[] = []
  const summary = {
    mode: args.write ? 'write' : 'dry-run',
    withAssets: args.withAssets,
    createdOrUpdated: 0,
    skippedAssets: 0,
    errors: [] as string[],
  }

  console.log(`Migration import mode: ${summary.mode}${args.withAssets ? ' (with assets)' : ''}`)
  if (!args.write) {
    console.log('Tip: real write needs both flags via npm:')
    console.log('  npm run migrate:import -- --write')
    console.log('  npm run migrate:import -- --write --with-assets')
  }

  if (!args.write) {
    for (const category of payload.categories) {
      log.push(`create/update productCategory ${category.sourceKey}`)
      summary.createdOrUpdated += 1
    }
    for (const industry of payload.industries || []) {
      log.push(`create/update applicationArea ${industry.sourceKey}`)
      summary.createdOrUpdated += 1
    }
    for (const document of payload.documents || []) {
      log.push(`create/update downloadableDocument ${document.sourceKey}`)
      summary.createdOrUpdated += 1
      if (args.withAssets) log.push(`  upload PDF ${document.legacySourceUrl}`)
      else summary.skippedAssets += 1
    }
    for (const product of payload.products) {
      log.push(`create/update product ${product.sourceKey} → category ${product.categorySlug}`)
      summary.createdOrUpdated += 1
      if (args.withAssets && product.imageUrls?.length) {
        log.push(`  upload ${product.imageUrls.length} image(s)`)
      } else if (product.imageUrls?.length) {
        summary.skippedAssets += product.imageUrls.length
      }
      if (product.relatedSlugs?.length) {
        log.push(`  relate ${product.relatedSlugs.length} product(s)`)
      }
    }
    for (const post of [...payload.posts, ...payload.postStubs]) {
      log.push(`create/update post ${post.sourceKey}`)
      summary.createdOrUpdated += 1
    }
    for (const page of [...payload.pages, ...payload.pageStubs]) {
      log.push(`create/update page ${page.sourceKey}`)
      summary.createdOrUpdated += 1
    }
    log.push('patch siteSettings singleton')
    summary.createdOrUpdated += 1

    writeJson(path.join(reportsDir, 'import-dry-run.json'), {summary, log})
    console.log(`Dry-run complete. Would touch ~${summary.createdOrUpdated} documents.`)
    console.log('Report: migration/reports/import-dry-run.json')
    console.log('Pass --write to mutate Sanity (requires SANITY_API_WRITE_TOKEN).')
    return
  }

  const client = getWriteClient()
  const categoryIds = new Map<string, string>()
  const industryIds = new Map<string, string>()
  const documentIds = new Map<string, string>()
  const productIds = new Map<string, string>()
  let step = 0
  const industries = payload.industries || []
  const documents = payload.documents || []
  const total =
    payload.categories.length +
    industries.length +
    documents.length +
    payload.products.length +
    payload.posts.length +
    payload.postStubs.length +
    payload.pages.length +
    payload.pageStubs.length +
    payload.products.length + // related-products patch pass
    1
  const tick = (label: string) => {
    step += 1
    console.log(`[${step}/${total}] ${label}`)
  }

  for (const category of payload.categories) {
    tick(`category ${category.slug.current}`)
    const existing =
      (await findByLegacyId(client, 'productCategory', category.legacyId || '')) ||
      (await findBySlug(client, 'productCategory', category.slug.current))
    const id = await upsert(client, existing?._id, category, log)
    categoryIds.set(category.slug.current, id)
    summary.createdOrUpdated += 1
  }

  for (const industry of industries) {
    tick(`industry ${industry.slug.current}`)
    const existing = await findBySlug(client, 'applicationArea', industry.slug.current)
    const id = await upsert(client, existing?._id, industry, log)
    industryIds.set(industry.slug.current, id)
    summary.createdOrUpdated += 1
  }

  for (const document of documents) {
    tick(`document ${document.sourceKey}`)
    const existing = await findDocumentByLegacyUrl(client, document.legacySourceUrl)
    const doc: Record<string, unknown> = {
      _type: 'downloadableDocument',
      sourceKey: document.sourceKey,
      title: document.title,
      documentType: document.documentType,
      legacySourceUrl: document.legacySourceUrl,
      publishedAt: new Date().toISOString(),
    }

    if (args.withAssets) {
      try {
        doc.file = await uploadPdf(client, document.legacySourceUrl)
      } catch (error) {
        summary.errors.push(`pdf ${document.sourceKey}: ${(error as Error).message}`)
        if (!existing?._id) continue
      }
    } else if (!existing?._id) {
      summary.errors.push(
        `pdf ${document.sourceKey}: skipped (pass --with-assets to upload required file)`,
      )
      continue
    }

    const id = await upsert(client, existing?._id, doc, log)
    documentIds.set(document.sourceKey, id)
    summary.createdOrUpdated += 1
  }

  for (const product of payload.products) {
    tick(`product ${product.slug.current}`)
    const existing = await findByLegacyId(client, 'product', product.legacyId)
    const categoryId = categoryIds.get(product.categorySlug)
    const doc: Record<string, unknown> = {...product}
    if (categoryId) {
      doc.primaryCategory = {_type: 'reference', _ref: categoryId}
    }
    const appAreaRefs = (product.industrySlugs || [])
      .map((slug) => industryIds.get(slug))
      .filter(Boolean)
      .map((id) => ({_type: 'reference', _ref: id}))
    if (appAreaRefs.length) {
      doc.applicationAreas = appAreaRefs
    }

    const documentRefs = (product.documentKeys || [])
      .map((sourceKey) => {
        const id = documentIds.get(sourceKey)
        if (!id) return null
        const meta = documents.find((item) => item.sourceKey === sourceKey)
        return {
          _type: 'documentReference',
          document: {_type: 'reference', _ref: id},
          label: localizedLabelFromCopy(meta?.label),
        }
      })
      .filter(Boolean)
    if (documentRefs.length) {
      doc.documents = documentRefs
    }

    if (args.withAssets && product.imageUrls?.length) {
      try {
        const image = await uploadImage(client, product.imageUrls[0]!)
        const alt = Array.isArray(product.title) ? product.title : []
        doc.packshot = {...image, alt}
        doc.cardImage = {...image, alt}
      } catch (error) {
        summary.errors.push(`asset ${product.sourceKey}: ${(error as Error).message}`)
      }
    } else if (product.imageUrls?.length) {
      summary.skippedAssets += product.imageUrls.length
    }

    const id = await upsert(client, existing?._id, doc, log)
    productIds.set(product.slug.current, id)
    summary.createdOrUpdated += 1
  }

  // Second pass: related products + SDS document → product links
  for (const product of payload.products) {
    tick(`relate ${product.slug.current}`)
    const productId = productIds.get(product.slug.current)
    if (!productId) continue
    const related = (product.relatedSlugs || [])
      .map((slug) => productIds.get(slug))
      .filter(Boolean)
      .map((id) => ({_type: 'reference', _ref: id}))
    if (related.length) {
      await client.patch(productId).set({relatedProducts: related}).commit({autoGenerateArrayKeys: true})
      log.push(`relatedProducts ${productId} ← ${related.length}`)
    }
  }

  for (const document of documents) {
    if (!document.relatedProductSlug) continue
    const docId = documentIds.get(document.sourceKey)
    const productId = productIds.get(document.relatedProductSlug)
    if (!docId || !productId) continue
    await client
      .patch(docId)
      .set({relatedProducts: [{_type: 'reference', _ref: productId}]})
      .commit({autoGenerateArrayKeys: true})
    log.push(`document ${docId} ↔ product ${productId}`)
  }

  const postGroups = new Map<string, Array<{language: string; id: string}>>()

  for (const post of payload.posts) {
    const existing =
      (await findByLegacyId(client, 'post', post.legacyId || '')) ||
      (await findBySlug(client, 'post', post.slug.current, post.language))
    const id = await upsert(client, existing?._id, post, log)
    const groupKey = post.legacyId || post.slug.current
    const group = postGroups.get(groupKey) || []
    group.push({language: post.language, id})
    postGroups.set(groupKey, group)
    summary.createdOrUpdated += 1
  }

  for (const stub of payload.postStubs) {
    const existing = await findBySlug(client, 'post', stub.slug.current, stub.language)
    const id = await upsert(client, existing?._id, stub, log)
    const groupKey = stub.translationOfLegacyId || stub.slug.current
    const group = postGroups.get(groupKey) || []
    group.push({language: stub.language, id})
    postGroups.set(groupKey, group)
    summary.createdOrUpdated += 1
  }

  for (const [, refs] of postGroups) {
    await ensureTranslationMetadata(client, 'post', refs, log)
  }

  const pageGroups = new Map<string, Array<{language: string; id: string}>>()

  for (const page of payload.pages) {
    const existing = await findBySlug(client, 'page', page.slug.current, page.language)
    const id = await upsert(client, existing?._id, page, log)
    const group = pageGroups.get(page.slug.current) || []
    group.push({language: page.language, id})
    pageGroups.set(page.slug.current, group)
    summary.createdOrUpdated += 1
  }

  for (const stub of payload.pageStubs) {
    const existing = await findBySlug(client, 'page', stub.slug.current, stub.language)
    const id = await upsert(client, existing?._id, stub, log)
    const group = pageGroups.get(stub.slug.current) || []
    group.push({language: stub.language, id})
    pageGroups.set(stub.slug.current, group)
    summary.createdOrUpdated += 1
  }

  for (const [, refs] of pageGroups) {
    await ensureTranslationMetadata(client, 'page', refs, log)
  }

  const settingsExisting = await client.fetch<{_id: string} | null>(
    `*[_type == "siteSettings"][0]{_id}`,
  )
  if (settingsExisting?._id) {
    await client
      .patch(settingsExisting._id)
      .set({
        companyName: payload.siteSettings.companyName,
        contactChannels: payload.siteSettings.contactChannels,
      })
      .commit({autoGenerateArrayKeys: true})
    log.push(`updated siteSettings ${settingsExisting._id}`)
  } else {
    await client.createOrReplace({
      _id: 'siteSettings',
      _type: 'siteSettings',
      companyName: payload.siteSettings.companyName,
      contactChannels: payload.siteSettings.contactChannels,
    })
    log.push('created siteSettings siteSettings')
  }
  summary.createdOrUpdated += 1

  writeJson(path.join(reportsDir, 'import-write.json'), {summary, log})
  console.log(`Write complete. Touched ${summary.createdOrUpdated} documents.`)
  if (summary.errors.length) {
    console.warn('Errors:')
    for (const error of summary.errors) console.warn(`- ${error}`)
  }
  console.log('Report: migration/reports/import-write.json')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
