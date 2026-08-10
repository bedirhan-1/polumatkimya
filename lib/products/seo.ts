import type {Locale} from '@/lib/i18n/locales'
import type {ProductDetailData} from '@/lib/products/types'
import {cdnUrlFor} from '@/sanity/lib/image'

export function buildWhatsAppHref(
  phone?: string | null,
  message?: string | null,
): string | null {
  if (!phone) return null
  const digits = phone.replace(/\D/g, '')
  if (!digits) return null
  const text = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${digits}${text}`
}

export function buildProductJsonLd({
  locale,
  product,
  path,
  siteName,
  productsLabel,
}: {
  locale: Locale
  product: ProductDetailData
  path: string
  siteName: string
  productsLabel: string
}) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://polumatkimya.com').replace(/\/$/, '')
  const url = `${siteUrl}/${locale}${path}`
  const imageSource = product.packshot?.asset ? product.packshot : product.cardImage
  const imageUrl = imageSource?.asset
    ? cdnUrlFor(imageSource, {width: 1200, height: 1200, fit: 'crop'})
    : undefined

  const breadcrumbItems: Array<{
    '@type': 'ListItem'
    position: number
    name: string
    item: string
  }> = [
    {
      '@type': 'ListItem',
      position: 1,
      name: siteName,
      item: `${siteUrl}/${locale}`,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: productsLabel,
      item: `${siteUrl}/${locale}/products`,
    },
  ]

  if (product.primaryCategory?.slug && product.primaryCategory.title) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 3,
      name: product.primaryCategory.title,
      item: `${siteUrl}/${locale}/products/category/${product.primaryCategory.slug}`,
    })
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 4,
      name: product.title || product.slug || '',
      item: url,
    })
  } else {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 3,
      name: product.title || product.slug || '',
      item: url,
    })
  }

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.title,
      description: product.shortDescription || undefined,
      sku: product.sku || undefined,
      inLanguage: locale,
      url,
      brand: {
        '@type': 'Brand',
        name: siteName,
      },
      ...(imageUrl ? {image: imageUrl} : {}),
      category: product.primaryCategory?.title || undefined,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      inLanguage: locale,
      itemListElement: breadcrumbItems,
    },
  ]
}

export function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0]
  return value || undefined
}

export function formatResultsCount(template: string, count: number): string {
  return template.replace('{count}', String(count))
}
