import {EnvelopeIcon, PinIcon, MobileDeviceIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const contactLocationType = defineType({
  name: 'contactLocation',
  title: 'Contact location',
  type: 'object',
  icon: PinIcon,
  fields: [
    defineField({
      name: 'locationId',
      title: 'Location id',
      type: 'string',
      description: 'Stable id used by the frontend (e.g. factory, istanbul).',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'addressLine',
      title: 'Address line',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'city',
      title: 'City / district',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'postalCode',
      title: 'Postal code',
      type: 'string',
    }),
    defineField({
      name: 'mapEmbedUrl',
      title: 'Map embed URL',
      type: 'url',
      validation: (rule) =>
        rule.required().uri({
          allowRelative: false,
          scheme: ['https'],
        }),
    }),
    defineField({
      name: 'mapsUrl',
      title: 'Open in Maps URL',
      type: 'url',
      validation: (rule) =>
        rule.required().uri({
          allowRelative: false,
          scheme: ['https'],
        }),
    }),
    defineField({
      name: 'mapTitle',
      title: 'Map accessibility title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'locationId'},
    prepare({title, subtitle}) {
      const localized = Array.isArray(title)
        ? title.find(
            (item: {language?: string; _key?: string; value?: string}) =>
              item.language === 'tr' || item._key === 'tr',
          )?.value
        : undefined
      return {
        title: localized || 'Location',
        subtitle,
      }
    },
  },
})

export const contactPhoneType = defineType({
  name: 'contactPhone',
  title: 'Contact phone',
  type: 'object',
  icon: MobileDeviceIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      validation: (rule) =>
        rule.required().custom((phone) => {
          if (!phone) return true
          return phone.replace(/\D/g, '').length >= 10 || 'Enter a valid phone number'
        }),
    }),
  ],
  preview: {
    select: {title: 'phone', subtitle: 'label'},
    prepare({title, subtitle}) {
      const localized = Array.isArray(subtitle)
        ? subtitle.find(
            (item: {language?: string; _key?: string; value?: string}) =>
              item.language === 'tr' || item._key === 'tr',
          )?.value
        : undefined
      return {
        title: title || 'Phone',
        subtitle: localized,
      }
    },
  },
})

export const contactEmailType = defineType({
  name: 'contactEmail',
  title: 'Contact email',
  type: 'object',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule) => rule.required().email(),
    }),
  ],
  preview: {
    select: {title: 'email', subtitle: 'label'},
    prepare({title, subtitle}) {
      const localized = Array.isArray(subtitle)
        ? subtitle.find(
            (item: {language?: string; _key?: string; value?: string}) =>
              item.language === 'tr' || item._key === 'tr',
          )?.value
        : undefined
      return {
        title: title || 'Email',
        subtitle: localized,
      }
    },
  },
})

export const contactPageType = defineType({
  name: 'contactPage',
  title: 'Contact page',
  type: 'document',
  icon: EnvelopeIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'details', title: 'Contact details'},
    {name: 'form', title: 'Form'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'internationalizedArrayString',
      group: 'content',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'internationalizedArrayText',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'phonesSectionTitle',
      title: 'Phones section title',
      type: 'internationalizedArrayString',
      group: 'details',
    }),
    defineField({
      name: 'emailsSectionTitle',
      title: 'Emails section title',
      type: 'internationalizedArrayString',
      group: 'details',
    }),
    defineField({
      name: 'corporateSectionTitle',
      title: 'Corporate section title',
      type: 'internationalizedArrayString',
      group: 'details',
    }),
    defineField({
      name: 'corporatePhone',
      title: 'Corporate phone',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'corporateEmail',
      title: 'Corporate email',
      type: 'string',
      group: 'details',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'phones',
      title: 'Phone numbers',
      type: 'array',
      group: 'details',
      of: [defineArrayMember({type: 'contactPhone'})],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'emails',
      title: 'Email addresses',
      type: 'array',
      group: 'details',
      of: [defineArrayMember({type: 'contactEmail'})],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'locations',
      title: 'Locations',
      type: 'array',
      group: 'details',
      of: [defineArrayMember({type: 'contactLocation'})],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'formTitle',
      title: 'Form title',
      type: 'internationalizedArrayString',
      group: 'form',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'formDescription',
      title: 'Form description',
      type: 'internationalizedArrayText',
      group: 'form',
    }),
    defineField({
      name: 'openInMapsLabel',
      title: 'Open in Maps label',
      type: 'internationalizedArrayString',
      group: 'form',
    }),
    defineField({
      name: 'formSuccessMessage',
      title: 'Form success message',
      type: 'internationalizedArrayText',
      group: 'form',
    }),
    defineField({
      name: 'formErrorMessage',
      title: 'Form error message',
      type: 'internationalizedArrayText',
      group: 'form',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'localizedSeo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      const localized = Array.isArray(title)
        ? title.find(
            (item: {language?: string; _key?: string; value?: string}) =>
              item.language === 'tr' || item._key === 'tr',
          )?.value
        : undefined
      return {
        title: localized || 'Contact page',
      }
    },
  },
})
