import {LaunchIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/** Plain CTA for document-level localized pages (one language per document). */
export const simpleCallToActionType = defineType({
  name: 'simpleCallToAction',
  title: 'Eylem düğmesi',
  type: 'object',
  icon: LaunchIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Etiket',
      type: 'string',
      description: 'Sitede düğme üzerinde görünen metin.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'linkType',
      title: 'Bağlantı türü',
      type: 'string',
      options: {
        list: [
          {title: 'Site içi yol', value: 'internal'},
          {title: 'Dış URL', value: 'external'},
        ],
        layout: 'radio',
      },
      initialValue: 'internal',
      validation: (rule) => rule.required(),
      description: 'Düğmenin site içi bir sayfaya mı yoksa dış adrese mi gideceği.',
    }),
    defineField({
      name: 'internalPath',
      title: 'Site içi yol',
      type: 'string',
      description: 'Dil önekinden sonraki yol, örn. /products',
      hidden: ({parent}) => parent?.linkType !== 'internal',
    }),
    defineField({
      name: 'externalUrl',
      title: 'Dış URL',
      type: 'url',
      description: 'Site dışına giden tam adres.',
      hidden: ({parent}) => parent?.linkType !== 'external',
      validation: (rule) =>
        rule.uri({
          scheme: ['http', 'https', 'mailto', 'tel'],
        }),
    }),
    defineField({
      name: 'variant',
      title: 'Görünüm',
      type: 'string',
      options: {
        list: [
          {title: 'Birincil (dolu)', value: 'primary'},
          {title: 'İkincil (çerçeveli)', value: 'secondary'},
          {title: 'Sade (yalnızca metin)', value: 'ghost'},
        ],
        layout: 'radio',
      },
      initialValue: 'primary',
      description: 'Düğmenin sitedeki stil varyantı (dolu, çerçeveli veya sade).',
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'variant',
    },
  },
})
