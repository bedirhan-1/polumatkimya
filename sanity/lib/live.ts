import {defineLive} from 'next-sanity/live'

import {client} from './client'

const token = process.env.SANITY_API_READ_TOKEN

export const {sanityFetch, SanityLive} = defineLive({
  client,
  // Token optional at build time; Draft Mode / live preview need it in env
  serverToken: token || false,
  browserToken: token || false,
})
