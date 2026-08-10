import {ImagesIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * @deprecated Homepage no longer uses a hero slider. Kept registered so existing
 * documents with this block type still open in Studio. Not insertable via pageBuilder.
 */
export const heroSliderSectionType = defineType({
  name: 'heroSliderSection',
  title: 'Hero slider (deprecated)',
  type: 'object',
  icon: ImagesIcon,
  readOnly: true,
  fields: [
    defineField({
      name: 'accessibilityLabel',
      title: 'Accessibility label',
      type: 'string',
    }),
    defineField({
      name: 'slides',
      title: 'Slides',
      type: 'array',
      of: [defineArrayMember({type: 'heroSlide'})],
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
    }),
    defineField({
      name: 'interval',
      title: 'Automatic rotation interval',
      type: 'number',
    }),
  ],
  preview: {
    select: {
      firstHeading: 'slides.0.heading',
      media: 'slides.0.desktopImage',
    },
    prepare({firstHeading, media}) {
      return {
        title: firstHeading || 'Hero slider (deprecated)',
        subtitle: 'Replace with Home → Hero field',
        media: media || ImagesIcon,
      }
    },
  },
})
