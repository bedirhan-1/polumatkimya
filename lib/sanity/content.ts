export type PageBuilderBlock = {
  _key: string
  _type: string
  [key: string]: unknown
}

export function asPageBuilderBlocks(value: unknown): PageBuilderBlock[] | null {
  if (!Array.isArray(value) || value.length === 0) return null
  return value as PageBuilderBlock[]
}

export function asSeo(value: unknown): {
  title?: string | null
  description?: string | null
  noIndex?: boolean | null
} | null {
  if (!value || typeof value !== 'object') return null
  return value as {
    title?: string | null
    description?: string | null
    noIndex?: boolean | null
  }
}

export function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' && value.length > 0 ? value : fallback
}
