type SectionHeadingProps = {
  eyebrow?: string | null
  heading?: string | null
  description?: string | null
  align?: 'start' | 'center'
  as?: 'h1' | 'h2'
}

export function SectionHeading({
  eyebrow,
  heading,
  description,
  align = 'start',
  as = 'h2',
}: SectionHeadingProps) {
  if (!heading && !eyebrow && !description) return null
  const HeadingTag = as
  const alignClass = align === 'center' ? 'text-center mx-auto items-center' : 'text-start items-start'

  return (
    <div className={`flex max-w-3xl flex-col gap-3 ${alignClass}`}>
      {eyebrow ? (
        <p className="text-xs font-semibold tracking-[0.28em] text-accent uppercase">{eyebrow}</p>
      ) : null}
      {heading ? (
        <HeadingTag className="text-[clamp(1.85rem,7vw,3.25rem)] text-foreground leading-[1.08]">
          {heading}
        </HeadingTag>
      ) : null}
      {description ? <p className="text-base text-muted sm:text-lg">{description}</p> : null}
    </div>
  )
}
