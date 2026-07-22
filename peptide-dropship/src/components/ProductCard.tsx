import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/products";
import { VialArt } from "./VialArt";
import { AddToCartButton } from "./AddToCartButton";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-lg">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden"
      >
        <VialArt
          accent={product.accent}
          label={product.name}
          className="h-full w-full transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200">
          {product.sizeMg} mg · {product.purity}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-ink-900 group-hover:text-brand-600">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-slate-500">
          {product.shortDescription}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-ink-900">
            {formatPrice(product.price)}
          </span>
          <AddToCartButton productId={product.id} compact />
        </div>
      </div>
    </div>
  );
}
