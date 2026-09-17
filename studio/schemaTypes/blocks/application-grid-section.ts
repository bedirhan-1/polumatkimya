import {EarthGlobeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const applicationGridSectionType = defineType({
  name: 'applicationGridSection',
  title: 'Uygulama alanları ızgarası',
  type: 'object',
  icon: EarthGlobeIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Başlık',
      type: 'string',
      description: 'Sayfadaki uygulama alanları bölümünün başlığı.',
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
      rows: 3,
      description: 'Uygulama alanları başlığının altındaki kısa metin.',
    }),
    defineField({
      name: 'applicationAreas',
      title: 'Uygulama alanları',
      type: 'array',
      description: 'Bu bölümde kart olarak gösterilecek uygulama alanları.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'applicationArea'}]})],
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Uygulama alanları ızgarası'}
    },
  },
})
