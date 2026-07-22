"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { getProductById, formatPrice } from "@/lib/products";
import { VialArt } from "@/components/VialArt";

export default function CartPage() {
  const { lines, setQuantity, removeItem, ready } = useCart();

  const items = lines
    .map((l) => {
      const product = getProductById(l.productId);
      return product ? { product, quantity: l.quantity } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const subtotal = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0,
  );
  const suppliers = new Set(items.map((i) => i.product.supplierId));
  const shipping = items.length > 0 ? suppliers.size * 995 : 0;

  if (!ready) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-slate-500">
        Loading…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-ink-900">Your cart is empty</h1>
        <p className="mt-2 text-slate-500">
          Browse the catalog and add some peptides.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700"
        >
          Shop the catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink-900">Your cart</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4"
            >
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-100">
                <VialArt
                  accent={product.accent}
                  label={product.name}
                  className="h-full w-full"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between">
                  <div>
                    <Link
                      href={`/products/${product.slug}`}
                      className="font-semibold text-ink-900 hover:text-brand-600"
                    >
                      {product.name}
                    </Link>
                    <p className="text-sm text-slate-500">
                      {product.sizeMg} mg · {product.purity}
                    </p>
                  </div>
                  <span className="font-bold text-ink-900">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-lg border border-slate-300">
                    <button
                      type="button"
                      onClick={() => setQuantity(product.id, quantity - 1)}
                      className="px-3 py-1 text-slate-600 hover:text-ink-900"
                      aria-label="Decrease"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(product.id, quantity + 1)}
                      className="px-3 py-1 text-slate-600 hover:text-ink-900"
                      aria-label="Increase"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(product.id)}
                    className="text-sm font-medium text-rose-600 hover:text-rose-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-ink-900">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Subtotal</dt>
              <dd className="font-medium">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">
                Shipping ({suppliers.size} shipment
                {suppliers.size === 1 ? "" : "s"})
              </dt>
              <dd className="font-medium">{formatPrice(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-3 text-base">
              <dt className="font-semibold text-ink-900">Total</dt>
              <dd className="font-bold text-ink-900">
                {formatPrice(subtotal + shipping)}
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-slate-400">
            Items ship from {suppliers.size} lab
            {suppliers.size === 1 ? "" : "s"} — each with its own tracking.
          </p>
          <Link
            href="/checkout"
            className="mt-6 block rounded-xl bg-brand-600 px-6 py-3 text-center font-semibold text-white hover:bg-brand-700"
          >
            Proceed to checkout
          </Link>
          <Link
            href="/products"
            className="mt-3 block text-center text-sm font-medium text-slate-500 hover:text-brand-600"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
