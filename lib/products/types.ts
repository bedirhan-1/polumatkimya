export type ProductCardData = {
  _id: string
  title?: string | null
  slug?: string | null
  sku?: string | null
  shortDescription?: string | null
  badge?: string | null
  featured?: boolean | null
  cardImage?: {asset?: {_ref?: string}; alt?: string | null} | null
  packshot?: {asset?: {_ref?: string}; alt?: string | null} | null
  primaryCategory?: {
    _id?: string
    title?: string | null
    slug?: string | null
  } | null
}

export type ProductDetailData = ProductCardData & {
  body?: unknown
  usageAreas?: unknown
  applicationInstructions?: unknown
  warnings?: unknown
  externalVideoUrl?: string | null
  gallery?: Array<{asset?: {_ref?: string}; alt?: string | null} | null> | null
  categories?: Array<{_id: string; title?: string | null; slug?: string | null}> | null
  applicationAreas?: Array<{_id: string; title?: string | null; slug?: string | null}> | null
  benefits?: Array<{
    _key: string
    title?: string | null
    description?: string | null
  }> | null
  features?: Array<{
    _key: string
    title?: string | null
    description?: string | null
  }> | null
  packagingVariants?: Array<{
    _key: string
    label?: string | null
    sku?: string | null
    volume?: string | null
  }> | null
  specificationGroups?: Array<{
    _key: string
    title?: string | null
    items?: Array<{
      _key: string
      label?: string | null
      value?: string | null
      unit?: string | null
      note?: string | null
    }> | null
  }> | null
  documents?: Array<{
    _key: string
    label?: string | null
    document?: {
      _id: string
      title?: string | null
      documentType?: string | null
      version?: string | null
      file?: {
        asset?: {
          url?: string | null
          originalFilename?: string | null
          size?: number | null
        } | null
      } | null
    } | null
  }> | null
  relatedProducts?: ProductCardData[] | null
  productCta?: {
    label?: string | null
    variant?: string | null
    link?: {
      linkType?: 'internal' | 'external' | 'reference' | null
      internalPath?: string | null
      externalUrl?: string | null
      openInNewTab?: boolean | null
      reference?: {_type?: string; slug?: string | null; language?: string | null} | null
    } | null
  } | null
  seo?: {
    title?: string | null
    description?: string | null
    noIndex?: boolean | null
  } | null
}

export type FilterOption = {
  _id: string
  title?: string | null
  slug?: string | null
}
