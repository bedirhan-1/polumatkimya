import {DocumentTextIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const latestContentSectionType = defineType({
  name: 'latestContentSection',
  title: 'Latest content',
  type: 'object',
  icon: DocumentTextIcon,
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
      name: 'source',
      title: 'Content source',
      type: 'string',
      options: {
        list: [
          {title: 'Blog posts', value: 'posts'},
          {title: 'Videos', value: 'videos'},
          {title: 'Both', value: 'both'},
        ],
        layout: 'radio',
      },
      initialValue: 'posts',
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Latest content'}
    },
  },
})
