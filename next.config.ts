import type {NextConfig} from 'next'

import {locales} from './lib/i18n/locales'
import {getLegacyRedirects} from './lib/redirects/legacy'

function r2PublicHostname() {
  const raw = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.trim()
  if (!raw) return 'pub-a58c74b60c3c4a939d9922078fb2fe76.r2.dev'
  try {
    return new URL(raw).hostname
  } catch {
    return 'pub-a58c74b60c3c4a939d9922078fb2fe76.r2.dev'
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: r2PublicHostname(),
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
