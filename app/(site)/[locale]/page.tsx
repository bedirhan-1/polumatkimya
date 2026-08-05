import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { PostCardData } from "@/components/content/post-card";
import { PageBuilder } from "@/components/content/page-builder";
import { HomeLanding } from "@/components/home/home-landing";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { asPageBuilderBlocks, asSeo } from "@/lib/sanity/content";
import type { FilterOption, ProductCardData } from "@/lib/products/types";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getLatestPosts } from "@/sanity/lib/content";
import { getHomePage } from "@/sanity/lib/pages";
import { getProductCategories, getProducts } from "@/sanity/lib/products";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) return {};
  const dictionary = await getDictionary(localeParam);
  const page = await getHomePage(localeParam);
  return buildPageMetadata({
    locale: localeParam,
    fallbackTitle: dictionary.meta.siteName,
    fallbackDescription: dictionary.meta.defaultDescription,
    seo: asSeo(
      page && typeof page === "object" ? (page as { seo?: unknown }).seo : null,
    ),
    path: "/",
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();

  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const page = await getHomePage(locale);
  const blocks = asPageBuilderBlocks(
    page && typeof page === "object"
      ? (page as { pageBuilder?: unknown }).pageBuilder
      : null,
  );

  if (blocks) {
    return (
      <main id="main-content">
        <PageBuilder locale={locale} dictionary={dictionary} blocks={blocks} />
      </main>
    );
  }

  const [categoriesRaw, productsRaw, postsRaw] = await Promise.all([
    getProductCategories(locale),
    getProducts(locale),
    getLatestPosts(locale, 3),
  ]);

  const categories = (
    Array.isArray(categoriesRaw) ? categoriesRaw : []
  ) as FilterOption[];
  const products = (
    Array.isArray(productsRaw) ? productsRaw : []
  ) as ProductCardData[];
  const posts = (Array.isArray(postsRaw) ? postsRaw : []) as PostCardData[];

  return (
    <main id="main-content">
      <HomeLanding
        locale={locale}
        dictionary={dictionary}
        categories={categories}
        products={products}
        posts={posts}
        dateLocale={locale}
      />
    </main>
  );
}
