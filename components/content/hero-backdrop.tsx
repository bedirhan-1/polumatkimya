import styles from './hero-backdrop.module.css'

export type HeroPattern =
  | 'default'
  | 'products'
  | 'industries'
  | 'gallery'
  | 'videos'
  | 'blog'
  | 'contact'
  | 'export'
  | 'turkey-sales'
  | 'private-label'
  | 'quote'

type HeroBackdropProps = {
  pattern?: HeroPattern
}

/** Page-specific decorative layer for inner PageHero bands. */
export function HeroBackdrop({pattern = 'default'}: HeroBackdropProps) {
  return (
    <div className={`${styles.root} ${styles[pattern]}`} aria-hidden>
      <div className={styles.wash} />
      {pattern === 'turkey-sales' ? (
        <TurkeySalesMotif className={styles.illustration} />
      ) : (
        <div className={styles.motif} />
      )}
      <div className={styles.accent} />
      <div className={styles.grain} />
    </div>
  )
}

/** Soft Anatolian geometry + faint crescent — no heavy clipart. */
function TurkeySalesMotif({className}: {className: string}) {
  return (
    <svg
      className={className}
      viewBox="0 0 960 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Full-bleed field: stronger on the right, soft on the left over title */}
        <linearGradient id="trFieldFade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity="0.22" />
          <stop offset="28%" stopColor="white" stopOpacity="0.45" />
          <stop offset="62%" stopColor="white" stopOpacity="0.85" />
          <stop offset="100%" stopColor="white" stopOpacity="1" />
        </linearGradient>
        <mask id="trFieldMask">
          <rect width="960" height="320" fill="url(#trFieldFade)" />
        </mask>

        {/* Motifs stay clearer on the right */}
        <linearGradient id="trMotifFade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="42%" stopColor="white" stopOpacity="0.15" />
          <stop offset="70%" stopColor="white" stopOpacity="0.75" />
          <stop offset="100%" stopColor="white" stopOpacity="1" />
        </linearGradient>
        <mask id="trMotifMask">
          <rect width="960" height="320" fill="url(#trMotifFade)" />
        </mask>

        {/* Classic 8-point Seljuk star — single outline, roomy tile */}
        <pattern id="trStarLarge" width="120" height="120" patternUnits="userSpaceOnUse">
          <g transform="translate(60 60)" stroke="currentColor" fill="none">
            <path
              d="M0-26 L7.5-7.5 L26 0 L7.5 7.5 L0 26 L-7.5 7.5 L-26 0 L-7.5-7.5 Z"
              strokeWidth="1"
              opacity="0.55"
            />
            <circle cx="0" cy="0" r="1.6" fill="currentColor" stroke="none" opacity="0.28" />
          </g>
        </pattern>
      </defs>

      <g color="#d2cec6">
        {/* Full-width star field, fading gently under the title */}
        <g mask="url(#trFieldMask)">
          <rect width="960" height="320" fill="url(#trStarLarge)" opacity="0.32" />
        </g>

        <g mask="url(#trMotifMask)">
          {/* Horizon wash */}
          <path
            d="M320 250 C420 228 520 236 620 220 C740 198 840 210 960 196 V320 H320 Z"
            fill="currentColor"
            opacity="0.06"
          />

          {/* Delicate dome skyline — stroke only */}
          <g
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinejoin="round"
            fill="none"
            opacity="0.4"
          >
            <path d="M560 232 C572 204 604 204 616 232" />
            <path d="M556 232 H620" />
            <path d="M588 204 V194" />
            <circle cx="588" cy="191" r="2" fill="currentColor" stroke="none" opacity="0.7" />

            <path d="M640 236 C658 188 722 188 740 236" />
            <path d="M632 236 H748" />
            <path d="M668 236 C676 214 700 214 708 236" />
            <path d="M690 188 V176" />
            <circle cx="690" cy="172" r="2.5" fill="currentColor" stroke="none" opacity="0.75" />

            <path d="M628 236 V150" />
            <path d="M624 150 H632 L628 138 Z" fill="currentColor" stroke="none" opacity="0.45" />
            <path d="M752 236 V150" />
            <path d="M748 150 H756 L752 138 Z" fill="currentColor" stroke="none" opacity="0.45" />
            <path d="M656 236 V176" />
            <path d="M720 236 V176" />

            <path d="M640 236 V258 H740 V236" />
            <path d="M658 258 V244 C664 236 676 236 682 244 V258" />
            <path d="M698 258 V244 C704 236 716 236 722 244 V258" />
          </g>

          {/* Crescent */}
          <g fill="currentColor" opacity="0.3" transform="translate(800 108)">
            <path d="M28 4 C14 10 6 26 12 42 C20 62 44 68 60 56 C42 64 24 50 20 32 C16 16 24 4 28 4 Z" />
            <path d="M64 14 L66.4 21.2 L74 21.2 L68 25.6 L70.2 32.8 L64 28.2 L57.8 32.8 L60 25.6 L54 21.2 L61.6 21.2 Z" />
          </g>
        </g>
      </g>
    </svg>
  )
}
