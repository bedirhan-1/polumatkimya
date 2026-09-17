import {TagIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {slugValidation, isUniqueSlug} from '../../lib/slug'

export const productCategoryType = defineType({
  name: 'productCategory',
  title: 'Ürün kategorisi',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'internationalizedArrayString',
      description: 'Katalog ve kategori sayfalarında görünen kategori adını belirler.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Sayfa adresi (slug)',
      type: 'slug',
      description: 'Kategori sayfasının web adresi. Tüm dillerde ortak kullanılır (örn. /tr/products/category/sprays).',
      options: {
        maxLength: 96,
        isUnique: isUniqueSlug,
      },
      validation: slugValidation,
    }),
    defineField({
      name: 'summary',
      title: 'Özet',
      type: 'internationalizedArrayText',
      description: 'Kategori kartlarında ve kategori sayfasının üstünde görünen kısa özeti belirler.',
    }),
    defineField({
      name: 'body',
      title: 'Detay',
      type: 'internationalizedArrayPortableText',
      description: 'Kategori detay sayfasındaki uzun açıklama metnini belirler.',
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sıralama',
      type: 'number',
      description: 'Kategorilerin katalog listesindeki sırasını belirler; düşük sayılar önce gelir.',
      initialValue: 0,
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'localizedSeo',
      description: 'Kategori sayfasının arama motoru başlığı, açıklaması ve paylaşım görselini belirler.',
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
  ],
  orderings: [
    {
      title: 'Sıralama',
      name: 'sortOrderAsc',
      by: [{field: 'sortOrder', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      titleTr: 'title',
      slug: 'slug.current',
    },
    prepare({titleTr, slug}) {
      const localized = Array.isArray(titleTr)
        ? titleTr.find((item: {language?: string; _key?: string; value?: string}) => item.language === 'tr' || item._key === 'tr')
            ?.value
        : undefined
      return {
        title: localized || slug || 'Kategori',
        subtitle: slug,
      }
    },
  },
})
