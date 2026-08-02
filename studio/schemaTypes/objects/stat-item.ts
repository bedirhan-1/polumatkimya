import {BoltIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const statItemType = defineType({
  name: 'statItem',
  title: 'Statistic',
  type: 'object',
  icon: BoltIcon,
  fields: [
    defineField({
      name: 'value',
      title: 'Value',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'value',
    },
  },
})
