type DocumentItem = {
  _key: string
  label?: string | null
  document?: {
    _id: string
    title?: string | null
    documentType?: string | null
    version?: string | null
    file?: {
      asset?: {
        url?: string | null
        originalFilename?: string | null
      } | null
    } | null
  } | null
}

type DocumentDownloadsProps = {
  documents: DocumentItem[]
  heading: string
  downloadLabel: string
  embedded?: boolean
}

export function DocumentDownloads({
  documents,
  heading,
  downloadLabel,
  embedded = false,
}: DocumentDownloadsProps) {
  const items = documents.filter((item) => item.document?.file?.asset?.url)
  if (!items.length) return null

  const list = (
    <ul className={embedded ? 'flex flex-col gap-2' : 'grid gap-3 sm:grid-cols-2'}>
      {items.map((item) => {
        const doc = item.document!
        const url = doc.file!.asset!.url!
        const label = item.label || doc.title || downloadLabel
        return (
          <li key={item._key}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-12 items-center justify-between gap-3 border border-border bg-surface px-4 py-3 no-underline transition hover:border-accent"
            >
              <span>
                <span className="block text-sm font-medium text-foreground">{label}</span>
                <span className="text-[0.7rem] tracking-[0.14em] text-muted uppercase" dir="ltr">
                  {[doc.documentType, doc.version].filter(Boolean).join(' · ')}
                </span>
              </span>
              <span className="text-sm font-semibold text-accent transition group-hover:underline">
                {downloadLabel}
              </span>
            </a>
          </li>
        )
      })}
    </ul>
  )

  if (embedded) {
    return (
      <div>
        <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-muted uppercase">{heading}</p>
        {list}
      </div>
    )
  }

  return (
    <section className="border-b border-border section-space">
      <div className="container-site flex flex-col gap-6">
        <h2 className="font-display text-3xl text-foreground sm:text-4xl">{heading}</h2>
        {list}
      </div>
    </section>
  )
}
