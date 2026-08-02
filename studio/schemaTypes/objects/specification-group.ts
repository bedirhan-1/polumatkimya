import {ComposeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const specificationItemType = defineType({
  name: 'specificationItem',
  title: 'Specification item',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'value',
      title: 'Value',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'unit',
      title: 'Unit',
      type: 'string',
    }),
    defineField({
      name: 'note',
      title: 'Note',
      type: 'internationalizedArrayString',
    }),
  ],
  preview: {
    select: {
      value: 'value',
      unit: 'unit',
    },
    prepare({value, unit}) {
      return {
        title: unit ? `${value} ${unit}` : value,
      }
    },
  },
})

export const specificationGroupType = defineType({
  name: 'specificationGroup',
  title: 'Specification group',
  type: 'object',
  icon: ComposeIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [defineArrayMember({type: 'specificationItem'})],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Specification group'}
    },
  },
})
