import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {documentInternationalization} from '@sanity/document-internationalization'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'
import {defineField} from 'sanity'

import {apiVersion, dataset, projectId} from './env'
import {DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES} from './lib/languages'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

const DOCUMENT_I18N_TYPES = [
  'homePage',
  'privateLabelPage',
  'contactPage',
  'page',
  'post',
]

export default defineConfig({
  name: 'polumat-studio',
  title: 'Polumat Kimya',
  projectId,
  dataset,
  plugins: [
    structureTool({structure}),
    visionTool({defaultApiVersion: apiVersion}),
    internationalizedArray({
      languages: [...SUPPORTED_LANGUAGES],
      defaultLanguages: [DEFAULT_LANGUAGE],
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
        // Localized singletons are created via Structure fixed IDs
        if (
          template.schemaType === 'homePage' ||
          template.schemaType === 'privateLabelPage' ||
          template.schemaType === 'contactPage' ||
          template.schemaType === 'siteSettings'
        ) {
          return false
        }
        return true
      }),
  },
})
