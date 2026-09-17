import {BlockElementIcon} from '@sanity/icons'
import {defineArrayMember, defineType} from 'sanity'

export const pageBuilderType = defineType({
  name: 'pageBuilder',
  title: 'Sayfa oluşturucu',
  type: 'array',
  icon: BlockElementIcon,
  description:
    'Sayfa gövdesindeki bölümler. Sırayı değiştirmek sitedeki bölüm sırasını doğrudan etkiler.',
  of: [
    defineArrayMember({type: 'heroSection'}),
    defineArrayMember({type: 'productShowcaseSection'}),
    defineArrayMember({type: 'featureGridSection'}),
    defineArrayMember({type: 'applicationGridSection'}),
    defineArrayMember({type: 'imageTextSection'}),
    defineArrayMember({type: 'statsSection'}),
    defineArrayMember({type: 'certificateSection'}),
    defineArrayMember({type: 'galleryShowcaseSection'}),
    defineArrayMember({type: 'videoSection'}),
    defineArrayMember({type: 'latestContentSection'}),
    defineArrayMember({type: 'ctaSection'}),
  ],
})
