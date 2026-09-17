import {defineArrayMember, defineField, defineType} from 'sanity'

const titledItemFields = [
  defineField({
    name: 'title',
    title: 'Başlık',
    type: 'string',
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: 'description',
    title: 'Açıklama',
    type: 'text',
    rows: 2,
  }),
]

export const homeProductsSectionType = defineType({
  name: 'homeProductsSection',
  title: 'Ürünler bölümü',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Üst etiket',
      type: 'string',
      description: 'Ana sayfa ürünler bölümünde başlığın üstündeki küçük etiket.',
    }),
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'Ana sayfa ürünler bölümünün ana başlığı.',
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
      rows: 3,
      description: 'Ana sayfa ürünler bölümünde başlığın altındaki kısa metin.',
    }),
    defineField({
      name: 'viewAllLabel',
      title: 'Tümünü gör etiketi',
      type: 'string',
      description: 'Ana sayfa ürünler bölümünde “tüm ürünler” bağlantısının metni.',
    }),
    defineField({
      name: 'detailLabel',
      title: 'Ürün detay etiketi',
      type: 'string',
      description: 'Ana sayfa ürün kartlarındaki detay bağlantısı metni.',
    }),
    defineField({
      name: 'products',
      title: 'Öne çıkan ürünler',
      type: 'array',
      description: 'Ana sayfa ürünler bölümünde listelenen ürünler (en fazla 8).',
      of: [defineArrayMember({type: 'reference', to: [{type: 'product'}]})],
      validation: (rule) => rule.max(8),
    }),
  ],
})

export const homeStrengthsSectionType = defineType({
  name: 'homeStrengthsSection',
  title: 'Güçlü yönler bölümü',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Üst etiket',
      type: 'string',
      description: 'Ana sayfa güçlü yönler bölümünde başlığın üstündeki küçük etiket.',
    }),
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'Ana sayfa güçlü yönler bölümünün ana başlığı.',
    }),
    defineField({
      name: 'items',
      title: 'Maddeler',
      type: 'array',
      description: 'Ana sayfa güçlü yönler bölümündeki madde listesi (en fazla 6).',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'homeStrengthItem',
          fields: titledItemFields,
          preview: {select: {title: 'title', subtitle: 'description'}},
        }),
      ],
      validation: (rule) => rule.max(6),
    }),
  ],
})

export const homeIndustryCardType = defineType({
  name: 'homeIndustryCard',
  title: 'Sektör kartı',
  type: 'object',
  fields: [
    defineField({
      name: 'area',
      title: 'Uygulama alanı',
      type: 'reference',
      to: [{type: 'applicationArea'}],
      validation: (rule) => rule.required(),
      description:
        'Ana sayfa sektör kartının bağlantısı ve kapak/ikon görselleri bu uygulama alanından gelir.',
    }),
    defineField({
      name: 'title',
      title: 'Kart başlığı',
      type: 'string',
      description:
        'Ana sayfa sektör kartında görünür. Doluysa uygulama alanı başlığının yerine geçer.',
    }),
    defineField({
      name: 'summary',
      title: 'Kart özeti',
      type: 'text',
      rows: 2,
      description: 'Ana sayfa sektör kartında başlığın altındaki kısa satır.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      areaTitle: 'area.title',
      media: 'area.coverImage',
    },
    prepare({title, areaTitle, media}) {
      const resolved =
        title ||
        (Array.isArray(areaTitle)
          ? areaTitle.find((item: {_key?: string; value?: string}) => item?.value)?.value
          : areaTitle) ||
        'Sektör kartı'
      return {title: resolved, media}
    },
  },
})

export const homeIndustriesSectionType = defineType({
  name: 'homeIndustriesSection',
  title: 'Sektörler bölümü',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Üst etiket',
      type: 'string',
      description: 'Ana sayfa sektörler bölümünde başlığın üstündeki küçük etiket (örn. Uygulama alanları).',
    }),
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'string',
      validation: (rule) => rule.required(),
      description:
        'Ana sayfa sektörler bölümünün ana başlığı (örn. Her sektör için güvenilir bakım çözümleri).',
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
      rows: 3,
      description: 'Ana sayfa sektörler bölümünde başlığın altındaki kısa destek metni.',
    }),
    defineField({
      name: 'detailLabel',
      title: 'Kart eylem etiketi',
      type: 'string',
      description: 'Ana sayfa sektör kartlarındaki eylem metni (örn. Çözümleri keşfet).',
    }),
    defineField({
      name: 'viewAllCta',
      title: 'Tümünü gör düğmesi',
      type: 'simpleCallToAction',
      description: 'İsteğe bağlı. Ana sayfa sektörler bölümünden tüm sektörler sayfasına bağlantı.',
    }),
    defineField({
      name: 'areas',
      title: 'Sektör kartları',
      description:
        'Ana sayfada en fazla 6 sektör kartı. Başlık/özet burada; kapak ve ikon bağlı uygulama alanından gelir.',
      type: 'array',
      of: [defineArrayMember({type: 'homeIndustryCard'})],
      validation: (rule) => rule.max(6),
    }),
  ],
})

