import {TranslateIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const localeType = defineType({
  name: 'locale',
  title: 'Locale',
  type: 'document',
  icon: TranslateIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tag',
      title: 'Language tag',
      type: 'string',
      description: 'IANA language tag (tr, en, ar)',
      validation: (rule) =>
        rule
          .required()
          .regex(/^[a-z]{2}(-[A-Za-z0-9]+)*$/, {
            name: 'language-tag',
            invert: false,
          }),
    }),
    defineField({
      name: 'default',
      title: 'Default locale',
      type: 'boolean',
      initialValue: false,
      validation: (rule) =>
        rule.custom(async (value, context) => {
          if (!value) return true
          const client = context.getClient({apiVersion: '2026-08-02'})
          const id = context.document?._id?.replace(/^drafts\./, '')
          const existing = await client.fetch<number>(
            `count(*[_type == "locale" && default == true && !(_id in [$id, "drafts." + $id])])`,
            {id}
          )
          return existing === 0 || 'Only one locale can be marked as default'
        }),
    }),
    defineField({
      name: 'direction',
      title: 'Text direction',
      type: 'string',
      options: {
        list: [
          {title: 'LTR', value: 'ltr'},
          {title: 'RTL', value: 'rtl'},
        ],
        layout: 'radio',
      },
      initialValue: 'ltr',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'fallback',
      title: 'Fallback locale',
      type: 'reference',
      to: [{type: 'locale'}],
    }),
    defineField({
      name: 'enabled',
      title: 'Enabled',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'tag',
      enabled: 'enabled',
      isDefault: 'default',
    },
    prepare({title, subtitle, enabled, isDefault}) {
      return {
        title: title || subtitle,
        subtitle: [subtitle, isDefault ? 'default' : null, enabled === false ? 'disabled' : null]
          .filter(Boolean)
          .join(' · '),
      }
    },
  },
})
