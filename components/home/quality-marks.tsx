/** Red line-art icons for the homepage quality strip. */
export function QualityFeatureIcon({
  name,
  className,
}: {
  name: 'handshake' | 'production' | 'clipboard' | 'gauge' | 'service'
  className?: string
}) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.45,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className={className} {...common}>
      {name === 'handshake' ? (
        <>
          <path d="M8 22c3-4 7-6 12-4l4 3 4-3c5-2 9 0 12 4" />
          <path d="M14 26c2.5 3 5.5 5 10 5s7.5-2 10-5" />
          <path d="M20 29v6M24 30v7M28 29v6" />
          <path d="M6 20h6M36 20h6" />
        </>
      ) : null}
      {name === 'production' ? (
        <>
          <path d="M8 38V18l8-5v6l8-5v6l8-5v23H8Z" />
          <path d="M12 38v-6h5v6M20 38v-6h5v6M28 38v-6h5v6" />
          <path d="M34 14h6v8h-6" />
          <circle cx="16" cy="12" r="2.2" />
          <circle cx="24" cy="10" r="2.2" />
        </>
      ) : null}
      {name === 'clipboard' ? (
        <>
          <path d="M16 12h16a3 3 0 0 1 3 3v24a3 3 0 0 1-3 3H16a3 3 0 0 1-3-3V15a3 3 0 0 1 3-3Z" />
          <path d="M19 12V9.5A2.5 2.5 0 0 1 21.5 7h5A2.5 2.5 0 0 1 29 9.5V12" />
          <path d="m20 25 3.2 3.2L29 22" />
          <path d="M19 33h10" />
        </>
      ) : null}
      {name === 'gauge' ? (
        <>
          <path d="M10 30a14 14 0 1 1 28 0" />
          <path d="M14 30h20" />
          <path d="M24 30 31 18" />
          <circle cx="24" cy="30" r="2.2" fill="currentColor" stroke="none" />
          <path d="M24 12v3M12.5 19l2.2 2.2M35.5 19l-2.2 2.2" />
        </>
      ) : null}
      {name === 'service' ? (
        <>
          <circle cx="24" cy="24" r="14" />
          <path d="M16 22.5c1.2-3 3.8-4.5 8-4.5s6.8 1.5 8 4.5" />
          <path d="M17.5 28.5c2 3.2 4.8 4.8 6.5 4.8s4.5-1.6 6.5-4.8" />
          <circle cx="18.5" cy="20" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="29.5" cy="20" r="1.4" fill="currentColor" stroke="none" />
          <path d="m31 14 2 2 4-4" />
        </>
      ) : null}
    </svg>
  )
}

/** Circular certification seals used when Sanity badge images are empty. */
export function QualityBadgeMark({
  kind,
  label,
  className,
}: {
  kind: 'iso9001' | 'iso14001' | 'iso45001' | 'madeInTurkiye' | 'custom'
  label: string
  className?: string
}) {
  if (kind === 'madeInTurkiye') {
    return (
      <svg aria-hidden="true" viewBox="0 0 96 96" className={className}>
        <circle cx="48" cy="48" r="46" fill="#e31c23" />
        <circle cx="40" cy="48" r="18" fill="#fff" />
        <circle cx="46" cy="48" r="14.5" fill="#e31c23" />
        <path
          fill="#fff"
          d="m58.2 48 9.4-3.05-5.8 7.85V43.2l5.8 7.85L58.2 48Z"
        />
      </svg>
    )
  }

  const code =
    kind === 'iso9001' ? '9001' : kind === 'iso14001' ? '14001' : kind === 'iso45001' ? '45001' : ''
  const year =
    kind === 'iso9001' || kind === 'iso14001' ? '2015' : kind === 'iso45001' ? '2018' : ''

  return (
    <svg aria-hidden="true" viewBox="0 0 96 96" className={className}>
      <circle cx="48" cy="48" r="45" fill="none" stroke="#f2f2f0" strokeWidth="2.25" />
      <circle cx="48" cy="48" r="38.5" fill="none" stroke="#f2f2f0" strokeWidth="1.35" />
      <circle cx="48" cy="48" r="32" fill="none" stroke="rgba(242,242,240,0.28)" strokeWidth="0.9" />
      <text
        x="48"
        y="39"
        textAnchor="middle"
        fill="#f2f2f0"
        fontFamily="var(--font-display), sans-serif"
        fontSize="17"
        fontWeight="700"
        letterSpacing="0.14em"
      >
        ISO
      </text>
      <text
        x="48"
        y="58"
        textAnchor="middle"
        fill="#f2f2f0"
        fontFamily="var(--font-display), sans-serif"
        fontSize="16.5"
        fontWeight="700"
      >
        {code || label.slice(0, 6)}
      </text>
      {year ? (
        <text
          x="48"
          y="73"
          textAnchor="middle"
          fill="rgba(242,242,240,0.78)"
          fontFamily="var(--font-body), sans-serif"
          fontSize="10.5"
          letterSpacing="0.08em"
        >
          {year}
        </text>
      ) : null}
    </svg>
  )
}

export function inferQualityBadgeKind(
  label: string,
): 'iso9001' | 'iso14001' | 'iso45001' | 'madeInTurkiye' | 'custom' {
  const normalized = label.toLowerCase().replace(/\s+/g, '')
  if (normalized.includes('9001')) return 'iso9001'
  if (normalized.includes('14001')) return 'iso14001'
  if (normalized.includes('45001')) return 'iso45001'
  if (normalized.includes('türkiye') || normalized.includes('turkiye') || normalized.includes('turkey')) {
    return 'madeInTurkiye'
  }
  return 'custom'
}

export const QUALITY_FEATURE_ICONS = [
  'handshake',
  'production',
  'clipboard',
  'gauge',
  'service',
] as const
