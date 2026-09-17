import {ShareIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const socialLinkType = defineType({
  name: 'socialLink',
  title: 'Sosyal medya bağlantısı',
  type: 'object',
  icon: ShareIcon,
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        list: [
          {title: 'LinkedIn', value: 'linkedin'},
          {title: 'Instagram', value: 'instagram'},
          {title: 'YouTube', value: 'youtube'},
          {title: 'Facebook', value: 'facebook'},
          {title: 'X', value: 'x'},
        ],
      },
      validation: (rule) => rule.required(),
      description: 'Altbilgi veya iletişim alanındaki sosyal medya ikonunun platformu.',
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      description: 'Sosyal medya profilinin tam adresi; sitede ilgili ikona bağlanır.',
      validation: (rule) =>
        rule.required().uri({
          scheme: ['http', 'https'],
        }),
    }),
  ],
  preview: {
    select: {
      title: 'platform',
      subtitle: 'url',
    },
  },
})
