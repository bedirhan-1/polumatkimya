type SpecGroup = {
  _key: string
  title?: string | null
  items?: Array<{
    _key: string
    label?: string | null
    value?: string | null
    unit?: string | null
    note?: string | null
  }> | null
}

type ProductSpecificationsProps = {
  groups: SpecGroup[]
  heading?: string
  /** Compact embed inside the product summary column (old-site style). */
  embedded?: boolean
}

export function ProductSpecifications({
  groups,
  heading,
  embedded = false,
}: ProductSpecificationsProps) {
  if (!groups.length) return null

  const content = (
    <div className="flex min-w-0 flex-col gap-6">
      {groups.map((group) => {
        const items = (group.items || []).filter((item) => item.label || item.value)
        if (!items.length) return null

        // Old-site style: single horizontal technical table when item count is manageable.
        const useHorizontal = items.length <= 8
        const horizontalTableWidth =
          items.length > 4 ? 'min-w-[52rem]' : 'min-w-[32rem]'

        return (
          <div key={group._key} className="min-w-0 max-w-full">
            {group.title && !embedded ? (
              <h3 className="mb-3 font-display text-xl text-foreground">{group.title}</h3>
            ) : null}
            {embedded ? (
              <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-muted uppercase">
                {group.title || heading}
              </p>
            ) : null}

            {useHorizontal ? (
              <div className="w-full max-w-full overflow-x-auto overscroll-x-contain border border-border bg-surface [scrollbar-gutter:stable] [-webkit-overflow-scrolling:touch]">
                <table className={`w-full table-auto text-sm ${horizontalTableWidth}`}>
                  <thead>
                    <tr className="border-b border-border bg-surface-elevated">
                      {items.map((item) => (
                        <th
                          key={item._key}
                          scope="col"
                          className="border-s border-border px-4 py-2.5 text-start text-[0.7rem] leading-5 font-semibold tracking-[0.12em] text-muted uppercase whitespace-nowrap first:border-s-0"
                        >
                          {item.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {items.map((item) => (
                        <td
                          key={item._key}
                          className="border-s border-border px-3 py-3 text-foreground first:border-s-0"
                          dir="auto"
                        >
                          <span className="font-medium">
                            {[item.value, item.unit].filter(Boolean).join(' ')}
                          </span>
                          {item.note ? (
                            <span className="mt-1 block text-xs text-muted">{item.note}</span>
                          ) : null}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="w-full max-w-full overflow-x-auto overscroll-x-contain border border-border [scrollbar-gutter:stable] [-webkit-overflow-scrolling:touch]">
                <table className="min-w-full text-sm">
                  <tbody>
                    {items.map((item) => (
                      <tr key={item._key} className="border-b border-border last:border-b-0">
                        <th
                          scope="row"
                          className="bg-surface-elevated px-4 py-3 text-start font-medium text-foreground whitespace-nowrap"
                        >
                          {item.label}
                        </th>
                        <td className="px-4 py-3 text-muted" dir="auto">
                          {[item.value, item.unit].filter(Boolean).join(' ')}
                          {item.note ? (
                            <span className="mt-1 block text-xs text-muted">{item.note}</span>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )

  if (embedded) return content

  return (
    <section className="border-b border-border section-space">
      <div className="container-site flex flex-col gap-8">
        {heading ? (
          <h2 className="font-display text-3xl text-foreground sm:text-4xl">{heading}</h2>
        ) : null}
        {content}
      </div>
    </section>
  )
}
