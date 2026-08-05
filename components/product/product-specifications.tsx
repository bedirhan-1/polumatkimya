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
    <div className="flex flex-col gap-6">
      {groups.map((group) => {
        const items = (group.items || []).filter((item) => item.label || item.value)
        if (!items.length) return null

        // Old-site style: single horizontal technical table when item count is manageable.
        const useHorizontal = items.length <= 8

        return (
          <div key={group._key}>
            {group.title && !embedded ? (
              <h3 className="mb-3 font-display text-xl text-foreground">{group.title}</h3>
            ) : null}
            {embedded ? (
              <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-muted uppercase">
                {group.title || heading}
              </p>
            ) : null}

            {useHorizontal ? (
              <div className="overflow-x-auto border border-border bg-surface">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-surface-elevated">
                      {items.map((item) => (
                        <th
                          key={item._key}
                          scope="col"
                          className="px-3 py-2.5 text-start text-[0.7rem] font-semibold tracking-[0.12em] text-muted uppercase whitespace-nowrap"
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
                          dir="ltr"
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
              <div className="overflow-x-auto border border-border">
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
                        <td className="px-4 py-3 text-muted" dir="ltr">
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
