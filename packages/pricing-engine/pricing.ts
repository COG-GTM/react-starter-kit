/**
 * @file Monetary calculations for checkout: discounts, tax and grand total.
 */

import { TAX_REGIONS } from "./catalog";

export interface DiscountTier {
  rate: number;
  label: string;
}

/**
 * Resolves the Pro volume-discount tier for a given pre-tax subtotal,
 * mirroring the in-store bulk pricing breaks.
 */
export function getApplicableDiscount(subtotal: number): DiscountTier {
  if (subtotal >= 2000)
    return { rate: 0.1, label: "10% Pro volume discount ($2,000+)" };
  if (subtotal >= 500)
    return { rate: 0.05, label: "5% Pro volume discount ($500+)" };
  return { rate: 0, label: "None" };
}

export interface OrderTotals {
  subtotal: number;
  tax: number;
  discount: number;
  discountLabel: string;
  total: number;
  currency: string;
}

/**
 * Computes the order monetary totals for a region.
 */
export function computeOrderTotal(
  subtotal: number,
  region: string,
): OrderTotals {
  const taxConfig = TAX_REGIONS[region];
  if (!taxConfig) {
    throw Object.assign(new Error(`Unknown tax region: ${region}`), {
      code: "INVALID_REGION",
    });
  }
  const tax = subtotal * taxConfig.taxRate;
  const discount = getApplicableDiscount(subtotal);
  const discountAmount = (subtotal + tax) * discount.rate;
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    discount: Math.round(discountAmount * 100) / 100,
    discountLabel: discount.label,
    total: Math.round((subtotal + tax - discountAmount) * 100) / 100,
    currency: taxConfig.currency,
  };
}
