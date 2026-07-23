import { describe, expect, it } from "vitest";
import { CATALOG } from "./catalog";
import { buildCheckoutReceipt, formatLineItems } from "./receipt";
import type { CartItem } from "./receipt";

const CATALOG_ITEM: CartItem = {
  sku: "HD-1001-DRILL",
  price: 159.0,
  qty: 1,
};

// Loyalty reward SKU that is intentionally NOT part of the merchandise catalog.
// This reproduces the production TypeError (NODE-EXPRESS-25) where the checkout
// injected `HD-PROXTRA-REWARD` and formatLineItems dereferenced an undefined
// catalog product.
const LOYALTY_REWARD: CartItem = {
  sku: "HD-PROXTRA-REWARD",
  name: "Pro Xtra Member Reward",
  price: 0,
  qty: 1,
};

describe("formatLineItems", () => {
  it("resolves catalog SKUs to their display name and category", () => {
    const [line] = formatLineItems([CATALOG_ITEM]);
    const product = CATALOG.find((p) => p.sku === CATALOG_ITEM.sku)!;
    expect(line).toEqual({
      sku: "HD-1001-DRILL",
      name: product.name,
      category: product.category,
      qty: 1,
      lineTotal: 159.0,
    });
  });

  it("does not throw for a non-catalog SKU and falls back to the item name", () => {
    expect(() => formatLineItems([LOYALTY_REWARD])).not.toThrow();
    const [line] = formatLineItems([LOYALTY_REWARD]);
    expect(line).toEqual({
      sku: "HD-PROXTRA-REWARD",
      name: "Pro Xtra Member Reward",
      category: "other",
      qty: 1,
      lineTotal: 0,
    });
  });

  it("falls back to the SKU when a non-catalog item has no name", () => {
    const [line] = formatLineItems([{ sku: "HD-UNKNOWN", price: 10, qty: 2 }]);
    expect(line.name).toBe("HD-UNKNOWN");
    expect(line.category).toBe("other");
    expect(line.lineTotal).toBe(20);
  });

  it("handles a mixed cart of catalog and loyalty-reward items", () => {
    const lines = formatLineItems([CATALOG_ITEM, LOYALTY_REWARD]);
    expect(lines).toHaveLength(2);
    expect(lines[1]?.name).toBe("Pro Xtra Member Reward");
  });
});

describe("buildCheckoutReceipt", () => {
  it("builds a receipt for a cart that includes a non-catalog loyalty reward", () => {
    const receipt = buildCheckoutReceipt({
      items: [CATALOG_ITEM, LOYALTY_REWARD],
      region: "US",
    });
    expect(receipt.lineItems).toHaveLength(2);
    expect(receipt.totals.currency).toBe("USD");
    expect(receipt.lineItems[1]?.name).toBe("Pro Xtra Member Reward");
  });
});
