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
  /**
   * Optional display overrides for line items whose SKU is not a catalog
   * product (e.g. loyalty rewards, promotional credits). When the SKU is
   * absent from CATALOG_BY_SKU these are used for the receipt row.
   */
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
 * against the shared catalog for display name and category.
 *
 * SKUs missing from CATALOG_BY_SKU (e.g. loyalty rewards or promotional
 * credits injected by a storefront) are not catalog products, so they fall
 * back to the line item's own name/category, then to the SKU itself.
 */
export function formatLineItems(items: CartItem[]): ReceiptLine[] {
  return items.map((item) => {
    const product = CATALOG_BY_SKU[item.sku];
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
