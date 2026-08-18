'use client'

import {useEffect, useRef} from 'react'
import {set, type InputProps, type ObjectInputProps} from 'sanity'

import {normalizeLegacyI18n} from '../lib/normalize-legacy-i18n'

function valuesEqual(left: unknown, right: unknown) {
  return JSON.stringify(left) === JSON.stringify(right)
}

function NormalizeObjectInput(props: ObjectInputProps) {
  const applied = useRef(false)

  useEffect(() => {
    if (applied.current || !props.value) return
    const next = normalizeLegacyI18n(props.value)
    if (valuesEqual(next, props.value)) return
    applied.current = true
    props.onChange(set(next))
  }, [props.onChange, props.value])

  return props.renderDefault(props)
}

export function NormalizeLegacyI18nInput(props: InputProps) {
  if (props.schemaType.jsonType !== 'object') {
    return props.renderDefault(props)
  }
  return <NormalizeObjectInput {...(props as ObjectInputProps)} />
}
