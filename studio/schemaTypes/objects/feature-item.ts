import {CheckmarkCircleIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const featureItemType = defineType({
  name: 'featureItem',
  title: 'Feature',
  type: 'object',
  icon: CheckmarkCircleIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'image',
      options: {hotspot: true},
    }),
  ],
  preview: {
    select: {
      media: 'icon',
    },
    prepare({media}) {
      return {
        title: 'Feature',
        media,
      }
    },
  },
})
