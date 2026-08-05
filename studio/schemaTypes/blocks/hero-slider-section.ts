import {ImagesIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const heroSliderSectionType = defineType({
  name: 'heroSliderSection',
  title: 'Hero slider',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'accessibilityLabel',
      title: 'Accessibility label',
      type: 'string',
      description: 'A short localized name for screen readers, such as “Featured content”.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slides',
      title: 'Slides',
      type: 'array',
      of: [defineArrayMember({type: 'heroSlide'})],
      validation: (rule) => rule.required().min(1).max(6),
    }),
    defineField({
      name: 'rotationMode',
      title: 'Rotation mode',
      type: 'string',
      options: {
        list: [
          {title: 'Automatic', value: 'automatic'},
          {title: 'Manual only', value: 'manual'},
        ],
        layout: 'radio',
      },
      initialValue: 'automatic',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'interval',
      title: 'Automatic rotation interval',
      type: 'number',
      description: 'Milliseconds between slides. Recommended: 6500.',
      initialValue: 6500,
      hidden: ({parent}) => parent?.rotationMode !== 'automatic',
      validation: (rule) => rule.integer().min(4000).max(12000),
    }),
  ],
  preview: {
    select: {
      firstHeading: 'slides.0.heading',
      media: 'slides.0.desktopImage',
      slideCount: 'slides.length',
    },
    prepare({firstHeading, media, slideCount}) {
      return {
        title: firstHeading || 'Hero slider',
        subtitle: typeof slideCount === 'number' ? `${slideCount} slides` : 'Hero slider',
        media: media || ImagesIcon,
      }
    },
  },
})
