import {BoltIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/** Single-composition homepage hero (no slider). */
export const homeHeroType = defineType({
  name: 'homeHero',
  title: 'Ana sayfa üst tanıtım alanı',
  type: 'object',
  icon: BoltIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Üst etiket',
      type: 'string',
      description: 'Ana sayfanın en üstünde, büyük başlığın hemen üzerinde küçük satır olarak görünür.',
    }),
    defineField({
      name: 'headingLead',
      title: 'Başlık — ilk satır',
      type: 'string',
      description: 'Ana sayfanın en üstündeki büyük başlığın ilk satırı.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'headingAccent',
      title: 'Başlık — vurgu satırı',
      type: 'string',
      description: 'Ana sayfa büyük başlığının marka rengiyle vurgulanan orta satırı.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'headingTail',
      title: 'Başlık — son satır',
      type: 'string',
      description: 'Ana sayfanın en üstündeki büyük başlığın son satırı.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
      rows: 3,
      description: 'Ana sayfa büyük başlığının altında görünen kısa tanıtım metni.',
    }),
    defineField({
      name: 'desktopImage',
      title: 'Masaüstü görseli',
      type: 'imageWithAlt',
      description:
        'Ana sayfanın en üstündeki arka plan görseli (tam genişlik). Önerilen oran yaklaşık 21:9, örn. 2400×1024.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mobileImage',
      title: 'Mobil görsel',
      type: 'imageWithAlt',
      description: 'İsteğe bağlı. Telefon ekranlarında üst tanıtım için farklı görsel kullanılır.',
    }),
    defineField({
      name: 'primaryCta',
      title: 'Birincil düğme',
      type: 'simpleCallToAction',
      description: 'Ana sayfanın en üstündeki ana eylem düğmesi (örn. Ürünleri incele).',
    }),
    defineField({
      name: 'secondaryCta',
      title: 'İkincil düğme',
      type: 'simpleCallToAction',
      description: 'Ana sayfanın en üstündeki ikinci eylem düğmesi.',
    }),
    defineField({
      name: 'trustItems',
      title: 'Güven şeridi',
      type: 'array',
      description: 'Ana sayfanın en üstünde, düğmelerin altında görünen güven maddeleri (en fazla 4).',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'homeHeroTrustItem',
          fields: [
            defineField({
              name: 'title',
              title: 'Başlık',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Açıklama',
              type: 'string',
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'description'},
          },
        }),
      ],
      validation: (rule) => rule.max(4),
    }),
  ],
  preview: {
    select: {
      title: 'headingLead',
      accent: 'headingAccent',
      media: 'desktopImage',
    },
    prepare({title, accent, media}) {
      return {
        title: [title, accent].filter(Boolean).join(' ') || 'Ana sayfa üst tanıtım',
        media,
      }
    },
  },
})
