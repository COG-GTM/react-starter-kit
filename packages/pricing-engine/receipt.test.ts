import { describe, expect, it } from "vitest";

import { buildCheckoutReceipt, formatLineItems } from "./receipt";
import type { CartItem } from "./receipt";

const CATALOG_ITEM: CartItem = { sku: "HD-1001-DRILL", price: 159.0, qty: 1 };

// Loyalty reward injected at checkout — intentionally NOT a catalog product.
const LOYALTY_REWARD: CartItem = {
  sku: "HD-PROXTRA-REWARD",
  name: "Pro Xtra Member Reward",
  price: 0,
  qty: 1,
};

describe("formatLineItems", () => {
  it("resolves name and category from the catalog for known SKUs", () => {
    const [line] = formatLineItems([CATALOG_ITEM]);
    expect(line).toEqual({
      sku: "HD-1001-DRILL",
      name: "DEWALT 20V MAX Cordless Drill/Driver Kit",
      category: "tools",
      qty: 1,
      lineTotal: 159.0,
    });
  });

  // Regression for NODE-EXPRESS-25: a non-catalog SKU used to throw
  // "TypeError: Cannot read properties of undefined (reading 'name')".
  it("does not throw for a SKU absent from the catalog (loyalty reward)", () => {
    expect(() => formatLineItems([LOYALTY_REWARD])).not.toThrow();
  });

  it("falls back to the item's own name/category for non-catalog SKUs", () => {
    const [line] = formatLineItems([LOYALTY_REWARD]);
    expect(line).toEqual({
      sku: "HD-PROXTRA-REWARD",
      name: "Pro Xtra Member Reward",
      category: "other",
      qty: 1,
      lineTotal: 0,
    });
  });

  it("falls back to the SKU when no name is provided for a non-catalog item", () => {
    const [line] = formatLineItems([{ sku: "HD-UNKNOWN", price: 5, qty: 2 }]);
    expect(line.name).toBe("HD-UNKNOWN");
    expect(line.category).toBe("other");
    expect(line.lineTotal).toBe(10);
  });

  it("formats a mixed cart of catalog and non-catalog items", () => {
    const lines = formatLineItems([CATALOG_ITEM, LOYALTY_REWARD]);
    expect(lines.map((l) => l.name)).toEqual([
      "DEWALT 20V MAX Cordless Drill/Driver Kit",
      "Pro Xtra Member Reward",
    ]);
  });
});

describe("buildCheckoutReceipt", () => {
  // End-to-end regression: the Home Depot checkout appends the loyalty reward
  // SKU before building the receipt, which is what triggered NODE-EXPRESS-25.
  it("builds a receipt for a cart containing a non-catalog loyalty reward", () => {
    const receipt = buildCheckoutReceipt({
      items: [CATALOG_ITEM, LOYALTY_REWARD],
      region: "US",
    });
    expect(receipt.lineItems).toHaveLength(2);
    expect(receipt.lineItems[1]?.name).toBe("Pro Xtra Member Reward");
    expect(receipt.totals.currency).toBe("USD");
  });
});
