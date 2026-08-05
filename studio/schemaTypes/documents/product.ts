import {CubeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {slugValidation, isUniqueSlug} from '../../lib/slug'

export const productType = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: CubeIcon,
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
      name: 'sku',
      title: 'SKU',
      type: 'string',
    }),
    defineField({
      name: 'status',
      title: 'Publishing status',
      type: 'string',
      options: {
        list: [
          {title: 'Draft', value: 'draft'},
          {title: 'Published', value: 'published'},
          {title: 'Archived', value: 'archived'},
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort order',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short description',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'body',
      title: 'Detail',
      type: 'internationalizedArrayPortableText',
    }),
    defineField({
      name: 'primaryCategory',
      title: 'Primary category',
      type: 'reference',
      to: [{type: 'productCategory'}],
    }),
    defineField({
      name: 'categories',
      title: 'Additional categories',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'productCategory'}]})],
    }),
    defineField({
      name: 'applicationAreas',
      title: 'Application areas',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'applicationArea'}]})],
    }),
    defineField({
      name: 'cardImage',
      title: 'Card image',
      type: 'localizedImageWithAlt',
    }),
    defineField({
      name: 'packshot',
      title: 'Main packshot',
      type: 'localizedImageWithAlt',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [defineArrayMember({type: 'localizedImageWithAlt'})],
    }),
    defineField({
      name: 'badge',
      title: 'Badge',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'featured',
      title: 'Featured product',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'benefits',
      title: 'Benefits',
      type: 'array',
      of: [defineArrayMember({type: 'featureItem'})],
    }),
    defineField({
      name: 'features',
      title: 'Product features',
      type: 'array',
      of: [defineArrayMember({type: 'featureItem'})],
    }),
    defineField({
      name: 'usageAreas',
      title: 'Usage areas',
      type: 'internationalizedArrayPortableText',
    }),
    defineField({
      name: 'applicationInstructions',
      title: 'Application instructions',
      type: 'internationalizedArrayPortableText',
    }),
    defineField({
      name: 'warnings',
      title: 'Warnings',
      type: 'internationalizedArrayPortableText',
    }),
    defineField({
      name: 'packagingVariants',
      title: 'Packaging variants',
      type: 'array',
      of: [defineArrayMember({type: 'packagingVariant'})],
    }),
    defineField({
      name: 'specificationGroups',
      title: 'Specification groups',
      type: 'array',
      of: [defineArrayMember({type: 'specificationGroup'})],
    }),
    defineField({
      name: 'relatedProducts',
      title: 'Related products',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'product'}]})],
    }),
    defineField({
      name: 'externalVideoUrl',
      title: 'External application video URL',
      type: 'url',
    }),
    defineField({
      name: 'documents',
      title: 'SDS / TDS / catalog documents',
      type: 'array',
      of: [defineArrayMember({type: 'documentReference'})],
    }),
    defineField({
      name: 'productCta',
      title: 'Product CTA',
      type: 'callToAction',
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
    defineField({
      name: 'previousSlugs',
      title: 'Previous slugs',
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
      sku: 'sku',
      media: 'packshot',
      status: 'status',
    },
    prepare({titleTr, slug, sku, media, status}) {
      const localized = Array.isArray(titleTr)
        ? titleTr.find((item: {_key?: string; language?: string; value?: string}) => item.language === 'tr' || item._key === 'tr')
            ?.value
        : undefined
      return {
        title: localized || slug || sku || 'Product',
        subtitle: [slug, sku, status].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
