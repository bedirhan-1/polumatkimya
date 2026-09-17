import {DocumentPdfIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const downloadableDocumentType = defineType({
  name: 'downloadableDocument',
  title: 'İndirilebilir belge',
  type: 'document',
  icon: DocumentPdfIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'string',
      description: 'İndirme listelerinde ve ürün sayfasında görünen belge adını belirler.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'documentType',
      title: 'Belge türü',
      type: 'string',
      description: 'Belgenin türünü belirler; sitede filtreleme ve etiketleme için kullanılır.',
      options: {
        list: [
          {title: 'SDS', value: 'sds'},
          {title: 'TDS', value: 'tds'},
          {title: 'Katalog', value: 'catalog'},
          {title: 'Sertifika', value: 'certificate'},
          {title: 'Kullanım kılavuzu', value: 'userGuide'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'language',
      title: 'Belge dili',
      type: 'string',
      description:
        'PDF’in hangi dilde olduğunu belirtir. Katalog indirmede ziyaretçinin diline uygun dosya seçilir.',
      options: {
        list: [
          {title: 'Türkçe', value: 'tr'},
          {title: 'English', value: 'en'},
          {title: 'العربية', value: 'ar'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'file',
      title: 'Dosya',
      type: 'file',
      description: 'Siteden indirilecek PDF dosyasını belirler.',
      options: {
        accept: '.pdf',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'version',
      title: 'Sürüm',
      type: 'string',
      description: 'Belge sürüm numarasını belirler; indirme listesinde gösterilebilir.',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Yayın tarihi',
      type: 'datetime',
      description: 'Belgenin yayın / güncellenme tarihini belirler.',
    }),
    defineField({
      name: 'legacySourceUrl',
      title: 'Eski kaynak URL',
      type: 'url',
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'documentType',
    },
  },
})
