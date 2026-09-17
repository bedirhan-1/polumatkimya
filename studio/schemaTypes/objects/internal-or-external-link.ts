import {LinkIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import {validateLinkValue} from '../../lib/cta-validation'

export const internalOrExternalLinkType = defineType({
  name: 'internalOrExternalLink',
  title: 'Bağlantı',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Etiket',
      type: 'internationalizedArrayString',
      description:
        'Sitede görünen bağlantı metni. Eylem düğmesi içinde kullanıldığında isteğe bağlıdır.',
    }),
    defineField({
      name: 'linkType',
      title: 'Bağlantı türü',
      type: 'string',
      options: {
        list: [
          {title: 'Site içi yol', value: 'internal'},
          {title: 'Dış URL', value: 'external'},
          {title: 'Belge referansı', value: 'reference'},
        ],
        layout: 'radio',
      },
      initialValue: 'internal',
      description: 'Bağlantının site içi mi, dış URL mi yoksa bir içeriğe mi gideceği.',
    }),
    defineField({
      name: 'internalPath',
      title: 'Site içi yol',
      type: 'string',
      description: 'Dil önekinden sonraki yol, örn. /products veya /about',
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
      name: 'reference',
      title: 'Referans',
      type: 'reference',
      description: 'Bağlantının hedef ürünü, kategorisi, sayfası veya yazısı.',
      to: [
        {type: 'product'},
        {type: 'productCategory'},
        {type: 'applicationArea'},
        {type: 'page'},
        {type: 'post'},
      ],
      hidden: ({parent}) => parent?.linkType !== 'reference',
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Yeni sekmede aç',
      type: 'boolean',
      initialValue: false,
      description: 'Bağlantı tıklandığında yeni tarayıcı sekmesi açılır.',
    }),
  ],
  validation: (rule) => rule.custom((value) => validateLinkValue(value)),
  preview: {
    select: {
      linkType: 'linkType',
      internalPath: 'internalPath',
      externalUrl: 'externalUrl',
    },
    prepare({linkType, internalPath, externalUrl}) {
      return {
        title: 'Bağlantı',
        subtitle: linkType === 'external' ? externalUrl : internalPath || linkType,
      }
    },
  },
})
