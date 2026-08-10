import {defineQuery} from 'next-sanity'

import {imageWithAltProjection, seoProjection} from '../fragments/page-builder'

const relatedProductProjection = /* groq */ `
  _id,
  "title": title[language == $locale || _key == $locale][0].value,
  "slug": slug.current,
  "shortDescription": shortDescription[language == $locale || _key == $locale][0].value,
  cardImage{
    asset,
    hotspot,
    crop,
    "alt": alt[language == $locale || _key == $locale][0].value
  },
  packshot{
    asset,
    hotspot,
    crop,
    "alt": alt[language == $locale || _key == $locale][0].value
  },
  primaryCategory->{
    _id,
    "title": title[language == $locale || _key == $locale][0].value,
    "slug": slug.current
  }
`

const postCardProjection = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  category,
  author,
  language,
  coverImage{${imageWithAltProjection}}
`

const postTranslationsProjection = /* groq */ `
  "_translations": *[_type == "translation.metadata" && references(^._id)][0].translations[].value->{
    language,
    "slug": slug.current,
    translationStatus
  }
`

export const POSTS_QUERY = defineQuery(`
  *[
    _type == "post" &&
    language == $locale &&
    translationStatus == "complete" &&
    defined(slug.current)
  ] | order(publishedAt desc) {
    ${postCardProjection}
  }
`)

export const POST_BY_SLUG_QUERY = defineQuery(`
  *[
    _type == "post" &&
    language == $locale &&
    slug.current == $slug &&
    translationStatus == "complete"
  ][0]{
    ${postCardProjection},
    body,
    relatedProducts[]->{
      ${relatedProductProjection}
    },
    ${seoProjection},
    ${postTranslationsProjection}
  }
`)

export const POST_SLUGS_QUERY = defineQuery(`
  *[
    _type == "post" &&
    translationStatus == "complete" &&
    defined(slug.current) &&
    defined(language)
  ]{
    "slug": slug.current,
    language
  }
`)

export const LATEST_POSTS_QUERY = defineQuery(`
  *[
    _type == "post" &&
    language == $locale &&
    translationStatus == "complete" &&
    defined(slug.current)
  ] | order(publishedAt desc)[0...$limit] {
    ${postCardProjection}
  }
`)

export const VIDEOS_QUERY = defineQuery(`
  *[_type == "video"] | order(coalesce(publishedAt, _createdAt) desc) {
    _id,
    "title": title[language == $locale || _key == $locale][0].value,
    "description": description[language == $locale || _key == $locale][0].value,
    provider,
    externalUrl,
    playbackId,
    publishedAt,
    coverImage{${imageWithAltProjection}},
    relatedProducts[]->{
      ${relatedProductProjection}
    }
  }
`)

export const LATEST_VIDEOS_QUERY = defineQuery(`
  *[_type == "video"] | order(coalesce(publishedAt, _createdAt) desc)[0...$limit] {
    _id,
    "title": title[language == $locale || _key == $locale][0].value,
    "description": description[language == $locale || _key == $locale][0].value,
    provider,
    externalUrl,
    playbackId,
    publishedAt,
    coverImage{${imageWithAltProjection}}
  }
`)
