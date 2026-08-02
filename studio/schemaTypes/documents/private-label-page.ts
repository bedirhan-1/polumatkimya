import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {languageField, translationStatusField} from '../shared/localization-fields'

export const privateLabelPageType = defineType({
  name: 'privateLabelPage',
  title: 'Private label page',
  type: 'document',
  icon: TagIcon,
  fields: [
    languageField,
    translationStatusField,
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page builder',
      type: 'pageBuilder',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      language: 'language',
      status: 'translationStatus',
    },
    prepare({title, language, status}) {
      return {
        title: title || 'Private label',
        subtitle: [language?.toUpperCase(), status].filter(Boolean).join(' · '),
      }
    },
  },
})
