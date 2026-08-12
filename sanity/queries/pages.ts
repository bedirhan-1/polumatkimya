import {defineQuery} from 'next-sanity'

import {
  imageWithAltProjection,
  pageBuilderProjection,
  seoProjection,
  simpleCtaProjection,
} from '../fragments/page-builder'

export const homeHeroProjection = /* groq */ `
  eyebrow,
  headingLead,
  headingAccent,
  headingTail,
  description,
  desktopImage{${imageWithAltProjection}},
  mobileImage{${imageWithAltProjection}},
  primaryCta{${simpleCtaProjection}},
  secondaryCta{${simpleCtaProjection}},
  trustItems[]{_key, title, description}
`

const productCardProjection = /* groq */ `
  _id,
  "title": title[language == $locale || _key == $locale][0].value,
  "slug": slug.current,
  "shortDescription": shortDescription[language == $locale || _key == $locale][0].value,
  "badge": badge[language == $locale || _key == $locale][0].value,
  featured,
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
`

const applicationAreaCardProjection = /* groq */ `
  _id,
  "title": title[language == $locale || _key == $locale][0].value,
  "slug": slug.current,
  "summary": summary[language == $locale || _key == $locale][0].value,
  coverImage{${imageWithAltProjection}},
  icon{asset}
`

export const HOME_PAGE_QUERY = defineQuery(`
  *[_type == "homePage" && language == $locale && translationStatus == "complete"][0]{
    _id,
    title,
    language,
    translationStatus,
    ${seoProjection},
    hero{${homeHeroProjection}},
    productsSection{
      eyebrow,
      title,
      description,
      viewAllLabel,
      detailLabel,
      products[]->{${productCardProjection}}
    },
    strengthsSection{
      eyebrow,
      title,
      items[]{_key, title, description}
    },
    industriesSection{
      eyebrow,
      title,
      description,
      detailLabel,
      viewAllCta{${simpleCtaProjection}},
      areas[]{
        _key,
        title,
        summary,
        "area": area->{${applicationAreaCardProjection}}
      }
    },
    privateLabelSection{
      eyebrow,
      title,
      description,
      cta{${simpleCtaProjection}},
      image{${imageWithAltProjection}},
      features[]{_key, title, description},
      processTitle,
      process[]{_key, title, description}
    },
    aboutSection{
      eyebrow,
      title,
      description,
      cta{${simpleCtaProjection}},
      image{${imageWithAltProjection}},
      videoPlayLabel,
      streamUrl,
      streamVideoId,
      stats[]{_key, value, label, icon{${imageWithAltProjection}}}
    },
    qualitySection{
      eyebrow,
      title,
      link{${simpleCtaProjection}},
      items[]{_key, label, icon{${imageWithAltProjection}}},
      badges[]{_key, label, image{${imageWithAltProjection}}}
    },
    ctaSection{
      eyebrow,
      title,
      description,
      primaryCta{${simpleCtaProjection}},
      secondaryCta{${simpleCtaProjection}}
    }
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
