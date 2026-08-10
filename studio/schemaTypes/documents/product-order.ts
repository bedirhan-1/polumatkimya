import {SortIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Singleton (`productOrder`) — drag & drop the product list to control
 * catalog order on the website.
 */
export const productOrderType = defineType({
  name: 'productOrder',
  title: 'Product order',
  type: 'document',
  icon: SortIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Product order',
      hidden: true,
    }),
    defineField({
      name: 'products',
      title: 'Products',
      description:
        'Drag items to set the catalog order. New products appear at the end of the site until you add them here.',
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
        title: 'Product order',
        subtitle: 'Drag & drop catalog sequence',
      }
    },
  },
})
