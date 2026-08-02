import {EnvelopeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {languageField, translationStatusField} from '../shared/localization-fields'

export const contactPageType = defineType({
  name: 'contactPage',
  title: 'Contact page',
  type: 'document',
  icon: EnvelopeIcon,
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
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 3,
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
    defineField({
      name: 'formSuccessMessage',
      title: 'Form success message',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'formErrorMessage',
      title: 'Form error message',
      type: 'text',
      rows: 2,
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
        title: title || 'Contact',
        subtitle: [language?.toUpperCase(), status].filter(Boolean).join(' · '),
      }
    },
  },
})
