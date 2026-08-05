import {SectionHeading} from '@/components/content/section-heading'
import {SanityImage} from '@/components/content/sanity-image'

type CertificateSectionProps = {
  block: {
    _key: string
    heading?: string | null
    description?: string | null
    certificates?: Array<{
      _id: string
      name?: string | null
      issuer?: string | null
      certificateNumber?: string | null
      logo?: {asset?: {_ref?: string}; alt?: string | null} | null
    }> | null
  }
}

export function CertificateSection({block}: CertificateSectionProps) {
  return (
    <section className="border-b border-border section-space">
      <div className="container-site flex flex-col gap-10">
        <SectionHeading heading={block.heading} description={block.description} />
        {block.certificates?.length ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {block.certificates.map((certificate) => (
              <li
                key={certificate._id}
                className="flex items-center gap-4 border border-border bg-surface p-5"
              >
                <div className="relative h-14 w-14 shrink-0 bg-surface-elevated">
                  <SanityImage
                    image={certificate.logo}
                    fill
                    className="object-contain p-2"
                    sizes="56px"
                  />
                </div>
                <div>
                  <p className="font-display text-lg text-foreground">{certificate.name}</p>
                  {certificate.issuer ? (
                    <p className="text-sm text-muted">{certificate.issuer}</p>
                  ) : null}
                  {certificate.certificateNumber ? (
                    <p className="mt-1 text-xs text-muted" dir="ltr">
                      {certificate.certificateNumber}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}
