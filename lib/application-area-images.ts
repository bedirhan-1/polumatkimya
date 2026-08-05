const applicationAreaFallbackImages: Readonly<Record<string, string>> = {
  automotive: '/brand/slides/slide-brake-cleaner.webp',
  construction: '/brand/slides/slide-rust-remover.webp',
  'industrial-maintenance': '/brand/slides/slide-engine-cleaner.webp',
}

export function getApplicationAreaFallbackImage(slug?: string | null) {
  return slug ? applicationAreaFallbackImages[slug] : undefined
}
