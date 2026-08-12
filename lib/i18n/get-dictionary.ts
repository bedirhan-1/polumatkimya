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
    corporate: string
    about: string
    missionVision: string
    quality: string
    environment: string
    ohs: string
    customerSatisfaction: string
    humanResources: string
    export: string
    blog: string
    contact: string
    requestQuote: string
    dealerLogin: string
    downloadCatalog: string
  }
  home: {
    eyebrow: string
    headline: string
    supporting: string
    panelLabel: string
    panelText: string
  }
  pages: {
    aboutDescription: string
    qualityDescription: string
    industriesTitle: string
    industriesDescription: string
    contactDescription: string
    quoteTitle: string
    quoteDescription: string
    privateLabelTitle: string
    privateLabelDescription: string
    emptyIndustry: string
    recommendedProducts: string
  }
  quotePage: {
    eyebrow: string
    formTitle: string
    formHint: string
    responseTime: string
    step1Title: string
    step1Body: string
    step2Title: string
    step2Body: string
    step3Title: string
    step3Body: string
    directContact: string
  }
  privateLabelPage: {
    eyebrow: string
    formTitle: string
    formHint: string
    responseTime: string
    step1Title: string
    step1Body: string
    step2Title: string
    step2Body: string
    step3Title: string
    step3Body: string
    directContact: string
  }
  exportPage: {
    eyebrow: string
    title: string
    intro: string
    countryLabel: string
    activityEyebrow: string
    activityTitle: string
    activityDescription: string
    initiative1Title: string
    initiative1Body: string
    initiative2Title: string
    initiative2Body: string
    initiative3Title: string
    initiative3Body: string
    contactEyebrow: string
    contactTitle: string
    contactDescription: string
    contact1Name: string
    contact2Name: string
    contactRole: string
    phoneLabel: string
    emailLabel: string
  }
  contactPage: {
    address: string
    factory: string
    istanbulOffice: string
    phone: string
    email: string
    channels: string
    writeUs: string
    writeUsDescription: string
    map: string
    mapIstanbul: string
    openInMaps: string
    enableMap: string
    social: string
  }
  forms: {
    name: string
    email: string
    phone: string
    company: string
    brandName: string
    message: string
    productInterest: string
    privateLabelInterestDefault: string
    submitContact: string
    submitQuote: string
    submitPrivateLabel: string
    consent: string
    success: string
    error: string
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
    social: string
  }
  errors: {
    generic: string
    validationRequired: string
    validationEmail: string
  }
  filters: {
    title: string
    openFilters: string
    closeFilters: string
    clearFilters: string
    apply: string
    all: string
    search: string
    searchPlaceholder: string
    category: string
    industry: string
    resultsCount: string
    noResults: string
    activeFilters: string
    activeCount: string
    refine: string
  }
  products: {
    title: string
    description: string
    detail: string
    breadcrumbs: string
    specifications: string
    documents: string
    download: string
    related: string
    benefits: string
    features: string
    packaging: string
    usageAreas: string
    applicationInstructions: string
    warnings: string
    industries: string
    categories: string
    sku: string
    watchVideo: string
    whatsapp: string
    empty: string
  }
  blog: {
    title: string
    description: string
    readMore: string
    empty: string
    emptyLatest: string
    relatedProducts: string
    byAuthor: string
    breadcrumbs: string
  }
  videos: {
    title: string
    description: string
    play: string
    empty: string
    breadcrumbs: string
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
