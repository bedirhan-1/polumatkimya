import {EnvelopeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const contactChannelType = defineType({
  name: 'contactChannel',
  title: 'Contact channel',
  type: 'object',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'department',
      title: 'Department',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule) => rule.email(),
    }),
  ],
  preview: {
    select: {
      phone: 'phone',
      email: 'email',
    },
    prepare({phone, email}) {
      return {
        title: 'Contact channel',
        subtitle: phone || email,
      }
    },
  },
})
