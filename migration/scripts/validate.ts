/**
 * Validates snapshot counts, transform output, and legacy redirect coverage.
 *
 * Usage: npm run migrate:validate
 */
import path from 'node:path'

import {
  getLegacyRedirects,
  legacyBlogSlugMap,
  legacyProductSlugMap,
} from '../../lib/redirects/legacy'
import {ensureDirs, extractedDir, readJson, reportsDir, transformedDir, writeJson} from './lib'

type Snapshot = {
  products: unknown[]
  posts: unknown[]
  categories: unknown[]
  pages: unknown[]
}

type Transformed = {
  counts: Record<string, number>
  issues?: string[]
}

function assert(condition: unknown, message: string, failures: string[]) {
  if (!condition) failures.push(message)
}

function main() {
  ensureDirs()
  const failures: string[] = []
  const snapshot = readJson<Snapshot>(path.join(extractedDir, 'live-snapshot.json'))
  const transformed = readJson<Transformed>(path.join(transformedDir, 'documents.json'))
  const redirects = getLegacyRedirects()

  assert(snapshot.products.length === 19, `Expected 19 products, got ${snapshot.products.length}`, failures)
  assert(snapshot.categories.length === 2, `Expected 2 categories, got ${snapshot.categories.length}`, failures)
  assert(snapshot.posts.length === 4, `Expected 4 posts, got ${snapshot.posts.length}`, failures)
  assert(snapshot.pages.length >= 8, `Expected >=8 pages, got ${snapshot.pages.length}`, failures)

  assert(transformed.counts.products === 19, 'Transform product count mismatch', failures)
  assert(transformed.counts.categories === 2, 'Transform category count mismatch', failures)
  assert((transformed.counts.industries || 0) === 3, 'Expected 3 application areas', failures)
  assert(transformed.counts.posts === 4, 'Transform post count mismatch', failures)
  assert(transformed.counts.postStubs === 8, 'Expected 8 EN/AR post stubs', failures)

  const sampleProduct = (
    readJson<{products: Array<{title?: Array<{language?: string}>}>}>(
      path.join(transformedDir, 'documents.json'),
    ).products[0]
  )
  const langs = new Set((sampleProduct?.title || []).map((item) => item.language).filter(Boolean))
  assert(langs.has('tr') && langs.has('en') && langs.has('ar'), 'Product titles must include tr/en/ar', failures)

  for (const oldSlug of Object.keys(legacyProductSlugMap)) {
    const detay = `/urunler/detay/${oldSlug}`
    const plain = `/urunler/${oldSlug}`
    assert(
      redirects.some((entry) => entry.source === detay),
      `Missing redirect for ${detay}`,
      failures,
    )
    assert(
      redirects.some((entry) => entry.source === plain),
      `Missing redirect for ${plain}`,
      failures,
    )
  }

  for (const oldSlug of Object.keys(legacyBlogSlugMap)) {
    const source = `/blog/${oldSlug}`
    assert(
      redirects.some((entry) => entry.source === source),
      `Missing blog redirect for ${source}`,
      failures,
    )
  }

  assert(
    redirects.every((entry) => entry.destination.startsWith('/tr/')),
    'All legacy redirects must target /tr/…',
    failures,
  )
  assert(
    redirects.every((entry) => entry.permanent === true),
    'Legacy redirects must be permanent (301)',
    failures,
  )

  const sources = redirects.map((entry) => entry.source)
  const duplicateSources = sources.filter((source, index) => sources.indexOf(source) !== index)
  assert(duplicateSources.length === 0, `Duplicate redirect sources: ${duplicateSources.join(', ')}`, failures)

  const report = {
    validatedAt: new Date().toISOString(),
    redirectCount: redirects.length,
    snapshotCounts: {
      products: snapshot.products.length,
      categories: snapshot.categories.length,
      posts: snapshot.posts.length,
      pages: snapshot.pages.length,
    },
    transformCounts: transformed.counts,
    failures,
    ok: failures.length === 0,
  }

  writeJson(path.join(reportsDir, 'validate.json'), report)

  if (failures.length) {
    console.error('Validation failed:')
    for (const failure of failures) console.error(`- ${failure}`)
    process.exit(1)
  }

  console.log(`Validation OK. Redirects=${redirects.length}`)
  console.log('Report: migration/reports/validate.json')
}

main()
