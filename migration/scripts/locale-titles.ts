/**
 * Official-ish EN/AR product titles for field-level localization stubs.
 * Arabic names are editorial placeholders — confirm with catalog before go-live.
 */
export const productLocaleTitles: Record<
  string,
  {en: string; ar: string}
> = {
  'brake-cleaner-spray': {
    en: 'Brake Cleaner Spray',
    ar: 'بخاخ تنظيف الفرامل',
  },
  'rust-remover-spray': {
    en: 'Rust Remover Spray',
    ar: 'بخاخ مزيل الصدأ',
  },
  'engine-cleaner-spray': {
    en: 'Engine Cleaner Spray',
    ar: 'بخاخ تنظيف المحرك',
  },
  'chain-lubricant-spray': {
    en: 'Chain Lubricant Spray',
    ar: 'بخاخ تشحيم السلاسل',
  },
  'contact-cleaner-spray': {
    en: 'Contact Cleaner Spray',
    ar: 'بخاخ تنظيف نقاط التلامس',
  },
  'tire-shine-spray': {
    en: 'Tire Shine Spray',
    ar: 'بخاخ تلميع الإطارات',
  },
  'dashboard-polish-spray': {
    en: 'Dashboard Polish Spray',
    ar: 'بخاخ تلميع لوحة القيادة',
  },
  'mold-release-spray': {
    en: 'Mold Release Spray',
    ar: 'بخاخ فاصل القوالب',
  },
  'siliconized-sealant': {
    en: 'Siliconized Sealant',
    ar: 'مانع تسرب سيليكوني',
  },
  'acrylic-sealant': {
    en: 'Acrylic Sealant',
    ar: 'مانع تسرب أكريليك',
  },
  'high-temperature-rtv-silicone': {
    en: 'High Temperature RTV Silicone',
    ar: 'سيليكون RTV مقاوم للحرارة العالية',
  },
  'aquarium-silicone': {
    en: 'Aquarium Silicone',
    ar: 'سيليكون أحواض الأسماك',
  },
  'shower-enclosure-silicone': {
    en: 'Shower Enclosure Silicone',
    ar: 'سيليكون كابينة الدش',
  },
  'mirror-silicone': {
    en: 'Mirror Silicone',
    ar: 'سيليكون المرايا',
  },
  'universal-silicone': {
    en: 'Universal Silicone',
    ar: 'سيليكون متعدد الاستخدامات',
  },
  'e-universal-silicone': {
    en: 'E-Universal Silicone',
    ar: 'سيليكون E متعدد الاستخدامات',
  },
  'high-tack-adhesive': {
    en: 'High Tack Adhesive',
    ar: 'لاصق عالي الالتصاق',
  },
  'mdf-kit-activator': {
    en: 'MDF Kit Activator',
    ar: 'منشط لاصق MDF',
  },
  'grout-filler': {
    en: 'Grout Filler',
    ar: 'حشو الفواصل',
  },
}

export const industrySeeds = [
  {
    sourceKey: 'industry:automotive',
    slug: 'automotive',
    title: {tr: 'Otomotiv', en: 'Automotive', ar: 'السيارات'},
    summary: {
      tr: 'Fren, motor, kontak ve bakım spreyleri.',
      en: 'Brake, engine, contact and maintenance sprays.',
      ar: 'بخاخات الفرامل والمحرك ونقاط التلامس والصيانة.',
    },
  },
  {
    sourceKey: 'industry:industrial-maintenance',
    slug: 'industrial-maintenance',
    title: {tr: 'Endüstriyel bakım', en: 'Industrial maintenance', ar: 'الصيانة الصناعية'},
    summary: {
      tr: 'Pas sökme, kalıp ayırma ve genel bakım kimyasalları.',
      en: 'Rust removal, mold release and general maintenance chemicals.',
      ar: 'إزالة الصدأ وفصل القوالب وكيماويات الصيانة العامة.',
    },
  },
  {
    sourceKey: 'industry:construction',
    slug: 'construction',
    title: {tr: 'Yapı ve inşaat', en: 'Construction', ar: 'البناء والتشييد'},
    summary: {
      tr: 'Silikon, mastik ve derz dolgu uygulamaları.',
      en: 'Silicone, sealant and grout applications.',
      ar: 'تطبيقات السيليكون والمانعات وحشو الفواصل.',
    },
  },
]
