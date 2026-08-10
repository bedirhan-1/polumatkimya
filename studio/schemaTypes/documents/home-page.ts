import {HomeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {languageField, translationStatusField} from '../shared/localization-fields'

export const homePageType = defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'sections', title: 'Sections'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    languageField,
    translationStatusField,
    defineField({
      name: 'title',
      title: 'Internal title',
      type: 'string',
      initialValue: 'Home',
      group: 'seo',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'homeHero',
      description: 'Single full-bleed hero (no slider).',
      group: 'hero',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'productsSection',
      title: 'Products',
      type: 'homeProductsSection',
      group: 'sections',
    }),
    defineField({
      name: 'strengthsSection',
      title: 'Strengths',
      type: 'homeStrengthsSection',
      group: 'sections',
    }),
    defineField({
      name: 'industriesSection',
      title: 'Industries',
      type: 'homeIndustriesSection',
      group: 'sections',
    }),
    defineField({
      name: 'privateLabelSection',
      title: 'Private label',
      type: 'homePrivateLabelSection',
      group: 'sections',
    }),
    defineField({
      name: 'aboutSection',
      title: 'About',
      type: 'homeAboutSection',
      group: 'sections',
    }),
    defineField({
      name: 'qualitySection',
      title: 'Quality',
      type: 'homeQualitySection',
      group: 'sections',
    }),
    defineField({
      name: 'ctaSection',
      title: 'Bottom CTA',
      type: 'homeCtaSection',
      group: 'sections',
    }),
  ],
  preview: {
    select: {
      language: 'language',
      status: 'translationStatus',
      media: 'hero.desktopImage',
    },
    prepare({language, status, media}) {
      return {
        title: 'Home page',
        subtitle: [language?.toUpperCase(), status].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
