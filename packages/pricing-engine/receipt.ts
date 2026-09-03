/**
 * @file Checkout receipt formatting: expands cart lines and totals.
 */

import { CATALOG_BY_SKU } from "./catalog";
import type { CatalogProduct } from "./catalog";
import { computeOrderTotal } from "./pricing";
import type { OrderTotals } from "./pricing";

export interface CartItem {
  sku: string;
  price: number;
  qty: number;
  name?: string;
  category?: string;
}

export interface ReceiptLine {
  sku: string;
  name: string;
  category: string;
  qty: number;
  lineTotal: number;
}

/**
 * Expands each cart line into a printable receipt row by resolving the SKU
 * against the shared catalog for display name and category. SKUs not in the
 * catalog fall back to the cart line's own name and category.
 */
export function formatLineItems(items: CartItem[]): ReceiptLine[] {
  return items.map((item) => {
    const product: CatalogProduct | undefined = CATALOG_BY_SKU[item.sku];
    const name = product?.name ?? item.name;
    if (name === undefined) {
      throw Object.assign(
        new Error(`Unknown SKU with no display name: ${item.sku}`),
        { code: "UNKNOWN_SKU" },
      );
    }
    return {
      sku: item.sku,
      name,
      category: product?.category ?? item.category ?? "other",
      qty: item.qty,
      lineTotal: Math.round(item.price * item.qty * 100) / 100,
    };
  });
}

export interface CheckoutOrder {
  items: CartItem[];
  region: string;
}

export interface CheckoutReceipt {
  lineItems: ReceiptLine[];
  totals: OrderTotals;
}

/**
 * Builds the full checkout receipt: per-line detail plus monetary totals.
 */
export function buildCheckoutReceipt(order: CheckoutOrder): CheckoutReceipt {
  const items = order.items ?? [];
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totals = computeOrderTotal(subtotal, order.region);
  const lineItems = formatLineItems(items);
  return { lineItems, totals };
}
