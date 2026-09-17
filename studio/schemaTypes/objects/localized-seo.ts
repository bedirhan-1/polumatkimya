import {SearchIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Field-level SEO for shared-slug documents (product, category, industry).
 * Document-level pages keep the plain `seo` object (one language per document).
 */
export const localizedSeoType = defineType({
  name: 'localizedSeo',
  title: 'Arama motoru (SEO)',
  type: 'object',
  icon: SearchIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Arama sonucu başlığı',
      type: 'internationalizedArrayString',
      description:
        'Google’da ve tarayıcı sekmesinde görünen başlık (dile göre). Sayfanın kendi içeriğinde değil, arama sonuçlarında çıkar.',
      validation: (rule) =>
        rule.custom((value) => {
          if (!Array.isArray(value)) return true
          for (const item of value) {
            const text = (item as {value?: string} | undefined)?.value
            if (text && text.length > 70) return 'Her dil için arama sonucu başlığı en fazla 70 karakter olmalı'
          }
          return true
        }),
    }),
    defineField({
      name: 'description',
      title: 'Arama sonucu açıklaması',
      type: 'internationalizedArrayText',
      description:
        'Google sonuçlarında başlığın altında görünen kısa özet (dile göre). Sayfanın kendi metninde görünmez.',
      validation: (rule) =>
        rule.custom((value) => {
          if (!Array.isArray(value)) return true
          for (const item of value) {
            const text = (item as {value?: string} | undefined)?.value
            if (text && text.length > 160) {
              return 'Her dil için arama sonucu açıklaması en fazla 160 karakter olmalı'
            }
          }
          return true
        }),
    }),
    defineField({
      name: 'ogImage',
      title: 'Paylaşım görseli',
      type: 'image',
      options: {hotspot: true},
      description:
        'Sayfa WhatsApp, LinkedIn veya sosyal medyada paylaşıldığında görünen önizleme görseli.',
    }),
    defineField({
      name: 'noIndex',
      title: 'Arama motorlarından gizle',
      type: 'boolean',
      initialValue: false,
      description: 'Açıksa bu sayfa Google gibi arama motorlarında listelenmez.',
    }),
  ],
})
