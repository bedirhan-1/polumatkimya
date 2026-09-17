import {defineQuery} from 'next-sanity'

import {imageWithAltProjection, seoProjection} from '../fragments/page-builder'

export const APPLICATION_AREAS_QUERY = defineQuery(`
  *[_type == "applicationArea" && defined(slug.current)] | order(title[language == $locale || _key == $locale][0].value asc) {
    _id,
    "title": title[language == $locale || _key == $locale][0].value,
    "slug": slug.current,
    "summary": summary[language == $locale || _key == $locale][0].value,
    coverImage{${imageWithAltProjection}},
    icon{${imageWithAltProjection}}
  }
`)

export const APPLICATION_AREA_BY_SLUG_QUERY = defineQuery(`
  *[_type == "applicationArea" && slug.current == $slug][0]{
    _id,
    "title": title[language == $locale || _key == $locale][0].value,
    "slug": slug.current,
    "summary": summary[language == $locale || _key == $locale][0].value,
    "body": body[language == $locale || _key == $locale][0].value,
    coverImage{${imageWithAltProjection}},
    benefits[]{
      _key,
      "title": title[language == $locale || _key == $locale][0].value,
      "description": description[language == $locale || _key == $locale][0].value
    },
    products[]->{
      _id,
      "title": title[language == $locale || _key == $locale][0].value,
      "slug": slug.current,
      sku,
      "shortDescription": shortDescription[language == $locale || _key == $locale][0].value,
      "badge": badge[language == $locale || _key == $locale][0].value,
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
      "primaryCategory": coalesce(
        primaryCategory->{_id, "title": title[language == $locale || _key == $locale][0].value, "slug": slug.current},
        categories[0]->{_id, "title": title[language == $locale || _key == $locale][0].value, "slug": slug.current}
      )
    },
    ${seoProjection}
  }
`)

export const APPLICATION_AREA_SLUGS_QUERY = defineQuery(`
  *[_type == "applicationArea" && defined(slug.current)]{"slug": slug.current}
`)
