import {PackageIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const packagingVariantType = defineType({
  name: 'packagingVariant',
  title: 'Packaging variant',
  type: 'object',
  icon: PackageIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
    }),
    defineField({
      name: 'volume',
      title: 'Volume / size',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      sku: 'sku',
      volume: 'volume',
    },
    prepare({sku, volume}) {
      return {
        title: volume || sku || 'Packaging variant',
        subtitle: sku,
      }
    },
  },
})
