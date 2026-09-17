import {BoltIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const heroSectionType = defineType({
  name: 'heroSection',
  title: 'Üst tanıtım bölümü',
  type: 'object',
  icon: BoltIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Üst etiket',
      type: 'string',
      description: 'Sayfanın en üstünde, büyük başlığın hemen üzerinde küçük satır olarak görünür.',
    }),
    defineField({
      name: 'heading',
      title: 'Başlık',
      type: 'string',
      description: 'Sayfanın en üstündeki ana başlık.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
      rows: 3,
      description: 'Sayfanın en üstünde, başlığın altında görünen kısa metin.',
    }),
    defineField({
      name: 'primaryCta',
      title: 'Birincil düğme',
      type: 'simpleCallToAction',
      description: 'Sayfanın en üstündeki ana eylem düğmesi.',
    }),
    defineField({
      name: 'secondaryCta',
      title: 'İkincil düğme',
      type: 'simpleCallToAction',
      description: 'Sayfanın en üstündeki ikinci eylem düğmesi.',
    }),
    defineField({
      name: 'media',
      title: 'Görsel',
      type: 'imageWithAlt',
      description: 'Sayfanın en üstünde görünen ana görsel.',
    }),
    defineField({
      name: 'trustItems',
      title: 'Güven göstergeleri',
      type: 'array',
      description: 'Sayfanın en üstünde listelenen kısa güven maddeleri (örn. “ISO belgeli”).',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'trustItem',
          fields: [
            defineField({
              name: 'label',
              title: 'Etiket',
              type: 'string',
              description: 'Güven maddesinde görünen kısa metin.',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {title: 'label'},
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Üst tanıtım bölümü'}
    },
  },
})
