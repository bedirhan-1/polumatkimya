export const SUPPORTED_LANGUAGES = [
  {id: 'tr', title: 'Türkçe'},
  {id: 'en', title: 'English'},
  {id: 'ar', title: 'العربية'},
] as const

export const DEFAULT_LANGUAGE = 'tr'

export const LANGUAGE_IDS = SUPPORTED_LANGUAGES.map((language) => language.id)

export type StudioLanguageId = (typeof SUPPORTED_LANGUAGES)[number]['id']
