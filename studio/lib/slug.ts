import type {SlugRule} from 'sanity'

import {apiVersion} from '../env'

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function slugValidation(rule: SlugRule) {
  return rule.required().custom((value) => {
    const current = value?.current
    if (!current) return 'Slug is required'
    if (!SLUG_PATTERN.test(current)) {
      return 'Slug must be lowercase ASCII letters, numbers, and hyphens only'
    }
    return true
  })
}

type SlugUniqueContext = {
  document?: {_id?: string; _type?: string; language?: string}
  getClient: (options: {apiVersion: string}) => {
    fetch: <T>(query: string, params?: Record<string, unknown>) => Promise<T>
  }
}

/**
 * Shared-slug documents (product, category, industry): unique across the type.
 */
export async function isUniqueSlug(slug: string, context: SoftUniqueContext) {
  const {document, getClient} = context
  if (!document?._type || !slug) return true

  const client = getClient({apiVersion})
  const id = (document._id || '').replace(/^drafts\./, '')
  const count = await client.fetch<number>(
    `count(*[
      _type == $type &&
      slug.current == $slug &&
      !(_id in [$draft, $published])
    ])`,
    {
      draft: `drafts.${id}`,
      published: id,
      type: document._type,
      slug,
    },
  )

  return count === 0
}

type SoftUniqueContext = SlugUniqueContext

/**
 * Document-level i18n (page, post): same English slug shared across languages.
 * Uniqueness is scoped to type + language + slug.
 */
export async function isUniqueSlugPerLanguage(slug: string, context: SoftUniqueContext) {
  const {document, getClient} = context
  if (!document?._type || !slug) return true

  const language = document.language
  if (!language) {
    return isUniqueSlug(slug, context)
  }

  const client = getClient({apiVersion})
  const id = (document._id || '').replace(/^drafts\./, '')
  const count = await client.fetch<number>(
    `count(*[
      _type == $type &&
      language == $language &&
      slug.current == $slug &&
      !(_id in [$draft, $published])
    ])`,
    {
      draft: `drafts.${id}`,
      published: id,
      type: document._type,
      slug,
      language,
    },
  )

  return count === 0
}
