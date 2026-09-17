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
  ImagesIcon,
  PlayIcon,
  SortIcon,
  TagIcon,
} from '@sanity/icons'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'

import {SUPPORTED_LANGUAGES} from './lib/languages'

const SINGLETON_TYPES = new Set([
  'siteSettings',
  'homePage',
  'contactPage',
  'exportPage',
  'productOrder',
  'gallery',
])

function createSingleton(
  S: StructureBuilder,
  typeName: string,
  title: string,
  icon: ComponentType,
  documentId = typeName,
) {
  return S.listItem()
    .title(title)
    .icon(icon)
    .child(S.document().schemaType(typeName).documentId(documentId).title(title))
}

/** Document types with explicit sidebar list items — hide from auto-generated list. */
const CURATED_LIST_TYPES = [
  'product',
  'productCategory',
  'applicationArea',
  'page',
  'post',
  'video',
  'downloadableDocument',
  'certificate',
] as const

const HIDDEN_FROM_LIST = new Set([
  ...SINGLETON_TYPES,
  ...CURATED_LIST_TYPES,
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
    .title('Polumat İçerik')
    .items([
      S.listItem()
        .title('Site ayarları')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site ayarları')
        ),
      createLocalizedSingleton(S, 'homePage', 'Ana sayfa', HomeIcon),
      createSingleton(S, 'contactPage', 'İletişim sayfası', EnvelopeIcon),
      createSingleton(S, 'exportPage', 'İhracat sayfası', EarthGlobeIcon),
      S.divider(),
      S.listItem()
        .title('Ürünler')
        .icon(CubeIcon)
        .child(S.documentTypeList('product').title('Ürünler')),
      S.listItem()
        .title('Ürün sırası')
        .icon(SortIcon)
        .child(
          S.document()
            .schemaType('productOrder')
            .documentId('productOrder')
            .title('Ürün sırası'),
        ),
      S.listItem()
        .title('Ürün kategorileri')
        .icon(TagIcon)
        .child(S.documentTypeList('productCategory').title('Ürün kategorileri')),
      S.listItem()
        .title('Uygulama alanları')
        .icon(EarthGlobeIcon)
        .child(S.documentTypeList('applicationArea').title('Uygulama alanları')),
      S.divider(),
      S.listItem()
        .title('Sayfalar')
        .icon(DocumentIcon)
        .child(S.documentTypeList('page').title('Sayfalar')),
      S.listItem()
        .title('Blog')
        .icon(DocumentTextIcon)
        .child(S.documentTypeList('post').title('Blog yazıları')),
      S.listItem()
        .title('Videolar')
        .icon(PlayIcon)
        .child(S.documentTypeList('video').title('Videolar')),
      S.listItem()
        .title('Galeri')
        .icon(ImagesIcon)
        .child(
          S.document()
            .schemaType('gallery')
            .documentId('gallery')
            .title('Galeri'),
        ),
      S.listItem()
        .title('Belgeler')
        .icon(DocumentPdfIcon)
        .child(S.documentTypeList('downloadableDocument').title('İndirilebilir belgeler')),
      S.listItem()
        .title('Sertifikalar')
        .icon(CheckmarkCircleIcon)
        .child(S.documentTypeList('certificate').title('Sertifikalar')),
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId()
        return id ? !HIDDEN_FROM_LIST.has(id) : true
      }),
    ])
