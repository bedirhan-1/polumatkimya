import {LaunchIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import {validateCallToActionValue} from '../../lib/cta-validation'

export const callToActionType = defineType({
  name: 'callToAction',
  title: 'Eylem düğmesi',
  type: 'object',
  icon: LaunchIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Etiket',
      type: 'internationalizedArrayString',
      description: 'Sitede düğme üzerinde görünen metin.',
    }),
    defineField({
      name: 'link',
      title: 'Bağlantı',
      type: 'internalOrExternalLink',
      description: 'Düğmeye tıklanınca gidilecek adres veya içerik.',
    }),
    defineField({
      name: 'variant',
      title: 'Görünüm',
      type: 'string',
      options: {
        list: [
          {title: 'Birincil (dolu)', value: 'primary'},
          {title: 'İkincil (çerçeveli)', value: 'secondary'},
          {title: 'Sade (yalnızca metin)', value: 'ghost'},
        ],
        layout: 'radio',
      },
      initialValue: 'primary',
      description: 'Düğmenin sitedeki görünümü: dolu renk, çerçeveli veya sade metin.',
    }),
  ],
  validation: (rule) => rule.custom((value) => validateCallToActionValue(value)),
  preview: {
    select: {
      variant: 'variant',
      label: 'label',
      linkType: 'link.linkType',
      internalPath: 'link.internalPath',
      externalUrl: 'link.externalUrl',
    },
    prepare({variant, label, linkType, internalPath, externalUrl}) {
      const localized = Array.isArray(label)
        ? label.find(
            (item: {language?: string; _key?: string; value?: string}) =>
              item.language === 'tr' || item._key === 'tr',
          )?.value || label.find((item: {value?: string}) => item.value)?.value
        : undefined
      const target =
        linkType === 'external' ? externalUrl : linkType === 'internal' ? internalPath : linkType
      return {
        title: localized || 'Eylem düğmesi',
        subtitle: [variant, target].filter(Boolean).join(' · '),
      }
    },
  },
})
