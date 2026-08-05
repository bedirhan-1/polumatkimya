import Link from "next/link";

import { SanityImage } from "@/components/content/sanity-image";
import type { Locale } from "@/lib/i18n/locales";
import type { ProductCardData } from "@/lib/products/types";

type ProductCardProps = {
  locale: Locale;
  product: ProductCardData;
  detailLabel: string;
};

export function ProductCard({
  locale,
  product,
  detailLabel,
}: ProductCardProps) {
  if (!product.slug || !product.title) return null;

  const image = product.cardImage?.asset ? product.cardImage : product.packshot;

  return (
    <Link
      href={`/${locale}/products/${product.slug}`}
      className="group flex h-full flex-col border border-border bg-surface no-underline transition hover:border-accent"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-surface-elevated">
        <SanityImage
          image={image}
          fill
          className="object-cover transition group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {product.badge ? (
          <span className="absolute inset-inline-start-3 top-3 border border-accent bg-background/90 px-2 py-1 text-[11px] font-semibold tracking-wide text-accent uppercase">
            {product.badge}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        {product.primaryCategory?.title ? (
          <p className="text-xs tracking-[0.2em] text-accent uppercase">
            {product.primaryCategory.title}
          </p>
        ) : null}
        <h2 className="font-display text-xl text-foreground">
          {product.title}
        </h2>
        {product.shortDescription ? (
          <p className="line-clamp-3 text-sm text-muted">
            {product.shortDescription}
          </p>
        ) : null}
        <span className="mt-auto pt-3 text-sm font-semibold text-accent">
          {detailLabel}
        </span>
      </div>
    </Link>
  );
}
