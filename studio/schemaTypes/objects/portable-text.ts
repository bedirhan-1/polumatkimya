import {BlockContentIcon} from '@sanity/icons'
import {defineArrayMember, defineType} from 'sanity'

export const portableTextType = defineType({
  name: 'portableText',
  title: 'Zengin metin',
  type: 'array',
  icon: BlockContentIcon,
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'Alıntı', value: 'blockquote'},
      ],
      lists: [
        {title: 'Madde işaretli', value: 'bullet'},
        {title: 'Numaralı', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Kalın', value: 'strong'},
          {title: 'İtalik', value: 'em'},
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Bağlantı',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                description: 'Seçili metnin tıklanınca gideceği adres.',
                validation: (rule) =>
                  rule.uri({
                    allowRelative: true,
                    scheme: ['http', 'https', 'mailto', 'tel'],
                  }),
              },
              {
                name: 'openInNewTab',
                type: 'boolean',
                title: 'Yeni sekmede aç',
                initialValue: false,
                description: 'Bağlantı tıklandığında yeni tarayıcı sekmesi açılır.',
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'imageWithAlt',
    }),
  ],
})
