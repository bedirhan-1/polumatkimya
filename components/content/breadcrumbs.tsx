import Link from 'next/link'

import styles from './breadcrumbs.module.css'

type Crumb = {
  href?: string
  label: string
}

type BreadcrumbsProps = {
  items: Crumb[]
  label: string
  className?: string
}

export function Breadcrumbs({items, label, className = 'mb-6'}: BreadcrumbsProps) {
  return (
    <nav aria-label={label} className={className}>
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className={styles.item}>
              {index > 0 ? (
                <span className={styles.sep} aria-hidden="true">
                  <svg viewBox="0 0 8 14" width="6" height="10" fill="none">
                    <path
                      d="M1.5 1.5 6 7l-4.5 5.5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              ) : null}
              {item.href && !isLast ? (
                <Link href={item.href} className={styles.link}>
                  {item.label}
                </Link>
              ) : (
                <span
                  className={isLast ? styles.current : styles.link}
                  aria-current={isLast ? 'page' : undefined}
                >
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
