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
  /** Display name for lines that are not catalog products (loyalty rewards, promos). */
  name?: string;
  /** Category for lines that are not catalog products. */
  category?: string;
}

const NON_CATALOG_CATEGORY = "other";

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
 * Not every SKU is a catalog product: loyalty rewards and promotional lines are
 * injected by storefront services and carry their own name/category.
 */
export function formatLineItems(items: CartItem[]): ReceiptLine[] {
  return items.map((item) => {
    const product = CATALOG_BY_SKU[item.sku];
    return {
      sku: item.sku,
      name: product?.name ?? item.name ?? item.sku,
      category: product?.category ?? item.category ?? NON_CATALOG_CATEGORY,
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
