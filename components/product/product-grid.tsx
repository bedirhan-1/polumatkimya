import {ProductCard} from '@/components/product/product-card'
import type {Locale} from '@/lib/i18n/locales'
import type {ProductCardData} from '@/lib/products/types'

type ProductGridProps = {
  locale: Locale
  products: ProductCardData[]
  detailLabel: string
  emptyLabel: string
}

export function ProductGrid({locale, products, detailLabel, emptyLabel}: ProductGridProps) {
  if (!products.length) {
    return <p className="border border-border bg-surface px-5 py-8 text-sm text-muted">{emptyLabel}</p>
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <li key={product._id}>
          <ProductCard locale={locale} product={product} detailLabel={detailLabel} />
        </li>
      ))}
    </ul>
  )
}
