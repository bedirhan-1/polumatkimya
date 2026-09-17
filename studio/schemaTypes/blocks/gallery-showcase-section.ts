import {ImagesIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const galleryShowcaseSectionType = defineType({
  name: 'galleryShowcaseSection',
  title: 'Galeri vitrini',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Başlık',
      type: 'string',
      description: 'Sayfadaki galeri vitrini bölümünün başlığı.',
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
      rows: 3,
      description: 'Galeri vitrini başlığının altındaki kısa metin.',
    }),
    defineField({
      name: 'limit',
      title: 'Gösterilecek görsel sayısı',
      type: 'number',
      initialValue: 6,
      description:
        'Galeri menüsündeki sıraya göre ilk kaç görselin bu sayfada gösterileceğini belirler. Sıra Galeri ekranında sürükle-bırak ile ayarlanır.',
      validation: (rule) => rule.min(1).max(12).integer(),
    }),
    defineField({
      name: 'showViewAll',
      title: 'Tam galeri bağlantısını göster',
      type: 'boolean',
      initialValue: true,
      description: 'Açıksa bölümde tüm galeri sayfasına giden bağlantı görünür.',
    }),
  ],
  preview: {
    select: {title: 'heading', limit: 'limit'},
    prepare({title, limit}) {
      return {
        title: title || 'Galeri vitrini',
        subtitle: limit ? `İlk ${limit} görsel` : 'Galeri sırasından',
      }
    },
  },
})
