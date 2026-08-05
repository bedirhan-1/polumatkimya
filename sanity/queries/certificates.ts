import {defineQuery} from 'next-sanity'

import {imageWithAltProjection} from '@/sanity/fragments/page-builder'

export const CERTIFICATES_QUERY = defineQuery(`
  *[_type == "certificate"] | order(sortOrder asc) {
    _id,
    "name": name[language == $locale || _key == $locale][0].value,
    issuer,
    certificateNumber,
    issuedAt,
    expiresAt,
    logo{${imageWithAltProjection}},
    file{asset->{url, originalFilename}}
  }
`)
