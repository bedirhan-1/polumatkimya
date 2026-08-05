import type {MetadataRoute} from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Polumat Kimya',
    short_name: 'Polumat',
    description: 'Polumat Kimya kurumsal web sitesi',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b0c0e',
    theme_color: '#e31c23',
    icons: [
      {
        src: '/brand/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/brand/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/brand/maskable-icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
