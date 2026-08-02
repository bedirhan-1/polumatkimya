import {ImageIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const imageTextSectionType = defineType({
  name: 'imageTextSection',
  title: 'Image and text',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'portableText',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'imageWithAlt',
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
      return {title: title || 'Image and text'}
    },
  },
})
