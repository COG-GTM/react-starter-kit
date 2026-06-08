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
 * Not every SKU is a merchandise catalog product — e.g. loyalty rewards and
 * other non-catalog line items. When a SKU is absent from CATALOG_BY_SKU the
 * line is still rendered using the SKU as its display name and an "other"
 * category, rather than dereferencing an undefined product.
 *
 * A catalog miss is also surfaced via `console.warn` so genuine data errors
 * (e.g. a typo'd catalog SKU) remain observable instead of being silently
 * masked, while legitimate non-catalog items still check out gracefully.
 */
export function formatLineItems(items: CartItem[]): ReceiptLine[] {
  return items.map((item) => {
    const product = CATALOG_BY_SKU[item.sku];
    if (!product) {
      console.warn(
        `[pricing-engine] SKU "${item.sku}" is not in the product catalog; ` +
          `rendering as a non-catalog line item ("other").`,
      );
    }
    return {
      sku: item.sku,
      name: product?.name ?? item.sku,
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
