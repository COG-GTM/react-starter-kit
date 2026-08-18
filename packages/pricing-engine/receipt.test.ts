import { describe, expect, it } from "vitest";

import { CATALOG } from "./catalog";
import {
  UNCATALOGED_CATEGORY,
  buildCheckoutReceipt,
  formatLineItems,
} from "./receipt";

const catalogItem = { sku: "HD-1001-DRILL", price: 159.0, qty: 2 };
const loyaltyReward = {
  sku: "HD-PROXTRA-REWARD",
  name: "Pro Xtra Member Reward",
  price: 0,
  qty: 1,
};

describe("formatLineItems", () => {
  it("resolves catalog SKUs against the catalog", () => {
    const product = CATALOG.find((p) => p.sku === catalogItem.sku)!;
    expect(formatLineItems([catalogItem])).toEqual([
      {
        sku: product.sku,
        name: product.name,
        category: product.category,
        qty: 2,
        lineTotal: 318,
      },
    ]);
  });

  it("falls back to the cart line name for non-catalog SKUs", () => {
    expect(formatLineItems([loyaltyReward])).toEqual([
      {
        sku: loyaltyReward.sku,
        name: loyaltyReward.name,
        category: UNCATALOGED_CATEGORY,
        qty: 1,
        lineTotal: 0,
      },
    ]);
  });

  it("falls back to the SKU when a non-catalog line carries no name", () => {
    const [line] = formatLineItems([
      { sku: "HD-GIFTWRAP", price: 3.5, qty: 1 },
    ]);
    expect(line).toMatchObject({
      name: "HD-GIFTWRAP",
      category: UNCATALOGED_CATEGORY,
    });
  });

  it("does not treat Object.prototype members as catalog products", () => {
    const [line] = formatLineItems([{ sku: "constructor", price: 1, qty: 1 }]);
    expect(line).toMatchObject({
      name: "constructor",
      category: UNCATALOGED_CATEGORY,
    });
  });
});

describe("buildCheckoutReceipt", () => {
  it("builds a receipt for an order mixing catalog and loyalty SKUs", () => {
    const receipt = buildCheckoutReceipt({
      items: [catalogItem, loyaltyReward],
      region: "US",
    });
    expect(receipt.lineItems.map((line) => line.name)).toEqual([
      "DEWALT 20V MAX Cordless Drill/Driver Kit",
      "Pro Xtra Member Reward",
    ]);
    expect(receipt.totals.subtotal).toBe(318);
    expect(receipt.totals.currency).toBe("USD");
  });
});
