import {defineQuery} from 'next-sanity'

import {imageWithAltProjection} from '../fragments/page-builder'

const galleryImageProjection = /* groq */ `
  _key,
  "title": title[language == $locale || _key == $locale][0].value,
  image{${imageWithAltProjection}}
`

export const GALLERY_QUERY = defineQuery(`
  *[_id == "gallery" && _type == "gallery"][0]{
    _id,
    images[defined(image.asset)]{${galleryImageProjection}}
  }
`)
