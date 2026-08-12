/** Shared GROQ projections for page builder blocks (document-level localized pages). */
export const simpleCtaProjection = /* groq */ `
  label,
  linkType,
  internalPath,
  externalUrl,
  variant
`

export const imageWithAltProjection = /* groq */ `
  asset,
  alt,
  hotspot,
  crop
`

export const pageBuilderProjection = /* groq */ `
  pageBuilder[]{
    _key,
    _type,
    ...,
    _type == "heroSliderSection" => {
      accessibilityLabel,
      rotationMode,
      interval,
      slides[]{
        _key,
        eyebrow,
        heading,
        description,
        desktopImage{${imageWithAltProjection}},
        mobileImage{${imageWithAltProjection}},
        primaryCta{${simpleCtaProjection}},
        secondaryCta{${simpleCtaProjection}}
      }
    },
    _type == "heroSection" => {
      eyebrow,
      heading,
      description,
      primaryCta{${simpleCtaProjection}},
      secondaryCta{${simpleCtaProjection}},
      media{${imageWithAltProjection}},
      trustItems[]{_key, label}
    },
    _type == "productShowcaseSection" => {
      heading,
      description,
      products[]->{
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
        primaryCategory->{
          "title": title[language == $locale || _key == $locale][0].value,
          "slug": slug.current
        }
      }
    },
    _type == "featureGridSection" => {
      heading,
      description,
      features[]{_key, title, description, icon}
    },
    _type == "applicationGridSection" => {
      heading,
      description,
      applicationAreas[]->{
        _id,
        "title": title[language == $locale || _key == $locale][0].value,
        "slug": slug.current,
        "summary": summary[language == $locale || _key == $locale][0].value,
        coverImage{${imageWithAltProjection}},
        icon
      }
    },
    _type == "imageTextSection" => {
      heading,
      body,
      image{${imageWithAltProjection}},
      cta{${simpleCtaProjection}}
    },
    _type == "statsSection" => {
      heading,
      stats[]{_key, value, label}
    },
    _type == "certificateSection" => {
      heading,
      description,
      certificates[]->{
        _id,
        "name": name[language == $locale || _key == $locale][0].value,
        issuer,
        certificateNumber,
        logo{${imageWithAltProjection}}
      }
    },
    _type == "videoSection" => {
      heading,
      description,
      videos[]->{
        _id,
        "title": title[language == $locale || _key == $locale][0].value,
        "description": description[language == $locale || _key == $locale][0].value,
        provider,
        externalUrl,
        playbackId,
        coverImage{${imageWithAltProjection}}
      }
    },
    _type == "latestContentSection" => {
      heading,
      description,
      source
    },
    _type == "ctaSection" => {
      heading,
      description,
      cta{${simpleCtaProjection}}
    }
  }
`

export const seoProjection = /* groq */ `
  seo{
    noIndex,
    ogImage,
    "title": coalesce(
      title[language == $locale || _key == $locale][0].value,
      title
    ),
    "description": coalesce(
      description[language == $locale || _key == $locale][0].value,
      description
    )
  }
`
