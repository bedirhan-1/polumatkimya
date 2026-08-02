import {CheckmarkCircleIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const certificateSectionType = defineType({
  name: 'certificateSection',
  title: 'Certificates section',
  type: 'object',
  icon: CheckmarkCircleIcon,
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
      name: 'certificates',
      title: 'Certificates',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'certificate'}]})],
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Certificates section'}
    },
  },
})
