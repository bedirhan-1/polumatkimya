import type {Metadata} from 'next'
import Link from 'next/link'

import {defaultLocale} from '@/lib/i18n/locales'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://polumatkimya.com'),
}

export default function GlobalNotFound() {
  return (
    <html lang={defaultLocale}>
      <body>
        <main className="mx-auto flex min-h-[50vh] w-full max-w-xl flex-col items-start justify-center gap-4 px-6 py-16">
          <h1 className="text-3xl font-semibold tracking-tight">404</h1>
          <p className="text-zinc-600">Page not found.</p>
          <Link href={`/${defaultLocale}`} className="underline underline-offset-4">
            Back to home
          </Link>
        </main>
      </body>
    </html>
  )
}
