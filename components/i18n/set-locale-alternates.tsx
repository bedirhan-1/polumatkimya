'use client'

import {useEffect} from 'react'

import {useLocaleAlternates} from '@/components/i18n/locale-alternates'
import type {Locale} from '@/lib/i18n/locales'

type SetLocaleAlternatesProps = {
  hrefs: Partial<Record<Locale, string>>
}

/** Sets document-level alternate hrefs for the language switcher while mounted. */
export function SetLocaleAlternates({hrefs}: SetLocaleAlternatesProps) {
  const ctx = useLocaleAlternates()
  const setHrefs = ctx?.setHrefs
  const serialized = JSON.stringify(hrefs)

  useEffect(() => {
    if (!setHrefs) return
    setHrefs(JSON.parse(serialized) as Partial<Record<Locale, string>>)
    return () => setHrefs(null)
  }, [setHrefs, serialized])

  return null
}
