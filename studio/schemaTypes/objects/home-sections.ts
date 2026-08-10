import {defineArrayMember, defineField, defineType} from 'sanity'

const titledItemFields = [
  defineField({
    name: 'title',
    title: 'Title',
    type: 'string',
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: 'description',
    title: 'Description',
    type: 'text',
    rows: 2,
  }),
]

export const homeProductsSectionType = defineType({
  name: 'homeProductsSection',
  title: 'Products section',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({name: 'viewAllLabel', title: 'View all label', type: 'string'}),
    defineField({name: 'detailLabel', title: 'Product detail label', type: 'string'}),
    defineField({
      name: 'products',
      title: 'Featured products',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'product'}]})],
      validation: (rule) => rule.max(8),
    }),
  ],
})

export const homeStrengthsSectionType = defineType({
  name: 'homeStrengthsSection',
  title: 'Strengths section',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
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
  title: 'Industry card',
  type: 'object',
  fields: [
    defineField({
      name: 'area',
      title: 'Application area',
      type: 'reference',
      to: [{type: 'applicationArea'}],
      validation: (rule) => rule.required(),
      description: 'Used for the card link and for cover/icon media.',
    }),
    defineField({
      name: 'title',
      title: 'Card title',
      type: 'string',
      description: 'Overrides the application area title when set.',
    }),
    defineField({
      name: 'summary',
      title: 'Card summary',
      type: 'text',
      rows: 2,
      description: 'Optional short line under the card title.',
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
        'Industry card'
      return {title: resolved, media}
    },
  },
})

export const homeIndustriesSectionType = defineType({
  name: 'homeIndustriesSection',
  title: 'Industries section',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      description: 'Small label above the title (e.g. Uygulama alanları).',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'Main heading (e.g. Her sektör için güvenilir bakım çözümleri).',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Short supporting text under the title.',
    }),
    defineField({
      name: 'detailLabel',
      title: 'Card action label',
      type: 'string',
      description: 'Text shown on each card (e.g. Çözümleri keşfet).',
    }),
    defineField({
      name: 'viewAllCta',
      title: 'View all CTA',
      type: 'simpleCallToAction',
      description: 'Optional link to the full industries listing page.',
    }),
    defineField({
      name: 'areas',
      title: 'Industry cards',
      description:
        'Up to 6 cards. Set title/summary here. Cover photo and icon come from the linked application area (not edited in this section).',
      type: 'array',
      of: [defineArrayMember({type: 'homeIndustryCard'})],
      validation: (rule) => rule.max(6),
    }),
  ],
})

export const homePrivateLabelSectionType = defineType({
  name: 'homePrivateLabelSection',
  title: 'Private label section',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({
      name: 'cta',
      title: 'CTA',
      type: 'simpleCallToAction',
    }),
    defineField({
      name: 'image',
      title: 'Visual',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'homePrivateLabelFeature',
          fields: titledItemFields,
          preview: {select: {title: 'title', subtitle: 'description'}},
        }),
      ],
    }),
    defineField({name: 'processTitle', title: 'Process title', type: 'string'}),
    defineField({
      name: 'process',
      title: 'Process steps',
      type: 'array',
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
  title: 'About section',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 4}),
    defineField({
      name: 'cta',
      title: 'CTA',
      type: 'simpleCallToAction',
    }),
    defineField({
      name: 'image',
      title: 'Video poster',
      type: 'imageWithAlt',
      description: 'Poster shown before the promotional video plays.',
    }),
    defineField({
      name: 'videoPlayLabel',
      title: 'Video play label',
      type: 'string',
      description: 'Text under the play button (e.g. Tanıtım videosunu izle).',
    }),
    defineField({
      name: 'streamUrl',
      title: 'Cloudflare Stream URL',
      type: 'url',
      description:
        'Paste the Stream iframe or watch URL from Cloudflare dashboard (customer-xxx.cloudflarestream.com/...).',
    }),
    defineField({
      name: 'streamVideoId',
      title: 'Cloudflare Stream video UID',
      type: 'string',
      description:
        'Optional if stream URL is set. Uses NEXT_PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE when only the UID is provided.',
    }),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'homeAboutStat',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'imageWithAlt',
              description: 'Optional red line-art icon. Site fallbacks are used when empty.',
            }),
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
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
  title: 'Quality section',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Certificates page link',
      type: 'simpleCallToAction',
      description: 'Optional. Badges below can also link here when no per-badge URL is set.',
    }),
    defineField({
      name: 'items',
      title: 'Quality points',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'homeQualityItem',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'imageWithAlt',
              description: 'Optional red line-art icon. Built-in icons are used when empty.',
            }),
            defineField({
              name: 'label',
              title: 'Label',
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
      title: 'Certification badges',
      type: 'array',
      description: 'ISO / Made in Türkiye marks shown on the right. Upload official logos when available.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'homeQualityBadge',
          fields: [
            defineField({
              name: 'image',
              title: 'Badge image',
              type: 'imageWithAlt',
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
              description: 'e.g. ISO 9001:2015 or Made in Türkiye',
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
  title: 'CTA section',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({name: 'primaryCta', title: 'Primary CTA', type: 'simpleCallToAction'}),
    defineField({name: 'secondaryCta', title: 'Secondary CTA', type: 'simpleCallToAction'}),
  ],
})
