import {LaunchIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import {validateCallToActionValue} from '../../lib/cta-validation'

export const callToActionType = defineType({
  name: 'callToAction',
  title: 'Call to action',
  type: 'object',
  icon: LaunchIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'internalOrExternalLink',
    }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          {title: 'Primary', value: 'primary'},
          {title: 'Secondary', value: 'secondary'},
          {title: 'Ghost', value: 'ghost'},
        ],
        layout: 'radio',
      },
      initialValue: 'primary',
    }),
  ],
  validation: (rule) => rule.custom((value) => validateCallToActionValue(value)),
  preview: {
    select: {
      variant: 'variant',
      label: 'label',
      linkType: 'link.linkType',
      internalPath: 'link.internalPath',
      externalUrl: 'link.externalUrl',
    },
    prepare({variant, label, linkType, internalPath, externalUrl}) {
      const localized = Array.isArray(label)
        ? label.find(
            (item: {language?: string; _key?: string; value?: string}) =>
              item.language === 'tr' || item._key === 'tr',
          )?.value || label.find((item: {value?: string}) => item.value)?.value
        : undefined
      const target =
        linkType === 'external' ? externalUrl : linkType === 'internal' ? internalPath : linkType
      return {
        title: localized || 'Call to action',
        subtitle: [variant, target].filter(Boolean).join(' · '),
      }
    },
  },
})
