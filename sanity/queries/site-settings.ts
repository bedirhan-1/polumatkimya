import {defineQuery} from 'next-sanity'

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    _id,
    companyName,
    siteUrl,
    whatsappNumber,
    "shortDescription": shortDescription[_key == $locale][0].value,
    "address": address[_key == $locale][0].value,
    "workingHours": workingHours[_key == $locale][0].value,
    "footerLegalText": footerLegalText[_key == $locale][0].value,
    logoLight{
      asset,
      alt
    },
    logoDark{
      asset,
      alt
    },
    headerNavigation[]{
      _key,
      _type,
      linkType,
      internalPath,
      externalUrl,
      openInNewTab,
      "label": label[_key == $locale][0].value,
      reference->{
        _type,
        "slug": slug.current,
        language
      }
    },
    quoteCta{
      variant,
      "label": label[_key == $locale][0].value,
      link{
        linkType,
        internalPath,
        externalUrl,
        openInNewTab,
        "label": label[_key == $locale][0].value,
        reference->{
          _type,
          "slug": slug.current,
          language
        }
      }
    },
    contactChannels[]{
      _key,
      phone,
      email,
      "department": department[_key == $locale][0].value
    },
    socialLinks[]{
      _key,
      platform,
      url
    },
    uiLabels{
      "requestQuote": requestQuote[_key == $locale][0].value,
      "viewProducts": viewProducts[_key == $locale][0].value,
      "readMore": readMore[_key == $locale][0].value,
      "download": download[_key == $locale][0].value
    }
  }
`)
