import {PlayIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const videoType = defineType({
  name: 'video',
  title: 'Video',
  type: 'document',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'internationalizedArrayString',
      description: 'Video listelerinde ve video oynatıcının yanında görünen başlığı belirler.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'internationalizedArrayText',
      description: 'Video sayfasında veya listelerde görünen açıklama metnini belirler.',
    }),
    defineField({
      name: 'provider',
      title: 'Sağlayıcı',
      type: 'string',
      description: 'Videonun hangi platformdan oynatılacağını belirler.',
      options: {
        list: [
          {title: 'YouTube', value: 'youtube'},
          {title: 'Vimeo', value: 'vimeo'},
          {title: 'Mux', value: 'mux'},
          {title: 'Cloudflare Stream', value: 'cloudflare'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'externalUrl',
      title: 'Harici URL',
      type: 'url',
      description:
        'Sitede oynatılan YouTube/Vimeo linkini veya Cloudflare Stream iframe URL’sini belirler.',
      hidden: ({parent}) => parent?.provider === 'mux',
    }),
    defineField({
      name: 'playbackId',
      title: 'Oynatma kimliği',
      type: 'string',
      description:
        'Mux oynatma kimliğini veya Cloudflare Stream video UID’sini belirler (NEXT_PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE ile kullanılır).',
      hidden: ({parent}) => parent?.provider !== 'mux' && parent?.provider !== 'cloudflare',
    }),
    defineField({
      name: 'coverImage',
      title: 'Kapak görseli',
      type: 'imageWithAlt',
      description: 'Video oynatılmadan önce gösterilen kapak / önizleme görselini belirler.',
    }),
  ],
  preview: {
    select: {
      provider: 'provider',
      media: 'coverImage',
    },
    prepare({provider, media}) {
      return {
        title: 'Video',
        subtitle: provider,
        media,
      }
    },
  },
})
