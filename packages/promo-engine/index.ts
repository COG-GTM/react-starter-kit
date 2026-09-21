/**
 * @file promo-engine package entrypoint.
 *
 * Shared internal Gap promotions and checkout receipt engine.
 */

export { CATALOG, CATALOG_BY_SKU, TAX_REGIONS } from "./catalog";
export type { Product, TaxRegionConfig } from "./catalog";

export { PROMO_RULES, applyPromoCodes } from "./promotions";
export type { AppliedPromo, PromoRule, PromoType } from "./promotions";

export {
  buildCheckoutReceipt,
  computeOrderTotal,
  formatLineItems,
} from "./checkout";
export type {
  CartItem,
  CheckoutOrder,
  CheckoutReceipt,
  OrderTotals,
  ReceiptLine,
} from "./checkout";
