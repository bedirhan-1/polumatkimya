import {HomeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {languageField, translationStatusField} from '../shared/localization-fields'

export const homePageType = defineType({
  name: 'homePage',
  title: 'Ana sayfa',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'hero', title: 'Üst tanıtım alanı', default: true},
    {name: 'sections', title: 'Bölümler'},
    {name: 'seo', title: 'Arama motoru (SEO)'},
  ],
  fields: [
    languageField,
    translationStatusField,
    defineField({
      name: 'title',
      title: 'Dahili başlık',
      type: 'string',
      description: 'Yalnızca Studio’da görünen dahili isim; sitede gösterilmez.',
      initialValue: 'Ana sayfa',
      group: 'seo',
    }),
    defineField({
      name: 'seo',
      title: 'Arama motoru (SEO)',
      type: 'seo',
      description: 'Google ve sosyal medya paylaşımlarında görünen başlık, açıklama ve görseli belirler.',
      group: 'seo',
    }),
    defineField({
      name: 'hero',
      title: 'Üst tanıtım alanı',
      type: 'homeHero',
      description: 'Ana sayfanın en üstündeki büyük görsel ve başlık alanını etkiler (tek görsel, kaydırıcı yok).',
      group: 'hero',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'productsSection',
      title: 'Ürünler',
      type: 'homeProductsSection',
      description: 'Ana sayfadaki ürünler bölümünü etkiler.',
      group: 'sections',
    }),
    defineField({
      name: 'strengthsSection',
      title: 'Güçlü yönler',
      type: 'homeStrengthsSection',
      description: 'Ana sayfadaki güçlü yönler / avantajlar bölümünü etkiler.',
      group: 'sections',
    }),
    defineField({
      name: 'industriesSection',
      title: 'Sektörler',
      type: 'homeIndustriesSection',
      description: 'Ana sayfadaki sektörler / uygulama alanları bölümünü etkiler.',
      group: 'sections',
    }),
    defineField({
      name: 'privateLabelSection',
      title: 'Private label',
      type: 'homePrivateLabelSection',
      description: 'Ana sayfadaki private label (özel marka) bölümünü etkiler.',
      group: 'sections',
    }),
    defineField({
      name: 'aboutSection',
      title: 'Hakkımızda',
      type: 'homeAboutSection',
      description: 'Ana sayfadaki hakkımızda bölümünü etkiler.',
      group: 'sections',
    }),
    defineField({
      name: 'qualitySection',
      title: 'Kalite',
      type: 'homeQualitySection',
      description: 'Ana sayfadaki kalite / sertifika bölümünü etkiler.',
      group: 'sections',
    }),
    defineField({
      name: 'ctaSection',
      title: 'Alt eylem bandı',
      type: 'homeCtaSection',
      description: 'Ana sayfanın en altındaki “Teklif alın / İletişime geçin” bandını etkiler.',
      group: 'sections',
    }),
  ],
  preview: {
    select: {
      language: 'language',
      status: 'translationStatus',
      media: 'hero.desktopImage',
    },
    prepare({language, status, media}) {
      return {
        title: 'Ana sayfa',
        subtitle: [language?.toUpperCase(), status].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
