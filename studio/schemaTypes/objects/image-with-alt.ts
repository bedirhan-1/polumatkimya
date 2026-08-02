import {ImageIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const imageWithAltType = defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'image',
  icon: ImageIcon,
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alternative text',
      type: 'string',
      description: 'Describe the image for accessibility and SEO. Leave empty only for decorative images.',
      validation: (rule) =>
        rule.custom((alt, context) => {
          const parent = context.parent as {asset?: {_ref?: string}} | undefined
          if (parent?.asset?._ref && !alt) {
            return 'Alt text is strongly recommended for content images'
          }
          return true
        }).warning(),
    }),
  ],
  preview: {
    select: {
      alt: 'alt',
      media: 'asset',
    },
    prepare({alt, media}) {
      return {
        title: alt || 'Image',
        media,
      }
    },
  },
})
