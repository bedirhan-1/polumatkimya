import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {documentInternationalization} from '@sanity/document-internationalization'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'
import {defineField} from 'sanity'

import {apiVersion, dataset, projectId} from './env'
import {LANGUAGE_IDS, SUPPORTED_LANGUAGES} from './lib/languages'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

const DOCUMENT_I18N_TYPES = [
  'homePage',
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
        // Localized singletons are created via Structure fixed IDs
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
