import {ComposeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const featureGridSectionType = defineType({
  name: 'featureGridSection',
  title: 'Feature grid',
  type: 'object',
  icon: ComposeIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [defineArrayMember({type: 'simpleFeatureItem'})],
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Feature grid'}
    },
  },
})
