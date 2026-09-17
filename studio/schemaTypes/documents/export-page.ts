import {EarthGlobeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const exportActivityType = defineType({
  name: 'exportActivity',
  title: 'İhracat faaliyeti',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'internationalizedArrayString',
      description: 'İhracat sayfasındaki faaliyet kartının başlığını belirler.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'internationalizedArrayText',
      description: 'İhracat sayfasındaki faaliyet kartının açıklama metnini belirler.',
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
      return {title: localized || 'İhracat faaliyeti'}
    },
  },
})

export const exportContactType = defineType({
  name: 'exportContact',
  title: 'İhracat iletişim kişisi',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Ad',
      type: 'string',
      description: 'İhracat sayfasında gösterilen iletişim kişisinin adını belirler.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Ünvan',
      type: 'internationalizedArrayString',
      description: 'İhracat sayfasında kişinin adının altında görünen ünvanı belirler.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'phone',
      title: 'Telefon',
      type: 'string',
      description: 'İhracat sayfasında herkese açık gösterilen ve arama linki olarak kullanılan telefonu belirler.',
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
      description: 'İhracat sayfasında herkese açık gösterilen ve mailto linki olarak kullanılan e-postayı belirler.',
      validation: (rule) => rule.required().email(),
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'email'},
  },
})

export const exportPageType = defineType({
  name: 'exportPage',
  title: 'İhracat sayfası',
  type: 'document',
  icon: EarthGlobeIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Üst etiket',
      type: 'internationalizedArrayString',
      description: 'İhracat sayfası başlığının hemen üstünde görünen küçük etiketi belirler.',
    }),
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'internationalizedArrayString',
      description: 'İhracat sayfasının ana başlığını belirler.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Giriş metni',
      type: 'internationalizedArrayText',
      description: 'İhracat sayfası başlığının altındaki giriş paragrafını belirler.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'countryCount',
      title: 'İhracat ülke sayısı',
      type: 'string',
      description: 'İhracat sayfasında öne çıkan ülke sayısı değerini belirler (örn. “50+”).',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'countryLabel',
      title: 'Ülke sayısı etiketi',
      type: 'internationalizedArrayString',
      description: 'Ülke sayısının yanında görünen açıklama etiketini belirler (örn. “ülke”).',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'activityEyebrow',
      title: 'Faaliyetler üst etiketi',
      type: 'internationalizedArrayString',
      description: 'İhracat faaliyetleri bölümünün üstündeki küçük etiketi belirler.',
    }),
    defineField({
      name: 'activityTitle',
      title: 'Faaliyetler başlığı',
      type: 'internationalizedArrayString',
      description: 'İhracat faaliyetleri bölümünün ana başlığını belirler.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'activityDescription',
      title: 'Faaliyetler açıklaması',
      type: 'internationalizedArrayText',
      description: 'İhracat faaliyetleri bölümünün giriş açıklamasını belirler.',
    }),
    defineField({
      name: 'activities',
      title: 'Aktif ihracat çalışmaları',
      type: 'array',
      description: 'İhracat sayfasında listelenen faaliyet kartlarını belirler.',
      of: [defineArrayMember({type: 'exportActivity'})],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'contactEyebrow',
      title: 'İletişim üst etiketi',
      type: 'internationalizedArrayString',
      description: 'İhracat iletişim kişileri bölümünün üstündeki küçük etiketi belirler.',
    }),
    defineField({
      name: 'contactTitle',
      title: 'İletişim başlığı',
      type: 'internationalizedArrayString',
      description: 'İhracat iletişim kişileri bölümünün ana başlığını belirler.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'contactDescription',
      title: 'İletişim açıklaması',
      type: 'internationalizedArrayText',
      description: 'İhracat iletişim kişileri bölümünün giriş açıklamasını belirler.',
    }),
    defineField({
      name: 'leadContact',
      title: 'İhracat müdürü (üst kart)',
      type: 'exportContact',
      description:
        'İhracat sayfasında iletişim bölümünün en üstünde, tam genişlikte gösterilen kişi (örn. İhracat Müdürü).',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'regionalContacts',
      title: 'Bölge sorumluları (alt kolonlar)',
      type: 'array',
      description:
        'Üst kartın altında 3 kolonlu sırada soldan sağa gösterilir. Yeni eleman eklendikçe sıradaki boş kolona yerleşir (en fazla 3).',
      of: [defineArrayMember({type: 'exportContact'})],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: 'seo',
      title: 'Arama motoru (SEO)',
      type: 'localizedSeo',
      description: 'İhracat sayfasının arama motoru başlığı, açıklaması ve paylaşım görselini belirler.',
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
        title: localized || 'İhracat sayfası',
        subtitle: subtitle ? `${subtitle} ülke` : undefined,
      }
    },
  },
})
