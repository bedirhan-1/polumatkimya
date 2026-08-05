import {PortableText, type PortableTextComponents} from 'next-sanity'

import {SanityImage} from '@/components/content/sanity-image'

const components: PortableTextComponents = {
  block: {
    h2: ({children}) => <h2 className="mt-8 text-2xl text-foreground sm:text-3xl">{children}</h2>,
    h3: ({children}) => <h3 className="mt-6 text-xl text-foreground sm:text-2xl">{children}</h3>,
    normal: ({children}) => <p className="mt-4 text-base text-muted leading-relaxed">{children}</p>,
    blockquote: ({children}) => (
      <blockquote className="mt-4 border-inline-start-2 border-accent ps-4 text-muted italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({children}) => <ul className="mt-4 list-disc space-y-2 ps-5 text-muted">{children}</ul>,
    number: ({children}) => <ol className="mt-4 list-decimal space-y-2 ps-5 text-muted">{children}</ol>,
  },
  marks: {
    strong: ({children}) => <strong className="font-semibold text-foreground">{children}</strong>,
    em: ({children}) => <em>{children}</em>,
    link: ({children, value}) => {
      const href = value?.href as string | undefined
      const openInNewTab = Boolean(value?.openInNewTab)
      if (!href) return <>{children}</>
      return (
        <a
          href={href}
          className="text-accent underline underline-offset-4"
          {...(openInNewTab ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
        >
          {children}
        </a>
      )
    },
  },
  types: {
    imageWithAlt: ({value}) => (
      <div className="my-6 overflow-hidden border border-border">
        <SanityImage image={value} className="h-auto w-full object-cover" sizes="100vw" />
      </div>
    ),
  },
}

type PortableTextRendererProps = {
  value?: unknown
  className?: string
}

export function PortableTextRenderer({value, className}: PortableTextRendererProps) {
  if (!value || !Array.isArray(value) || value.length === 0) return null
  return (
    <div className={className}>
      <PortableText value={value} components={components} />
    </div>
  )
}
