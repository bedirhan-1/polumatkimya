'use client'

import {useEffect, useRef} from 'react'
import {
  useDocumentOperation,
  useEditState,
  useFormValue,
  type InputProps,
  type ObjectInputProps,
} from 'sanity'

import {normalizeLegacyI18n} from '../lib/normalize-legacy-i18n'

function valuesEqual(left: unknown, right: unknown) {
  return JSON.stringify(left) === JSON.stringify(right)
}

function NormalizeObjectInput(props: ObjectInputProps) {
  const rawId = String(useFormValue(['_id']) || '')
  const typeName = String(useFormValue(['_type']) || props.schemaType.name)
  const publishedId = rawId.replace(/^drafts\./, '')
  const {patch} = useDocumentOperation(publishedId, typeName)
  const editState = useEditState(publishedId, typeName)
  const applied = useRef(false)

  useEffect(() => {
    if (applied.current || props.readOnly || !props.value || !publishedId) return
    if (patch.disabled) return

    const current = props.value as Record<string, unknown>
    const next = normalizeLegacyI18n(current) as Record<string, unknown>
    if (valuesEqual(next, current)) return

    const patches = Object.keys(next)
      .filter((key) => !key.startsWith('_'))
      .filter((key) => !valuesEqual(next[key], current[key]))
      .map((key) => ({set: {[key]: next[key]}}))

    if (!patches.length) return
    applied.current = true
    const initial = editState.draft || editState.published
    patch.execute(patches, initial || undefined)
  }, [editState.draft, editState.published, patch, props.readOnly, props.value, publishedId])

  return props.renderDefault(props)
}

export function NormalizeLegacyI18nInput(props: InputProps) {
  if (props.schemaType.jsonType !== 'object') {
    return props.renderDefault(props)
  }
  return <NormalizeObjectInput {...(props as ObjectInputProps)} />
}
