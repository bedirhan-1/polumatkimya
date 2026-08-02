import {EarthGlobeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const applicationGridSectionType = defineType({
  name: 'applicationGridSection',
  title: 'Application areas grid',
  type: 'object',
  icon: EarthGlobeIcon,
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
      name: 'applicationAreas',
      title: 'Application areas',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'applicationArea'}]})],
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Application areas grid'}
    },
  },
})
