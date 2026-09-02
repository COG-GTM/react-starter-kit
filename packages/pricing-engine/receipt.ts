/**
 * @file Checkout receipt formatting: expands cart lines and totals.
 */

import { CATALOG_BY_SKU } from "./catalog";
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
 * Expands each cart line into a printable receipt row. Catalog SKUs resolve
 * their name and category from the shared catalog; non-catalog lines (loyalty
 * rewards, promos) fall back to the line's own name and category, then their
 * SKU and "other".
 *
 */
export function formatLineItems(items: CartItem[]): ReceiptLine[] {
  return items.map((item) => {
    const product = Object.hasOwn(CATALOG_BY_SKU, item.sku)
      ? CATALOG_BY_SKU[item.sku]
      : undefined;
    return {
      sku: item.sku,
      name: product?.name ?? item.name ?? item.sku,
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
