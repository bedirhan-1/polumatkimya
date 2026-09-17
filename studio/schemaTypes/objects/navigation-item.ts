import {LinkIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {hasLocalizedStringValue} from '../../lib/cta-validation'

type NavigationItemValue = {
  label?: unknown
  linkType?: string
  internalPath?: string
  externalUrl?: string
  reference?: {_ref?: string}
  children?: unknown[]
}

function validateNavigationItem(value: unknown): string | true {
  if (!value || typeof value !== 'object') return true
  const item = value as NavigationItemValue
  if (!hasLocalizedStringValue(item.label)) return 'Etiket zorunludur'

  const hasChildren = Array.isArray(item.children) && item.children.length > 0
  if (hasChildren || item.linkType === 'none' || !item.linkType) {
    return true
  }

  if (item.linkType === 'internal' && !item.internalPath?.trim()) {
    return 'Site içi bağlantılar için yol zorunludur'
  }
  if (item.linkType === 'external' && !item.externalUrl) {
    return 'Dış bağlantılar için URL zorunludur'
  }
  if (item.linkType === 'reference' && !item.reference?._ref) {
    return 'Referans bağlantılar için belge seçimi zorunludur'
  }

  return true
}

export const navigationItemType = defineType({
  name: 'navigationItem',
  title: 'Menü öğesi',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Etiket',
      type: 'internationalizedArrayString',
      description: 'Üst menüde veya alt menüde görünen bağlantı metni.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'linkType',
      title: 'Bağlantı türü',
      type: 'string',
      options: {
        list: [
          {title: 'Yalnızca açılır menü (bağlantı yok)', value: 'none'},
          {title: 'Site içi yol', value: 'internal'},
          {title: 'Dış URL', value: 'external'},
          {title: 'Belge referansı', value: 'reference'},
        ],
        layout: 'radio',
      },
      initialValue: 'internal',
      description:
        'Üst menü öğesinin nereye gideceği. Alt menüsü olan üst öğelerde “Yalnızca açılır menü” kullanılabilir.',
    }),
    defineField({
      name: 'internalPath',
      title: 'Site içi yol',
      type: 'string',
      description: 'Dil önekinden sonraki yol, örn. /products veya /about',
      hidden: ({parent}) => parent?.linkType !== 'internal',
    }),
    defineField({
      name: 'externalUrl',
      title: 'Dış URL',
      type: 'url',
      hidden: ({parent}) => parent?.linkType !== 'external',
      validation: (rule) =>
        rule.uri({
          scheme: ['http', 'https', 'mailto', 'tel'],
        }),
    }),
    defineField({
      name: 'reference',
      title: 'Referans',
      type: 'reference',
      description: 'Menü bağlantısının hedef sayfası, ürünü veya içeriği.',
      to: [
        {type: 'product'},
        {type: 'productCategory'},
        {type: 'applicationArea'},
        {type: 'page'},
        {type: 'post'},
      ],
      hidden: ({parent}) => parent?.linkType !== 'reference',
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Yeni sekmede aç',
      type: 'boolean',
      initialValue: false,
      description: 'Bağlantı tıklandığında yeni tarayıcı sekmesi açılır.',
      hidden: ({parent}) => parent?.linkType === 'none' || !parent?.linkType,
    }),
    defineField({
      name: 'children',
      title: 'Açılır menü bağlantıları',
      description:
        'İsteğe bağlı alt bağlantılar. Alt öğesi olan üst menü öğelerinin kendi yolu olması gerekmez.',
      type: 'array',
      of: [defineArrayMember({type: 'internalOrExternalLink'})],
    }),
  ],
  validation: (rule) => rule.custom((value) => validateNavigationItem(value)),
  preview: {
    select: {
      linkType: 'linkType',
      internalPath: 'internalPath',
      externalUrl: 'externalUrl',
      children: 'children',
    },
    prepare({linkType, internalPath, externalUrl, children}) {
      const childCount = Array.isArray(children) ? children.length : 0
      return {
        title: 'Menü öğesi',
        subtitle: [
          linkType === 'none'
            ? 'Yalnızca açılır menü'
            : linkType === 'external'
              ? externalUrl
              : internalPath || linkType,
          childCount ? `${childCount} alt bağlantı` : null,
        ]
          .filter(Boolean)
          .join(' · '),
      }
    },
  },
})
