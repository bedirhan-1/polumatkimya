import {BlockElementIcon} from '@sanity/icons'
import {defineArrayMember, defineType} from 'sanity'

export const pageBuilderType = defineType({
  name: 'pageBuilder',
  title: 'Page builder',
  type: 'array',
  icon: BlockElementIcon,
  of: [
    defineArrayMember({type: 'heroSection'}),
    defineArrayMember({type: 'productShowcaseSection'}),
    defineArrayMember({type: 'featureGridSection'}),
    defineArrayMember({type: 'applicationGridSection'}),
    defineArrayMember({type: 'imageTextSection'}),
    defineArrayMember({type: 'statsSection'}),
    defineArrayMember({type: 'certificateSection'}),
    defineArrayMember({type: 'videoSection'}),
    defineArrayMember({type: 'latestContentSection'}),
    defineArrayMember({type: 'ctaSection'}),
  ],
})
