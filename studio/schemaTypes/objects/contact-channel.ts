import {EnvelopeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const contactChannelType = defineType({
  name: 'contactChannel',
  title: 'İletişim kanalı',
  type: 'object',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'phone',
      title: 'Telefon',
      type: 'string',
      description: 'Sitede iletişim alanında gösterilen telefon numarası.',
    }),
    defineField({
      name: 'email',
      title: 'E-posta',
      type: 'string',
      description: 'Sitede iletişim alanında gösterilen e-posta adresi.',
      validation: (rule) => rule.email(),
    }),
  ],
  validation: (rule) =>
    rule.custom((value) => {
      if (!value?.phone && !value?.email) {
        return 'Telefon veya e-posta ekleyin'
      }
      return true
    }),
  preview: {
    select: {
      phone: 'phone',
      email: 'email',
    },
    prepare({phone, email}) {
      return {
        title: phone || email || 'İletişim kanalı',
        subtitle: phone && email ? email : undefined,
      }
    },
  },
})
