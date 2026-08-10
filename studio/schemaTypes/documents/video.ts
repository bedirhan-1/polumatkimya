import {PlayIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const videoType = defineType({
  name: 'video',
  title: 'Video',
  type: 'document',
  icon: PlayIcon,
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
      name: 'provider',
      title: 'Provider',
      type: 'string',
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
      title: 'External URL',
      type: 'url',
      description:
        'YouTube/Vimeo link, or full Cloudflare Stream URL (e.g. https://customer-xxx.cloudflarestream.com/{uid}/iframe).',
      hidden: ({parent}) => parent?.provider === 'mux',
    }),
    defineField({
      name: 'playbackId',
      title: 'Playback ID',
      type: 'string',
      description:
        'Mux playback ID, or Cloudflare Stream video UID when using NEXT_PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE.',
      hidden: ({parent}) => parent?.provider !== 'mux' && parent?.provider !== 'cloudflare',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'relatedProducts',
      title: 'Related products',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'product'}]})],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
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
