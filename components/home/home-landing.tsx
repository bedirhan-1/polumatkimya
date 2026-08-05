import Link from "next/link";

import { PostCard, type PostCardData } from "@/components/content/post-card";
import { ProductCard } from "@/components/product/product-card";
import { ButtonLink } from "@/components/ui/button-link";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/locales";
import type { FilterOption, ProductCardData } from "@/lib/products/types";

type HomeLandingProps = {
  locale: Locale;
  dictionary: Dictionary;
  categories: FilterOption[];
  products: ProductCardData[];
  posts: PostCardData[];
  dateLocale: string;
};

export function HomeLanding({
  locale,
  dictionary,
  categories,
  products,
  posts,
  dateLocale,
}: HomeLandingProps) {
  const featured = products.slice(0, 4);

  return (
    <>
      <section className="product-hero-panel relative overflow-hidden border-b border-border">
        <div className="product-mesh absolute inset-0 opacity-35" aria-hidden />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
          aria-hidden
        />
        <div className="container-site relative flex min-h-[78vh] flex-col justify-end py-16 sm:py-20 lg:min-h-[82vh] lg:py-24">
          <p className="animate-product-rise text-xs font-semibold tracking-[0.28em] text-accent uppercase">
            {dictionary.home.eyebrow}
          </p>
          <h1 className="animate-product-rise mt-5 max-w-4xl font-display text-5xl text-foreground sm:text-6xl lg:text-7xl">
            {dictionary.meta.siteName}
          </h1>
          <p
            className="animate-product-rise mt-5 max-w-2xl text-lg text-muted sm:text-xl"
            style={{ animationDelay: "70ms" }}
          >
            {dictionary.home.headline}
          </p>
          <p
            className="animate-product-rise mt-3 max-w-xl text-base text-muted"
            style={{ animationDelay: "120ms" }}
          >
            {dictionary.home.supporting}
          </p>
          <div
            className="animate-product-rise mt-8 flex flex-wrap gap-3"
            style={{ animationDelay: "160ms" }}
          >
            <ButtonLink href={`/${locale}/products`}>
              {dictionary.nav.products}
            </ButtonLink>
            <ButtonLink href={`/${locale}/request-a-quote`} variant="secondary">
              {dictionary.nav.requestQuote}
            </ButtonLink>
          </div>
        </div>
      </section>

      {categories.length ? (
        <section className="border-b border-border">
          <div className="container-site grid lg:grid-cols-2">
            {categories.slice(0, 2).map((category, index) => {
              if (!category.slug || !category.title) return null;
              return (
                <Link
                  key={category._id}
                  href={`/${locale}/products/category/${category.slug}`}
                  className={`group flex min-h-56 flex-col justify-between border-border px-6 py-10 no-underline transition hover:bg-surface sm:px-10 ${
                    index === 0 ? "border-b lg:border-b-0 lg:border-e" : ""
                  }`}
                >
                  <p className="text-xs tracking-[0.2em] text-accent uppercase">
                    {dictionary.nav.products}
                  </p>
                  <div>
                    <h2 className="font-display text-3xl text-foreground transition group-hover:text-accent sm:text-4xl">
                      {category.title}
                    </h2>
                    <p className="mt-3 text-sm font-semibold text-muted group-hover:text-foreground">
                      {dictionary.products.detail} →
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      {featured.length ? (
        <section className="border-b border-border section-space">
          <div className="container-site flex flex-col gap-8">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">
                {dictionary.nav.products}
              </h2>
              <Link
                href={`/${locale}/products`}
                className="text-sm font-semibold text-accent no-underline hover:underline"
              >
                {dictionary.filters.resultsCount.replace(
                  "{count}",
                  String(products.length),
                )}
              </Link>
            </div>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((product) => (
                <li key={product._id}>
                  <ProductCard
                    locale={locale}
                    product={product}
                    detailLabel={dictionary.products.detail}
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {posts.length ? (
        <section className="border-b border-border section-space">
          <div className="container-site flex flex-col gap-8">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">
                {dictionary.nav.blog}
              </h2>
              <Link
                href={`/${locale}/blog`}
                className="text-sm font-semibold text-accent no-underline hover:underline"
              >
                {dictionary.blog.readMore}
              </Link>
            </div>
            <ul className="grid gap-5 md:grid-cols-3">
              {posts.map((post) => (
                <li key={post._id}>
                  <PostCard
                    locale={locale}
                    post={post}
                    readMoreLabel={dictionary.blog.readMore}
                    dateLocale={dateLocale}
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="border-b border-border section-space">
        <div className="container-site flex flex-col items-start gap-6 border border-border bg-surface px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <div>
            <h2 className="font-display text-3xl text-foreground">
              {dictionary.pages.quoteTitle}
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted">
              {dictionary.pages.quoteDescription}
            </p>
          </div>
          <ButtonLink href={`/${locale}/request-a-quote`}>
            {dictionary.nav.requestQuote}
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
