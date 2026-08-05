import Link from "next/link";

import { SectionHeading } from "@/components/content/section-heading";
import { SanityImage } from "@/components/content/sanity-image";
import type { Locale } from "@/lib/i18n/locales";

type ProductShowcaseSectionProps = {
  locale: Locale;
  block: {
    _key: string;
    heading?: string | null;
    description?: string | null;
    products?: Array<{
      _id: string;
      title?: string | null;
      slug?: string | null;
      shortDescription?: string | null;
      cardImage?: { asset?: { _ref?: string }; alt?: string | null } | null;
      primaryCategory?: { title?: string | null } | null;
    }> | null;
  };
};

export function ProductShowcaseSection({
  locale,
  block,
}: ProductShowcaseSectionProps) {
  return (
    <section className="border-b border-border section-space">
      <div className="container-site flex flex-col gap-10">
        <SectionHeading
          heading={block.heading}
          description={block.description}
        />
        {block.products?.length ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {block.products.map((product) => {
              if (!product.slug || !product.title) return null;
              return (
                <li key={product._id}>
                  <Link
                    href={`/${locale}/products/${product.slug}`}
                    className="group flex h-full flex-col border border-border bg-surface no-underline transition hover:border-accent"
                  >
                    <div className="relative aspect-4/3 overflow-hidden bg-surface-elevated">
                      <SanityImage
                        image={product.cardImage}
                        fill
                        className="object-cover transition group-hover:scale-[1.02]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-5">
                      {product.primaryCategory?.title ? (
                        <p className="text-xs tracking-[0.2em] text-accent uppercase">
                          {product.primaryCategory.title}
                        </p>
                      ) : null}
                      <h3 className="font-display text-xl text-foreground">
                        {product.title}
                      </h3>
                      {product.shortDescription ? (
                        <p className="text-sm text-muted">
                          {product.shortDescription}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
