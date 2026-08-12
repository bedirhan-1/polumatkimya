export type SocialPlatform = 'linkedin' | 'instagram' | 'youtube' | 'facebook' | 'x'

export type SocialLinkItem = {
  _key?: string
  platform?: SocialPlatform | string | null
  url?: string | null
}

type SocialLinksProps = {
  items?: SocialLinkItem[] | null
  label?: string
  /** Dark panel (footer) vs light surface (contact). */
  tone?: 'dark' | 'light'
  className?: string
}

const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  youtube: 'YouTube',
  facebook: 'Facebook',
  x: 'X',
}

function isPlatform(value: string): value is SocialPlatform {
  return value in PLATFORM_LABELS
}

export function SocialLinks({
  items,
  label,
  tone = 'light',
  className = '',
}: SocialLinksProps) {
  const links = (items || [])
    .map((item) => {
      const platform = item.platform?.trim().toLowerCase() || ''
      const url = item.url?.trim() || ''
      if (!url || !isPlatform(platform)) return null
      return {
        key: item._key || `${platform}-${url}`,
        platform,
        url,
        name: PLATFORM_LABELS[platform],
      }
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))

  if (!links.length) return null

  const buttonClass =
    tone === 'dark'
      ? 'inline-flex size-10 items-center justify-center border border-white/15 bg-white/5 text-foreground/85 no-underline transition hover:border-accent/60 hover:bg-accent hover:text-white'
      : 'inline-flex size-10 items-center justify-center border border-border bg-surface text-foreground no-underline transition hover:border-accent hover:text-accent'

  return (
    <div className={className}>
      {label ? (
        <p
          className={
            tone === 'dark'
              ? 'flex items-center gap-2.5 text-[0.6875rem] font-semibold tracking-[0.18em] text-muted uppercase before:h-px before:w-5 before:bg-accent/70'
              : 'text-xs font-semibold tracking-[0.18em] text-accent uppercase'
          }
        >
          {label}
        </p>
      ) : null}
      <ul className={`flex flex-wrap gap-2 ${label ? 'mt-3' : ''}`}>
        {links.map((link) => (
          <li key={link.key}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.name}
              title={link.name}
              className={buttonClass}
            >
              <SocialIcon platform={link.platform} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SocialIcon({platform}: {platform: SocialPlatform}) {
  const common = {
    viewBox: '0 0 24 24',
    width: 16,
    height: 16,
    fill: 'currentColor',
    'aria-hidden': true as const,
  }

  switch (platform) {
    case 'facebook':
      return (
        <svg {...common}>
          <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H8v3h3v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z" />
        </svg>
      )
    case 'instagram':
      return (
        <svg {...common}>
          <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm10 2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-5 3.5A3.5 3.5 0 1 1 8.5 12 3.5 3.5 0 0 1 12 8.5zm0 2A1.5 1.5 0 1 0 13.5 12 1.5 1.5 0 0 0 12 10.5zm4.75-3.25a.75.75 0 1 1-.75.75.75.75 0 0 1 .75-.75z" />
        </svg>
      )
    case 'linkedin':
      return (
        <svg {...common}>
          <path d="M6.5 9.5H3.7V20h2.8V9.5zM5.1 4A1.6 1.6 0 1 0 5.1 7.2 1.6 1.6 0 0 0 5.1 4zM20.3 20h-2.8v-5.6c0-1.5-.5-2.5-1.8-2.5a1.9 1.9 0 0 0-1.8 1.3 2.4 2.4 0 0 0-.1.9V20h-2.8s.1-8.8 0-9.7h2.8v1.6c.5-.9 1.6-2.1 3.8-2.1 2.7 0 4.7 1.8 4.7 5.5V20z" />
        </svg>
      )
    case 'youtube':
      return (
        <svg {...common}>
          <path d="M23 12.2s0-3.2-.4-4.7a2.9 2.9 0 0 0-2-2C18.9 5 12 5 12 5s-6.9 0-8.6.5a2.9 2.9 0 0 0-2 2C1 9 1 12.2 1 12.2s0 3.2.4 4.7a2.9 2.9 0 0 0 2 2C5.1 19.4 12 19.4 12 19.4s6.9 0 8.6-.5a2.9 2.9 0 0 0 2-2c.4-1.5.4-4.7.4-4.7zM9.8 15.5v-6.6l5.8 3.3-5.8 3.3z" />
        </svg>
      )
    case 'x':
      return (
        <svg {...common}>
          <path d="M18.9 3H22l-6.8 7.8L23 21h-6.2l-4.9-6.4L6.4 21H3.3l7.3-8.3L1.8 3h6.3l4.4 5.8L18.9 3zm-1.1 16.2h1.7L6.9 4.7H5.1l12.7 14.5z" />
        </svg>
      )
  }
}