export const homePrivateLabelSectionType = defineType({
  name: 'homePrivateLabelSection',
  title: 'Private label bölümü',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Üst etiket',
      type: 'string',
      description: 'Ana sayfa private label bölümünde başlığın üstündeki küçük etiket.',
    }),
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'Ana sayfa private label bölümünün ana başlığı.',
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
      rows: 3,
      description: 'Ana sayfa private label bölümünde başlığın altındaki metin.',
    }),
    defineField({
      name: 'cta',
      title: 'Eylem düğmesi',
      type: 'simpleCallToAction',
      description: 'Ana sayfa private label bölümündeki eylem düğmesi.',
    }),
    defineField({
      name: 'image',
      title: 'Görsel',
      type: 'imageWithAlt',
      description: 'Ana sayfa private label bölümünde metnin yanında görünen görsel.',
    }),
    defineField({
      name: 'features',
      title: 'Özellikler',
      type: 'array',
      description: 'Ana sayfa private label bölümündeki özellik maddeleri.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'homePrivateLabelFeature',
          fields: titledItemFields,
          preview: {select: {title: 'title', subtitle: 'description'}},
        }),
      ],
    }),
    defineField({
      name: 'processTitle',
      title: 'Süreç başlığı',
      type: 'string',
      description: 'Ana sayfa private label bölümünde süreç adımlarının üst başlığı.',
    }),
    defineField({
      name: 'process',
      title: 'Süreç adımları',
      type: 'array',
      description: 'Ana sayfa private label bölümündeki adım listesi (en fazla 6).',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'homePrivateLabelStep',
          fields: titledItemFields,
          preview: {select: {title: 'title', subtitle: 'description'}},
        }),
      ],
      validation: (rule) => rule.max(6),
    }),
  ],
})

export const homeAboutSectionType = defineType({
  name: 'homeAboutSection',
  title: 'Hakkımızda bölümü',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Üst etiket',
      type: 'string',
      description: 'Ana sayfa hakkımızda bölümünde başlığın üstündeki küçük etiket.',
    }),
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'Ana sayfa hakkımızda bölümünün ana başlığı.',
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
      rows: 4,
      description: 'Ana sayfa hakkımızda bölümünde başlığın altındaki metin.',
    }),
    defineField({
      name: 'cta',
      title: 'Eylem düğmesi',
      type: 'simpleCallToAction',
      description: 'Ana sayfa hakkımızda bölümündeki eylem düğmesi.',
    }),
    defineField({
      name: 'image',
      title: 'Video kapak görseli',
      type: 'imageWithAlt',
      description: 'Ana sayfa hakkımızda bölümünde video oynatılmadan önce gösterilen kapak.',
    }),
    defineField({
      name: 'videoPlayLabel',
      title: 'Video oynat etiketi',
      type: 'string',
      description:
        'Ana sayfa hakkımızda bölümünde oynat düğmesinin altındaki metin (örn. Tanıtım videosunu izle).',
    }),
    defineField({
      name: 'streamUrl',
      title: 'Cloudflare Stream URL',
      type: 'url',
      description:
        'Ana sayfa hakkımızda videosu. Cloudflare panelinden iframe veya izleme URL’sini yapıştırın (customer-xxx.cloudflarestream.com/...).',
    }),
    defineField({
      name: 'streamVideoId',
      title: 'Cloudflare Stream video UID',
      type: 'string',
      description:
        'İsteğe bağlı (URL varsa gerekmez). Yalnızca UID verilirse NEXT_PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE kullanılır.',
    }),
    defineField({
      name: 'stats',
      title: 'İstatistikler',
      type: 'array',
      description: 'Ana sayfa hakkımızda bölümünde gösterilen sayı/etiket satırları (en fazla 5).',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'homeAboutStat',
          fields: [
            defineField({
              name: 'icon',
              title: 'İkon',
              type: 'imageWithAlt',
              description: 'İsteğe bağlı kırmızı çizgi ikon. Boşsa sitedeki varsayılanlar kullanılır.',
            }),
            defineField({
              name: 'value',
              title: 'Değer',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Etiket',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {select: {title: 'value', subtitle: 'label', media: 'icon'}},
        }),
      ],
      validation: (rule) => rule.max(5),
    }),
  ],
})

