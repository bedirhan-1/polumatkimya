import Link from 'next/link'

import {SanityImage} from '@/components/content/sanity-image'
import type {Locale} from '@/lib/i18n/locales'
import type {ProductDetailData} from '@/lib/products/types'

import {
  FeaturedProductSlider,
  type FeaturedProductSlide,
} from './featured-product-slider'
import styles from './featured-product-showcase.module.css'

type FeaturedProductShowcaseProps = {
  locale: Locale
  product?: ProductDetailData | null
}

type ShowcaseCopy = {
  eyebrow: string
  focusLabel: string
  kicker: string
  fallbackDescription: string
  benefitTag: string
  packagingTag: string
  packagingTitle: string
  packagingDescription: string
  sliderLabel: string
  carouselLabel: string
  previousLabel: string
  nextLabel: string
  goToLabel: string
  detailLabel: string
  quoteLabel: string
  fallbackSlides: FeaturedProductSlide[]
}

const SHOWCASE_COPY: Record<Locale, ShowcaseCopy> = {
  tr: {
    eyebrow: 'Öne çıkan ürün',
    focusLabel: 'Ürün odağı · 01',
    kicker: 'Saniyeler içinde güçlü bağ',
    fallbackDescription:
      'Ahşap, MDF, kauçuk, deri ve plastik yüzeylerde hızlı ve kontrollü yapıştırma performansı.',
    benefitTag: 'Ürün avantajı',
    packagingTag: 'Ambalaj seçenekleri',
    packagingTitle: 'İki profesyonel set seçeneği',
    packagingDescription: 'İhtiyacınıza uygun seti seçin.',
    sliderLabel: 'Neden MDF Kit?',
    carouselLabel: 'Ürün avantajları sliderı',
    previousLabel: 'Önceki avantaj',
    nextLabel: 'Sonraki avantaj',
    goToLabel: 'Avantaja git',
    detailLabel: 'Ürünü keşfet',
    quoteLabel: 'Teklif al',
    fallbackSlides: [
      {
        _key: 'fast-bond-tr',
        tag: 'Ürün avantajı',
        title: 'Daha hızlı kürleşme',
        description: 'Aktivatör, uygulama sonrasında kuruma süresinin kısalmasına yardımcı olur.',
      },
      {
        _key: 'vertical-tr',
        tag: 'Ürün avantajı',
        title: 'Dikey yüzeylerde kontrollü uygulama',
        description: 'Akma ve sıçrama yapmadan güçlü bir bağ elde edilmesini destekler.',
      },
      {
        _key: 'surfaces-tr',
        tag: 'Ürün avantajı',
        title: 'Zor yüzeylerde güçlü performans',
        description: 'Gözenekli ve yapıştırılması zor yüzeylerde yüksek viskozite avantajı.',
      },
    ],
  },
  en: {
    eyebrow: 'Featured product',
    focusLabel: 'Product focus · 01',
    kicker: 'A powerful bond in seconds',
    fallbackDescription:
      'Fast, controlled bonding performance on wood, MDF, rubber, leather and plastic surfaces.',
    benefitTag: 'Product benefit',
    packagingTag: 'Packaging options',
    packagingTitle: 'Two professional set options',
    packagingDescription: 'Choose the right set for your application.',
    sliderLabel: 'Why MDF Kit?',
    carouselLabel: 'Product benefits carousel',
    previousLabel: 'Previous benefit',
    nextLabel: 'Next benefit',
    goToLabel: 'Go to benefit',
    detailLabel: 'Explore product',
    quoteLabel: 'Get a quote',
    fallbackSlides: [
      {
        _key: 'fast-bond-en',
        tag: 'Product benefit',
        title: 'Faster curing',
        description: 'The activator helps shorten drying time after application.',
      },
      {
        _key: 'vertical-en',
        tag: 'Product benefit',
        title: 'Controlled vertical application',
        description: 'Supports a strong bond without running or splashing.',
      },
      {
        _key: 'surfaces-en',
        tag: 'Product benefit',
        title: 'Strong performance on difficult surfaces',
        description: 'High-viscosity performance for porous and difficult-to-bond surfaces.',
      },
    ],
  },
  ar: {
    eyebrow: 'منتج مميز',
    focusLabel: 'تركيز المنتج · 01',
    kicker: 'رابطة قوية خلال ثوانٍ',
    fallbackDescription:
      'أداء لصق سريع ومتحكم به على الخشب وMDF والمطاط والجلد والأسطح البلاستيكية.',
    benefitTag: 'ميزة المنتج',
    packagingTag: 'خيارات التعبئة',
    packagingTitle: 'خياران احترافيان للطقم',
    packagingDescription: 'اختر الطقم المناسب لتطبيقك.',
    sliderLabel: 'لماذا طقم MDF؟',
    carouselLabel: 'عارض مزايا المنتج',
    previousLabel: 'الميزة السابقة',
    nextLabel: 'الميزة التالية',
    goToLabel: 'انتقل إلى الميزة',
    detailLabel: 'استكشف المنتج',
    quoteLabel: 'اطلب عرضاً',
    fallbackSlides: [
      {
        _key: 'fast-bond-ar',
        tag: 'ميزة المنتج',
        title: 'تصلب أسرع',
        description: 'يساعد المنشّط على تقصير زمن الجفاف بعد التطبيق.',
      },
      {
        _key: 'vertical-ar',
        tag: 'ميزة المنتج',
        title: 'تطبيق متحكم به على الأسطح العمودية',
        description: 'يدعم تكوين رابطة قوية من دون سيلان أو تطاير.',
      },
      {
        _key: 'surfaces-ar',
        tag: 'ميزة المنتج',
        title: 'أداء قوي على الأسطح الصعبة',
        description: 'لزوجة عالية للأسطح المسامية وصعبة اللصق.',
      },
    ],
  },
}

