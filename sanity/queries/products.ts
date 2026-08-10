import {defineQuery} from 'next-sanity'

import {imageWithAltProjection, seoProjection} from '../fragments/page-builder'

const localizedImageProjection = /* groq */ `
  asset,
  hotspot,
  crop,
  "alt": alt[language == $locale || _key == $locale][0].value
`

const productCardProjection = /* groq */ `
  _id,
  "title": title[language == $locale || _key == $locale][0].value,
  "slug": slug.current,
  sku,
  "shortDescription": shortDescription[language == $locale || _key == $locale][0].value,
  "badge": badge[language == $locale || _key == $locale][0].value,
  featured,
  cardImage{${localizedImageProjection}},
  packshot{${localizedImageProjection}},
  primaryCategory->{
    _id,
    "title": title[language == $locale || _key == $locale][0].value,
    "slug": slug.current
  }
`

export const PRODUCT_CATEGORIES_QUERY = defineQuery(`
  *[_type == "productCategory" && defined(slug.current)] | order(sortOrder asc) {
    _id,
    "title": title[language == $locale || _key == $locale][0].value,
    "slug": slug.current,
    "summary": summary[language == $locale || _key == $locale][0].value,
    image{${imageWithAltProjection}},
    sortOrder
  }
`)

export const PRODUCT_CATEGORY_BY_SLUG_QUERY = defineQuery(`
  *[_type == "productCategory" && slug.current == $slug][0]{
    _id,
    "title": title[language == $locale || _key == $locale][0].value,
    "slug": slug.current,
    "summary": summary[language == $locale || _key == $locale][0].value,
    "body": body[language == $locale || _key == $locale][0].value,
    image{${imageWithAltProjection}},
    ${seoProjection}
  }
`)

const productListFilter = /* groq */ `
  status == "published" &&
  defined(slug.current) &&
  ($category == "" || primaryCategory->slug.current == $category || $category in categories[]->slug.current) &&
  ($industry == "" || $industry in applicationAreas[]->slug.current) &&
  (
    $q == "" ||
    title[language == $locale || _key == $locale][0].value match $qWildcard ||
    shortDescription[language == $locale || _key == $locale][0].value match $qWildcard ||
    sku match $qWildcard
  )
`

/** Catalog order comes from the `productOrder` singleton (drag & drop in Studio). */
export const PRODUCTS_QUERY = defineQuery(`
  (
    coalesce(
      *[_id == "productOrder"][0].products[
        @->status == "published" &&
        defined(@->slug.current) &&
        ($category == "" || @->primaryCategory->slug.current == $category || $category in @->categories[]->slug.current) &&
        ($industry == "" || $industry in @->applicationAreas[]->slug.current) &&
        (
          $q == "" ||
          @->title[language == $locale || _key == $locale][0].value match $qWildcard ||
          @->shortDescription[language == $locale || _key == $locale][0].value match $qWildcard ||
          @->sku match $qWildcard
        )
      ]->{
        ${productCardProjection}
      },
      []
    )
    +
    *[
      _type == "product" &&
      ${productListFilter} &&
      !(_id in coalesce(*[_id == "productOrder"][0].products[]._ref, []))
    ] | order(title[language == $locale || _key == $locale][0].value asc) {
      ${productCardProjection}
    }
  )
`)

export const PRODUCT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "product" && slug.current == $slug && status == "published"][0]{
    _id,
    "title": title[language == $locale || _key == $locale][0].value,
    "slug": slug.current,
    sku,
    "shortDescription": shortDescription[language == $locale || _key == $locale][0].value,
    "body": body[language == $locale || _key == $locale][0].value,
    "badge": badge[language == $locale || _key == $locale][0].value,
    "usageAreas": usageAreas[language == $locale || _key == $locale][0].value,
    "applicationInstructions": applicationInstructions[language == $locale || _key == $locale][0].value,
    "warnings": warnings[language == $locale || _key == $locale][0].value,
    externalVideoUrl,
    cardImage{${localizedImageProjection}},
    packshot{${localizedImageProjection}},
    gallery[]{${localizedImageProjection}},
    primaryCategory->{
      _id,
      "title": title[language == $locale || _key == $locale][0].value,
      "slug": slug.current
    },
    categories[]->{
      _id,
      "title": title[language == $locale || _key == $locale][0].value,
      "slug": slug.current
    },
    applicationAreas[]->{
      _id,
      "title": title[language == $locale || _key == $locale][0].value,
      "slug": slug.current
    },
    benefits[]{
      _key,
      "title": title[language == $locale || _key == $locale][0].value,
      "description": description[language == $locale || _key == $locale][0].value,
      icon
    },
    features[]{
      _key,
      "title": title[language == $locale || _key == $locale][0].value,
      "description": description[language == $locale || _key == $locale][0].value,
      icon
    },
    packagingVariants[]{
      _key,
      sku,
      volume,
      "label": label[language == $locale || _key == $locale][0].value
    },
    specificationGroups[]{
      _key,
      "title": title[language == $locale || _key == $locale][0].value,
      items[]{
        _key,
        value,
        unit,
        "label": label[language == $locale || _key == $locale][0].value,
        "note": note[language == $locale || _key == $locale][0].value
      }
    },
    documents[]{
      _key,
      "label": label[language == $locale || _key == $locale][0].value,
      document->{
        _id,
        title,
        documentType,
        version,
        file{asset->{url, originalFilename, size}}
      }
    },
    relatedProducts[]->{
      ${productCardProjection}
    },
    productCta{
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

export const PRODUCT_SLUGS_QUERY = defineQuery(`
  *[_type == "product" && status == "published" && defined(slug.current)]{"slug": slug.current}
`)

export const PRODUCT_CATEGORY_SLUGS_QUERY = defineQuery(`
  *[_type == "productCategory" && defined(slug.current)]{"slug": slug.current}
`)

export const FILTER_INDUSTRIES_QUERY = defineQuery(`
  *[_type == "applicationArea" && defined(slug.current)] | order(title[language == $locale || _key == $locale][0].value asc) {
    _id,
    "title": title[language == $locale || _key == $locale][0].value,
    "slug": slug.current
  }
`)
