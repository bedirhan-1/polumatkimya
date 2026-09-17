import {DocumentTextIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {slugValidation, isUniqueSlugPerLanguage} from '../../lib/slug'
import {languageField, translationStatusField} from '../shared/localization-fields'

export const postType = defineType({
  name: 'post',
  title: 'Blog yazısı',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    languageField,
    translationStatusField,
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'string',
      description: 'Blog yazısının listelerde ve yazı sayfasında görünen başlığını belirler.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Sayfa adresi (slug)',
      type: 'slug',
      description:
        'Blog yazısının web adresi. Aynı yazının Türkçe/İngilizce/Arapça sürümleri aynı adresi paylaşır.',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: isUniqueSlugPerLanguage,
      },
      validation: slugValidation,
    }),
    defineField({
      name: 'excerpt',
      title: 'Özet',
      type: 'text',
      rows: 3,
      description: 'Blog listelerinde ve önizlemelerde görünen kısa özeti belirler.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Kapak görseli',
      type: 'imageWithAlt',
      description: 'Blog listesi kartlarında ve yazı sayfasının üstündeki kapak görselini belirler.',
    }),
    defineField({
      name: 'body',
      title: 'İçerik',
      type: 'portableText',
      description: 'Blog yazısı sayfasının ana metin içeriğini belirler.',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Yayın tarihi',
      type: 'datetime',
      description: 'Blog yazısının sitede gösterilen yayın tarihini belirler.',
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      description: 'Blog yazısının kategorisini belirler; listelerde etiket olarak görünebilir.',
    }),
    defineField({
      name: 'author',
      title: 'Yazar',
      type: 'string',
      description: 'Blog yazısında gösterilen yazar adını belirler.',
    }),
    defineField({
      name: 'relatedProducts',
      title: 'İlgili ürünler',
      type: 'array',
      description: 'Blog yazısı sayfasının altındaki ilgili ürünler bölümünü belirler.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'product'}]})],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      description: 'Blog yazısının arama motoru başlığı, açıklaması ve paylaşım görselini belirler.',
    }),
    defineField({
      name: 'legacyId',
      title: 'Eski sistem ID',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'legacyUrls',
      title: 'Eski URL’ler',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'previousSlugs',
      title: 'Önceki slug’lar',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      language: 'language',
      media: 'coverImage',
      status: 'translationStatus',
    },
    prepare({title, language, media, status}) {
      return {
        title: title || 'Yazı',
        subtitle: [language?.toUpperCase(), status].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
