import {CogIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site ayarları',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'companyName',
      title: 'Şirket adı',
      type: 'string',
      description: 'Site genelinde (üst menü, alt bilgi vb.) görünen şirket adını belirler.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Kısa açıklama',
      type: 'internationalizedArrayText',
      description: 'Alt bilgide veya genel tanıtım metinlerinde kullanılan kısa şirket özetini etkiler.',
    }),
    defineField({
      name: 'headerNavigation',
      title: 'Üst menü',
      type: 'array',
      description: 'Sitenin en üstündeki navigasyon menüsündeki linkleri belirler.',
      of: [defineArrayMember({type: 'navigationItem'})],
    }),
    defineField({
      name: 'footerColumns',
      title: 'Alt bilgi sütunları',
      type: 'array',
      description: 'Sayfanın altındaki footer’da görünen link sütunlarını düzenler.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'footerColumn',
          fields: [
            defineField({
              name: 'title',
              title: 'Başlık',
              type: 'internationalizedArrayString',
              description: 'Footer sütununun üstünde görünen başlığı belirler.',
            }),
            defineField({
              name: 'links',
              title: 'Bağlantılar',
              type: 'array',
              description: 'Bu footer sütununda listelenen linkleri belirler.',
              of: [defineArrayMember({type: 'internalOrExternalLink'})],
            }),
          ],
          preview: {
            prepare() {
              return {title: 'Footer sütunu'}
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'contactChannels',
      title: 'İletişim kanalları',
      type: 'array',
      description: 'Footer veya iletişim alanlarında gösterilen telefon, e-posta vb. kanalları belirler.',
      of: [defineArrayMember({type: 'contactChannel'})],
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp numarası',
      type: 'string',
      description:
        'Sitedeki WhatsApp butonunun bağlandığı numarayı belirler. Uluslararası format, boşluksuz (örn. 905xxxxxxxxx).',
    }),
    defineField({
      name: 'whatsappMessage',
      title: 'WhatsApp varsayılan mesajı',
      type: 'internationalizedArrayText',
      description: 'WhatsApp sohbeti açıldığında hazır gelen mesaj metnini belirler.',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Sosyal medya bağlantıları',
      type: 'array',
      description: 'Footer’daki sosyal medya ikonlarının linklerini belirler.',
      of: [defineArrayMember({type: 'socialLink'})],
    }),
    defineField({
      name: 'catalogs',
      title: 'PDF kataloglar',
      type: 'array',
      description: 'Siteden indirilebilen PDF katalog dosyalarını listeler.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'downloadableDocument'}]})],
    }),
    defineField({
      name: 'footerLegalText',
      title: 'Footer yasal metin',
      type: 'internationalizedArrayText',
      description: 'Sayfanın en altındaki telif / yasal uyarı metnini belirler.',
    }),
    defineField({
      name: 'footerMetaItems',
      title: 'Footer alt meta öğeleri',
      description:
        'Footer’ın sağ altında görünen küçük etiketleri belirler (örn. Çaycuma · Zonguldak).',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'footerMetaItem',
          fields: [
            defineField({
              name: 'label',
              title: 'Etiket',
              type: 'internationalizedArrayString',
              description: 'Footer altındaki küçük meta etiketinin metnini belirler.',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {label: 'label'},
            prepare({label}) {
              const items = Array.isArray(label) ? label : []
              const preferred =
                items.find((entry: {_key?: string; language?: string; value?: string}) =>
                  entry.language === 'tr' || entry._key === 'tr',
                ) ||
                items.find((entry: {_key?: string; language?: string; value?: string}) =>
                  entry.language === 'en' || entry._key === 'en',
                ) ||
                items[0]
              return {
                title:
                  typeof preferred?.value === 'string' && preferred.value.trim()
                    ? preferred.value
                    : 'Footer meta öğesi',
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'uiLabels',
      title: 'Arayüz etiketleri',
      type: 'object',
      description: 'Sitede tekrar kullanılan buton ve arayüz yazılarını belirler.',
      fields: [
        defineField({
          name: 'download',
          title: 'İndir',
          type: 'internationalizedArrayString',
          description: 'İndirme butonlarında görünen yazıyı belirler.',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'companyName',
    },
  },
})
