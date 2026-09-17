import {ImageIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const imageTextSectionType = defineType({
  name: 'imageTextSection',
  title: 'Görsel ve metin',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Başlık',
      type: 'string',
      description: 'Sayfadaki görsel+metin bölümünün başlığı.',
    }),
    defineField({
      name: 'body',
      title: 'Gövde metni',
      type: 'portableText',
      description: 'Görselin yanında görünen zengin metin içeriği.',
    }),
    defineField({
      name: 'image',
      title: 'Görsel',
      type: 'imageWithAlt',
      description: 'Bu bölümde metnin yanında gösterilen görsel.',
    }),
    defineField({
      name: 'cta',
      title: 'Eylem düğmesi',
      type: 'simpleCallToAction',
      description: 'Görsel+metin bölümünün altındaki eylem düğmesi.',
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Görsel ve metin'}
    },
  },
})
