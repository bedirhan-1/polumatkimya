import {BoltIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/** Single-composition homepage hero (no slider). */
export const homeHeroType = defineType({
  name: 'homeHero',
  title: 'Home hero',
  type: 'object',
  icon: BoltIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'headingLead',
      title: 'Heading — lead',
      type: 'string',
      description: 'First line of the display heading.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'headingAccent',
      title: 'Heading — accent',
      type: 'string',
      description: 'Highlighted middle line (brand accent color).',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'headingTail',
      title: 'Heading — tail',
      type: 'string',
      description: 'Final line of the display heading.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'desktopImage',
      title: 'Desktop image',
      type: 'imageWithAlt',
      description: 'Full-bleed hero image. Recommended ~21:9, e.g. 2400×1024.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mobileImage',
      title: 'Mobile image',
      type: 'imageWithAlt',
      description: 'Optional art direction for small screens.',
    }),
    defineField({
      name: 'primaryCta',
      title: 'Primary CTA',
      type: 'simpleCallToAction',
    }),
    defineField({
      name: 'secondaryCta',
      title: 'Secondary CTA',
      type: 'simpleCallToAction',
    }),
    defineField({
      name: 'trustItems',
      title: 'Trust strip',
      type: 'array',
      description: 'Up to 4 items shown under the hero on the homepage.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'homeHeroTrustItem',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'string',
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'description'},
          },
        }),
      ],
      validation: (rule) => rule.max(4),
    }),
  ],
  preview: {
    select: {
      title: 'headingLead',
      accent: 'headingAccent',
      media: 'desktopImage',
    },
    prepare({title, accent, media}) {
      return {
        title: [title, accent].filter(Boolean).join(' ') || 'Home hero',
        media,
      }
    },
  },
})
