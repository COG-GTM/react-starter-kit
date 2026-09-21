# Promo Engine Package

Shared internal promotions & receipt engine for Gap storefront services. It
owns the canonical product catalog, tax/region configuration, promotion rules
and checkout receipt formatting so every consumer surface prices an order
identically.

## Usage

```ts
import { buildCheckoutReceipt } from "@repo/promo-engine";

const { lineItems, promos, totals } = buildCheckoutReceipt({
  region: "US",
  items: [{ sku: "GAP-1001-DENIM", price: 79.95, qty: 1 }],
  promoCodes: ["GAP40"],
});
```

## API

| Export                                          | Description                                     |
| ----------------------------------------------- | ----------------------------------------------- |
| `CATALOG` / `CATALOG_BY_SKU`                    | Canonical product catalog (array + SKU index).  |
| `TAX_REGIONS`                                   | Tax rate + currency by region code.             |
| `PROMO_RULES`                                   | Promotion rules keyed by promo code.            |
| `applyPromoCodes(codes, subtotal)`              | Resolves promotions and computes discounts.     |
| `computeOrderTotal(subtotal, region, discount)` | Subtotal, tax, discount, grand total.           |
| `formatLineItems(items)`                        | Expands cart lines into printable receipt rows. |
| `buildCheckoutReceipt(order)`                   | Full receipt: `{ lineItems, promos, totals }`.  |
