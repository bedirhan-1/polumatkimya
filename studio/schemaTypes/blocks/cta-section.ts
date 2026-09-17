import {LaunchIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const ctaSectionType = defineType({
  name: 'ctaSection',
  title: 'Alt eylem bandı',
  type: 'object',
  icon: LaunchIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Başlık',
      type: 'string',
      description: 'Sayfadaki alt eylem bandının ana başlığı (örn. “Teklif alın”).',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
      rows: 3,
      description: 'Alt eylem bandında başlığın altında görünen kısa metin.',
    }),
    defineField({
      name: 'cta',
      title: 'Eylem düğmesi',
      type: 'simpleCallToAction',
      description: 'Alt eylem bandındaki düğme (örn. İletişime geç).',
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Alt eylem bandı'}
    },
  },
})
