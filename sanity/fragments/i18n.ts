/**
 * Shared GROQ helpers for internationalized-array v5.
 * Prefer `language`, keep `_key` fallback during transition.
 */
export const localeValue = (field: string) =>
  `${field}[language == $locale || _key == $locale][0].value`

export const imageWithAltProjection = /* groq */ `
  asset,
  hotspot,
  crop,
  alt
`

export const localizedImageProjection = /* groq */ `
  asset,
  hotspot,
  crop,
  "alt": ${localeValue('alt')}
`
