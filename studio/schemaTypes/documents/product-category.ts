import {TagIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {slugValidation, isUniqueSlug} from '../../lib/slug'

export const productCategoryType = defineType({
  name: 'productCategory',
  title: 'Product category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Shared English slug used across all locales',
      options: {
        maxLength: 96,
        isUnique: isUniqueSlug,
      },
      validation: slugValidation,
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'body',
      title: 'Detail',
      type: 'internationalizedArrayPortableText',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'image',
    }),
    defineField({
      name: 'themeAccent',
      title: 'Theme accent',
      type: 'string',
      options: {
        list: [
          {title: 'Default', value: 'default'},
          {title: 'Red', value: 'red'},
          {title: 'Neutral', value: 'neutral'},
        ],
      },
      initialValue: 'default',
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort order',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'localizedSeo',
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
  ],
  orderings: [
    {
      title: 'Sort order',
      name: 'sortOrderAsc',
      by: [{field: 'sortOrder', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      titleTr: 'title',
      slug: 'slug.current',
      media: 'image',
    },
    prepare({titleTr, slug, media}) {
      const localized = Array.isArray(titleTr)
        ? titleTr.find((item: {language?: string; _key?: string; value?: string}) => item.language === 'tr' || item._key === 'tr')
            ?.value
        : undefined
      return {
        title: localized || slug || 'Category',
        subtitle: slug,
        media,
      }
    },
  },
})