export const homeQualitySectionType = defineType({
  name: 'homeQualitySection',
  title: 'Kalite bölümü',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Üst etiket',
      type: 'string',
      description: 'Ana sayfa kalite bölümünde başlığın üstündeki küçük etiket.',
    }),
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'Ana sayfa kalite bölümünün ana başlığı.',
    }),
    defineField({
      name: 'link',
      title: 'Sertifikalar sayfası bağlantısı',
      type: 'simpleCallToAction',
      description:
        'İsteğe bağlı. Ana sayfa kalite bölümünden sertifikalar sayfasına; rozetlerde ayrı URL yoksa da buraya gider.',
    }),
    defineField({
      name: 'items',
      title: 'Kalite maddeleri',
      type: 'array',
      description: 'Ana sayfa kalite bölümündeki madde listesi (en fazla 5).',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'homeQualityItem',
          fields: [
            defineField({
              name: 'icon',
              title: 'İkon',
              type: 'imageWithAlt',
              description: 'İsteğe bağlı kırmızı çizgi ikon. Boşsa yerleşik ikonlar kullanılır.',
            }),
            defineField({
              name: 'label',
              title: 'Etiket',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {select: {title: 'label', media: 'icon'}},
        }),
      ],
      validation: (rule) => rule.max(5),
    }),
    defineField({
      name: 'badges',
      title: 'Sertifika rozetleri',
      type: 'array',
      description:
        'Ana sayfa kalite bölümünün sağında ISO / Made in Türkiye rozetleri. Varsa resmi logoları yükleyin.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'homeQualityBadge',
          fields: [
            defineField({
              name: 'image',
              title: 'Rozet görseli',
              type: 'imageWithAlt',
            }),
            defineField({
              name: 'label',
              title: 'Etiket',
              type: 'string',
              validation: (rule) => rule.required(),
              description: 'Örn. ISO 9001:2015 veya Made in Türkiye',
            }),
          ],
          preview: {select: {title: 'label', media: 'image'}},
        }),
      ],
      validation: (rule) => rule.max(4),
    }),
  ],
})

export const homeCtaSectionType = defineType({
  name: 'homeCtaSection',
  title: 'Alt eylem bandı',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Üst etiket',
      type: 'string',
      description: 'Ana sayfanın en altındaki eylem bandında, başlığın üstündeki küçük etiket.',
    }),
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'Ana sayfanın en altındaki eylem bandının ana başlığı.',
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
      rows: 3,
      description: 'Ana sayfa alt eylem bandında başlığın altında görünen metin.',
    }),
    defineField({
      name: 'primaryCta',
      title: 'Birincil düğme',
      type: 'simpleCallToAction',
      description: 'Ana sayfa alt eylem bandındaki ana düğme.',
    }),
    defineField({
      name: 'secondaryCta',
      title: 'İkincil düğme',
      type: 'simpleCallToAction',
      description: 'Ana sayfa alt eylem bandındaki ikinci düğme.',
    }),
  ],
})
