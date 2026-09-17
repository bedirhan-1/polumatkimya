import {DocumentIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {slugValidation, isUniqueSlugPerLanguage} from '../../lib/slug'
import {languageField, translationStatusField} from '../shared/localization-fields'

export const pageType = defineType({
  name: 'page',
  title: 'Sayfa',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    languageField,
    translationStatusField,
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'string',
      description: 'Sayfanın sitede ve Studio listesinde görünen başlığını belirler.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Sayfa adresi (slug)',
      type: 'slug',
      description:
        'Sayfanın web adresi. Aynı sayfanın Türkçe/İngilizce/Arapça sürümleri aynı adresi paylaşır.',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: isUniqueSlugPerLanguage,
      },
      validation: slugValidation,
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Sayfa oluşturucu',
      type: 'pageBuilder',
      description: 'Sayfanın içeriğini oluşturan bölümleri (blokları) belirler.',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      description: 'Sayfanın arama motoru başlığı, açıklaması ve paylaşım görselini belirler.',
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
      slug: 'slug.current',
      status: 'translationStatus',
    },
    prepare({title, language, slug, status}) {
      return {
        title: title || slug || 'Sayfa',
        subtitle: [language?.toUpperCase(), slug, status].filter(Boolean).join(' · '),
      }
    },
  },
})
