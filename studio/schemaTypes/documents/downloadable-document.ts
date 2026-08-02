import {DocumentPdfIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const downloadableDocumentType = defineType({
  name: 'downloadableDocument',
  title: 'Downloadable document',
  type: 'document',
  icon: DocumentPdfIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'documentType',
      title: 'Document type',
      type: 'string',
      options: {
        list: [
          {title: 'SDS', value: 'sds'},
          {title: 'TDS', value: 'tds'},
          {title: 'Catalog', value: 'catalog'},
          {title: 'Certificate', value: 'certificate'},
          {title: 'User guide', value: 'userGuide'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'language',
      title: 'Document language',
      type: 'reference',
      to: [{type: 'locale'}],
    }),
    defineField({
      name: 'file',
      title: 'File',
      type: 'file',
      options: {
        accept: '.pdf',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'version',
      title: 'Version',
      type: 'string',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
    defineField({
      name: 'validUntil',
      title: 'Valid until',
      type: 'date',
    }),
    defineField({
      name: 'relatedProducts',
      title: 'Related products',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'product'}]})],
    }),
    defineField({
      name: 'legacySourceUrl',
      title: 'Legacy source URL',
      type: 'url',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'documentType',
    },
  },
})
