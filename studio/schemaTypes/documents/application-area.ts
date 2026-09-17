import {EarthGlobeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {slugValidation, isUniqueSlug} from '../../lib/slug'

export const applicationAreaType = defineType({
  name: 'applicationArea',
  title: 'Uygulama alanı',
  type: 'document',
  icon: EarthGlobeIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'internationalizedArrayString',
      description: 'Uygulama alanı sayfası ve kartlarında görünen başlığı belirler.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Sayfa adresi (slug)',
      type: 'slug',
      description: 'Uygulama alanı sayfasının web adresi. Tüm dillerde ortak kullanılır (örn. /tr/industries/furniture).',
      options: {maxLength: 96, isUnique: isUniqueSlug},
      validation: slugValidation,
    }),
    defineField({
      name: 'summary',
      title: 'Özet',
      type: 'internationalizedArrayText',
      description: 'Ana sayfa ve liste kartlarında görünen kısa özeti belirler.',
    }),
    defineField({
      name: 'body',
      title: 'Detay',
      type: 'internationalizedArrayPortableText',
      description: 'Uygulama alanı detay sayfasındaki uzun açıklama metnini belirler.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Kapak görseli',
      type: 'imageWithAlt',
      description: 'Ana sayfadaki kart fotoğrafını ve detay sayfasının üst görselini belirler.',
    }),
    defineField({
      name: 'icon',
      title: 'İkon',
      type: 'image',
      description:
        'Ana sayfadaki kart ikonunu belirler. Tercihen şeffaf zeminde beyaz/açık renkli SVG veya PNG kullanın.',
      options: {accept: 'image/svg+xml,image/png,image/webp'},
    }),
    defineField({
      name: 'benefits',
      title: 'Faydalar',
      type: 'array',
      description: 'Uygulama alanı detay sayfasındaki faydalar listesini belirler.',
      of: [defineArrayMember({type: 'featureItem'})],
    }),
    defineField({
      name: 'products',
      title: 'Önerilen ürünler',
      type: 'array',
      description: 'Uygulama alanı sayfasında listelenen önerilen ürünleri belirler.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'product'}]})],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'localizedSeo',
      description: 'Uygulama alanı sayfasının arama motoru başlığı, açıklaması ve paylaşım görselini belirler.',
    }),
  ],
  preview: {
    select: {
      titleTr: 'title',
      slug: 'slug.current',
      media: 'coverImage',
    },
    prepare({titleTr, slug, media}) {
      const localized = Array.isArray(titleTr)
        ? titleTr.find((item: {language?: string; _key?: string; value?: string}) => item.language === 'tr' || item._key === 'tr')
            ?.value
        : undefined
      return {
        title: localized || slug || 'Uygulama alanı',
        subtitle: slug,
        media,
      }
    },
  },
})
