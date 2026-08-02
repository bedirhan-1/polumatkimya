export type Dictionary = {
  meta: {
    siteName: string
    defaultDescription: string
  }
  a11y: {
    skipToContent: string
    mainNavigation: string
    languageSwitcher: string
    openMenu: string
    closeMenu: string
  }
  common: {
    home: string
    notFoundTitle: string
    notFoundDescription: string
    backHome: string
  }
  nav: {
    products: string
    industries: string
    privateLabel: string
    about: string
    blog: string
    contact: string
    requestQuote: string
  }
  home: {
    eyebrow: string
    headline: string
    supporting: string
    panelLabel: string
    panelText: string
  }
  footer: {
    company: string
    resources: string
    legal: string
    rights: string
    videos: string
    quality: string
    privacy: string
    kvkk: string
    cookies: string
  }
  errors: {
    generic: string
    validationRequired: string
    validationEmail: string
  }
  filters: {
    openFilters: string
    clearFilters: string
    resultsCount: string
    noResults: string
  }
}

export const dictionaries = {
  tr: () => import('@/dictionaries/tr').then((module) => module.default),
  en: () => import('@/dictionaries/en').then((module) => module.default),
  ar: () => import('@/dictionaries/ar').then((module) => module.default),
} as const

export async function getDictionary(locale: keyof typeof dictionaries): Promise<Dictionary> {
  return dictionaries[locale]()
}
