'use client'

import {useEffect, useId, useState} from 'react'

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
  const panelId = useId()
  const activeCount = [
    props.basePath === '/products' ? props.current.category : undefined,
    props.current.industry,
    props.current.q,
  ].filter(Boolean).length

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className={styles.mobileBar}
        aria-expanded={open}
        aria-controls={panelId}
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
        <>
          <button
            type="button"
            aria-label={props.dictionary.filters.closeFilters}
            className={styles.mobileBackdrop}
            onClick={() => setOpen(false)}
          />
          <div id={panelId} className={styles.mobileSheet} role="dialog" aria-modal="true">
            <div className={styles.mobileSheetHead}>
              <p className={styles.mobileSheetTitle}>{props.dictionary.filters.title}</p>
              <button
                type="button"
                className={styles.mobileSheetClose}
                onClick={() => setOpen(false)}
              >
                {props.dictionary.filters.closeFilters}
              </button>
            </div>
            <div className={styles.mobileSheetBody}>
              <ProductFilters {...props} />
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
