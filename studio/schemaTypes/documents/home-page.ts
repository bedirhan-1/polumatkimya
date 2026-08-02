import {HomeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {languageField, translationStatusField} from '../shared/localization-fields'

export const homePageType = defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  icon: HomeIcon,
  fields: [
    languageField,
    translationStatusField,
    defineField({
      name: 'title',
      title: 'Internal title',
      type: 'string',
      initialValue: 'Home',
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
      language: 'language',
      status: 'translationStatus',
    },
    prepare({language, status}) {
      return {
        title: 'Home page',
        subtitle: [language?.toUpperCase(), status].filter(Boolean).join(' · '),
      }
    },
  },
})
