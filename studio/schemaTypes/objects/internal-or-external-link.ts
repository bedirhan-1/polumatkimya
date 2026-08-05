import {LinkIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import {validateLinkValue} from '../../lib/cta-validation'

export const internalOrExternalLinkType = defineType({
  name: 'internalOrExternalLink',
  title: 'Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'internationalizedArrayString',
      description: 'Optional when this link is nested inside a call to action.',
    }),
    defineField({
      name: 'linkType',
      title: 'Link type',
      type: 'string',
      options: {
        list: [
          {title: 'Internal path', value: 'internal'},
          {title: 'External URL', value: 'external'},
          {title: 'Document reference', value: 'reference'},
        ],
        layout: 'radio',
      },
      initialValue: 'internal',
    }),
    defineField({
      name: 'internalPath',
      title: 'Internal path',
      type: 'string',
      description: 'Path after locale prefix, e.g. /products or /about',
      hidden: ({parent}) => parent?.linkType !== 'internal',
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      hidden: ({parent}) => parent?.linkType !== 'external',
      validation: (rule) =>
        rule.uri({
          scheme: ['http', 'https', 'mailto', 'tel'],
        }),
    }),
    defineField({
      name: 'reference',
      title: 'Reference',
      type: 'reference',
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
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
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
        title: 'Link',
        subtitle: linkType === 'external' ? externalUrl : internalPath || linkType,
      }
    },
  },
})
