import {CogIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'companyName',
      title: 'Company name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short description',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'logoLight',
      title: 'Logo (light backgrounds)',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'logoDark',
      title: 'Logo (dark backgrounds)',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
    }),
    defineField({
      name: 'defaultOgImage',
      title: 'Default Open Graph image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'siteUrl',
      title: 'Canonical site URL',
      type: 'url',
      validation: (rule) =>
        rule.uri({
          scheme: ['https'],
        }),
    }),
    defineField({
      name: 'defaultSeo',
      title: 'Default SEO',
      type: 'seo',
    }),
    defineField({
      name: 'headerNavigation',
      title: 'Header navigation',
      type: 'array',
      of: [defineArrayMember({type: 'internalOrExternalLink'})],
    }),
    defineField({
      name: 'footerColumns',
      title: 'Footer columns',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'footerColumn',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'links',
              title: 'Links',
              type: 'array',
              of: [defineArrayMember({type: 'internalOrExternalLink'})],
            }),
          ],
          preview: {
            prepare() {
              return {title: 'Footer column'}
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'quoteCta',
      title: 'Quote CTA',
      type: 'callToAction',
    }),
    defineField({
      name: 'contactChannels',
      title: 'Contact channels',
      type: 'array',
      of: [defineArrayMember({type: 'contactChannel'})],
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp number',
      type: 'string',
      description: 'International format without spaces, e.g. 905xxxxxxxxx',
    }),
    defineField({
      name: 'whatsappMessage',
      title: 'WhatsApp default message',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'mapUrl',
      title: 'Map URL',
      type: 'url',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      of: [defineArrayMember({type: 'socialLink'})],
    }),
    defineField({
      name: 'catalogs',
      title: 'PDF catalogs',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'downloadableDocument'}]})],
    }),
    defineField({
      name: 'workingHours',
      title: 'Working hours',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'footerLegalText',
      title: 'Footer legal text',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'uiLabels',
      title: 'UI labels',
      type: 'object',
      fields: [
        defineField({
          name: 'requestQuote',
          title: 'Request a quote',
          type: 'internationalizedArrayString',
        }),
        defineField({
          name: 'viewProducts',
          title: 'View products',
          type: 'internationalizedArrayString',
        }),
        defineField({
          name: 'readMore',
          title: 'Read more',
          type: 'internationalizedArrayString',
        }),
        defineField({
          name: 'download',
          title: 'Download',
          type: 'internationalizedArrayString',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'companyName',
    },
  },
})
