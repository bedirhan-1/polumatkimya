import {CheckmarkCircleIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const certificateType = defineType({
  name: 'certificate',
  title: 'Certificate',
  type: 'document',
  icon: CheckmarkCircleIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Certificate name',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'issuer',
      title: 'Issuing organization',
      type: 'string',
    }),
    defineField({
      name: 'certificateNumber',
      title: 'Certificate number',
      type: 'string',
    }),
    defineField({
      name: 'issuedAt',
      title: 'Issued at',
      type: 'date',
    }),
    defineField({
      name: 'expiresAt',
      title: 'Expires at',
      type: 'date',
    }),
    defineField({
      name: 'logo',
      title: 'Logo / image',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'file',
      title: 'Downloadable file',
      type: 'file',
      options: {
        accept: '.pdf',
      },
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort order',
      type: 'number',
      initialValue: 0,
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
      issuer: 'issuer',
      media: 'logo',
      number: 'certificateNumber',
    },
    prepare({issuer, media, number}) {
      return {
        title: issuer || 'Certificate',
        subtitle: number,
        media,
      }
    },
  },
})
