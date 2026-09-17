import {DocumentTextIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const latestContentSectionType = defineType({
  name: 'latestContentSection',
  title: 'Son içerikler',
  type: 'object',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Başlık',
      type: 'string',
      description: 'Sayfadaki son içerikler bölümünün başlığı.',
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
      rows: 3,
      description: 'Son içerikler başlığının altındaki kısa metin.',
    }),
    defineField({
      name: 'source',
      title: 'İçerik kaynağı',
      type: 'string',
      options: {
        list: [
          {title: 'Blog yazıları', value: 'posts'},
          {title: 'Videolar', value: 'videos'},
          {title: 'İkisi birden', value: 'both'},
        ],
        layout: 'radio',
      },
      initialValue: 'posts',
      description: 'Bu bölümde otomatik listelenecek içerik türü.',
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Son içerikler'}
    },
  },
})
