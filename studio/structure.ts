import type {ComponentType} from 'react'
import {
  CheckmarkCircleIcon,
  CogIcon,
  CubeIcon,
  DocumentIcon,
  DocumentPdfIcon,
  DocumentTextIcon,
  EarthGlobeIcon,
  EnvelopeIcon,
  HomeIcon,
  PlayIcon,
  TagIcon,
  TranslateIcon,
} from '@sanity/icons'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'

import {SUPPORTED_LANGUAGES} from './lib/languages'

const SINGLETON_TYPES = new Set([
  'siteSettings',
  'homePage',
  'privateLabelPage',
  'contactPage',
])

const HIDDEN_FROM_LIST = new Set([
  ...SINGLETON_TYPES,
  'locale',
  'translation.metadata',
])

function createLocalizedSingleton(
  S: StructureBuilder,
  typeName: string,
  title: string,
  icon: ComponentType
) {
  return S.listItem()
    .title(title)
    .icon(icon)
    .child(
      S.list()
        .title(title)
        .items(
          SUPPORTED_LANGUAGES.map((language) =>
            S.listItem()
              .title(`${title} (${language.id.toUpperCase()})`)
              .icon(icon)
              .child(
                S.document()
                  .schemaType(typeName)
                  .documentId(`${typeName}-${language.id}`)
                  .title(`${title} (${language.title})`)
              )
          )
        )
    )
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Polumat Content')
    .items([
      S.listItem()
        .title('Site settings')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site settings')
        ),
      createLocalizedSingleton(S, 'homePage', 'Home page', HomeIcon),
      createLocalizedSingleton(S, 'privateLabelPage', 'Private label', TagIcon),
      createLocalizedSingleton(S, 'contactPage', 'Contact page', EnvelopeIcon),
      S.divider(),
      S.listItem()
        .title('Products')
        .icon(CubeIcon)
        .child(S.documentTypeList('product').title('Products')),
      S.listItem()
        .title('Product categories')
        .icon(TagIcon)
        .child(S.documentTypeList('productCategory').title('Product categories')),
      S.listItem()
        .title('Application areas')
        .icon(EarthGlobeIcon)
        .child(S.documentTypeList('applicationArea').title('Application areas')),
      S.divider(),
      S.listItem()
        .title('Pages')
        .icon(DocumentIcon)
        .child(S.documentTypeList('page').title('Pages')),
      S.listItem()
        .title('Blog')
        .icon(DocumentTextIcon)
        .child(S.documentTypeList('post').title('Blog posts')),
      S.listItem()
        .title('Videos')
        .icon(PlayIcon)
        .child(S.documentTypeList('video').title('Videos')),
      S.listItem()
        .title('Documents')
        .icon(DocumentPdfIcon)
        .child(S.documentTypeList('downloadableDocument').title('Downloadable documents')),
      S.listItem()
        .title('Certificates')
        .icon(CheckmarkCircleIcon)
        .child(S.documentTypeList('certificate').title('Certificates')),
      S.divider(),
      S.listItem()
        .title('Locales')
        .icon(TranslateIcon)
        .child(S.documentTypeList('locale').title('Locales')),
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId()
        return id ? !HIDDEN_FROM_LIST.has(id) : true
      }),
    ])
