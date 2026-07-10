import { describe, expect, it } from "vitest";

import { CATALOG } from "./catalog";
import type { CartItem } from "./receipt";
import { buildCheckoutReceipt, formatLineItems } from "./receipt";

const CATALOG_SKU = CATALOG[0].sku;
const LOYALTY_REWARD: CartItem = {
  sku: "HD-PROXTRA-REWARD",
  name: "Pro Xtra Member Reward",
  price: 0,
  qty: 1,
};

describe("formatLineItems", () => {
  it("resolves display name/category from the catalog for known SKUs", () => {
    const [line] = formatLineItems([{ sku: CATALOG_SKU, price: 159, qty: 2 }]);

    expect(line.name).toBe(CATALOG[0].name);
    expect(line.category).toBe(CATALOG[0].category);
    expect(line.lineTotal).toBe(318);
  });

  // Regression for NODE-EXPRESS-25: a non-catalog SKU (loyalty reward) must not
  // throw "Cannot read properties of undefined (reading 'name')".
  it("does not throw for a SKU that is absent from the catalog", () => {
    expect(() => formatLineItems([LOYALTY_REWARD])).not.toThrow();
  });

  it("falls back to the item-provided name/category for non-catalog SKUs", () => {
    const [line] = formatLineItems([LOYALTY_REWARD]);

    expect(line.name).toBe("Pro Xtra Member Reward");
    expect(line.category).toBe("other");
    expect(line.lineTotal).toBe(0);
  });

  it("falls back to the SKU when no name is provided for a non-catalog item", () => {
    const [line] = formatLineItems([{ sku: "HD-UNKNOWN", price: 10, qty: 1 }]);

    expect(line.name).toBe("HD-UNKNOWN");
    expect(line.category).toBe("other");
  });
});

describe("buildCheckoutReceipt", () => {
  // End-to-end regression: the exact Home Depot checkout shape that triggered
  // NODE-EXPRESS-25 — catalog items plus an appended loyalty reward SKU.
  it("builds a receipt for a cart containing a non-catalog loyalty reward", () => {
    const { lineItems, totals } = buildCheckoutReceipt({
      items: [{ sku: CATALOG_SKU, price: 159, qty: 1 }, LOYALTY_REWARD],
      region: "US",
    });

    expect(lineItems).toHaveLength(2);
    expect(lineItems[1].name).toBe("Pro Xtra Member Reward");
    expect(totals.currency).toBe("USD");
  });
});
