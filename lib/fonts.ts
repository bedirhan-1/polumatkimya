import {Barlow_Condensed, Noto_Sans_Arabic, Source_Sans_3} from 'next/font/google'

export const fontDisplay = Barlow_Condensed({
  variable: '--font-display',
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600', '700'],
  display: 'swap',
})

export const fontBody = Source_Sans_3({
  variable: '--font-body',
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const fontArabic = Noto_Sans_Arabic({
  variable: '--font-arabic',
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})
