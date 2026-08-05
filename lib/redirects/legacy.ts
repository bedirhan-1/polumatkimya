import {defaultLocale} from '../i18n/locales'

/**
 * Legacy Turkish URL → new locale-prefixed English-segment routes.
 * Keep this map explicit; do not replace with wildcard product redirects.
 */
export const legacyPageRedirects: Array<{source: string; destination: string}> = [
  {source: '/urunler', destination: `/${defaultLocale}/products`},
  {
    source: '/urunler/kategori/endustriyel-spreyler',
    destination: `/${defaultLocale}/products/category/industrial-sprays`,
  },
  {
    source: '/urunler/kategori/yapi-kimyasallari',
    destination: `/${defaultLocale}/products/category/construction-chemicals`,
  },
  {source: '/sayfa/hakkimizda', destination: `/${defaultLocale}/about`},
  {
    source: '/sayfa/misyon-ve-vizyonumuz',
    destination: `/${defaultLocale}/company/mission-and-vision`,
  },
  {
    source: '/sayfa/polumat-kalitesi',
    destination: `/${defaultLocale}/quality-certificates`,
  },
  {
    source: '/sayfa/cevreye-duyarlilik',
    destination: `/${defaultLocale}/company/environmental-responsibility`,
  },
  {
    source: '/sayfa/is-sagligi-ve-guvenligi',
    destination: `/${defaultLocale}/company/occupational-health-and-safety`,
  },
  {
    source: '/sayfa/musteri-memnuniyeti',
    destination: `/${defaultLocale}/company/customer-satisfaction`,
  },
  {
    source: '/sayfa/insan-kaynaklari',
    destination: `/${defaultLocale}/company/human-resources`,
  },
  {source: '/sayfa/uygulama-videolari', destination: `/${defaultLocale}/videos`},
  {
    source: '/sayfa/iade-ve-degisim-politikamiz',
    destination: `/${defaultLocale}/company/return-and-exchange-policy`,
  },
  {source: '/iletisim', destination: `/${defaultLocale}/contact`},
  {source: '/blog', destination: `/${defaultLocale}/blog`},
]

/** Old Turkish product slugs → shared English slugs (must be validated with catalog before go-live). */
export const legacyProductSlugMap: Record<string, string> = {
  'fren-balata-temizleme-spreyi': 'brake-cleaner-spray',
  'pas-sokucu-sprey': 'rust-remover-spray',
  'motor-temizleme-spreyi': 'engine-cleaner-spray',
  'sivi-gres-zincir-yaglayici': 'chain-lubricant-spray',
  'kontak-temizleme-spreyi': 'contact-cleaner-spray',
  'lastik-parlatici-sprey': 'tire-shine-spray',
  'torpido-parlatici-sprey': 'dashboard-polish-spray',
  'kalip-ayirici-sprey': 'mold-release-spray',
  'silikonize-mastik': 'siliconized-sealant',
  'akrilik-mastik': 'acrylic-sealant',
  'rtv-yuksek-isi-silikonu': 'high-temperature-rtv-silicone',
  'akvaryum-silikonu': 'aquarium-silicone',
  'dusakabin-silikonu': 'shower-enclosure-silicone',
  'ayna-silikonu': 'mirror-silicone',
  'universal-silikon': 'universal-silicone',
  'e-universal-silikon': 'e-universal-silicone',
  'high-tack-silikon': 'high-tack-adhesive',
  'mdf-kit-aktivator': 'mdf-kit-activator',
  'derz-dolgusu': 'grout-filler',
}

/** Old Turkish blog slugs → English-character document slugs. */
export const legacyBlogSlugMap: Record<string, string> = {
  'yeni-nesil-polumat-endustriyel-spreyler': 'next-generation-polumat-industrial-sprays',
  'neden-polumati-tercih-etmelisiniz': 'why-choose-polumat',
  'kuresel-ekonomiye-yeni-bir-soluk': 'a-new-breath-for-global-economy',
  'yapi-kimyasallari-sektorunde-yenilikci-cozumler':
    'innovative-solutions-in-construction-chemicals',
}

export function getLegacyRedirects(): Array<{
  source: string
  destination: string
  permanent: boolean
}> {
  const pageRedirects = legacyPageRedirects.map((entry) => ({
    ...entry,
    permanent: true,
  }))

  const productRedirects = Object.entries(legacyProductSlugMap).flatMap(([oldSlug, newSlug]) => {
    const destination = `/${defaultLocale}/products/${newSlug}`
    return [
      {source: `/urunler/detay/${oldSlug}`, destination, permanent: true},
      {source: `/urunler/${oldSlug}`, destination, permanent: true},
    ]
  })

  const blogRedirects = Object.entries(legacyBlogSlugMap).map(([oldSlug, newSlug]) => ({
    source: `/blog/${oldSlug}`,
    destination: `/${defaultLocale}/blog/${newSlug}`,
    permanent: true,
  }))

  return [...pageRedirects, ...productRedirects, ...blogRedirects]
}
