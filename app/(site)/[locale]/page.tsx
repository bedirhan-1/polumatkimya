import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HomeLanding } from "@/components/home/home-landing";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { asSeo } from "@/lib/sanity/content";
import type { ProductCardData } from "@/lib/products/types";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getApplicationAreas, getHomePage } from "@/sanity/lib/pages";
import { getProducts } from "@/sanity/lib/products";

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
  const [productsRaw, industriesRaw] = await Promise.all([
    getProducts(locale),
    getApplicationAreas(locale),
  ]);

  const products = (
    Array.isArray(productsRaw) ? productsRaw : []
  ) as ProductCardData[];
  const industries = Array.isArray(industriesRaw) ? industriesRaw : [];

  return (
    <main id="main-content">
      <HomeLanding
        locale={locale}
        dictionary={dictionary}
        products={products}
        industries={industries}
      />
    </main>
  );
}
