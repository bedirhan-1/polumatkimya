import {DocumentTextIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {slugValidation, isUniqueSlugPerLanguage} from '../../lib/slug'
import {languageField, translationStatusField} from '../shared/localization-fields'

export const postType = defineType({
  name: 'post',
  title: 'Blog post',
  type: 'document',
  icon: DocumentTextIcon,
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
        'Shared English-character slug across language versions (TR/EN/AR of the same post keep the same slug).',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: isUniqueSlugPerLanguage,
      },
      validation: slugValidation,
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'portableText',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
    }),
    defineField({
      name: 'relatedProducts',
      title: 'Related products',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'product'}]})],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
    defineField({
      name: 'legacyId',
      title: 'Legacy ID',
      type: 'string',
      readOnly: true,
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
      media: 'coverImage',
      status: 'translationStatus',
    },
    prepare({title, language, media, status}) {
      return {
        title: title || 'Post',
        subtitle: [language?.toUpperCase(), status].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
