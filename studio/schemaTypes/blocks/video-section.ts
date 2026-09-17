import {PlayIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const videoSectionType = defineType({
  name: 'videoSection',
  title: 'Video bölümü',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Başlık',
      type: 'string',
      description: 'Sayfadaki video bölümünün başlığı.',
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
      rows: 3,
      description: 'Video bölümü başlığının altındaki kısa metin.',
    }),
    defineField({
      name: 'videos',
      title: 'Videolar',
      type: 'array',
      description: 'Bu bölümde oynatılacak veya listelenecek videolar.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'video'}]})],
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Video bölümü'}
    },
  },
})
