import {SectionHeading} from '@/components/content/section-heading'

type StatsSectionProps = {
  block: {
    _key: string
    heading?: string | null
    stats?: Array<{_key: string; value?: string | null; label?: string | null}> | null
  }
}

export function StatsSection({block}: StatsSectionProps) {
  return (
    <section className="border-b border-border section-space">
      <div className="container-site flex flex-col gap-10">
        <SectionHeading heading={block.heading} />
        {block.stats?.length ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {block.stats.map((stat) => (
              <li key={stat._key} className="border border-border bg-surface p-6 text-center">
                <p className="font-display text-4xl text-accent sm:text-5xl">{stat.value}</p>
                <p className="mt-2 text-sm text-muted">{stat.label}</p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}
