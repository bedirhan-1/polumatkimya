import {CheckmarkCircleIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const certificateSectionType = defineType({
  name: 'certificateSection',
  title: 'Sertifikalar bölümü',
  type: 'object',
  icon: CheckmarkCircleIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Başlık',
      type: 'string',
      description: 'Sayfadaki sertifikalar bölümünün başlığı.',
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
      rows: 3,
      description: 'Sertifikalar başlığının altındaki kısa metin.',
    }),
    defineField({
      name: 'certificates',
      title: 'Sertifikalar',
      type: 'array',
      description: 'Bu bölümde listelenen veya rozet olarak gösterilen sertifikalar.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'certificate'}]})],
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Sertifikalar bölümü'}
    },
  },
})
