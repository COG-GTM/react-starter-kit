"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export function ProductPurchase({ productId }: { productId: string }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(productId, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="mt-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-lg border border-slate-300">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3 py-2 text-lg text-slate-600 hover:text-ink-900"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-10 text-center font-semibold">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(99, q + 1))}
            className="px-3 py-2 text-lg text-slate-600 hover:text-ink-900"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex-1 rounded-xl bg-brand-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-700"
        >
          {added ? "Added to cart ✓" : "Add to cart"}
        </button>
      </div>
      {added && (
        <Link
          href="/cart"
          className="mt-3 inline-block text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          Go to cart →
        </Link>
      )}
    </div>
  );
}
