'use client'

import {useState} from 'react'

import {ProductFilters} from '@/components/product/product-filters'
import type {Dictionary} from '@/lib/i18n/get-dictionary'
import type {Locale} from '@/lib/i18n/locales'
import type {FilterOption} from '@/lib/products/types'

import styles from './product-filters.module.css'

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
  const activeCount = [
    props.basePath === '/products' ? props.current.category : undefined,
    props.current.industry,
    props.current.q,
  ].filter(Boolean).length

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className={styles.mobileBar}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span>
          {open ? props.dictionary.filters.closeFilters : props.dictionary.filters.openFilters}
        </span>
        <span className={styles.mobileMeta}>
          {activeCount > 0 ? (
            <>
              <span className={styles.badge}>{activeCount}</span>
              <span>{props.dictionary.filters.activeCount.replace('{count}', String(activeCount))}</span>
            </>
          ) : (
            <span>{props.dictionary.filters.refine}</span>
          )}
        </span>
      </button>
      {open ? (
        <div className={styles.mobilePanel}>
          <ProductFilters {...props} />
        </div>
      ) : null}
    </div>
  )
}
