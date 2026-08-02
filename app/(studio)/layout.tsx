import type {ReactNode} from 'react'

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
