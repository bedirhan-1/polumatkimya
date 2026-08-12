import {defineQuery} from 'next-sanity'

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    _id,
    companyName,
    siteUrl,
    whatsappNumber,
    "whatsappMessage": whatsappMessage[language == $locale || _key == $locale][0].value,
    "shortDescription": shortDescription[language == $locale || _key == $locale][0].value,
    "address": address[language == $locale || _key == $locale][0].value,
    "workingHours": workingHours[language == $locale || _key == $locale][0].value,
    "footerLegalText": footerLegalText[language == $locale || _key == $locale][0].value,
    footerMetaItems[]{
      _key,
      "label": label[language == $locale || _key == $locale][0].value
    },
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
      "label": label[language == $locale || _key == $locale][0].value,
      reference->{
        _type,
        "slug": slug.current,
        language
      },
      children[]{
        _key,
        _type,
        linkType,
        internalPath,
        externalUrl,
        openInNewTab,
        "label": label[language == $locale || _key == $locale][0].value,
        reference->{
          _type,
          "slug": slug.current,
          language
        }
      }
    },
    footerColumns[]{
      _key,
      "title": title[language == $locale || _key == $locale][0].value,
      links[]{
        _key,
        _type,
        linkType,
        internalPath,
        externalUrl,
        openInNewTab,
        "label": label[language == $locale || _key == $locale][0].value,
        reference->{
          _type,
          "slug": slug.current,
          language
        }
      }
    },
    quoteCta{
      variant,
      "label": label[language == $locale || _key == $locale][0].value,
      link{
        linkType,
        internalPath,
        externalUrl,
        openInNewTab,
        "label": label[language == $locale || _key == $locale][0].value,
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
      "department": department[language == $locale || _key == $locale][0].value
    },
    socialLinks[]{
      _key,
      platform,
      url
    },
    "catalogs": coalesce(
      catalogs[]->{
        _id,
        title,
        "language": language->tag,
        "url": file.asset->url
      }[defined(url)],
      *[_type == "downloadableDocument" && documentType == "catalog" && defined(file.asset)]
        | order(coalesce(publishedAt, _createdAt) desc){
          _id,
          title,
          "language": language->tag,
          "url": file.asset->url
        }
    ),
    uiLabels{
      "requestQuote": requestQuote[language == $locale || _key == $locale][0].value,
      "viewProducts": viewProducts[language == $locale || _key == $locale][0].value,
      "readMore": readMore[language == $locale || _key == $locale][0].value,
      "download": download[language == $locale || _key == $locale][0].value
    }
  }
`)
