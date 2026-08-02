import {LaunchIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const ctaSectionType = defineType({
  name: 'ctaSection',
  title: 'CTA section',
  type: 'object',
  icon: LaunchIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'cta',
      title: 'CTA',
      type: 'simpleCallToAction',
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'CTA section'}
    },
  },
})
