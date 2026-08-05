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
      titleTr: 'title',
      media: 'icon',
    },
    prepare({titleTr, media}) {
      const localized = Array.isArray(titleTr)
        ? titleTr.find((item: {language?: string; _key?: string; value?: string}) => item.language === 'tr' || item._key === 'tr')
            ?.value
        : undefined
      return {
        title: localized || 'Feature',
        media,
      }
    },
  },
})
