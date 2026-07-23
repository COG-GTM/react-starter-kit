import { describe, expect, it } from "vitest";

import { CATALOG } from "./catalog";
import { buildCheckoutReceipt, formatLineItems } from "./receipt";
import type { CartItem } from "./receipt";

const CATALOG_ITEM: CartItem = {
  sku: "HD-1001-DRILL",
  price: 159.0,
  qty: 2,
};

// Loyalty rewards are injected server-side and are intentionally NOT part of
// the merchandise catalog — the original bug (NODE-EXPRESS-25) threw a
// TypeError when formatLineItems dereferenced `undefined.name` for such SKUs.
const LOYALTY_REWARD: CartItem = {
  sku: "HD-PROXTRA-REWARD",
  name: "Pro Xtra Member Reward",
  price: 0,
  qty: 1,
};

describe("formatLineItems", () => {
  it("resolves display fields from the catalog for known SKUs", () => {
    const [line] = formatLineItems([CATALOG_ITEM]);
    const product = CATALOG.find((p) => p.sku === CATALOG_ITEM.sku)!;

    expect(line).toEqual({
      sku: "HD-1001-DRILL",
      name: product.name,
      category: product.category,
      qty: 2,
      lineTotal: 318,
    });
  });

  it("does not throw for a non-catalog SKU and uses the item's own name", () => {
    expect(() => formatLineItems([LOYALTY_REWARD])).not.toThrow();

    const [line] = formatLineItems([LOYALTY_REWARD]);
    expect(line.name).toBe("Pro Xtra Member Reward");
    expect(line.category).toBe("other");
    expect(line.lineTotal).toBe(0);
  });

  it("falls back to the SKU when a non-catalog item has no display name", () => {
    const [line] = formatLineItems([
      { sku: "HD-UNKNOWN-SKU", price: 10, qty: 3 },
    ]);

    expect(line.name).toBe("HD-UNKNOWN-SKU");
    expect(line.category).toBe("other");
    expect(line.lineTotal).toBe(30);
  });

  it("formats a mixed cart of catalog and loyalty items without throwing", () => {
    const lines = formatLineItems([CATALOG_ITEM, LOYALTY_REWARD]);
    expect(lines).toHaveLength(2);
    expect(lines.map((l) => l.name)).toContain("Pro Xtra Member Reward");
  });
});

describe("buildCheckoutReceipt", () => {
  it("builds a receipt for a cart containing a loyalty reward line", () => {
    const receipt = buildCheckoutReceipt({
      items: [CATALOG_ITEM, LOYALTY_REWARD],
      region: "US",
    });

    expect(receipt.lineItems).toHaveLength(2);
    expect(receipt.totals.currency).toBe("USD");
    expect(receipt.totals.total).toBeGreaterThan(0);
  });
});
