import type {NextConfig} from 'next'

import {locales} from './lib/i18n/locales'
import {getLegacyRedirects} from './lib/redirects/legacy'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  async redirects() {
    const localePattern = locales.join('|')

    return [
      {
        source: `/:locale(${localePattern})/admin`,
        destination: '/admin',
        permanent: false,
      },
      {
        source: `/:locale(${localePattern})/admin/:path*`,
        destination: '/admin/:path*',
        permanent: false,
      },
      ...getLegacyRedirects(),
    ]
  },
}

export default nextConfig
