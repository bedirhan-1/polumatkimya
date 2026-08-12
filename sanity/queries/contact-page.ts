import {defineQuery} from 'next-sanity'

import {localeValue} from '../fragments/i18n'
import {seoProjection} from '../fragments/page-builder'

export const CONTACT_PAGE_QUERY = defineQuery(/* groq */ `
  *[_id == "contactPage" && _type == "contactPage"][0]{
    _id,
    "eyebrow": ${localeValue('eyebrow')},
    "title": ${localeValue('title')},
    "intro": ${localeValue('intro')},
    "phonesSectionTitle": ${localeValue('phonesSectionTitle')},
    "emailsSectionTitle": ${localeValue('emailsSectionTitle')},
    "corporateSectionTitle": ${localeValue('corporateSectionTitle')},
    corporatePhone,
    corporateEmail,
    phones[]{
      _key,
      phone,
      "label": ${localeValue('label')}
    },
    emails[]{
      _key,
      email,
      "label": ${localeValue('label')}
    },
    locations[]{
      _key,
      locationId,
      postalCode,
      mapEmbedUrl,
      mapsUrl,
      "label": ${localeValue('label')},
      "addressLine": ${localeValue('addressLine')},
      "city": ${localeValue('city')},
      "mapTitle": ${localeValue('mapTitle')}
    },
    "formTitle": ${localeValue('formTitle')},
    "formDescription": ${localeValue('formDescription')},
    "openInMapsLabel": ${localeValue('openInMapsLabel')},
    "formSuccessMessage": ${localeValue('formSuccessMessage')},
    "formErrorMessage": ${localeValue('formErrorMessage')},
    ${seoProjection}
  }
`)
