import {defineQuery} from 'next-sanity'

import {imageWithAltProjection, seoProjection} from '@/sanity/fragments/page-builder'

export const APPLICATION_AREAS_QUERY = defineQuery(`
  *[_type == "applicationArea" && defined(slug.current)] | order(title[0].value asc) {
    _id,
    "title": title[language == $locale || _key == $locale][0].value,
    "slug": slug.current,
    "summary": summary[language == $locale || _key == $locale][0].value,
    coverImage{${imageWithAltProjection}},
    icon
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
    icon,
    benefits[]{
      _key,
      "title": title[language == $locale || _key == $locale][0].value,
      "description": description[language == $locale || _key == $locale][0].value,
      icon
    },
    products[]->{
      _id,
      "title": title[language == $locale || _key == $locale][0].value,
      "slug": slug.current,
      "shortDescription": shortDescription[language == $locale || _key == $locale][0].value,
      cardImage{asset, alt}
    },
    cta{
      variant,
      "label": label[language == $locale || _key == $locale][0].value,
      link{
        linkType,
        internalPath,
        externalUrl,
        openInNewTab,
        reference->{_type, "slug": slug.current, language}
      }
    },
    ${seoProjection}
  }
`)

export const APPLICATION_AREA_SLUGS_QUERY = defineQuery(`
  *[_type == "applicationArea" && defined(slug.current)]{"slug": slug.current}
`)
