import {ComposeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const specificationItemType = defineType({
  name: 'specificationItem',
  title: 'Teknik özellik maddesi',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Etiket',
      type: 'internationalizedArrayString',
      description: 'Ürün sayfasındaki teknik özellik tablosunda satır adı (sol sütun).',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'value',
      title: 'Değer',
      type: 'internationalizedArrayString',
      description: 'Ürün sayfasındaki teknik özellik tablosunda ölçüm veya değer (sağ sütun).',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'unit',
      title: 'Birim',
      type: 'internationalizedArrayString',
      description: 'Ürün sayfasında değerin yanında gösterilen birim (örn. kg, °C).',
    }),
    defineField({
      name: 'note',
      title: 'Not',
      type: 'internationalizedArrayString',
      description: 'Ürün sayfasında özelliğe ek kısa açıklama veya dipnot.',
    }),
  ],
  preview: {
    select: {
      value: 'value',
      unit: 'unit',
    },
    prepare({value, unit}) {
      const pick = (field: unknown) => {
        if (typeof field === 'string') return field
        if (!Array.isArray(field)) return ''
        const preferred =
          field.find((entry) => entry?.language === 'tr' || entry?._key === 'tr') ||
          field.find((entry) => entry?.language === 'en' || entry?._key === 'en') ||
          field[0]
        return typeof preferred?.value === 'string' ? preferred.value : ''
      }
      const valueText = pick(value)
      const unitText = pick(unit)
      return {
        title: unitText ? `${valueText} ${unitText}` : valueText || 'Teknik özellik',
      }
    },
  },
})

export const specificationGroupType = defineType({
  name: 'specificationGroup',
  title: 'Teknik özellik grubu',
  type: 'object',
  icon: ComposeIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'internationalizedArrayString',
      description: 'Ürün sayfasında bir teknik özellik tablosunun grup başlığı.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Maddeler',
      type: 'array',
      description: 'Bu grup altında ürün sayfasında listelenen özellik satırları.',
      of: [defineArrayMember({type: 'specificationItem'})],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Teknik özellik grubu'}
    },
  },
})
