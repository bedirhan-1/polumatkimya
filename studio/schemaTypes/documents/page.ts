import {DocumentIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {slugValidation, isUniqueSlugPerLanguage} from '../../lib/slug'
import {languageField, translationStatusField} from '../shared/localization-fields'

export const pageType = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
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
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description:
        'Shared English-character slug across language versions (TR/EN/AR of the same page keep the same slug).',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: isUniqueSlugPerLanguage,
      },
      validation: slugValidation,
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page builder',
      type: 'pageBuilder',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
    defineField({
      name: 'legacyUrls',
      title: 'Legacy URLs',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      readOnly: true,
    }),
    defineField({
      name: 'previousSlugs',
      title: 'Previous slugs',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      language: 'language',
      slug: 'slug.current',
      status: 'translationStatus',
    },
    prepare({title, language, slug, status}) {
      return {
        title: title || slug || 'Page',
        subtitle: [language?.toUpperCase(), slug, status].filter(Boolean).join(' · '),
      }
    },
  },
})
