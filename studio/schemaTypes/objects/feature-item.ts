import {CheckmarkCircleIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const featureItemType = defineType({
  name: 'featureItem',
  title: 'Özellik',
  type: 'object',
  icon: CheckmarkCircleIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'internationalizedArrayString',
      description: 'Özellik listelerinde veya ızgaralarda görünen madde başlığı.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'internationalizedArrayText',
      description: 'Özellik başlığının altında görünen kısa açıklama.',
    }),
  ],
  preview: {
    select: {
      titleTr: 'title',
    },
    prepare({titleTr}) {
      const localized = Array.isArray(titleTr)
        ? titleTr.find((item: {language?: string; _key?: string; value?: string}) => item.language === 'tr' || item._key === 'tr')
            ?.value
        : undefined
      return {
        title: localized || 'Özellik',
      }
    },
  },
})
