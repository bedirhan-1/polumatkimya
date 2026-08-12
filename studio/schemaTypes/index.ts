import type {SchemaTypeDefinition} from 'sanity'

import {applicationGridSectionType} from './blocks/application-grid-section'
import {certificateSectionType} from './blocks/certificate-section'
import {ctaSectionType} from './blocks/cta-section'
import {featureGridSectionType} from './blocks/feature-grid-section'
import {heroSectionType} from './blocks/hero-section'
import {heroSliderSectionType} from './blocks/hero-slider-section'
import {imageTextSectionType} from './blocks/image-text-section'
import {latestContentSectionType} from './blocks/latest-content-section'
import {productShowcaseSectionType} from './blocks/product-showcase-section'
import {statsSectionType} from './blocks/stats-section'
import {videoSectionType} from './blocks/video-section'
import {applicationAreaType} from './documents/application-area'
import {certificateType} from './documents/certificate'
import {
  contactEmailType,
  contactLocationType,
  contactPageType,
  contactPhoneType,
} from './documents/contact-page'
import {downloadableDocumentType} from './documents/downloadable-document'
import {
  exportActivityType,
  exportContactType,
  exportPageType,
} from './documents/export-page'
import {homePageType} from './documents/home-page'
import {localeType} from './documents/locale'
import {pageType} from './documents/page'
import {postType} from './documents/post'
import {productType} from './documents/product'
import {productCategoryType} from './documents/product-category'
import {productOrderType} from './documents/product-order'
import {siteSettingsType} from './documents/site-settings'
import {videoType} from './documents/video'
import {callToActionType} from './objects/call-to-action'
import {contactChannelType} from './objects/contact-channel'
import {documentReferenceType} from './objects/document-reference'
import {featureItemType} from './objects/feature-item'
import {heroSlideType} from './objects/hero-slide'
import {homeHeroType} from './objects/home-hero'
import {
  homeAboutSectionType,
  homeCtaSectionType,
  homeIndustriesSectionType,
  homeIndustryCardType,
  homePrivateLabelSectionType,
  homeProductsSectionType,
  homeQualitySectionType,
  homeStrengthsSectionType,
} from './objects/home-sections'
import {imageWithAltType} from './objects/image-with-alt'
import {internalOrExternalLinkType} from './objects/internal-or-external-link'
import {localizedImageWithAltType} from './objects/localized-image-with-alt'
import {localizedSeoType} from './objects/localized-seo'
import {navigationItemType} from './objects/navigation-item'
import {packagingVariantType} from './objects/packaging-variant'
import {pageBuilderType} from './objects/page-builder'
import {portableTextType} from './objects/portable-text'
import {seoType} from './objects/seo'
import {simpleCallToActionType} from './objects/simple-call-to-action'
import {simpleFeatureItemType} from './objects/simple-feature-item'
import {socialLinkType} from './objects/social-link'
import {specificationGroupType, specificationItemType} from './objects/specification-group'
import {statItemType} from './objects/stat-item'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  localeType,
  siteSettingsType,
  exportPageType,
  productType,
  productCategoryType,
  productOrderType,
  applicationAreaType,
  homePageType,
  contactPageType,
  pageType,
  postType,
  videoType,
  downloadableDocumentType,
  certificateType,

  // Objects
  seoType,
  localizedSeoType,
  imageWithAltType,
  localizedImageWithAltType,
  internalOrExternalLinkType,
  navigationItemType,
  callToActionType,
  simpleCallToActionType,
  simpleFeatureItemType,
  statItemType,
  featureItemType,
  heroSlideType,
  homeHeroType,
  homeProductsSectionType,
  homeStrengthsSectionType,
  homeIndustryCardType,
  homeIndustriesSectionType,
  homePrivateLabelSectionType,
  homeAboutSectionType,
  homeQualitySectionType,
  homeCtaSectionType,
  contactChannelType,
  contactLocationType,
  contactPhoneType,
  contactEmailType,
  socialLinkType,
  specificationItemType,
  specificationGroupType,
  documentReferenceType,
  portableTextType,
  packagingVariantType,
  exportActivityType,
  exportContactType,
  pageBuilderType,

  // Blocks
  heroSectionType,
  heroSliderSectionType,
  productShowcaseSectionType,
  featureGridSectionType,
  applicationGridSectionType,
  imageTextSectionType,
  statsSectionType,
  certificateSectionType,
  videoSectionType,
  latestContentSectionType,
  ctaSectionType,
]
