import {ImageIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const localizedImageWithAltType = defineType({
  name: 'localizedImageWithAlt',
  title: 'Localized image',
  type: 'image',
  icon: ImageIcon,
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alternative text',
      type: 'internationalizedArrayString',
      description: 'Localized alt text for accessibility and SEO.',
    }),
  ],
})
