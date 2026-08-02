import Link from 'next/link'

import type {Dictionary} from '@/lib/i18n/get-dictionary'
import type {Locale} from '@/lib/i18n/locales'
import {getDefaultFooterColumns} from '@/lib/navigation'

type SiteFooterProps = {
  locale: Locale
  dictionary: Dictionary
}

export function SiteFooter({locale, dictionary}: SiteFooterProps) {
  const columns = getDefaultFooterColumns(locale, dictionary)
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="container-site grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="font-display text-2xl font-bold tracking-[0.04em]">
            <span className="text-accent">POLUMAT</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-muted">{dictionary.meta.defaultDescription}</p>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <p className="font-display text-sm font-semibold tracking-wider text-foreground uppercase">
              {column.title}
            </p>
            <ul className="mt-4 space-y-2">
              {column.links.map((link) => (
                <li key={`${column.title}-${link.href}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted no-underline transition hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="container-site flex flex-col gap-2 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {dictionary.meta.siteName}. {dictionary.footer.rights}
          </p>
          <p dir="ltr">polumatkimya.com</p>
        </div>
      </div>
    </footer>
  )
}
