import {BoltIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const heroSectionType = defineType({
  name: 'heroSection',
  title: 'Hero section',
  type: 'object',
  icon: BoltIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
    }),
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
      name: 'primaryCta',
      title: 'Primary CTA',
      type: 'simpleCallToAction',
    }),
    defineField({
      name: 'secondaryCta',
      title: 'Secondary CTA',
      type: 'simpleCallToAction',
    }),
    defineField({
      name: 'media',
      title: 'Media',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'trustItems',
      title: 'Trust indicators',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'trustItem',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {title: 'label'},
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Hero section'}
    },
  },
})
