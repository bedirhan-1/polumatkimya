import { ApplicationGridSection } from "@/components/sections/application-grid-section";
import { CertificateSection } from "@/components/sections/certificate-section";
import { CtaSection } from "@/components/sections/cta-section";
import { FeatureGridSection } from "@/components/sections/feature-grid-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ImageTextSection } from "@/components/sections/image-text-section";
import { LatestContentSection } from "@/components/sections/latest-content-section";
import { ProductShowcaseSection } from "@/components/sections/product-showcase-section";
import { StatsSection } from "@/components/sections/stats-section";
import { VideoSection } from "@/components/sections/video-section";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/locales";
import type { PageBuilderBlock } from "@/lib/sanity/content";

type PageBuilderProps = {
  locale: Locale;
  dictionary: Dictionary;
  blocks?: PageBuilderBlock[] | null;
};

export async function PageBuilder({
  locale,
  dictionary,
  blocks,
}: PageBuilderProps) {
  if (!blocks?.length) return null;

  const dateLocale =
    locale === "tr" ? "tr-TR" : locale === "ar" ? "ar" : "en-GB";

  return (
    <>
      {blocks.map((block) => {
        switch (block._type) {
          case "heroSection":
            return (
              <HeroSection
                key={block._key}
                locale={locale}
                block={block as never}
              />
            );
          case "productShowcaseSection":
            return (
              <ProductShowcaseSection
                key={block._key}
                locale={locale}
                block={block as never}
              />
            );
          case "featureGridSection":
            return (
              <FeatureGridSection key={block._key} block={block as never} />
            );
          case "applicationGridSection":
            return (
              <ApplicationGridSection
                key={block._key}
                locale={locale}
                block={block as never}
              />
            );
          case "imageTextSection":
            return (
              <ImageTextSection
                key={block._key}
                locale={locale}
                block={block as never}
              />
            );
          case "statsSection":
            return <StatsSection key={block._key} block={block as never} />;
          case "certificateSection":
            return (
              <CertificateSection key={block._key} block={block as never} />
            );
          case "videoSection":
            return (
              <VideoSection
                key={block._key}
                block={block as never}
                playLabel={dictionary.videos.play}
              />
            );
          case "latestContentSection":
            return (
              <LatestContentSection
                key={block._key}
                locale={locale}
                block={block as never}
                dateLocale={dateLocale}
                labels={{
                  readMore: dictionary.blog.readMore,
                  play: dictionary.videos.play,
                  empty: dictionary.blog.emptyLatest,
                }}
              />
            );
          case "ctaSection":
            return (
              <CtaSection
                key={block._key}
                locale={locale}
                block={block as never}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
