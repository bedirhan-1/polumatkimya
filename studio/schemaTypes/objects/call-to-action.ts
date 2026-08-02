import {LaunchIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

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
      validation: (rule) => rule.required(),
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
  preview: {
    select: {
      variant: 'variant',
    },
    prepare({variant}) {
      return {
        title: 'Call to action',
        subtitle: variant,
      }
    },
  },
})
