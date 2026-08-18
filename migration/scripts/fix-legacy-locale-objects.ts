/**
 * Convert leftover `{tr,en,ar}` objects (missing `_type`) into
 * sanity-plugin-internationalized-array values.
 *
 *   npx tsx migration/scripts/fix-legacy-locale-objects.ts
 *   npx tsx migration/scripts/fix-legacy-locale-objects.ts --dataset=production
 */
import {createClient} from '@sanity/client'
import {existsSync, readFileSync} from 'node:fs'
import path from 'node:path'

import {normalizeLegacyI18n} from '../../studio/lib/normalize-legacy-i18n'

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

loadEnvFile(path.resolve(process.cwd(), '.env.local'))
loadEnvFile(path.resolve(process.cwd(), '.env'))

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const token = process.env.SANITY_API_WRITE_TOKEN
  const datasetArg = process.argv.find((argument) => argument.startsWith('--dataset='))
  const dataset =
    datasetArg?.slice('--dataset='.length) ||
    process.env.NEXT_PUBLIC_SANITY_DATASET ||
    'production'

  if (!projectId || !token) {
    throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN')
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-08-02',
    token,
    useCdn: false,
  })

  const docs = await client.fetch<Array<Record<string, unknown>>>(
    `*[_type in ["exportPage","contactPage","siteSettings"]]{_id,_rev,...}`,
  )

  let patched = 0
  for (const doc of docs) {
    const next = normalizeLegacyI18n(doc) as Record<string, unknown>
    if (JSON.stringify(next) === JSON.stringify(doc)) continue
    const {_id, _rev, ...fields} = next
    await client.patch(String(_id)).set(fields).commit({autoGenerateArrayKeys: false})
    patched += 1
    console.log(`Patched ${_id}`)
  }

  console.log(`Done. Patched ${patched} document(s) on ${dataset}.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
