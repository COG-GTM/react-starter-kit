import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  formatPrice,
  getProductBySlug,
  products,
  categories,
} from "@/lib/products";
import { getSupplier } from "@/lib/suppliers";
import { VialArt } from "@/components/VialArt";
import { ProductPurchase } from "@/components/ProductPurchase";
import { ProductCard } from "@/components/ProductCard";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Not found — PeptixLabs" };
  return {
    title: `${product.name} — PeptixLabs`,
    description: product.shortDescription,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const supplier = getSupplier(product.supplierId);
  const category = categories.find((c) => c.id === product.category);
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <nav className="text-sm text-slate-500">
        <Link href="/products" className="hover:text-brand-600">
          Catalog
        </Link>{" "}
        / <span className="text-ink-900">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <VialArt
            accent={product.accent}
            label={product.name}
            className="aspect-square w-full"
          />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
              {category?.label}
            </span>
            {product.researchUseOnly && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                Research use only
              </span>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-bold text-ink-900">
            {product.name}
          </h1>
          <p className="mt-2 font-mono text-sm text-slate-500">
            {product.sequence}
          </p>

          <p className="mt-4 text-3xl font-bold text-ink-900">
            {formatPrice(product.price)}
          </p>

          <p className="mt-4 leading-relaxed text-slate-600">
            {product.description}
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-sm">
            <div>
              <dt className="text-slate-500">Size</dt>
              <dd className="font-semibold text-ink-900">
                {product.sizeMg} mg
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Purity</dt>
              <dd className="font-semibold text-ink-900">{product.purity}</dd>
            </div>
            <div>
              <dt className="text-slate-500">In stock</dt>
              <dd className="font-semibold text-ink-900">
                {product.stock} vials
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Fulfilled by</dt>
              <dd className="font-semibold text-ink-900">
                {supplier?.name}
                {supplier && (
                  <span className="ml-1 font-normal text-slate-500">
                    · {supplier.leadTimeDays}d dispatch
                  </span>
                )}
              </dd>
            </div>
          </dl>

          <ProductPurchase productId={product.id} />

          <p className="mt-6 rounded-xl bg-amber-50 p-4 text-xs leading-relaxed text-amber-800 ring-1 ring-amber-200">
            ⚠️ This product is sold strictly for laboratory research or cosmetic
            formulation. Not for human consumption. Not evaluated by the FDA.
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-ink-900">Related products</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
