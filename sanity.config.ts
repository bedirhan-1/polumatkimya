'use client'

/**
 * This configuration is used for the Sanity Studio mounted at `/admin`.
 */

import {visionTool} from '@sanity/vision'
import {defineConfig, defineField} from 'sanity'
import {structureTool} from 'sanity/structure'
import {documentInternationalization} from '@sanity/document-internationalization'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'
import {createElement} from 'react'

import {apiVersion, dataset, projectId} from './sanity/env'
import {NormalizeLegacyI18nInput} from './studio/components/normalize-legacy-i18n-input'
import {LANGUAGE_IDS, SUPPORTED_LANGUAGES} from './studio/lib/languages'
import {schemaTypes} from './studio/schemaTypes'
import {structure} from './studio/structure'

const DOCUMENT_I18N_TYPES = [
  'homePage',
  'page',
  'post',
]

export default defineConfig({
  name: 'polumat-studio',
  title: 'Polumat Kimya',
  basePath: '/admin',
  projectId,
  dataset,
  plugins: [
    structureTool({structure}),
    visionTool({defaultApiVersion: apiVersion}),
    internationalizedArray({
      languages: [...SUPPORTED_LANGUAGES],
      // Empty TR/EN/AR rows on new field-level documents (products, categories, …)
      defaultLanguages: [...LANGUAGE_IDS],
      fieldTypes: [
        'string',
        'text',
        defineField({
          name: 'portableText',
          type: 'portableText',
        }),
      ],
    }),
    documentInternationalization({
      supportedLanguages: [...SUPPORTED_LANGUAGES],
      schemaTypes: DOCUMENT_I18N_TYPES,
    }),
  ],
  form: {
    components: {
      input: (props) => {
        if (props.schemaType.name === 'exportPage' || props.schemaType.name === 'contactPage') {
          return createElement(NormalizeLegacyI18nInput, props)
        }
        return props.renderDefault(props)
      },
    },
  },
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter((template) => {
        if (
          template.schemaType === 'homePage' ||
          template.schemaType === 'contactPage' ||
          template.schemaType === 'exportPage' ||
          template.schemaType === 'siteSettings' ||
          template.schemaType === 'productOrder'
        ) {
          return false
        }
        return true
      }),
  },
})
