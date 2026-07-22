"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";

interface Props {
  productId: string;
  quantity?: number;
  compact?: boolean;
}

export function AddToCartButton({ productId, quantity = 1, compact }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(productId, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleAdd}
        className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
      >
        {added ? "Added ✓" : "Add"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      className="w-full rounded-xl bg-brand-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-700"
    >
      {added ? "Added to cart ✓" : "Add to cart"}
    </button>
  );
}
