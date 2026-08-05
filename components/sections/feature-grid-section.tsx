import {SectionHeading} from '@/components/content/section-heading'
import {SanityImage} from '@/components/content/sanity-image'

type FeatureGridSectionProps = {
  block: {
    _key: string
    heading?: string | null
    description?: string | null
    features?: Array<{
      _key: string
      title?: string | null
      description?: string | null
      icon?: {asset?: {_ref?: string}} | null
    }> | null
  }
}

export function FeatureGridSection({block}: FeatureGridSectionProps) {
  return (
    <section className="border-b border-border section-space">
      <div className="container-site flex flex-col gap-10">
        <SectionHeading heading={block.heading} description={block.description} />
        {block.features?.length ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {block.features.map((feature) => (
              <li key={feature._key} className="border border-border bg-surface p-6">
                {feature.icon?.asset ? (
                  <div className="relative mb-4 h-10 w-10">
                    <SanityImage image={feature.icon} fill className="object-contain" sizes="40px" />
                  </div>
                ) : (
                  <div className="mb-4 h-1 w-10 bg-accent" />
                )}
                {feature.title ? (
                  <h3 className="font-display text-xl text-foreground">{feature.title}</h3>
                ) : null}
                {feature.description ? (
                  <p className="mt-2 text-sm text-muted">{feature.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}
