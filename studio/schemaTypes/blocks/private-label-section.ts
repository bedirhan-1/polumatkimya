import {TagIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const privateLabelSectionType = defineType({
  name: 'privateLabelSection',
  title: 'Private label section',
  type: 'object',
  icon: TagIcon,
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
      name: 'advantages',
      title: 'Advantages',
      type: 'array',
      of: [defineArrayMember({type: 'simpleFeatureItem'})],
    }),
    defineField({
      name: 'processSteps',
      title: 'Process steps',
      type: 'array',
      of: [defineArrayMember({type: 'simpleFeatureItem'})],
      validation: (rule) => rule.max(4),
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
      return {title: title || 'Private label section'}
    },
  },
})
