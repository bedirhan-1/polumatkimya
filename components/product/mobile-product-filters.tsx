'use client'

import {useState} from 'react'

import {ProductFilters} from '@/components/product/product-filters'
import type {Dictionary} from '@/lib/i18n/get-dictionary'
import type {Locale} from '@/lib/i18n/locales'
import type {FilterOption} from '@/lib/products/types'

type MobileProductFiltersProps = {
  locale: Locale
  dictionary: Dictionary
  categories: FilterOption[]
  industries: FilterOption[]
  current: {
    category?: string
    industry?: string
    q?: string
  }
  basePath?: string
}

export function MobileProductFilters(props: MobileProductFiltersProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="inline-flex min-h-11 w-full items-center justify-center border border-border bg-surface px-4 text-sm font-semibold"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? props.dictionary.filters.closeFilters : props.dictionary.filters.openFilters}
      </button>
      {open ? (
        <div className="mt-4">
          <ProductFilters {...props} />
        </div>
      ) : null}
    </div>
  )
}
