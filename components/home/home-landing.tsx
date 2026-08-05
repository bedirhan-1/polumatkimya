import Image from 'next/image'
import Link from 'next/link'

import {SanityImage} from '@/components/content/sanity-image'
import {ButtonLink} from '@/components/ui/button-link'
import {getApplicationAreaFallbackImage} from '@/lib/application-area-images'
import type {Dictionary} from '@/lib/i18n/get-dictionary'
import type {Locale} from '@/lib/i18n/locales'
import type {ProductCardData} from '@/lib/products/types'

import {getHomeCopy} from './home-copy'
import styles from './home-landing.module.css'

type ApplicationAreaCardData = {
  _id: string
  title?: string | null
  slug?: string | null
  summary?: string | null
  coverImage?: {asset?: {_ref?: string}; alt?: string | null} | null
}

type HomeLandingProps = {
  locale: Locale
  dictionary: Dictionary
  products: ProductCardData[]
  industries: ApplicationAreaCardData[]
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

const strengthIcons: IconName[] = ['bolt', 'diamond', 'factory', 'globe', 'shield', 'package']
const trustIcons: IconName[] = ['shield', 'bolt', 'diamond', 'globe']

const fallbackIndustries: Record<
  Locale,
  Array<{_id: string; title: string; slug: string; staticImage: string}>
> = {
  tr: [
    {_id: 'automotive', title: 'Otomotiv', slug: 'automotive', staticImage: '/brand/slides/slide-brake-cleaner.webp'},
    {_id: 'industrial', title: 'Endüstriyel bakım', slug: 'industrial-maintenance', staticImage: '/brand/slides/slide-engine-cleaner.webp'},
    {_id: 'construction', title: 'Yapı ve inşaat', slug: 'construction', staticImage: '/brand/slides/slide-rust-remover.webp'},
  ],
  en: [
    {_id: 'automotive', title: 'Automotive', slug: 'automotive', staticImage: '/brand/slides/slide-brake-cleaner.webp'},
    {_id: 'industrial', title: 'Industrial maintenance', slug: 'industrial-maintenance', staticImage: '/brand/slides/slide-engine-cleaner.webp'},
    {_id: 'construction', title: 'Construction', slug: 'construction', staticImage: '/brand/slides/slide-rust-remover.webp'},
  ],
  ar: [
    {_id: 'automotive', title: 'السيارات', slug: 'automotive', staticImage: '/brand/slides/slide-brake-cleaner.webp'},
    {_id: 'industrial', title: 'الصيانة الصناعية', slug: 'industrial-maintenance', staticImage: '/brand/slides/slide-engine-cleaner.webp'},
    {_id: 'construction', title: 'البناء والتشييد', slug: 'construction', staticImage: '/brand/slides/slide-rust-remover.webp'},
  ],
}

export function HomeLanding({locale, dictionary, products, industries}: HomeLandingProps) {
  const copy = getHomeCopy(locale)
  const preferredProducts = products.filter((product) => product.featured)
  const remainingProducts = products.filter((product) => !product.featured)
  const featuredProducts = [...preferredProducts, ...remainingProducts].slice(0, 6)
  const visibleIndustries = industries.filter((area) => area.slug && area.title).slice(0, 3)
  const industryCards = visibleIndustries.length ? visibleIndustries : fallbackIndustries[locale]
  const aboutImage = visibleIndustries[1]?.coverImage || visibleIndustries[0]?.coverImage

  return (
    <div className={styles.home}>
      <section
        className="relative isolate min-h-[50rem] w-full overflow-hidden border-b border-white/10 bg-[#050607] sm:min-h-[48rem] lg:min-h-[38rem] lg:aspect-[8/3]"
        aria-labelledby="home-hero-title"
      >
        <div className="absolute inset-0">
          <Image
            src="/brand/slides/hero-product-family-slider-v2.webp"
            alt={copy.hero.imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[70%_center] lg:object-center"
          />
        </div>
        <div
          className="absolute inset-0 z-[1] bg-gradient-to-r from-[#050607] via-[#050607]/85 to-transparent"
          aria-hidden
        />
        <div
          className="absolute inset-0 z-[1] bg-gradient-to-t from-[#050607] via-transparent to-black/15"
          aria-hidden
        />
        <div
          className="absolute inset-0 z-[1] opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:42px_42px] [mask-image:linear-gradient(90deg,black,transparent_55%)]"
          aria-hidden
        />
        <div
          className="absolute -bottom-1/3 left-1/3 z-0 h-2/3 w-2/3 rounded-full bg-accent/25 blur-[130px]"
          aria-hidden
        />

        <div className="container relative z-[2] mx-auto flex min-h-[50rem] flex-col justify-center pt-14 pb-56 sm:min-h-[48rem] lg:min-h-full lg:pt-16 lg:pb-28">
          <div className="max-w-[34rem]">
            <p className="flex items-center gap-3 text-[0.68rem] font-bold leading-none tracking-[0.2em] text-accent uppercase before:h-px before:w-7 before:shrink-0 before:bg-current before:content-['']">
              {copy.hero.eyebrow}
            </p>
            <h1
              id="home-hero-title"
              className="mt-4 max-w-[11ch] font-[family-name:var(--font-display)] text-[clamp(3.1rem,4.2vw,4.8rem)] leading-[0.91] font-bold tracking-[-0.015em] text-[#f8f8f5] uppercase"
            >
              <span className="block">{copy.hero.lead}</span>
              <span className="mt-1 block text-accent drop-shadow-[0_0_32px_rgba(227,28,35,0.2)]">
                {copy.hero.accent}
              </span>
              <span className="mt-1 block">{copy.hero.tail}</span>
            </h1>
            <p className="mt-5 max-w-[30rem] text-[clamp(0.92rem,1.1vw,1.05rem)] leading-7 text-white/65">
              {copy.hero.description}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink
                href={`/${locale}/products`}
                className="min-w-40 no-underline uppercase"
              >
                {copy.hero.products}
                <ArrowIcon />
              </ButtonLink>
              <ButtonLink
                href={`/${locale}/request-a-quote`}
                variant="secondary"
                className="min-w-36 border-white/20 bg-black/20 no-underline uppercase backdrop-blur-sm"
              >
                {copy.hero.quote}
                <ArrowIcon />
              </ButtonLink>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 grid grid-cols-2 overflow-hidden border border-b-0 border-white/10 bg-[#08090b]/85 shadow-2xl backdrop-blur-xl lg:grid-cols-4">
            {copy.trust.map((item, index) => (
              <div
                className={`grid min-h-24 grid-cols-[auto_1fr] items-center gap-3 px-4 py-4 ${
                  index % 2 === 1 ? 'border-l border-white/10' : ''
                } ${index >= 2 ? 'border-t border-white/10' : ''} ${
                  index > 0 ? 'lg:border-l lg:border-white/10' : ''
                } lg:border-t-0 lg:px-5`}
                key={item.title}
              >
                <span className="flex size-10 shrink-0 rotate-45 items-center justify-center border border-accent/45 bg-accent/5 text-accent [&>svg]:size-5 [&>svg]:-rotate-45">
                  <HomeIcon name={trustIcons[index]} />
                </span>
                <span>
                  <strong className="block font-[family-name:var(--font-display)] text-sm leading-tight font-semibold text-[#f3f3f0] uppercase">
                    {item.title}
                  </strong>
                  <small className="mt-1 hidden text-[0.7rem] leading-snug text-white/45 xl:block">
                    {item.description}
                  </small>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {featuredProducts.length ? (
        <section className={styles.section} aria-labelledby="home-products-title">
          <div className="container-site">
            <div className={styles.headingRow}>
              <div>
                <p className={styles.eyebrow}>{copy.products.eyebrow}</p>
                <h2 id="home-products-title" className={styles.sectionTitle}>
                  {copy.products.title}
                </h2>
                <p className={styles.sectionDescription}>{copy.products.description}</p>
              </div>
              <Link href={`/${locale}/products`} className={styles.textLink}>
                {copy.products.all} <ArrowIcon />
              </Link>
            </div>

            <div className={styles.productsGrid}>
              {featuredProducts.map((product) => (
                <HomeProductCard
                  key={product._id}
                  locale={locale}
                  product={product}
                  detailLabel={copy.products.detail}
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
            <p className={styles.eyebrow}>{copy.strengths.eyebrow}</p>
            <h2 id="home-strengths-title" className={styles.sectionTitle}>
              {copy.strengths.title}
            </h2>
          </div>
          <div className={styles.benefitsGrid}>
            {copy.strengths.items.map((item, index) => (
              <article className={styles.benefit} key={item.title}>
                <span className={styles.benefitIcon}>
                  <HomeIcon name={strengthIcons[index]} />
                </span>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="home-industries-title">
        <div className="container-site">
          <div className={styles.headingRow}>
            <div>
              <p className={styles.eyebrow}>{copy.industries.eyebrow}</p>
              <h2 id="home-industries-title" className={styles.sectionTitle}>
                {copy.industries.title}
              </h2>
              <p className={styles.sectionDescription}>{copy.industries.description}</p>
            </div>
            <Link href={`/${locale}/industries`} className={styles.textLink}>
              {dictionary.nav.industries} <ArrowIcon />
            </Link>
          </div>

          <div className={styles.industryGrid}>
            {industryCards.map((area, index) => {
              if (!area.slug || !area.title) return null
              const staticImage =
                ('staticImage' in area ? area.staticImage : null) ||
                getApplicationAreaFallbackImage(area.slug)
              return (
                <Link
                  href={`/${locale}/industries/${area.slug}`}
                  className={styles.industryCard}
                  key={area._id}
                >
                  {staticImage ? (
                    <Image
                      src={staticImage}
                      alt=""
                      fill
                      sizes="(max-width: 920px) 100vw, 33vw"
                      className={styles.industryImage}
                    />
                  ) : 'coverImage' in area && area.coverImage?.asset ? (
                    <SanityImage
                      image={area.coverImage}
                      fill
                      sizes="(max-width: 920px) 100vw, 33vw"
                      className={styles.industryImage}
                    />
                  ) : null}
                  <span className={styles.industryShade} aria-hidden />
                  <span className={styles.industryContent}>
                    <span className={styles.industryIndex}>{String(index + 1).padStart(2, '0')}</span>
                    <h3>{area.title}</h3>
                    <span>{copy.industries.detail} →</span>
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section
        id="private-label"
        className={`${styles.section} ${styles.privateSection}`}
        aria-labelledby="private-label-title"
      >
        <div className="container-site">
          <div className={styles.privatePanel}>
            <div className={styles.privateIntro}>
              <p className={styles.eyebrow}>{copy.privateLabel.eyebrow}</p>
              <h2 id="private-label-title" className={styles.sectionTitle}>
                {copy.privateLabel.title}
              </h2>
              <p className={styles.sectionDescription}>{copy.privateLabel.description}</p>
              <ButtonLink
                href={`/${locale}/request-a-quote?type=private-label`}
                className={styles.privateAction}
              >
                {copy.privateLabel.action} <ArrowIcon />
              </ButtonLink>
            </div>

            <div className={styles.privateVisual} aria-hidden="true">
              <Image
                src="/brand/private-label-product-scene-v2.webp"
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1180px) 50vw, 25vw"
                className={styles.privateVisualImage}
              />
            </div>

            <div className={styles.privateFeatures}>
              <div className={styles.featureList}>
                {copy.privateLabel.features.map((item, index) => (
                  <div className={styles.featureItem} key={item.title}>
                    <HomeIcon name={index === 0 ? 'beaker' : index === 4 ? 'globe' : 'package'} />
                    <span>
                      <strong>{item.title}</strong>
                      <p>{item.description}</p>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.privateProcess}>
              <p className={styles.processTitle}>{copy.privateLabel.processTitle}</p>
              <div className={styles.processList}>
                {copy.privateLabel.process.map((step, index) => (
                  <div className={styles.processStep} key={step.title}>
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
            <div className={styles.aboutMedia}>
              {aboutImage?.asset ? (
                <SanityImage
                  image={aboutImage}
                  alt={copy.about.imageAlt}
                  fill
                  sizes="(max-width: 920px) 100vw, 55vw"
                  className={styles.aboutImage}
                />
              ) : (
                <Image
                  src="/brand/slides/slide-engine-cleaner.webp"
                  alt={copy.about.imageAlt}
                  fill
                  sizes="(max-width: 920px) 100vw, 55vw"
                  className={styles.aboutImage}
                />
              )}
            </div>
            <div className={styles.aboutCopy}>
              <p className={styles.eyebrow}>{copy.about.eyebrow}</p>
              <h2 id="home-about-title" className={styles.sectionTitle}>
                {copy.about.title}
              </h2>
              <p className={styles.sectionDescription}>{copy.about.description}</p>
              <Link href={`/${locale}/about`} className={`${styles.textLink} mt-7 w-fit`}>
                {copy.about.action} <ArrowIcon />
              </Link>
              <div className={styles.statsGrid}>
                {copy.about.stats.map((stat) => (
                  <div className={styles.stat} key={stat.label}>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.qualityBand} aria-labelledby="home-quality-title">
        <div className="container-site">
          <div className={styles.qualityTop}>
            <div>
              <p className={styles.eyebrow}>{copy.quality.eyebrow}</p>
              <h2 id="home-quality-title" className={styles.sectionTitle}>
                {copy.quality.title}
              </h2>
            </div>
            <Link href={`/${locale}/quality-certificates`} className={styles.textLink}>
              ISO 9001 · 14001 · 45001 <ArrowIcon />
            </Link>
          </div>
          <div className={styles.qualityGrid}>
            {copy.quality.items.map((item) => (
              <div className={styles.qualityItem} key={item}>
                <HomeIcon name="check" />
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaBand} aria-labelledby="home-cta-title">
        <div className={`container-site ${styles.ctaInner}`}>
          <div>
            <p className={styles.eyebrow}>{copy.cta.eyebrow}</p>
            <h2 id="home-cta-title" className={styles.ctaTitle}>
              {copy.cta.title}
            </h2>
            <p className={styles.ctaDescription}>{copy.cta.description}</p>
          </div>
          <div className={styles.ctaActions}>
            <ButtonLink href={`/${locale}/request-a-quote`} className="no-underline uppercase">
              {copy.cta.quote} <ArrowIcon />
            </ButtonLink>
            <ButtonLink
              href={`/${locale}/contact`}
              variant="secondary"
              className="no-underline uppercase"
            >
              {copy.cta.contact}
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
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
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
    </svg>
  )
}
