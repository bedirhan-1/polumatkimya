import {LinkIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {hasLocalizedStringValue} from '../../lib/cta-validation'

type NavigationItemValue = {
  label?: unknown
  linkType?: string
  internalPath?: string
  externalUrl?: string
  reference?: {_ref?: string}
  children?: unknown[]
}

function validateNavigationItem(value: unknown): string | true {
  if (!value || typeof value !== 'object') return true
  const item = value as NavigationItemValue
  if (!hasLocalizedStringValue(item.label)) return 'Label is required'

  const hasChildren = Array.isArray(item.children) && item.children.length > 0
  if (hasChildren || item.linkType === 'none' || !item.linkType) {
    return true
  }

  if (item.linkType === 'internal' && !item.internalPath?.trim()) {
    return 'Internal path is required for internal links'
  }
  if (item.linkType === 'external' && !item.externalUrl) {
    return 'External URL is required for external links'
  }
  if (item.linkType === 'reference' && !item.reference?._ref) {
    return 'Document reference is required for reference links'
  }

  return true
}

export const navigationItemType = defineType({
  name: 'navigationItem',
  title: 'Navigation item',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'linkType',
      title: 'Link type',
      type: 'string',
      options: {
        list: [
          {title: 'Dropdown only (no link)', value: 'none'},
          {title: 'Internal path', value: 'internal'},
          {title: 'External URL', value: 'external'},
          {title: 'Document reference', value: 'reference'},
        ],
        layout: 'radio',
      },
      initialValue: 'internal',
      description: 'Parents with dropdown children can use “Dropdown only”.',
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
      hidden: ({parent}) => parent?.linkType === 'none' || !parent?.linkType,
    }),
    defineField({
      name: 'children',
      title: 'Dropdown links',
      description: 'Optional nested links. Parents with children do not need their own path.',
      type: 'array',
      of: [defineArrayMember({type: 'internalOrExternalLink'})],
    }),
  ],
  validation: (rule) => rule.custom((value) => validateNavigationItem(value)),
  preview: {
    select: {
      linkType: 'linkType',
      internalPath: 'internalPath',
      externalUrl: 'externalUrl',
      children: 'children',
    },
    prepare({linkType, internalPath, externalUrl, children}) {
      const childCount = Array.isArray(children) ? children.length : 0
      return {
        title: 'Navigation item',
        subtitle: [
          linkType === 'none'
            ? 'Dropdown only'
            : linkType === 'external'
              ? externalUrl
              : internalPath || linkType,
          childCount ? `${childCount} dropdown links` : null,
        ]
          .filter(Boolean)
          .join(' · '),
      }
    },
  },
})
