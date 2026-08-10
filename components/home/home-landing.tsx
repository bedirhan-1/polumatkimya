import Link from 'next/link'

import {SanityImage} from '@/components/content/sanity-image'
import {IndustryCards} from '@/components/content/industry-cards'
import {ButtonLink} from '@/components/ui/button-link'
import type {HomeImage, HomePageContent} from '@/lib/home/content'
import type {Locale} from '@/lib/i18n/locales'
import type {ProductCardData} from '@/lib/products/types'
import {resolveSimpleCta} from '@/sanity/lib/link-resolver'

import {AboutVideo} from './about-video'
import {getHomeCopy} from './home-copy'
import styles from './home-landing.module.css'
import {
  inferQualityBadgeKind,
  QUALITY_FEATURE_ICONS,
  QualityBadgeMark,
  QualityFeatureIcon,
} from './quality-marks'

type HomeLandingProps = {
  locale: Locale
  content?: HomePageContent | null
}

type IconName =
  | 'shield'
  | 'bolt'
  | 'diamond'
  | 'globe'
  | 'factory'
  | 'beaker'
  | 'package'
  | 'check'
  | 'list'

const strengthIcons: IconName[] = ['bolt', 'diamond', 'factory', 'globe', 'shield', 'package']
const trustIcons: IconName[] = ['shield', 'bolt', 'diamond', 'globe']
const aboutStatIcons: IconName[] = ['shield', 'globe', 'factory', 'list', 'package']

