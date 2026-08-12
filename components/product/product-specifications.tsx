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

function SpecValue({
  value,
  unit,
  note,
}: {
  value?: string | null
  unit?: string | null
  note?: string | null
}) {
  return (
    <>
      <span className="font-medium text-foreground">
        {[value, unit].filter(Boolean).join(' ')}
      </span>
      {note ? <span className="mt-1 block text-xs text-muted">{note}</span> : null}
    </>
  )
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

        // Horizontal table only on md+ when item count stays manageable.
        const useHorizontal = items.length <= 8

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

            {/* Mobile / tablet column: stacked key-value rows */}
            <div className={`w-full max-w-full overflow-hidden border border-border ${useHorizontal ? (embedded ? 'lg:hidden' : 'md:hidden') : ''}`}>
              <table className="min-w-full table-fixed text-sm">
                <tbody>
                  {items.map((item) => (
                    <tr key={item._key} className="border-b border-border last:border-b-0">
                      <th
                        scope="row"
                        className="w-[42%] bg-surface-elevated px-3 py-3 text-start text-[0.75rem] font-medium break-words text-foreground sm:px-4 sm:text-sm"
                      >
                        {item.label}
                      </th>
                      <td className="min-w-0 px-3 py-3 break-words text-muted sm:px-4" dir="auto">
                        <SpecValue value={item.value} unit={item.unit} note={item.note} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* md+/lg+: horizontal technical table */}
            {useHorizontal ? (
              <div className={`hidden w-full max-w-full overflow-x-auto overscroll-x-contain border border-border bg-surface [scrollbar-gutter:stable] [-webkit-overflow-scrolling:touch] ${embedded ? 'lg:block' : 'md:block'}`}>
                <table
                  className={`w-full table-auto text-sm ${
                    items.length > 4 ? 'min-w-[40rem] lg:min-w-[52rem]' : 'min-w-[28rem] lg:min-w-[32rem]'
                  }`}
                >
                  <thead>
                    <tr className="border-b border-border bg-surface-elevated">
                      {items.map((item) => (
                        <th
                          key={item._key}
                          scope="col"
                          className="border-s border-border px-3 py-2.5 text-start text-[0.7rem] leading-5 font-semibold tracking-[0.12em] text-muted uppercase whitespace-nowrap first:border-s-0 lg:px-4"
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
                          <SpecValue value={item.value} unit={item.unit} note={item.note} />
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : null}
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
