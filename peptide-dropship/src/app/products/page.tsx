import Link from "next/link";
import { categories, products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import type { PeptideCategory } from "@/lib/types";

export const metadata = {
  title: "Catalog — PeptixLabs",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const active = categories.find((c) => c.id === category)?.id;
  const filtered = active
    ? products.filter((p) => p.category === (active as PeptideCategory))
    : products;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink-900">Peptide Catalog</h1>
      <p className="mt-2 text-slate-500">
        {filtered.length} product{filtered.length === 1 ? "" : "s"} · research &
        cosmetic use only
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/products"
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            !active
              ? "bg-brand-600 text-white"
              : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
          }`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/products?category=${c.id}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              active === c.id
                ? "bg-brand-600 text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-slate-500">
          No products in this category yet.
        </p>
      )}
    </div>
  );
}
