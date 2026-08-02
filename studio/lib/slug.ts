import type {SlugRule} from 'sanity'

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
