import {SearchIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Field-level SEO for shared-slug documents (product, category, industry).
 * Document-level pages keep the plain `seo` object (one language per document).
 */
export const localizedSeoType = defineType({
  name: 'localizedSeo',
  title: 'Localized SEO',
  type: 'object',
  icon: SearchIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Meta title',
      type: 'internationalizedArrayString',
      validation: (rule) =>
        rule.custom((value) => {
          if (!Array.isArray(value)) return true
          for (const item of value) {
            const text = (item as {value?: string} | undefined)?.value
            if (text && text.length > 70) return 'Each locale meta title must be ≤ 70 characters'
          }
          return true
        }),
    }),
    defineField({
      name: 'description',
      title: 'Meta description',
      type: 'internationalizedArrayText',
      validation: (rule) =>
        rule.custom((value) => {
          if (!Array.isArray(value)) return true
          for (const item of value) {
            const text = (item as {value?: string} | undefined)?.value
            if (text && text.length > 160) {
              return 'Each locale meta description must be ≤ 160 characters'
            }
          }
          return true
        }),
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
