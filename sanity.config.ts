'use client'

/**
 * This configuration is used for the Sanity Studio mounted at `/admin`.
 */

import {visionTool} from '@sanity/vision'
import {defineConfig, defineField} from 'sanity'
import {structureTool} from 'sanity/structure'
import {documentInternationalization} from '@sanity/document-internationalization'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'

import {apiVersion, dataset, projectId} from './sanity/env'
import {LANGUAGE_IDS, SUPPORTED_LANGUAGES} from './studio/lib/languages'
import {schemaTypes} from './studio/schemaTypes'
import {structure} from './studio/structure'

const DOCUMENT_I18N_TYPES = [
  'homePage',
  'contactPage',
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
