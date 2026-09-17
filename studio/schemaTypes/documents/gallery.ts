import {ImagesIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const galleryImageItemType = defineType({
  name: 'galleryImageItem',
  title: 'Galeri görseli',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Görsel',
      type: 'imageWithAlt',
      description: 'Galeri sayfasında ve kurumsal vitrinde gösterilen fotoğraf.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Başlık (isteğe bağlı)',
      type: 'internationalizedArrayString',
      description: 'Varsa görselin altında kısa bir başlık olarak görünür.',
    }),
  ],
  preview: {
    select: {
      titleTr: 'title',
      media: 'image',
    },
    prepare({titleTr, media}) {
      const localized = Array.isArray(titleTr)
        ? titleTr.find(
            (item: {language?: string; _key?: string; value?: string}) =>
              item.language === 'tr' || item._key === 'tr',
          )?.value
        : undefined
      return {
        title: localized || 'Galeri görseli',
        media,
      }
    },
  },
})

export const galleryType = defineType({
  name: 'gallery',
  title: 'Galeri',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'images',
      title: 'Görseller',
      type: 'array',
      description:
        'Kurumsal galeri fotoğrafları. Sırayı değiştirmek için öğeleri sürükleyip bırakın. Site: /galeri ve kurumsal sayfa vitrini.',
      of: [defineArrayMember({type: 'galleryImageItem'})],
      options: {
        layout: 'grid',
      },
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Galeri'}
    },
  },
})
