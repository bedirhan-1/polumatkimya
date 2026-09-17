import {SortIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Singleton (`productOrder`) — drag & drop the product list to control
 * catalog order on the website.
 */
export const productOrderType = defineType({
  name: 'productOrder',
  title: 'Ürün sırası',
  type: 'document',
  icon: SortIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'string',
      initialValue: 'Product order',
      hidden: true,
    }),
    defineField({
      name: 'products',
      title: 'Ürünler',
      description:
        'Katalogdaki ürün sırasını ayarlamak için öğeleri sürükleyin. Yeni ürünler buraya eklenene kadar sitenin sonunda görünür.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'product'}],
          options: {disableNew: true},
        }),
      ],
      validation: (rule) => rule.unique(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Ürün sırası',
        subtitle: 'Sürükle-bırak katalog sırası',
      }
    },
  },
})
