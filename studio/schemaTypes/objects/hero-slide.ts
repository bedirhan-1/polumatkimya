import {ImageIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const heroSlideType = defineType({
  name: 'heroSlide',
  title: 'Hero slide',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({
      name: 'desktopImage',
      title: 'Desktop image',
      type: 'imageWithAlt',
      description: 'Recommended crop: 1920 × 800 px.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mobileImage',
      title: 'Mobile image',
      type: 'imageWithAlt',
      description: 'Optional mobile art direction. Recommended crop: 768 × 1024 px.',
    }),
    defineField({name: 'primaryCta', title: 'Primary CTA', type: 'simpleCallToAction'}),
    defineField({name: 'secondaryCta', title: 'Secondary CTA', type: 'simpleCallToAction'}),
  ],
  preview: {
    select: {title: 'heading', subtitle: 'eyebrow', media: 'desktopImage'},
    prepare({title, subtitle, media}) {
      return {title: title || 'Untitled slide', subtitle: subtitle || 'Hero slide', media}
    },
  },
})
