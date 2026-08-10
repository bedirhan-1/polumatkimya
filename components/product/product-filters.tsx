import Link from 'next/link'

import type {Dictionary} from '@/lib/i18n/get-dictionary'
import type {Locale} from '@/lib/i18n/locales'
import type {FilterOption} from '@/lib/products/types'

import styles from './product-filters.module.css'

type ProductFiltersProps = {
  locale: Locale
  dictionary: Dictionary
  categories: FilterOption[]
  industries: FilterOption[]
  current: {
    category?: string
    industry?: string
    q?: string
  }
  /** When set, filters stay on this path (category pages). Category chips still navigate to category routes. */
  basePath?: string
}

function withQuery(path: string, next: {industry?: string; q?: string}) {
  const params = new URLSearchParams()
  if (next.industry) params.set('industry', next.industry)
  if (next.q) params.set('q', next.q)
  const query = params.toString()
  return query ? `${path}?${query}` : path
}

export function ProductFilters({
  locale,
  dictionary,
  categories,
  industries,
  current,
  basePath = '/products',
}: ProductFiltersProps) {
  const listPath = `/${locale}/products`
  const formAction = `/${locale}${basePath}`
  // Always reset category + industry (+ search) back to the unfiltered catalog.
  const clearHref = listPath
  const activeCategory = categories.find((item) => item.slug === current.category)
  const activeIndustry = industries.find((item) => item.slug === current.industry)
  const hasFilters = Boolean(current.industry || current.q || current.category)

  return (
    <aside className={styles.panel}>
      <div className={styles.head}>
        <h2 className={styles.title}>{dictionary.filters.title}</h2>
        {hasFilters ? (
          <Link href={clearHref} className={styles.clear}>
            {dictionary.filters.clearFilters}
          </Link>
        ) : null}
      </div>

      {hasFilters ? (
        <div className={styles.activeRow} aria-label={dictionary.filters.activeFilters}>
          {activeCategory?.title && basePath === '/products' ? (
            <Link
              href={withQuery(listPath, {industry: current.industry, q: current.q})}
              className={styles.chip}
            >
              <span>{activeCategory.title}</span>
              <span className={styles.chipX} aria-hidden>
                ×
              </span>
            </Link>
          ) : null}
          {activeIndustry?.title ? (
            <Link href={withQuery(formAction, {q: current.q})} className={styles.chip}>
              <span>{activeIndustry.title}</span>
              <span className={styles.chipX} aria-hidden>
                ×
              </span>
            </Link>
          ) : null}
          {current.q ? (
            <Link
              href={withQuery(formAction, {industry: current.industry})}
              className={styles.chip}
            >
              <span>“{current.q}”</span>
              <span className={styles.chipX} aria-hidden>
                ×
              </span>
            </Link>
          ) : null}
        </div>
      ) : null}

      <form method="get" action={formAction} className={styles.form}>
        <label className={styles.searchLabel}>
          <span>{dictionary.filters.search}</span>
          <span className={styles.searchBox}>
            <input
              type="search"
              name="q"
              defaultValue={current.q || ''}
              placeholder={dictionary.filters.searchPlaceholder}
              className={styles.searchInput}
            />
            <button
              type="submit"
              className={styles.searchSubmit}
              aria-label={dictionary.filters.apply}
            >
              <SearchIcon />
            </button>
          </span>
        </label>

        {current.industry ? <input type="hidden" name="industry" value={current.industry} /> : null}

        <fieldset className={styles.group}>
          <legend className={styles.legend}>{dictionary.filters.category}</legend>
          <div className={styles.options}>
            <FilterOptionLink
              href={withQuery(listPath, {industry: current.industry, q: current.q})}
              active={!current.category}
              label={dictionary.filters.all}
            />
            {categories.map((category) => {
              if (!category.slug || !category.title) return null
              return (
                <FilterOptionLink
                  key={category._id}
                  href={withQuery(`/${locale}/products/category/${category.slug}`, {
                    industry: current.industry,
                    q: current.q,
                  })}
                  active={current.category === category.slug}
                  label={category.title}
                />
              )
            })}
          </div>
        </fieldset>

        <fieldset className={styles.group}>
          <legend className={styles.legend}>{dictionary.filters.industry}</legend>
          <div className={styles.options}>
            <FilterOptionLink
              href={withQuery(formAction, {q: current.q})}
              active={!current.industry}
              label={dictionary.filters.all}
            />
            {industries.map((industry) => {
              if (!industry.slug || !industry.title) return null
              return (
                <FilterOptionLink
                  key={industry._id}
                  href={withQuery(formAction, {
                    industry: industry.slug,
                    q: current.q,
                  })}
                  active={current.industry === industry.slug}
                  label={industry.title}
                />
              )
            })}
          </div>
        </fieldset>
      </form>
    </aside>
  )
}

function FilterOptionLink({
  href,
  active,
  label,
}: {
  href: string
  active: boolean
  label: string
}) {
  return (
    <Link
      href={href}
      className={`${styles.option}${active ? ` ${styles.optionActive}` : ''}`}
      aria-current={active ? 'true' : undefined}
    >
      <span>{label}</span>
      <span className={styles.optionMark} aria-hidden />
    </Link>
  )
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M7.25 12.5a5.25 5.25 0 1 1 0-10.5 5.25 5.25 0 0 1 0 10.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M11.1 11.1 14 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
