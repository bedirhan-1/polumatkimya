import {DocumentPdfIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const documentReferenceType = defineType({
  name: 'documentReference',
  title: 'Document reference',
  type: 'object',
  icon: DocumentPdfIcon,
  fields: [
    defineField({
      name: 'document',
      title: 'Document',
      type: 'reference',
      to: [{type: 'downloadableDocument'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Override label',
      type: 'internationalizedArrayString',
    }),
  ],
  preview: {
    select: {
      title: 'document.title',
    },
    prepare({title}) {
      return {
        title: title || 'Document',
      }
    },
  },
})
