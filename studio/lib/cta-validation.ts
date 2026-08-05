type LocalizedStringItem = {
  language?: string
  value?: string
}

type LinkValue = {
  linkType?: string
  label?: LocalizedStringItem[]
  internalPath?: string
  externalUrl?: string
  reference?: {_ref?: string}
}

type CallToActionValue = {
  label?: LocalizedStringItem[]
  link?: LinkValue
  variant?: string
}

export function hasLocalizedStringValue(value: unknown): boolean {
  if (!Array.isArray(value)) return false
  return value.some(
    (item) =>
      item &&
      typeof item === 'object' &&
      typeof (item as LocalizedStringItem).value === 'string' &&
      (item as LocalizedStringItem).value!.trim().length > 0,
  )
}

export function isLinkConfigured(link: unknown): boolean {
  if (!link || typeof link !== 'object') return false
  const value = link as LinkValue
  return (
    Boolean(value.linkType) ||
    hasLocalizedStringValue(value.label) ||
    Boolean(value.internalPath?.trim()) ||
    Boolean(value.externalUrl) ||
    Boolean(value.reference?._ref)
  )
}

export function isCallToActionConfigured(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const cta = value as CallToActionValue
  return hasLocalizedStringValue(cta.label) || isLinkConfigured(cta.link)
}

export function validateLinkValue(link: unknown): string | true {
  if (!link || typeof link !== 'object') return true
  if (!isLinkConfigured(link)) return true

  const value = link as LinkValue
  if (!value.linkType) return 'Link type is required when link details are provided'
  if (!hasLocalizedStringValue(value.label)) return 'Label is required when link details are provided'

  if (value.linkType === 'internal' && !value.internalPath?.trim()) {
    return 'Internal path is required for internal links'
  }
  if (value.linkType === 'external' && !value.externalUrl) {
    return 'External URL is required for external links'
  }
  if (value.linkType === 'reference' && !value.reference?._ref) {
    return 'Document reference is required for reference links'
  }

  return true
}

export function validateCallToActionValue(value: unknown): string | true {
  if (!value || typeof value !== 'object') return true
  if (!isCallToActionConfigured(value)) return true

  const cta = value as CallToActionValue
  if (!hasLocalizedStringValue(cta.label)) {
    return 'Label is required when CTA details are provided'
  }

  return validateLinkValue(cta.link)
}
