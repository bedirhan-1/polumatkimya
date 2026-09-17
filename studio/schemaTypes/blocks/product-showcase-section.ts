import {ThLargeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const productShowcaseSectionType = defineType({
  name: 'productShowcaseSection',
  title: 'Ürün vitrini',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Başlık',
      type: 'string',
      description: 'Sayfadaki ürün vitrini bölümünün başlığı.',
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
      rows: 3,
      description: 'Ürün vitrini başlığının altındaki kısa metin.',
    }),
    defineField({
      name: 'products',
      title: 'Ürünler',
      type: 'array',
      description: 'Bu bölümde kart olarak gösterilecek ürünler (en fazla 6).',
      of: [defineArrayMember({type: 'reference', to: [{type: 'product'}]})],
      validation: (rule) => rule.max(6),
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Ürün vitrini'}
    },
  },
})
