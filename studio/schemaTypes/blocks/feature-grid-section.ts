import {ComposeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const featureGridSectionType = defineType({
  name: 'featureGridSection',
  title: 'Özellik ızgarası',
  type: 'object',
  icon: ComposeIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Başlık',
      type: 'string',
      description: 'Sayfadaki özellik ızgarası bölümünün başlığı.',
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
      rows: 3,
      description: 'Özellik ızgarası başlığının altındaki kısa metin.',
    }),
    defineField({
      name: 'features',
      title: 'Özellikler',
      type: 'array',
      description: 'Bu bölümde ızgara halinde listelenen özellik kartları.',
      of: [defineArrayMember({type: 'simpleFeatureItem'})],
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Özellik ızgarası'}
    },
  },
})
