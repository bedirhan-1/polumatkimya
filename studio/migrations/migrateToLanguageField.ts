import {migrateToLanguageField} from 'sanity-plugin-internationalized-array/migrations'

/**
 * Move internationalized-array language identifiers from `_key` to `language`.
 *
 * These document types either contain localized arrays directly or through
 * nested objects. Translation metadata is included because document
 * internationalization stores its translation references in the same shape.
 */
const DOCUMENT_TYPES = [
  'applicationArea',
  'certificate',
  'exportPage',
  'product',
  'productCategory',
  'siteSettings',
  'translation.metadata',
  'video',
]

export default migrateToLanguageField(DOCUMENT_TYPES)
