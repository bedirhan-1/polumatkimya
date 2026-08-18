const LOCALES = ['tr', 'en', 'ar'] as const

const TEXT_FIELD_NAMES = new Set([
  'intro',
  'activityDescription',
  'contactDescription',
  'description',
  'shortDescription',
])

type LocaleMap = Partial<Record<(typeof LOCALES)[number], string>>

export function isLegacyLocaleObject(value: unknown): value is LocaleMap {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const record = value as Record<string, unknown>
  if ('_type' in record || '_key' in record || 'language' in record || 'value' in record) {
    return false
  }
  const keys = Object.keys(record)
  if (!keys.length) return false
  return keys.every(
    (key) =>
      LOCALES.includes(key as (typeof LOCALES)[number]) && typeof record[key] === 'string',
  )
}

function toLocalizedArray(value: LocaleMap, fieldName?: string) {
  const itemType = fieldName && TEXT_FIELD_NAMES.has(fieldName)
    ? 'internationalizedArrayTextValue'
    : 'internationalizedArrayStringValue'

  return LOCALES.flatMap((language) => {
    const text = value[language]?.trim()
    if (!text) return []
    return [
      {
        _key: language,
        _type: itemType,
        language,
        value: text,
      },
    ]
  })
}

export function normalizeLegacyI18n(value: unknown, fieldName?: string): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeLegacyI18n(item))
  }
  if (!value || typeof value !== 'object') return value
  if (isLegacyLocaleObject(value)) {
    return toLocalizedArray(value, fieldName)
  }

  const record = value as Record<string, unknown>
  let changed = false
  const next: Record<string, unknown> = {}
  for (const [key, child] of Object.entries(record)) {
    const normalized = normalizeLegacyI18n(child, key)
    next[key] = normalized
    if (normalized !== child) changed = true
  }
  return changed ? next : value
}
