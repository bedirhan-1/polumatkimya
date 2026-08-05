/**
 * Upload legacy cover images from polumatkimya.com into Sanity.
 *
 * Usage:
 *   npx tsx migration/scripts/seed-media.ts
 *   npx tsx migration/scripts/seed-media.ts --dataset production
 */
import {createClient, type SanityClient} from '@sanity/client'
import {createHash, randomBytes} from 'node:crypto'
import {existsSync, readFileSync} from 'node:fs'
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

const BLOG_COVERS = [
  {
    legacyTrSlug: 'yeni-nesil-polumat-endustriyel-spreyler',
    slug: 'next-generation-polumat-industrial-sprays',
    url: 'https://polumatkimya.com/images/blogs/1747482869.webp',
  },
  {
    legacyTrSlug: 'neden-polumati-tercih-etmelisiniz',
    slug: 'why-choose-polumat',
    url: 'https://polumatkimya.com/images/blogs/1740327689.webp',
  },
  {
    legacyTrSlug: 'kuresel-ekonomiye-yeni-bir-soluk',
    slug: 'a-new-breath-for-global-economy',
    url: 'https://polumatkimya.com/images/blogs/1740328651.webp',
  },
  {
    legacyTrSlug: 'yapi-kimyasallari-sektorunde-yenilikci-cozumler',
    slug: 'innovative-solutions-in-construction-chemicals',
    url: 'https://polumatkimya.com/images/blogs/1740332960.webp',
  },
] as const

const ABOUT_HERO_URL = 'https://polumatkimya.com/images/pages/1740155208.webp'

type PageBuilderBlock = {
  _key: string
  _type: string
  [key: string]: unknown
}

function arrayKey() {
  return randomBytes(6).toString('hex')
}

async function uploadImage(client: SanityClient, url: string) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Asset download failed ${url}: ${response.status}`)
  const buffer = Buffer.from(await response.arrayBuffer())
  const filename =
    url.split('/').pop()?.split('?')[0] ||
    `asset-${createHash('sha1').update(url).digest('hex').slice(0, 10)}.webp`
  const asset = await client.assets.upload('image', buffer, {filename})
  return asset._id
}

function imageWithAlt(assetId: string, alt: string) {
  return {
    _type: 'image',
    asset: {_type: 'reference' as const, _ref: assetId},
    alt,
  }
}

async function patchPostCover(
  client: SanityClient,
  slug: string,
  imageUrl: string,
  legacyTrSlug: string,
) {
  const post = await client.fetch<{_id: string; title?: string} | null>(
    `*[_type == "post" && language == "tr" && slug.current == $slug][0]{ _id, title }`,
    {slug},
  )

  if (!post) {
    const byLegacy = await client.fetch<{_id: string; title?: string} | null>(
      `*[_type == "post" && language == "tr" && $legacyTrSlug in previousSlugs][0]{ _id, title }`,
      {legacyTrSlug},
    )
    if (!byLegacy) {
      return {slug, status: 'not_found' as const}
    }
    const assetId = await uploadImage(client, imageUrl)
    await client
      .patch(byLegacy._id)
      .set({coverImage: imageWithAlt(assetId, byLegacy.title || slug)})
      .commit()
    return {
      slug,
      status: 'patched' as const,
      postId: byLegacy._id,
      title: byLegacy.title,
      assetId,
      matchedBy: 'previousSlugs',
    }
  }

  const assetId = await uploadImage(client, imageUrl)
  await client
    .patch(post._id)
    .set({coverImage: imageWithAlt(assetId, post.title || slug)})
    .commit()

  return {
    slug,
    status: 'patched' as const,
    postId: post._id,
    title: post.title,
    assetId,
    matchedBy: 'slug',
  }
}

async function patchAboutPage(client: SanityClient, imageUrl: string) {
  const page = await client.fetch<{
    _id: string
    title?: string
    pageBuilder?: PageBuilderBlock[]
  } | null>(
    `*[_type == "page" && language == "tr" && slug.current == "about"][0]{ _id, title, pageBuilder }`,
  )

  if (!page) {
    return {status: 'not_found' as const}
  }

  const assetId = await uploadImage(client, imageUrl)
  const alt = page.title || 'Hakkımızda'
  const image = imageWithAlt(assetId, alt)

  const pageBuilder = [...(page.pageBuilder || [])]
  const heroIndex = pageBuilder.findIndex((block) => block._type === 'heroSection')
  const imageTextIndex = pageBuilder.findIndex((block) => block._type === 'imageTextSection')

  const patches: string[] = []

  if (heroIndex >= 0) {
    pageBuilder[heroIndex] = {...pageBuilder[heroIndex], media: image}
    patches.push(`heroSection[${heroIndex}].media`)
  }

  if (imageTextIndex >= 0) {
    pageBuilder[imageTextIndex] = {...pageBuilder[imageTextIndex], image}
    patches.push(`imageTextSection[${imageTextIndex}].image`)
  }

  if (heroIndex < 0 && imageTextIndex < 0) {
    pageBuilder.unshift({
      _key: arrayKey(),
      _type: 'heroSection',
      heading: page.title || 'Hakkımızda',
      media: image,
    })
    patches.push('prepended heroSection with media')
  }

  await client.patch(page._id).set({pageBuilder}).commit()

  return {
    status: 'patched' as const,
    pageId: page._id,
    title: page.title,
    assetId,
    patches,
  }
}

async function runForDataset(dataset: string) {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const token = process.env.SANITY_API_WRITE_TOKEN

  if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
  if (!token) throw new Error('Missing SANITY_API_WRITE_TOKEN')

  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2025-01-01',
    token,
    useCdn: false,
  })

  console.log(`\n=== Dataset: ${dataset} ===`)

  const postResults: Array<Record<string, unknown>> = []
  const errors: Array<{scope: string; error: string}> = []

  for (const entry of BLOG_COVERS) {
    try {
      const result = await patchPostCover(client, entry.slug, entry.url, entry.legacyTrSlug)
      postResults.push(result)
      console.log(`post ${entry.slug}: ${result.status}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      errors.push({scope: `post:${entry.slug}`, error: message})
      console.error(`post ${entry.slug}: ERROR ${message}`)
    }
  }

  let aboutResult: Record<string, unknown> = {status: 'skipped'}
  try {
    aboutResult = await patchAboutPage(client, ABOUT_HERO_URL)
    console.log(`about page: ${aboutResult.status}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    errors.push({scope: 'about', error: message})
    aboutResult = {status: 'error', error: message}
    console.error(`about page: ERROR ${message}`)
  }

  return {dataset, postResults, aboutResult, errors}
}

async function main() {
  const args = process.argv.slice(2)
  const explicitDataset = args.find((arg) => arg.startsWith('--dataset='))?.split('=')[1]
  const datasets = explicitDataset
    ? [explicitDataset]
    : [process.env.NEXT_PUBLIC_SANITY_DATASET || 'development', 'production']

  const allResults: Awaited<ReturnType<typeof runForDataset>>[] = []

  for (const dataset of datasets) {
    try {
      allResults.push(await runForDataset(dataset))
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error(`Dataset ${dataset} failed: ${message}`)
      allResults.push({
        dataset,
        postResults: [],
        aboutResult: {status: 'error', error: message},
        errors: [{scope: 'dataset', error: message}],
      })
    }
  }

  console.log('\n=== Summary ===')
  console.log(JSON.stringify(allResults, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
