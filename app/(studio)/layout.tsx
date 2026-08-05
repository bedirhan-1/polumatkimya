import type {Metadata} from 'next'
import type {ReactNode} from 'react'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://polumatkimya.com'),
}

type StudioLayoutProps = {
  children: ReactNode
}

export default function StudioLayout({children}: StudioLayoutProps) {
  return (
    <html lang="en">
      <body style={{margin: 0}}>{children}</body>
    </html>
  )
}
