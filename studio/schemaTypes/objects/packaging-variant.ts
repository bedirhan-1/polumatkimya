import {PackageIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const packagingVariantType = defineType({
  name: 'packagingVariant',
  title: 'Ambalaj varyantı',
  type: 'object',
  icon: PackageIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Etiket',
      type: 'internationalizedArrayString',
      description: 'Ürün sayfasında ambalaj seçeneği olarak görünen ad.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
      description: 'Ürün / ambalaj stok kodu; sitede veya sipariş süreçlerinde referans için.',
    }),
    defineField({
      name: 'volume',
      title: 'Hacim / boyut',
      type: 'string',
      description: 'Ürün sayfasında ambalaj boyutu olarak görünen değer (örn. 20 L, 1 kg).',
    }),
  ],
  preview: {
    select: {
      sku: 'sku',
      volume: 'volume',
    },
    prepare({sku, volume}) {
      return {
        title: volume || sku || 'Ambalaj varyantı',
        subtitle: sku,
      }
    },
  },
})
