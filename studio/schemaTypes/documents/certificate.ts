import {CheckmarkCircleIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const certificateType = defineType({
  name: 'certificate',
  title: 'Sertifika',
  type: 'document',
  icon: CheckmarkCircleIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Sertifika adı',
      type: 'internationalizedArrayString',
      description: 'Sertifika listelerinde ve kalite bölümünde görünen adı belirler.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'issuer',
      title: 'Veren kuruluş',
      type: 'string',
      description: 'Sertifikayı veren kurumun adını belirler; sitede sertifika kartında gösterilebilir.',
    }),
    defineField({
      name: 'certificateNumber',
      title: 'Sertifika numarası',
      type: 'string',
      description: 'Sertifika numarasını belirler; sitede detay bilgisi olarak gösterilebilir.',
    }),
    defineField({
      name: 'logo',
      title: 'Logo / görsel',
      type: 'imageWithAlt',
      description: 'Sertifika kartında veya kalite bölümünde görünen logo / görseli belirler.',
    }),
    defineField({
      name: 'file',
      title: 'İndirilebilir dosya',
      type: 'file',
      description: 'Siteden indirilebilen sertifika PDF’ini belirler.',
      options: {
        accept: '.pdf',
      },
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sıralama',
      type: 'number',
      description: 'Sertifikaların listede görünme sırasını belirler; düşük sayılar önce gelir.',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Sıralama',
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
        title: issuer || 'Sertifika',
        subtitle: number,
        media,
      }
    },
  },
})
