import {SearchIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const seoType = defineType({
  name: 'seo',
  title: 'Arama motoru (SEO)',
  type: 'object',
  icon: SearchIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Arama sonucu başlığı',
      type: 'string',
      description:
        'Google’da ve tarayıcı sekmesinde görünen başlık. Sayfanın kendi içeriğinde değil, arama sonuçlarında çıkar.',
      validation: (rule) => rule.max(70),
    }),
    defineField({
      name: 'description',
      title: 'Arama sonucu açıklaması',
      type: 'text',
      rows: 3,
      description:
        'Google sonuçlarında başlığın altında görünen kısa özet. Sayfanın kendi metninde görünmez.',
      validation: (rule) => rule.max(160),
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
