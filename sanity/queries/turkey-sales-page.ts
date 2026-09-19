import {defineQuery} from 'next-sanity'

import {localeValue} from '../fragments/i18n'
import {seoProjection} from '../fragments/page-builder'

export const TURKEY_SALES_PAGE_QUERY = defineQuery(/* groq */ `
  *[_id == "turkeySalesPage" && _type == "turkeySalesPage"][0]{
    _id,
    "eyebrow": ${localeValue('eyebrow')},
    "title": ${localeValue('title')},
    "intro": ${localeValue('intro')},
    "mapTitle": ${localeValue('mapTitle')},
    "mapDescription": ${localeValue('mapDescription')},
    highlights[]{
      _key,
      "title": ${localeValue('title')},
      "description": ${localeValue('description')}
    },
    "contactEyebrow": ${localeValue('contactEyebrow')},
    "contactTitle": ${localeValue('contactTitle')},
    "contactDescription": ${localeValue('contactDescription')},
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
