import {defineQuery} from 'next-sanity'

import {localeValue} from '../fragments/i18n'
import {seoProjection} from '../fragments/page-builder'

export const EXPORT_PAGE_QUERY = defineQuery(/* groq */ `
  *[_id == "exportPage" && _type == "exportPage"][0]{
    _id,
    "eyebrow": ${localeValue('eyebrow')},
    "title": ${localeValue('title')},
    "intro": ${localeValue('intro')},
    countryCount,
    "countryLabel": ${localeValue('countryLabel')},
    "activityEyebrow": ${localeValue('activityEyebrow')},
    "activityTitle": ${localeValue('activityTitle')},
    "activityDescription": ${localeValue('activityDescription')},
    activities[]{
      _key,
      "title": ${localeValue('title')},
      "description": ${localeValue('description')}
    },
    "contactEyebrow": ${localeValue('contactEyebrow')},
    "contactTitle": ${localeValue('contactTitle')},
    "contactDescription": ${localeValue('contactDescription')},
    leadContact{
      name,
      phone,
      email,
      "role": ${localeValue('role')}
    },
    regionalContacts[]{
      _key,
      name,
      phone,
      email,
      "role": ${localeValue('role')}
    },
    // Legacy fallback while content migrates from contacts[]
    contacts[]{
      _key,
      name,
      phone,
      email,
      "role": ${localeValue('role')}
    },
    ${seoProjection}
  }
`)
