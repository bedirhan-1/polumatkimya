import {defineQuery} from 'next-sanity'

import {pageBuilderProjection, seoProjection} from '@/sanity/fragments/page-builder'

export const HOME_PAGE_QUERY = defineQuery(`
  *[_type == "homePage" && language == $locale && translationStatus == "complete"][0]{
    _id,
    title,
    language,
    translationStatus,
    ${seoProjection},
    ${pageBuilderProjection}
  }
`)

export const CONTACT_PAGE_QUERY = defineQuery(`
  *[_type == "contactPage" && language == $locale && translationStatus == "complete"][0]{
    _id,
    title,
    intro,
    formSuccessMessage,
    formErrorMessage,
    language,
    translationStatus,
    ${seoProjection},
    ${pageBuilderProjection}
  }
`)

export const PAGE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "page" && language == $locale && slug.current == $slug && translationStatus == "complete"][0]{
    _id,
    title,
    "slug": slug.current,
    language,
    translationStatus,
    ${seoProjection},
    ${pageBuilderProjection}
  }
`)
