import {BoltIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const statsSectionType = defineType({
  name: 'statsSection',
  title: 'İstatistik bölümü',
  type: 'object',
  icon: BoltIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Başlık',
      type: 'string',
      description: 'Sayfadaki istatistik bölümünün başlığı.',
    }),
    defineField({
      name: 'stats',
      title: 'İstatistikler',
      type: 'array',
      description: 'Bu bölümde sayı ve etiket olarak gösterilen maddeler.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'simpleStatItem',
          fields: [
            defineField({
              name: 'value',
              title: 'Değer',
              type: 'string',
              description: 'Sitede büyük yazıyla görünen sayı veya değer.',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Etiket',
              type: 'string',
              description: 'Değerin altında görünen açıklama metni.',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'value',
              subtitle: 'label',
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'İstatistik bölümü'}
    },
  },
})
