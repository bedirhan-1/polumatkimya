import {EarthGlobeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {slugValidation, isUniqueSlug} from '../../lib/slug'

export const applicationAreaType = defineType({
  name: 'applicationArea',
  title: 'Application area',
  type: 'document',
  icon: EarthGlobeIcon,
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
      options: {maxLength: 96, isUnique: isUniqueSlug},
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
      name: 'coverImage',
      title: 'Cover image',
      type: 'imageWithAlt',
      description: 'Homepage card photo and detail page hero.',
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'image',
      description:
        'Homepage card icon. Prefer a white/light monochrome SVG or PNG on transparent background.',
      options: {accept: 'image/svg+xml,image/png,image/webp'},
    }),
    defineField({
      name: 'benefits',
      title: 'Benefits',
      type: 'array',
      of: [defineArrayMember({type: 'featureItem'})],
    }),
    defineField({
      name: 'products',
      title: 'Recommended products',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'product'}]})],
    }),
    defineField({
      name: 'cta',
      title: 'CTA',
      type: 'callToAction',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'localizedSeo',
    }),
  ],
  preview: {
    select: {
      titleTr: 'title',
      slug: 'slug.current',
      media: 'coverImage',
    },
    prepare({titleTr, slug, media}) {
      const localized = Array.isArray(titleTr)
        ? titleTr.find((item: {language?: string; _key?: string; value?: string}) => item.language === 'tr' || item._key === 'tr')
            ?.value
        : undefined
      return {
        title: localized || slug || 'Application area',
        subtitle: slug,
        media,
      }
    },
  },
})
