import {CubeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {slugValidation, isUniqueSlug} from '../../lib/slug'

export const productType = defineType({
  name: 'product',
  title: 'Ürün',
  type: 'document',
  icon: CubeIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'internationalizedArrayString',
      description: 'Ürün sayfası ve ürün kartlarında görünen ürün adını belirler.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Sayfa adresi (slug)',
      type: 'slug',
      description: 'Ürün sayfasının web adresi. Tüm dillerde ortak kullanılır (örn. /tr/products/mdf-kit).',
      options: {maxLength: 96, isUnique: isUniqueSlug},
      validation: slugValidation,
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
      description: 'Ürünün stok / katalog kodunu belirler; sitede ürün detayında gösterilebilir.',
    }),
    defineField({
      name: 'status',
      title: 'Yayın durumu',
      type: 'string',
      description: 'Ürünün sitede görünür olup olmadığını (taslak, yayınlandı, arşiv) belirler.',
      options: {
        list: [
          {title: 'Taslak', value: 'draft'},
          {title: 'Yayınlandı', value: 'published'},
          {title: 'Arşivlendi', value: 'archived'},
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Kısa açıklama',
      type: 'internationalizedArrayText',
      description: 'Ürün kartlarında ve ürün sayfasının üstünde görünen kısa özeti belirler.',
    }),
    defineField({
      name: 'primaryCategory',
      title: 'Ana kategori',
      type: 'reference',
      description: 'Ürünün ana kategorisini belirler; ürün listesi filtrelerinde ve sayfa yolunda kullanılır.',
      to: [{type: 'productCategory'}],
    }),
    defineField({
      name: 'categories',
      title: 'Ek kategoriler',
      type: 'array',
      description: 'Ürünün ek olarak listeleneceği kategorileri belirler.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'productCategory'}]})],
    }),
    defineField({
      name: 'applicationAreas',
      title: 'Uygulama alanları',
      type: 'array',
      description: 'Ürün sayfasında ve uygulama alanı sayfalarında gösterilen ilişkili alanları belirler.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'applicationArea'}]})],
    }),
    defineField({
      name: 'cardImage',
      title: 'Kart görseli',
      type: 'localizedImageWithAlt',
      description: 'Ürün listesi ve katalog kartlarında görünen küçük görseli belirler.',
    }),
    defineField({
      name: 'packshot',
      title: 'Ana ürün görseli',
      type: 'localizedImageWithAlt',
      description: 'Ürün detay sayfasının en üstündeki ana ürün fotoğrafını belirler.',
    }),
    defineField({
      name: 'gallery',
      title: 'Galeri',
      type: 'array',
      description: 'Ürün detay sayfasındaki ek görsel galerisini belirler.',
      of: [defineArrayMember({type: 'localizedImageWithAlt'})],
    }),
    defineField({
      name: 'badge',
      title: 'Rozet',
      type: 'internationalizedArrayString',
      description: 'Ürün kartında veya detayda görünen kısa rozet metnini belirler (örn. “Yeni”).',
    }),
    defineField({
      name: 'benefits',
      title: 'Faydalar',
      type: 'array',
      description: 'Ürün detay sayfasındaki faydalar / avantajlar listesini belirler.',
      of: [defineArrayMember({type: 'featureItem'})],
    }),
    defineField({
      name: 'features',
      title: 'Ürün özellikleri',
      type: 'array',
      description: 'Ürün detay sayfasındaki özellikler listesini belirler.',
      of: [defineArrayMember({type: 'featureItem'})],
    }),
    defineField({
      name: 'usageAreas',
      title: 'Kullanım alanları',
      type: 'internationalizedArrayPortableText',
      description: 'Ürün detay sayfasındaki kullanım alanları metnini belirler.',
    }),
    defineField({
      name: 'applicationInstructions',
      title: 'Uygulama talimatları',
      type: 'internationalizedArrayPortableText',
      description: 'Ürün detay sayfasındaki uygulama / kullanım talimatları bölümünü belirler.',
    }),
    defineField({
      name: 'warnings',
      title: 'Uyarılar',
      type: 'internationalizedArrayPortableText',
      description: 'Ürün detay sayfasındaki güvenlik / uyarı metinlerini belirler.',
    }),
    defineField({
      name: 'packagingVariants',
      title: 'Ambalaj çeşitleri',
      type: 'array',
      description: 'Ürün detay sayfasında listelenen ambalaj / paketleme seçeneklerini belirler.',
      of: [defineArrayMember({type: 'packagingVariant'})],
    }),
    defineField({
      name: 'specificationGroups',
      title: 'Teknik özellik grupları',
      type: 'array',
      description: 'Ürün detay sayfasındaki teknik özellik tablolarını belirler.',
      of: [defineArrayMember({type: 'specificationGroup'})],
    }),
    defineField({
      name: 'relatedProducts',
      title: 'İlgili ürünler',
      type: 'array',
      description: 'Ürün detay sayfasının altındaki “ilgili ürünler” bölümünü belirler.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'product'}]})],
    }),
    defineField({
      name: 'documents',
      title: 'SDS / TDS / katalog belgeleri',
      type: 'array',
      description: 'Ürün detay sayfasından indirilebilen SDS, TDS ve katalog dosyalarını belirler.',
      of: [defineArrayMember({type: 'documentReference'})],
    }),
    defineField({
      name: 'productCta',
      title: 'Ürün CTA',
      type: 'callToAction',
      description: 'Ürün detay sayfasındaki harekete geçirici buton / çağrı alanını belirler.',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'localizedSeo',
      description: 'Ürün sayfasının arama motoru başlığı, açıklaması ve paylaşım görselini belirler.',
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
      titleTr: 'title',
      slug: 'slug.current',
      sku: 'sku',
      media: 'packshot',
      status: 'status',
    },
    prepare({titleTr, slug, sku, media, status}) {
      const localized = Array.isArray(titleTr)
        ? titleTr.find((item: {_key?: string; language?: string; value?: string}) => item.language === 'tr' || item._key === 'tr')
            ?.value
        : undefined
      return {
        title: localized || slug || sku || 'Ürün',
        subtitle: [slug, sku, status].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
