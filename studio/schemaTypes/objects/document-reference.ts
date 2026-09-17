import {DocumentPdfIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const documentReferenceType = defineType({
  name: 'documentReference',
  title: 'Belge referansı',
  type: 'object',
  icon: DocumentPdfIcon,
  fields: [
    defineField({
      name: 'document',
      title: 'Belge',
      type: 'reference',
      to: [{type: 'downloadableDocument'}],
      validation: (rule) => rule.required(),
      description: 'Ürün veya sayfada indirilebilir olarak sunulan belge (PDF vb.).',
    }),
    defineField({
      name: 'label',
      title: 'Özel etiket',
      type: 'internationalizedArrayString',
      description:
        'İsteğe bağlı. Sitede indirme bağlantısının metni; boşsa belgenin kendi başlığı kullanılır.',
    }),
  ],
  preview: {
    select: {
      title: 'document.title',
    },
    prepare({title}) {
      return {
        title: title || 'Belge',
      }
    },
  },
})