export function HomeLanding({locale, content}: HomeLandingProps) {
  const copy = getHomeCopy(locale)
  const hero = content?.hero
  const productsSection = content?.productsSection
  const strengthsSection = content?.strengthsSection
  const industriesSection = content?.industriesSection
  const privateLabel = content?.privateLabelSection
  const about = content?.aboutSection
  const quality = content?.qualitySection
  const cta = content?.ctaSection

  const featuredProducts = (productsSection?.products || []).filter(
    (product) => product?.slug && product?.title,
  ) as ProductCardData[]
  const industryCards = (industriesSection?.areas || [])
    .map((entry) => {
      if (entry && typeof entry === 'object' && 'area' in entry) {
        const area = entry.area
        if (!area?.slug) return null
        return {
          ...area,
          _id: area._id || entry._key || area.slug,
          title: entry.title || area.title,
          summary: entry.summary ?? area.summary ?? null,
        }
      }
      if (entry && typeof entry === 'object' && 'slug' in entry) {
        return entry
      }
      return null
    })
    .filter((area): area is NonNullable<typeof area> => Boolean(area?.slug && area?.title))
    .slice(0, 6)

  const heroEyebrow = hero?.eyebrow || copy.hero.eyebrow
  const heroLead = hero?.headingLead || copy.hero.lead
  const heroAccent = hero?.headingAccent || copy.hero.accent
  const heroTail = hero?.headingTail || copy.hero.tail
  const heroDescription = hero?.description || copy.hero.description
  const heroImageAlt =
    hero?.desktopImage?.alt || hero?.mobileImage?.alt || copy.hero.imageAlt
  const primaryCta = resolveSimpleCta(locale, hero?.primaryCta) || {
    href: `/${locale}/products`,
    label: copy.hero.products,
    variant: 'primary' as const,
  }
  const secondaryCta = resolveSimpleCta(locale, hero?.secondaryCta) || {
    href: `/${locale}/request-a-quote`,
    label: copy.hero.quote,
    variant: 'secondary' as const,
  }
  const trustItems =
    hero?.trustItems?.filter((item) => item.title)?.slice(0, 4) ||
    copy.trust.map((item) => ({
      _key: item.title,
      title: item.title,
      description: item.description,
    }))

  const productsEyebrow = productsSection?.eyebrow || copy.products.eyebrow
  const productsTitle = productsSection?.title || copy.products.title
  const productsDescription = productsSection?.description || copy.products.description
  const productsAll = productsSection?.viewAllLabel || copy.products.all
  const productsDetail = productsSection?.detailLabel || copy.products.detail

  const strengthsEyebrow = strengthsSection?.eyebrow || copy.strengths.eyebrow
  const strengthsTitle = strengthsSection?.title || copy.strengths.title
  const strengthItems =
    strengthsSection?.items?.filter((item) => item.title) ||
    copy.strengths.items.map((item) => ({
      _key: item.title,
      title: item.title,
      description: item.description,
    }))

  const industriesEyebrow = industriesSection?.eyebrow || copy.industries.eyebrow
  const industriesTitle = industriesSection?.title || copy.industries.title
  const industriesDescription = industriesSection?.description || copy.industries.description
  const industriesDetailLabel = industriesSection?.detailLabel || copy.industries.detail
  const industriesViewAll = resolveSimpleCta(locale, industriesSection?.viewAllCta) || {
    href: `/${locale}/industries`,
    label: copy.industries.viewAll,
    variant: 'secondary' as const,
  }

  const privateCta = resolveSimpleCta(locale, privateLabel?.cta) || {
    href: `/${locale}/private-label`,
    label: copy.privateLabel.action,
    variant: 'primary' as const,
  }
  const privateFeatures =
    privateLabel?.features?.filter((item) => item.title) ||
    copy.privateLabel.features.map((item) => ({
      _key: item.title,
      title: item.title,
      description: item.description,
    }))
  const privateProcess =
    privateLabel?.process?.filter((item) => item.title) ||
    copy.privateLabel.process.map((item) => ({
      _key: item.title,
      title: item.title,
      description: item.description,
    }))
  const privateImage = privateLabel?.image?.asset
    ? privateLabel.image
    : featuredProducts[0]?.cardImage?.asset
      ? featuredProducts[0].cardImage
      : featuredProducts[0]?.packshot?.asset
        ? featuredProducts[0].packshot
        : null

  const aboutCta = resolveSimpleCta(locale, about?.cta) || {
    href: `/${locale}/about`,
    label: copy.about.action,
    variant: 'primary' as const,
  }
  const aboutImage = about?.image?.asset ? about.image : null
  const aboutPlayLabel = about?.videoPlayLabel || copy.about.videoPlayLabel
  const aboutStatsFromCms = (about?.stats || []).filter((stat) =>
    Boolean(stat?.value && stat?.label),
  )
  const aboutStats =
    aboutStatsFromCms.length >= 5
      ? aboutStatsFromCms.slice(0, 5)
      : copy.about.stats.map((stat) => ({
          _key: stat.label,
          value: stat.value,
          label: stat.label,
          icon: null as HomeImage | null,
        }))

  const qualityLink = resolveSimpleCta(locale, quality?.link) || {
    href: `/${locale}/quality-certificates`,
    label: 'ISO 9001 · 14001 · 45001',
    variant: 'primary' as const,
  }
  const qualityItemsFromCms = (quality?.items || []).flatMap((item) => {
    if (typeof item === 'string') {
      return item ? [{label: item, icon: null, _key: item}] : []
    }
    if (!item?.label) return []
    return [
      {
        label: item.label,
        icon: item.icon ?? null,
        _key: item._key || item.label,
      },
    ]
  })
  const qualityItems = (
    qualityItemsFromCms.length
      ? qualityItemsFromCms
      : copy.quality.items.map((item) => ({
          label: item.label,
          icon: null as HomeImage | null,
          _key: item.label,
        }))
  ).slice(0, 5)
  const qualityBadgesFromCms = (quality?.badges || []).filter(
    (badge): badge is NonNullable<typeof badge> & {label: string} => Boolean(badge?.label),
  )
  const qualityBadges = (
    qualityBadgesFromCms.length
      ? qualityBadgesFromCms
      : copy.quality.badges.map((badge) => ({
          label: badge.label,
          image: null as HomeImage | null,
          _key: badge.label,
        }))
  ).slice(0, 4)

  const bottomPrimary = resolveSimpleCta(locale, cta?.primaryCta) || {
    href: `/${locale}/request-a-quote`,
    label: copy.cta.quote,
    variant: 'primary' as const,
  }
  const bottomSecondary = resolveSimpleCta(locale, cta?.secondaryCta) || {
    href: `/${locale}/contact`,
    label: copy.cta.contact,
    variant: 'secondary' as const,
  }

  return (
    <div className={styles.home}>
      <section
        className="relative isolate min-h-[50rem] w-full overflow-hidden border-b border-white/10 bg-[#050607] sm:min-h-[48rem] lg:aspect-[21/9] lg:min-h-0"
        aria-labelledby="home-hero-title"
      >
        <div className="absolute inset-0">
          {hero?.mobileImage?.asset ? (
            <>
              <SanityImage
                image={hero.desktopImage}
                alt={heroImageAlt}
                fill
                priority
                sizes="100vw"
                className="hidden object-cover object-[64%_center] lg:block lg:object-center"
              />
              <SanityImage
                image={hero.mobileImage}
                alt={hero.mobileImage.alt || heroImageAlt}
                fill
                priority
                sizes="100vw"
                className="object-cover object-[64%_center] lg:hidden"
              />
            </>
          ) : hero?.desktopImage?.asset ? (
            <SanityImage
              image={hero.desktopImage}
              alt={heroImageAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover object-[64%_center] lg:object-center"
            />
          ) : null}
        </div>
        <div
          className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(2,3,4,0.96)_0%,rgba(2,3,4,0.82)_52%,rgba(2,3,4,0.26)_100%)] lg:hidden"
          aria-hidden
        />

        <div className="container relative z-[2] mx-auto flex min-h-[50rem] flex-col justify-center px-4 pt-14 pb-56 sm:min-h-[48rem] sm:px-6 lg:min-h-full lg:justify-center lg:px-8 lg:pt-0 lg:pb-20">
          <div className="max-w-[31rem] lg:w-[36%] lg:min-w-[28rem]">
            {heroEyebrow ? (
              <p className="flex items-center gap-3 text-[0.68rem] font-bold leading-none tracking-[0.2em] text-accent uppercase before:h-px before:w-7 before:shrink-0 before:bg-current before:content-['']">
                {heroEyebrow}
              </p>
            ) : null}
            <h1
              id="home-hero-title"
              className="mt-3 max-w-[11ch] font-[family-name:var(--font-display)] text-[clamp(3rem,4vw,4.65rem)] leading-[0.92] font-bold tracking-[-0.015em] text-[#f8f8f5] uppercase"
            >
              <span className="block">{heroLead}</span>
              <span className="mt-1 block text-accent drop-shadow-[0_0_32px_rgba(227,28,35,0.2)]">
                {heroAccent}
              </span>
              <span className="mt-1 block">{heroTail}</span>
            </h1>
            {heroDescription ? (
              <p className="mt-4 max-w-[28rem] text-[clamp(0.86rem,0.9vw,1rem)] leading-6 text-white/65">
                {heroDescription}
              </p>
            ) : null}
            <div className="mt-5 flex flex-wrap gap-3">
              <ButtonLink
                href={primaryCta.href}
                variant={primaryCta.variant}
                className="min-w-40 no-underline uppercase"
              >
                {primaryCta.label}
                <ArrowIcon />
              </ButtonLink>
              <ButtonLink
                href={secondaryCta.href}
                variant={secondaryCta.variant}
                className="min-w-36 border-white/20 bg-black/20 no-underline uppercase backdrop-blur-sm"
              >
                {secondaryCta.label}
                <ArrowIcon />
              </ButtonLink>
            </div>
          </div>

          {trustItems.length ? (
            <div className="absolute inset-x-4 bottom-0 grid grid-cols-2 overflow-hidden border border-b-0 border-white/10 bg-[#08090b]/85 shadow-2xl backdrop-blur-xl sm:inset-x-6 lg:inset-x-auto lg:bottom-4 lg:left-8 lg:w-[calc(100%_-_4rem)] lg:max-w-[50rem] lg:grid-cols-4 lg:border-white/10 lg:bg-black/20 lg:shadow-none lg:backdrop-blur-sm">
              {trustItems.map((item, index) => (
                <div
                  className="grid min-h-24 grid-cols-[auto_1fr] items-center gap-3 px-4 py-4 lg:min-h-16 lg:px-3 lg:py-2"
                  key={item._key || item.title || index}
                >
                  <span className="flex size-10 shrink-0 rotate-45 items-center justify-center border border-accent/45 bg-accent/5 text-accent lg:size-9 [&>svg]:size-5 [&>svg]:-rotate-45 lg:[&>svg]:size-4">
                    <HomeIcon name={trustIcons[index % trustIcons.length]} />
                  </span>
                  <span>
                    <strong className="block font-[family-name:var(--font-display)] text-sm leading-tight font-semibold text-[#f3f3f0] uppercase">
                      {item.title}
                    </strong>
                    {item.description ? (
                      <small className="mt-1 hidden text-[0.7rem] leading-snug text-white/45 2xl:block">
                        {item.description}
                      </small>
                    ) : null}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {featuredProducts.length ? (
        <section className={styles.section} aria-labelledby="home-products-title">
          <div className="container-site">
            <div className={styles.headingRow}>
              <div>
                <p className={styles.eyebrow}>{productsEyebrow}</p>
                <h2 id="home-products-title" className={styles.sectionTitle}>
                  {productsTitle}
                </h2>
                <p className={styles.sectionDescription}>{productsDescription}</p>
              </div>
              <Link href={`/${locale}/products`} className={styles.textLink}>
                {productsAll} <ArrowIcon />
              </Link>
            </div>
            <div className={styles.productsGrid}>
              {featuredProducts.map((product) => (
                <HomeProductCard
                  key={product._id}
                  locale={locale}
                  product={product}
                  detailLabel={productsDetail}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section
        className={`${styles.section} ${styles.strengthsSection}`}
        aria-labelledby="home-strengths-title"
      >
        <div className="container-site">
          <div className={styles.centerHeading}>
            <p className={styles.eyebrow}>{strengthsEyebrow}</p>
            <h2 id="home-strengths-title" className={styles.sectionTitle}>
              {strengthsTitle}
            </h2>
          </div>
          <div className={styles.benefitsGrid}>
            {strengthItems.map((item, index) => (
              <article className={styles.benefit} key={item._key || item.title}>
                <span className={styles.benefitIcon}>
                  <HomeIcon name={strengthIcons[index % strengthIcons.length]} />
                </span>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {industryCards.length ? (
        <section className={styles.section} aria-labelledby="home-industries-title">
          <div className="container-site">
            <div className={styles.centerHeading}>
              <p className={styles.eyebrow}>{industriesEyebrow}</p>
              <h2 id="home-industries-title" className={styles.sectionTitle}>
                {industriesTitle}
              </h2>
              {industriesDescription ? (
                <p className={styles.sectionDescription}>{industriesDescription}</p>
              ) : null}
              {industriesViewAll.href ? (
                <Link href={industriesViewAll.href} className={`${styles.textLink} mt-5`}>
                  {industriesViewAll.label} <ArrowIcon />
                </Link>
              ) : null}
            </div>
            <IndustryCards
              locale={locale}
              areas={industryCards}
              detailLabel={industriesDetailLabel}
            />
          </div>
        </section>
      ) : null}

      <section
        id="private-label"
        className={`${styles.section} ${styles.privateSection}`}
        aria-labelledby="private-label-title"
      >
        <div className="container-site">
          <div className={styles.privatePanel}>
            <div className={styles.privateIntro}>
              <p className={styles.eyebrow}>
                {privateLabel?.eyebrow || copy.privateLabel.eyebrow}
              </p>
              <h2 id="private-label-title" className={styles.sectionTitle}>
                {privateLabel?.title || copy.privateLabel.title}
              </h2>
              <p className={styles.sectionDescription}>
                {privateLabel?.description || copy.privateLabel.description}
              </p>
              <ButtonLink href={privateCta.href} className={styles.privateAction}>
                {privateCta.label} <ArrowIcon />
              </ButtonLink>
            </div>

            <div className={styles.privateVisual} aria-hidden="true">
              {privateImage ? (
                <SanityImage
                  image={privateImage}
                  alt={privateImage.alt || ''}
                  fill
                  fit="max"
                  sizes="(max-width: 640px) 100vw, (max-width: 1180px) 50vw, 25vw"
                  className={styles.privateVisualImage}
                />
              ) : null}
            </div>

            <div className={styles.privateFeatures}>
              <div className={styles.featureList}>
                {privateFeatures.map((item, index) => (
                  <div className={styles.featureItem} key={item._key || item.title}>
                    <HomeIcon
                      name={index === 0 ? 'beaker' : index === 4 ? 'globe' : 'package'}
                    />
                    <span>
                      <strong>{item.title}</strong>
                      <p>{item.description}</p>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.privateProcess}>
              <p className={styles.processTitle}>
                {privateLabel?.processTitle || copy.privateLabel.processTitle}
              </p>
              <div className={styles.processList}>
                {privateProcess.map((step, index) => (
                  <div className={styles.processStep} key={step._key || step.title}>
                    <span className={styles.processNumber}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>
                      <strong>{step.title}</strong>
                      <p>{step.description}</p>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="home-about-title">
        <div className="container-site">
          <div className={styles.aboutGrid}>
            <AboutVideo
              poster={aboutImage}
              posterAlt={about?.image?.alt || copy.about.imageAlt}
              playLabel={aboutPlayLabel}
              streamUrl={about?.streamUrl}
              streamVideoId={about?.streamVideoId}
            />
            <div className={styles.aboutCopy}>
              <p className={styles.aboutEyebrow}>{about?.eyebrow || copy.about.eyebrow}</p>
              <h2 id="home-about-title" className={styles.sectionTitle}>
                {about?.title || copy.about.title}
              </h2>
              <p className={styles.sectionDescription}>
                {about?.description || copy.about.description}
              </p>
              <div className={styles.statsGrid}>
                {aboutStats.map((stat, index) => (
                  <div className={styles.stat} key={stat._key || `${stat.value}-${stat.label}`}>
                    <span className={styles.statIcon}>
                      {stat.icon?.asset ? (
                        <SanityImage image={stat.icon} alt="" width={48} height={48} />
                      ) : (
                        <HomeIcon name={aboutStatIcons[index] || 'shield'} />
                      )}
                    </span>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
              <Link href={aboutCta.href} className={styles.aboutOutlineCta}>
                {aboutCta.label} <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.qualityBand} aria-labelledby="home-quality-title">
        <img
          src="/brand/polumat-mark-512-light.webp"
          alt=""
          aria-hidden="true"
          className={styles.qualityWatermark}
        />
        <div className={`container-site ${styles.qualityInner}`}>
          <div className={styles.qualityTop}>
            <p className={styles.eyebrow}>{quality?.eyebrow || copy.quality.eyebrow}</p>
            <h2 id="home-quality-title" className={styles.sectionTitle}>
              {quality?.title || copy.quality.title}
            </h2>
          </div>

          <div className={styles.qualityRow}>
            <div className={styles.qualityGrid}>
              {qualityItems.map((item, index) => (
                <div className={styles.qualityItem} key={item._key || item.label}>
                  <span className={styles.qualityItemIcon}>
                    {item.icon?.asset ? (
                      <SanityImage image={item.icon} alt="" width={48} height={48} />
                    ) : (
                      <QualityFeatureIcon
                        name={QUALITY_FEATURE_ICONS[index] || 'service'}
                      />
                    )}
                  </span>
                  <strong>{item.label}</strong>
                </div>
              ))}
            </div>

            {qualityBadges.length ? (
              <>
                <div className={styles.qualityDivider} aria-hidden="true" />
                <div className={styles.qualityBadges}>
                  {qualityBadges.map((badge) => {
                    const kind = inferQualityBadgeKind(badge.label || '')
                    const content = (
                      <>
                        <span className={styles.qualityBadgeMark}>
                          {badge.image?.asset ? (
                            <SanityImage
                              image={badge.image}
                              alt={badge.label || ''}
                              width={96}
                              height={96}
                            />
                          ) : (
                            <QualityBadgeMark kind={kind} label={badge.label || ''} />
                          )}
                        </span>
                        <span className={styles.qualityBadgeLabel}>{badge.label}</span>
                      </>
                    )

                    return qualityLink.href ? (
                      <Link
                        key={badge._key || badge.label}
                        href={qualityLink.href}
                        className={styles.qualityBadge}
                      >
                        {content}
                      </Link>
                    ) : (
                      <div key={badge._key || badge.label} className={styles.qualityBadge}>
                        {content}
                      </div>
                    )
                  })}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </section>

      <section className={styles.ctaBand} aria-labelledby="home-cta-title">
        <div className={`container-site ${styles.ctaInner}`}>
          <div>
            <p className={styles.eyebrow}>{cta?.eyebrow || copy.cta.eyebrow}</p>
            <h2 id="home-cta-title" className={styles.ctaTitle}>
              {cta?.title || copy.cta.title}
            </h2>
            <p className={styles.ctaDescription}>
              {cta?.description || copy.cta.description}
            </p>
          </div>
          <div className={styles.ctaActions}>
            <ButtonLink href={bottomPrimary.href} className="no-underline uppercase">
              {bottomPrimary.label} <ArrowIcon />
            </ButtonLink>
            <ButtonLink
              href={bottomSecondary.href}
              variant={bottomSecondary.variant}
              className="no-underline uppercase"
            >
              {bottomSecondary.label}
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  )
}

function HomeProductCard({
  locale,
  product,
  detailLabel,
}: {
  locale: Locale
  product: ProductCardData
  detailLabel: string
}) {
  if (!product.slug || !product.title) return null
  const image = product.packshot?.asset ? product.packshot : product.cardImage

  return (
    <Link href={`/${locale}/products/${product.slug}`} className={styles.productCard}>
      <span className={styles.productMedia}>
        <SanityImage
          image={image}
          fill
          fit="max"
          sizes="(max-width: 640px) 50vw, (max-width: 1180px) 33vw, 17vw"
          className={styles.productImage}
        />
      </span>
      <span className={styles.productBody}>
        {product.primaryCategory?.title ? (
          <span className={styles.productCategory}>{product.primaryCategory.title}</span>
        ) : null}
        <span className={styles.productTitle}>{product.title}</span>
        {product.shortDescription ? (
          <span className={styles.productDescription}>{product.shortDescription}</span>
        ) : null}
        <span className={styles.productAction}>{detailLabel}</span>
      </span>
    </Link>
  )
}

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path
        d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function HomeIcon({name}: {name: IconName}) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.55,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" {...common}>
      {name === 'shield' ? (
        <>
          <path d="M16 3.5 26 7v7.3c0 6.7-4 11.3-10 14.2-6-2.9-10-7.5-10-14.2V7l10-3.5Z" />
          <path d="m11.5 15.8 3 3 6.5-7" />
        </>
      ) : null}
      {name === 'bolt' ? <path d="M18 2.5 7.5 17H15l-1 12.5L24.5 14H17l1-11.5Z" /> : null}
      {name === 'diamond' ? (
        <>
          <path d="m6 11 5-6h10l5 6-10 16L6 11Z" />
          <path d="M6 11h20M11 5l5 6 5-6M16 11v16" />
        </>
      ) : null}
      {name === 'globe' ? (
        <>
          <circle cx="16" cy="16" r="12" />
          <path d="M4 16h24M16 4c3.2 3.3 4.8 7.3 4.8 12S19.2 24.7 16 28M16 4c-3.2 3.3-4.8 7.3-4.8 12S12.8 24.7 16 28" />
        </>
      ) : null}
      {name === 'factory' ? (
        <>
          <path d="M4 27V13l8-4v6l8-4v5l8-4v15H4Z" />
          <path d="M8 27v-5h5v5M17 27v-5h5v5M5 9V4h5v6" />
        </>
      ) : null}
      {name === 'beaker' ? (
        <>
          <path d="M11 4h10M13 4v8L6.5 24.5A2.5 2.5 0 0 0 8.7 28h14.6a2.5 2.5 0 0 0 2.2-3.5L19 12V4" />
          <path d="M9.5 21h13" />
        </>
      ) : null}
      {name === 'package' ? (
        <>
          <path d="m5 9 11-5 11 5v14L16 28 5 23V9Z" />
          <path d="m5 9 11 5 11-5M16 14v14M10.5 6.5l11 5" />
        </>
      ) : null}
      {name === 'check' ? (
        <>
          <circle cx="16" cy="16" r="12" />
          <path d="m10 16 4 4 8-9" />
        </>
      ) : null}
      {name === 'list' ? (
        <>
          <path d="M8 7h16M8 16h16M8 25h12" />
          <circle cx="4" cy="7" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="4" cy="16" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="4" cy="25" r="1.4" fill="currentColor" stroke="none" />
        </>
      ) : null}
    </svg>
  )
}
