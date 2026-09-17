import {CheckmarkCircleIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/** Plain feature item for document-level localized page builder blocks. */
export const simpleFeatureItemType = defineType({
  name: 'simpleFeatureItem',
  title: 'Özellik',
  type: 'object',
  icon: CheckmarkCircleIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'string',
      description: 'Sayfa oluşturucudaki özellik ızgarasında görünen madde başlığı.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
      rows: 3,
      description: 'Özellik başlığının altında görünen kısa açıklama.',
    }),
    defineField({
      name: 'icon',
      title: 'İkon',
      type: 'image',
      options: {hotspot: true},
      description: 'Özellik maddesinin yanında görünen ikon görseli.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'icon',
    },
  },
})
