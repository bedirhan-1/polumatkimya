'use client'

import {createContext, useContext, useMemo, useState, type ReactNode} from 'react'

import type {Locale} from '@/lib/i18n/locales'

type LocaleHrefs = Partial<Record<Locale, string>>

type LocaleAlternatesContextValue = {
  hrefs: LocaleHrefs | null
  setHrefs: (hrefs: LocaleHrefs | null) => void
}

const LocaleAlternatesContext = createContext<LocaleAlternatesContextValue | null>(null)

export function LocaleAlternatesProvider({children}: {children: ReactNode}) {
  const [hrefs, setHrefs] = useState<LocaleHrefs | null>(null)
  const value = useMemo(() => ({hrefs, setHrefs}), [hrefs])
  return (
    <LocaleAlternatesContext.Provider value={value}>{children}</LocaleAlternatesContext.Provider>
  )
}

export function useLocaleAlternates() {
  return useContext(LocaleAlternatesContext)
}
