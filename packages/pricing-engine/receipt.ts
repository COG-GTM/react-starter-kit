/**
 * @file Checkout receipt formatting: expands cart lines and totals.
 */

import { CATALOG_BY_SKU } from "./catalog";
import { computeOrderTotal } from "./pricing";
import type { OrderTotals } from "./pricing";

export interface CartItem {
  sku: string;
  name?: string;
  price: number;
  qty: number;
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
 * against the shared catalog for display name and category.
 *
 * SKUs not in the catalog, such as loyalty rewards, use the cart line's own
 * name (or the SKU) and category "other".
 */
export function formatLineItems(items: CartItem[]): ReceiptLine[] {
  return items.map((item) => {
    const product = Object.hasOwn(CATALOG_BY_SKU, item.sku)
      ? CATALOG_BY_SKU[item.sku]
      : undefined;
    return {
      sku: item.sku,
      name: product?.name ?? item.name ?? item.sku,
      category: product?.category ?? "other",
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
