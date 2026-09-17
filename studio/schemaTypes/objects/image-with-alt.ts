import {ImageIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const imageWithAltType = defineType({
  name: 'imageWithAlt',
  title: 'Görsel',
  type: 'image',
  icon: ImageIcon,
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alternatif metin',
      type: 'string',
      description:
        'Görseli ekran okuyucular ve SEO için tanımlar. Sitede görselin yanında yazı olarak görünmez; yalnızca erişilebilirlik ve arama için kullanılır. Dekoratif görsellerde boş bırakılabilir.',
      validation: (rule) =>
        rule.custom((alt, context) => {
          const parent = context.parent as {asset?: {_ref?: string}} | undefined
          if (parent?.asset?._ref && !alt) {
            return 'İçerik görselleri için alternatif metin şiddetle önerilir'
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
        title: alt || 'Görsel',
        media,
      }
    },
  },
})
