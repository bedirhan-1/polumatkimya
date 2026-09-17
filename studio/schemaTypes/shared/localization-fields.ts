import {defineField} from 'sanity'

export const translationStatusField = defineField({
  name: 'translationStatus',
  title: 'Çeviri durumu',
  type: 'string',
  description: 'Bu dil sürümünün çeviri sürecindeki durumunu belirler (Studio içi takip).',
  options: {
    list: [
      {title: 'Taslak', value: 'draft'},
      {title: 'İncelemede', value: 'inReview'},
      {title: 'Tamamlandı', value: 'complete'},
    ],
    layout: 'radio',
  },
  initialValue: 'draft',
})

export const languageField = defineField({
  name: 'language',
  type: 'string',
  readOnly: true,
  hidden: true,
})
