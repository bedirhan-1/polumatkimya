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
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'unit',
      title: 'Unit',
      type: 'internationalizedArrayString',
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
      const pick = (field: unknown) => {
        if (typeof field === 'string') return field
        if (!Array.isArray(field)) return ''
        const preferred =
          field.find((entry) => entry?.language === 'tr' || entry?._key === 'tr') ||
          field.find((entry) => entry?.language === 'en' || entry?._key === 'en') ||
          field[0]
        return typeof preferred?.value === 'string' ? preferred.value : ''
      }
      const valueText = pick(value)
      const unitText = pick(unit)
      return {
        title: unitText ? `${valueText} ${unitText}` : valueText || 'Specification',
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
