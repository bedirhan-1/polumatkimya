import {mkdirSync, readFileSync, writeFileSync} from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {randomBytes} from 'node:crypto'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const migrationRoot = path.resolve(__dirname, '..')
export const extractedDir = path.join(migrationRoot, 'extracted')
export const transformedDir = path.join(migrationRoot, 'transformed')
export const reportsDir = path.join(migrationRoot, 'reports')

export function ensureDirs() {
  for (const dir of [extractedDir, transformedDir, reportsDir]) {
    mkdirSync(dir, {recursive: true})
  }
}

export function readJson<T>(filePath: string): T {
  return JSON.parse(readFileSync(filePath, 'utf8')) as T
}

export function writeJson(filePath: string, data: unknown) {
  mkdirSync(path.dirname(filePath), {recursive: true})
  writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

function arrayKey() {
  return randomBytes(6).toString('hex')
}

/** sanity-plugin-internationalized-array v5 shape */
export function localizedString(values: Partial<Record<'tr' | 'en' | 'ar', string | undefined>>) {
  return Object.entries(values)
    .filter(([, value]) => Boolean(value?.trim()))
    .map(([language, value]) => ({
      _key: arrayKey(),
      _type: 'internationalizedArrayStringValue',
      language,
      value: value!.trim(),
    }))
}

export function localizedText(values: Partial<Record<'tr' | 'en' | 'ar', string | undefined>>) {
  return Object.entries(values)
    .filter(([, value]) => Boolean(value?.trim()))
    .map(([language, value]) => ({
      _key: arrayKey(),
      _type: 'internationalizedArrayTextValue',
      language,
      value: value!.trim(),
    }))
}

export function textToPortableText(text?: string) {
  if (!text?.trim()) return undefined
  return text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => ({
      _type: 'block',
      _key: `p${index + 1}_${arrayKey()}`,
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: `s${index + 1}_${arrayKey()}`,
          text: paragraph,
          marks: [],
        },
      ],
    }))
}

export function localizedPortableText(
  values: Partial<Record<'tr' | 'en' | 'ar', string | undefined>>,
) {
  return Object.entries(values)
    .map(([language, value]) => {
      const blocks = textToPortableText(value)
      if (!blocks) return null
      return {
        _key: arrayKey(),
        _type: 'internationalizedArrayPortableTextValue',
        language,
        value: blocks,
      }
    })
    .filter(Boolean)
}

export function humanizeSlug(slug: string) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function parseArgs(argv: string[]) {
  const flags = new Set(argv.filter((arg) => arg.startsWith('--')))
  return {
    dryRun: flags.has('--dry-run') || !flags.has('--write'),
    write: flags.has('--write'),
    withAssets: flags.has('--with-assets'),
    stubs: flags.has('--stubs') || flags.has('--write'),
  }
}

const ENTITY_MAP: Record<string, string> = {
  '&nbsp;': ' ',
  '&amp;': '&',
  '&quot;': '"',
  '&#39;': "'",
  '&lt;': '<',
  '&gt;': '>',
  '&uuml;': 'ü',
  '&Uuml;': 'Ü',
  '&ouml;': 'ö',
  '&Ouml;': 'Ö',
  '&ccedil;': 'ç',
  '&Ccedil;': 'Ç',
  '&gbreve;': 'ğ',
  '&Gbreve;': 'Ğ',
  '&scedil;': 'ş',
  '&Scedil;': 'Ş',
  '&bull;': '•',
  '&mdash;': '—',
  '&ndash;': '–',
  '&deg;': '°',
  '&sup3;': '³',
  '&sup2;': '²',
}

/** Fold Turkish letters to ASCII for robust substring matching. */
export function foldTr(input: string) {
  return input
    .replace(/İ/g, 'i')
    .replace(/I/g, 'i')
    .replace(/ı/g, 'i')
    .toLocaleLowerCase('tr-TR')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
}

export function decodeEntities(input: string) {
  return input
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&[a-zA-Z]+;/g, (entity) => ENTITY_MAP[entity] || entity)
}

export function isJunkText(text: string) {
  const value = text.trim()
  if (value.length < 40) return true
  if (/^\.[\w-]+\s*\{/.test(value)) return true
  if (/position:\s*relative|z-index:\s*\d|background-color:\s*rgba/i.test(value) && value.includes('{')) {
    return true
  }
  if (/polumat olarak, geniş ürün yelpazemizle/i.test(value)) return true
  if (/tüm hakları saklıdır/i.test(value)) return true
  if (/kişisel verilerin/i.test(value)) return true
  if (/güvenlik bilgin?i? formu/i.test(value) && value.length < 80) return true
  if (/online katalog/i.test(value)) return true
  if (/fabrika@polumatkimya\.com/i.test(value)) return true
  if (/^\+90\s*\d/.test(value)) return true
  if (/polumat kimya\s*\|/i.test(value)) return true
  if (/^(misyon|vizyon|iş sağlığı|insan kaynakları|müşteri memnuniyeti|çevreye|iade ve)/i.test(value)) {
    return true
  }
  if (/^ürünler\b/i.test(value) && value.length < 80) return true
  return false
}

export function cleanExtractedText(raw: string) {
  return decodeEntities(raw)
    .replace(/Ana Sayfa\s+/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
}
