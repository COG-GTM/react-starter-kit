/**
 * @file pricing-engine package entrypoint.
 *
 * Shared internal pricing & receipt engine consumed by Home Depot storefront
 * services. Owns the canonical product catalog, tax/region configuration,
 * volume-discount tiers and checkout receipt formatting.
 */

export { CATALOG, CATALOG_BY_SKU, TAX_REGIONS } from "./catalog";
export type { CatalogProduct, TaxRegionConfig } from "./catalog";

export { getApplicableDiscount, computeOrderTotal } from "./pricing";
export type { DiscountTier, OrderTotals } from "./pricing";

export {
  formatLineItems,
  buildCheckoutReceipt,
  NON_CATALOG_CATEGORY,
} from "./receipt";
export type {
  CartItem,
  ReceiptLine,
  CheckoutOrder,
  CheckoutReceipt,
} from "./receipt";
