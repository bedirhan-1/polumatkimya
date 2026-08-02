import {EarthGlobeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {slugValidation} from '../../lib/slug'

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
      options: {maxLength: 96},
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
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'image',
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
      type: 'seo',
    }),
  ],
  preview: {
    select: {
      slug: 'slug.current',
      media: 'coverImage',
    },
    prepare({slug, media}) {
      return {
        title: slug || 'Application area',
        media,
      }
    },
  },
})
