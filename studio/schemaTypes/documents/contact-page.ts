import {EnvelopeIcon, PinIcon, MobileDeviceIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const contactLocationType = defineType({
  name: 'contactLocation',
  title: 'İletişim konumu',
  type: 'object',
  icon: PinIcon,
  fields: [
    defineField({
      name: 'locationId',
      title: 'Konum kimliği',
      type: 'string',
      description: 'Sitede bu konumu ayırt etmek için kullanılan sabit kimlik (örn. factory, istanbul).',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Etiket',
      type: 'internationalizedArrayString',
      description: 'İletişim sayfasında konumun görünen adını belirler.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'addressLine',
      title: 'Adres satırı',
      type: 'internationalizedArrayString',
      description: 'İletişim sayfasında gösterilen sokak / açık adres satırını belirler.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'city',
      title: 'Şehir / ilçe',
      type: 'internationalizedArrayString',
      description: 'İletişim sayfasında adresin altında görünen şehir veya ilçe bilgisini belirler.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'postalCode',
      title: 'Posta kodu',
      type: 'string',
      description: 'İletişim sayfasında adrese eklenen posta kodunu belirler.',
    }),
    defineField({
      name: 'mapEmbedUrl',
      title: 'Harita gömme URL’si',
      type: 'url',
      description: 'İletişim sayfasındaki gömülü harita iframe’inin adresini belirler.',
      validation: (rule) =>
        rule.required().uri({
          allowRelative: false,
          scheme: ['https'],
        }),
    }),
    defineField({
      name: 'mapsUrl',
      title: 'Haritada aç URL’si',
      type: 'url',
      description: '“Haritada aç” linkinin Google Maps / Apple Maps adresini belirler.',
      validation: (rule) =>
        rule.required().uri({
          allowRelative: false,
          scheme: ['https'],
        }),
    }),
    defineField({
      name: 'mapTitle',
      title: 'Harita erişilebilirlik başlığı',
      type: 'internationalizedArrayString',
      description: 'Harita iframe’inin ekran okuyucular için erişilebilirlik başlığını belirler.',
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
        title: localized || 'Konum',
        subtitle,
      }
    },
  },
})

export const contactPhoneType = defineType({
  name: 'contactPhone',
  title: 'İletişim telefonu',
  type: 'object',
  icon: MobileDeviceIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Etiket',
      type: 'internationalizedArrayString',
      description: 'İletişim sayfasında telefon numarasının yanında görünen etiketi belirler.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'phone',
      title: 'Telefon',
      type: 'string',
      description: 'İletişim sayfasında tıklanabilir olarak gösterilen telefon numarasını belirler.',
      validation: (rule) =>
        rule.required().custom((phone) => {
          if (!phone) return true
          return phone.replace(/\D/g, '').length >= 10 || 'Geçerli bir telefon numarası girin'
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
        title: title || 'Telefon',
        subtitle: localized,
      }
    },
  },
})

export const contactEmailType = defineType({
  name: 'contactEmail',
  title: 'İletişim e-postası',
  type: 'object',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Etiket',
      type: 'internationalizedArrayString',
      description: 'İletişim sayfasında e-posta adresinin yanında görünen etiketi belirler.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'E-posta',
      type: 'string',
      description: 'İletişim sayfasında tıklanabilir olarak gösterilen e-posta adresini belirler.',
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
        title: title || 'E-posta',
        subtitle: localized,
      }
    },
  },
})

export const contactPageType = defineType({
  name: 'contactPage',
  title: 'İletişim sayfası',
  type: 'document',
  icon: EnvelopeIcon,
  groups: [
    {name: 'content', title: 'İçerik', default: true},
    {name: 'details', title: 'İletişim bilgileri'},
    {name: 'form', title: 'Form'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Üst etiket',
      type: 'internationalizedArrayString',
      description: 'İletişim sayfası başlığının hemen üstünde görünen küçük etiketi belirler.',
      group: 'content',
    }),
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'internationalizedArrayString',
      description: 'İletişim sayfasının ana başlığını belirler.',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Giriş metni',
      type: 'internationalizedArrayText',
      description: 'İletişim sayfası başlığının altındaki giriş paragrafını belirler.',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'phonesSectionTitle',
      title: 'Telefonlar bölüm başlığı',
      type: 'internationalizedArrayString',
      description: 'İletişim sayfasındaki telefon listesinin üstündeki başlığı belirler.',
      group: 'details',
    }),
    defineField({
      name: 'emailsSectionTitle',
      title: 'E-postalar bölüm başlığı',
      type: 'internationalizedArrayString',
      description: 'İletişim sayfasındaki e-posta listesinin üstündeki başlığı belirler.',
      group: 'details',
    }),
    defineField({
      name: 'corporateSectionTitle',
      title: 'Kurumsal bölüm başlığı',
      type: 'internationalizedArrayString',
      description: 'İletişim sayfasındaki kurumsal iletişim bilgisinin üstündeki başlığı belirler.',
      group: 'details',
    }),
    defineField({
      name: 'corporatePhone',
      title: 'Kurumsal telefon',
      type: 'string',
      description: 'İletişim sayfasında gösterilen kurumsal telefon numarasını belirler.',
      group: 'details',
    }),
    defineField({
      name: 'corporateEmail',
      title: 'Kurumsal e-posta',
      type: 'string',
      description: 'İletişim sayfasında gösterilen kurumsal e-posta adresini belirler.',
      group: 'details',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'phones',
      title: 'Telefon numaraları',
      type: 'array',
      description: 'İletişim sayfasında listelenen telefon numaralarını belirler.',
      group: 'details',
      of: [defineArrayMember({type: 'contactPhone'})],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'emails',
      title: 'E-posta adresleri',
      type: 'array',
      description: 'İletişim sayfasında listelenen e-posta adreslerini belirler.',
      group: 'details',
      of: [defineArrayMember({type: 'contactEmail'})],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'locations',
      title: 'Konumlar',
      type: 'array',
      description: 'İletişim sayfasında gösterilen adres ve harita konumlarını belirler.',
      group: 'details',
      of: [defineArrayMember({type: 'contactLocation'})],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'formTitle',
      title: 'Form başlığı',
      type: 'internationalizedArrayString',
      description: 'İletişim sayfasındaki iletişim formunun başlığını belirler.',
      group: 'form',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'formDescription',
      title: 'Form açıklaması',
      type: 'internationalizedArrayText',
      description: 'İletişim formunun altında veya üstünde görünen açıklama metnini belirler.',
      group: 'form',
    }),
    defineField({
      name: 'openInMapsLabel',
      title: 'Haritada aç etiketi',
      type: 'internationalizedArrayString',
      description: 'Konum kartlarındaki “Haritada aç” linkinin yazısını belirler.',
      group: 'form',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'localizedSeo',
      description: 'İletişim sayfasının arama motoru başlığı, açıklaması ve paylaşım görselini belirler.',
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
        title: localized || 'İletişim sayfası',
      }
    },
  },
})
