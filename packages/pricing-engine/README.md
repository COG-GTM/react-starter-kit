# Pricing Engine Package

Shared internal pricing & receipt engine for Home Depot storefront services. It
owns the canonical product catalog, tax/region configuration, Pro volume-discount
tiers and checkout receipt formatting so every consumer surface (web, mobile,
in-store kiosk) prices an order identically.

## Usage

```ts
import { buildCheckoutReceipt } from "@repo/pricing-engine";

const { lineItems, totals } = buildCheckoutReceipt({
  region: "US",
  items: [{ sku: "HD-1001-DRILL", price: 159.0, qty: 1 }],
});
```

## API

| Export                                | Description                                     |
| ------------------------------------- | ----------------------------------------------- |
| `CATALOG` / `CATALOG_BY_SKU`          | Canonical product catalog (array + SKU index).  |
| `TAX_REGIONS`                         | Tax rate + currency by region code.             |
| `getApplicableDiscount(subtotal)`     | Resolves the Pro volume-discount tier.          |
| `computeOrderTotal(subtotal, region)` | Subtotal, tax, discount, grand total.           |
| `formatLineItems(items)`              | Expands cart lines into printable receipt rows. |
| `buildCheckoutReceipt(order)`         | Full receipt: `{ lineItems, totals }`.          |
