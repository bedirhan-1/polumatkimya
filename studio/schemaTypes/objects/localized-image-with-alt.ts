import {ImageIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const localizedImageWithAltType = defineType({
  name: 'localizedImageWithAlt',
  title: 'Çok dilli görsel',
  type: 'image',
  icon: ImageIcon,
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alternatif metin',
      type: 'internationalizedArrayString',
      description:
        'Dile göre alternatif metin. Sitede yazı olarak görünmez; erişilebilirlik ve SEO için kullanılır.',
    }),
  ],
})
