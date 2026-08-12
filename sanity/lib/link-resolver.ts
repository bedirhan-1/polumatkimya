import type {Locale} from '@/lib/i18n/locales'

type LinkReference = {
  _type?: string
  slug?: string | null
  language?: string | null
}

type ResolvableLink = {
  linkType?: 'none' | 'internal' | 'external' | 'reference' | null
  internalPath?: string | null
  externalUrl?: string | null
  reference?: LinkReference | null
}

function ensureLeadingSlash(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

function stripLocalePrefix(path: string): string {
  return path.replace(/^\/(tr|en|ar)(?=\/|$)/, '') || '/'
}

export function resolveHref(locale: Locale, link?: ResolvableLink | null): string | null {
  if (!link?.linkType || link.linkType === 'none') return null

  if (link.linkType === 'external') {
    return link.externalUrl || null
  }

  if (link.linkType === 'internal') {
    if (!link.internalPath) return null
    const path = stripLocalePrefix(ensureLeadingSlash(link.internalPath))
    if (path === '/') return `/${locale}`
    return `/${locale}${path}`
  }

  if (link.linkType === 'reference') {
    const type = link.reference?._type
    const slug = link.reference?.slug
    if (!type || !slug) return null

    switch (type) {
      case 'product':
        return `/${locale}/products/${slug}`
      case 'productCategory':
        return `/${locale}/products/category/${slug}`
      case 'applicationArea':
        return `/${locale}/industries/${slug}`
      case 'post':
        return `/${locale}/blog/${slug}`
      case 'page':
        return `/${locale}/company/${slug}`
      default:
        return null
    }
  }

  return null
}

export function resolveSimpleCta(
  locale: Locale,
  cta?: {
    label?: string | null
    linkType?: 'internal' | 'external' | null
    internalPath?: string | null
    externalUrl?: string | null
    variant?: string | null
  } | null,
): {href: string; label: string; variant: 'primary' | 'secondary' | 'ghost'} | null {
  if (!cta?.label) return null
  const href = resolveHref(locale, {
    linkType: cta.linkType === 'external' ? 'external' : 'internal',
    internalPath: cta.internalPath,
    externalUrl: cta.externalUrl,
  })
  if (!href) return null
  const variant =
    cta.variant === 'secondary' || cta.variant === 'ghost' ? cta.variant : 'primary'
  return {href, label: cta.label, variant}
}
