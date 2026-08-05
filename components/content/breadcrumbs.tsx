import Link from 'next/link'

type Crumb = {
  href?: string
  label: string
}

type BreadcrumbsProps = {
  items: Crumb[]
  label: string
  className?: string
}

export function Breadcrumbs({items, label, className = ''}: BreadcrumbsProps) {
  return (
    <nav aria-label={label} className={className || 'mb-6'}>
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {item.href && !isLast ? (
                <Link href={item.href} className="no-underline transition hover:text-foreground">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'text-foreground' : undefined} aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
