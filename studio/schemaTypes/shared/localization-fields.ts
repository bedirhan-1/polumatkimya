import {defineField} from 'sanity'

export const translationStatusField = defineField({
  name: 'translationStatus',
  title: 'Translation status',
  type: 'string',
  options: {
    list: [
      {title: 'Draft', value: 'draft'},
      {title: 'In review', value: 'inReview'},
      {title: 'Complete', value: 'complete'},
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