export function FeaturedProductShowcase({locale, product}: FeaturedProductShowcaseProps) {
  if (!product?.slug || !product.title) return null

  const copy = SHOWCASE_COPY[locale]
  const image = product.packshot?.asset ? product.packshot : product.cardImage
  const packaging = (product.packagingVariants || [])
    .map((variant) => variant.label || variant.volume)
    .filter((label): label is string => Boolean(label))
    .slice(0, 2)
  const seenTitles = new Set<string>()
  const benefitSlides = [...(product.benefits || []), ...(product.features || [])]
    .filter((item) => {
      if (!item.title || !item.description || seenTitles.has(item.title)) return false
      seenTitles.add(item.title)
      return true
    })
    .slice(0, 3)
    .map((item) => ({
      _key: item._key,
      tag: copy.benefitTag,
      title: item.title!,
      description: item.description!,
    }))

  const slides: FeaturedProductSlide[] = benefitSlides.length
    ? [...benefitSlides]
    : [...copy.fallbackSlides]

  if (packaging.length) {
    slides.push({
      _key: 'packaging',
      tag: copy.packagingTag,
      title: copy.packagingTitle,
      description: `${copy.packagingDescription} ${packaging.join(' · ')}`,
    })
  }

  const detailHref = `/${locale}/products/${product.slug}`
  const quoteHref = `/${locale}/request-a-quote?product=${encodeURIComponent(product.slug)}`

  return (
    <section className={styles.section} aria-labelledby="featured-product-title">
      <div className="container-site">
        <div className={styles.showcase}>
          <span className={styles.watermark} aria-hidden="true" dir="ltr">
            MDF KIT
          </span>

          <div className={styles.mediaColumn}>
            <div className={styles.focusLabel}>
              <span aria-hidden="true" />
              {copy.focusLabel}
            </div>
            <div className={styles.mediaStage}>
              <SanityImage
                image={image}
                alt={product.title}
                fill
                fit="max"
                sizes="(max-width: 900px) 86vw, 42vw"
                className={styles.productImage}
              />
            </div>
            {packaging.length ? (
              <div className={styles.packageRail} aria-label={copy.packagingTag}>
                {packaging.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
            ) : null}
          </div>

          <div className={styles.copyColumn}>
            <p className={styles.eyebrow}>{copy.eyebrow}</p>
            <h2 id="featured-product-title" className={styles.title}>
              {product.title}
            </h2>
            <p className={styles.kicker}>{copy.kicker}</p>
            <p className={styles.description}>
              {product.shortDescription || copy.fallbackDescription}
            </p>

            <FeaturedProductSlider
              slides={slides}
              label={copy.sliderLabel}
              carouselLabel={copy.carouselLabel}
              previousLabel={copy.previousLabel}
              nextLabel={copy.nextLabel}
              goToLabel={copy.goToLabel}
              direction={locale === 'ar' ? 'rtl' : 'ltr'}
            />

            <div className={styles.actions}>
              <Link href={detailHref} className={styles.primaryAction}>
                {copy.detailLabel}
                <ActionArrow />
              </Link>
              <Link href={quoteHref} className={styles.secondaryAction}>
                {copy.quoteLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ActionArrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 18 18">
      <path d="M3 9h11M10 5l4 4-4 4" />
    </svg>
  )
}
