import Link from 'next/link'

import type {Dictionary} from '@/lib/i18n/get-dictionary'
import type {Locale} from '@/lib/i18n/locales'
import type {FilterOption} from '@/lib/products/types'

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
  const clearHref = withQuery(formAction, {})
  const hasFilters = Boolean(
    current.industry || current.q || (basePath === '/products' && current.category),
  )

  return (
    <aside className="border border-border bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-lg text-foreground">{dictionary.filters.title}</h2>
        {hasFilters ? (
          <Link href={clearHref} className="text-xs font-semibold text-accent no-underline">
            {dictionary.filters.clearFilters}
          </Link>
        ) : null}
      </div>

      <form method="get" action={formAction} className="mt-5 flex flex-col gap-5">
        <label className="flex flex-col gap-2 text-sm">
          <span>{dictionary.filters.search}</span>
          <input
            type="search"
            name="q"
            defaultValue={current.q || ''}
            placeholder={dictionary.filters.searchPlaceholder}
            className="min-h-11 border border-border bg-background px-3 py-2 text-foreground"
          />
        </label>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium text-foreground">{dictionary.filters.category}</legend>
          <div className="flex flex-col gap-1">
            <FilterLink
              href={withQuery(listPath, {industry: current.industry, q: current.q})}
              active={!current.category}
              label={dictionary.filters.all}
            />
            {categories.map((category) => {
              if (!category.slug || !category.title) return null
              return (
                <FilterLink
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

        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium text-foreground">{dictionary.filters.industry}</legend>
          <div className="flex flex-col gap-1">
            <FilterLink
              href={withQuery(formAction, {q: current.q})}
              active={!current.industry}
              label={dictionary.filters.all}
            />
            {industries.map((industry) => {
              if (!industry.slug || !industry.title) return null
              return (
                <FilterLink
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
          {current.industry ? <input type="hidden" name="industry" value={current.industry} /> : null}
          {basePath === '/products' && current.category ? (
            <input type="hidden" name="category" value={current.category} />
          ) : null}
        </fieldset>

        <button
          type="submit"
          className="inline-flex min-h-11 items-center justify-center border border-border bg-background px-4 text-sm font-semibold text-foreground"
        >
          {dictionary.filters.apply}
        </button>
      </form>
    </aside>
  )
}

function FilterLink({href, active, label}: {href: string; active: boolean; label: string}) {
  return (
    <Link
      href={href}
      className={`min-h-10 px-2 py-2 text-sm no-underline transition ${
        active ? 'bg-accent text-white' : 'text-muted hover:bg-surface-elevated hover:text-foreground'
      }`}
      aria-current={active ? 'true' : undefined}
    >
      {label}
    </Link>
  )
}
