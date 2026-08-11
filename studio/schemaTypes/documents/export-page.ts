import {EarthGlobeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const exportActivityType = defineType({
  name: 'exportActivity',
  title: 'Export activity',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayText',
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
      return {title: localized || 'Export activity'}
    },
  },
})

export const exportContactType = defineType({
  name: 'exportContact',
  title: 'Export contact',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      description: 'Displayed publicly and used as a click-to-call link.',
      validation: (rule) =>
        rule.required().custom((phone) => {
          if (!phone) return true
          return phone.replace(/\D/g, '').length >= 10 || 'Enter a valid phone number'
        }),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      description: 'Displayed publicly and used as a mailto link.',
      validation: (rule) => rule.required().email(),
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'email'},
  },
})

export const exportPageType = defineType({
  name: 'exportPage',
  title: 'Export page',
  type: 'document',
  icon: EarthGlobeIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'internationalizedArrayText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'countryCount',
      title: 'Export country count',
      type: 'string',
      description: 'Public value such as “50+”.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'countryLabel',
      title: 'Country count label',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'activityEyebrow',
      title: 'Activities eyebrow',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'activityTitle',
      title: 'Activities title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'activityDescription',
      title: 'Activities description',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'activities',
      title: 'Active export work',
      type: 'array',
      of: [defineArrayMember({type: 'exportActivity'})],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'contactEyebrow',
      title: 'Contacts eyebrow',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'contactTitle',
      title: 'Contacts title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'contactDescription',
      title: 'Contacts description',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'contacts',
      title: 'Export contacts',
      type: 'array',
      of: [defineArrayMember({type: 'exportContact'})],
      validation: (rule) => rule.length(2).error('Add exactly two export contacts'),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'localizedSeo',
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'countryCount'},
    prepare({title, subtitle}) {
      const localized = Array.isArray(title)
        ? title.find(
            (item: {language?: string; _key?: string; value?: string}) =>
              item.language === 'tr' || item._key === 'tr',
          )?.value
        : undefined
      return {
        title: localized || 'Export page',
        subtitle: subtitle ? `${subtitle} countries` : undefined,
      }
    },
  },
})
