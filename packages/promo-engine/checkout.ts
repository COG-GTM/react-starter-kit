import { CATALOG_BY_SKU, TAX_REGIONS } from "./catalog";
import { applyPromoCodes, type AppliedPromo } from "./promotions";

export function round(value: number): number {
  return Math.round(value * 100) / 100;
}

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

export function formatLineItems(items: CartItem[]): ReceiptLine[] {
  return items.map((item) => {
    const product = CATALOG_BY_SKU[item.sku];
    return {
      sku: item.sku,
      name: product?.name ?? item.sku,
      category: product?.category ?? "other",
      qty: item.qty,
      lineTotal: round(item.price * item.qty),
    };
  });
}

export interface OrderTotals {
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
}

export function computeOrderTotal(
  subtotal: number,
  region: string,
  discount: number,
): OrderTotals {
  const taxConfig = TAX_REGIONS[region];
  if (!taxConfig) {
    throw Object.assign(new Error(`Unknown tax region: ${region}`), {
      code: "INVALID_REGION",
    });
  }
  const taxableSubtotal = subtotal - discount;
  const tax = round(taxableSubtotal * taxConfig.taxRate);
  return {
    subtotal: round(subtotal),
    tax,
    discount: round(discount),
    total: round(taxableSubtotal + tax),
    currency: taxConfig.currency,
  };
}

export interface CheckoutOrder {
  items: CartItem[];
  region: string;
  promoCodes?: string[];
}

export interface CheckoutReceipt {
  lineItems: ReceiptLine[];
  promos: AppliedPromo[];
  totals: OrderTotals;
}

export function buildCheckoutReceipt(order: CheckoutOrder): CheckoutReceipt {
  const items = order.items ?? [];
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const promos = applyPromoCodes(order.promoCodes ?? [], subtotal);
  const discount = promos.reduce((sum, promo) => sum + promo.amount, 0);
  const totals = computeOrderTotal(subtotal, order.region, discount);
  const lineItems = formatLineItems(items);
  return { lineItems, promos, totals };
}
