import {PinIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Mirror export-page schema patterns exactly so Studio form fields resolve.
 */
export const turkeySalesPageType = defineType({
  name: 'turkeySalesPage',
  title: 'Türkiye satış sayfası',
  type: 'document',
  icon: PinIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Üst etiket',
      type: 'internationalizedArrayString',
      description: 'Sayfa başlığının hemen üstünde görünen küçük etiketi belirler.',
    }),
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'internationalizedArrayString',
      description: 'Türkiye satış sayfasının ana başlığını belirler.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Giriş metni',
      type: 'internationalizedArrayText',
      description: 'Sayfa başlığının altındaki giriş paragrafını belirler.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mapTitle',
      title: 'Harita başlığı',
      type: 'internationalizedArrayString',
      description: 'Türkiye haritası bölümünün başlığını belirler.',
    }),
    defineField({
      name: 'mapDescription',
      title: 'Harita açıklaması',
      type: 'internationalizedArrayText',
      description: 'Harita bölümünün kısa açıklamasını belirler.',
    }),
    defineField({
      name: 'highlights',
      title: 'Vurgular',
      type: 'array',
      description: 'Sayfanın altındaki kısa satış vurgularını belirler.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'turkeySalesHighlight',
          title: 'Vurgu',
          fields: [
            defineField({
              name: 'title',
              title: 'Başlık',
              type: 'internationalizedArrayString',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Açıklama',
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
              return {title: localized || 'Vurgu'}
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'contactEyebrow',
      title: 'İletişim üst etiketi',
      type: 'internationalizedArrayString',
      description: 'Satış müdürü bölümünün üstündeki küçük etiketi belirler.',
    }),
    defineField({
      name: 'contactTitle',
      title: 'İletişim başlığı',
      type: 'internationalizedArrayString',
      description: 'Satış müdürü bölümünün ana başlığını belirler.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'contactDescription',
      title: 'İletişim açıklaması',
      type: 'internationalizedArrayText',
      description: 'Satış müdürü bölümünün giriş açıklamasını belirler.',
    }),
    defineField({
      name: 'contacts',
      title: 'Çalışanlar',
      type: 'array',
      description:
        'Türkiye satış ekibi. Sıra sürükle-bırak ile değişir. İlk kişi üstte geniş kart olarak gösterilir.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'turkeySalesContact',
          title: 'İletişim kişisi',
          fields: [
            defineField({
              name: 'name',
              title: 'Ad',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'role',
              title: 'Ünvan',
              type: 'internationalizedArrayString',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'phone',
              title: 'Telefon',
              type: 'string',
              validation: (rule) =>
                rule.required().custom((phone) => {
                  if (!phone) return true
                  return phone.replace(/\D/g, '').length >= 10 || 'Geçerli bir telefon numarası girin'
                }),
            }),
            defineField({
              name: 'email',
              title: 'E-posta',
              type: 'string',
              validation: (rule) => rule.required().email(),
            }),
          ],
          preview: {
            select: {title: 'name', subtitle: 'email'},
          },
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'seo',
      title: 'Arama motoru (SEO)',
      type: 'localizedSeo',
      description: 'Sayfanın arama motoru başlığı, açıklaması ve paylaşım görselini belirler.',
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
        title: localized || 'Türkiye satış sayfası',
        subtitle: 'Singleton',
      }
    },
  },
})
