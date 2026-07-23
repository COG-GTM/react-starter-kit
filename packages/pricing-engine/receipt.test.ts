import { describe, expect, it } from "vitest";
import { CATALOG } from "./catalog";
import { buildCheckoutReceipt, formatLineItems } from "./receipt";
import type { CartItem } from "./receipt";

const CATALOG_SKU = CATALOG[0]!.sku;

describe("formatLineItems", () => {
  it("resolves display name and category from the catalog for known SKUs", () => {
    const [line] = formatLineItems([
      { sku: CATALOG_SKU, price: CATALOG[0]!.unitPrice, qty: 2 },
    ]);

    expect(line).toEqual({
      sku: CATALOG_SKU,
      name: CATALOG[0]!.name,
      category: CATALOG[0]!.category,
      qty: 2,
      lineTotal: Math.round(CATALOG[0]!.unitPrice * 2 * 100) / 100,
    });
  });

  it("does not throw for a SKU that is not in the catalog (regression: NODE-EXPRESS-25)", () => {
    // The Home Depot checkout appends a loyalty reward line item whose SKU is
    // intentionally not a catalog product. Before the fix, the catalog lookup
    // returned undefined and `product.name` threw a TypeError.
    const loyaltyReward: CartItem = {
      sku: "HD-PROXTRA-REWARD",
      name: "Pro Xtra Member Reward",
      category: "loyalty",
      price: 0,
      qty: 1,
    };

    expect(() => formatLineItems([loyaltyReward])).not.toThrow();

    const [line] = formatLineItems([loyaltyReward]);
    expect(line).toEqual({
      sku: "HD-PROXTRA-REWARD",
      name: "Pro Xtra Member Reward",
      category: "loyalty",
      qty: 1,
      lineTotal: 0,
    });
  });

  it("falls back to the SKU and 'uncategorized' when a non-catalog item has no name/category", () => {
    const [line] = formatLineItems([
      { sku: "UNKNOWN-SKU", price: 12.5, qty: 3 },
    ]);

    expect(line.name).toBe("UNKNOWN-SKU");
    expect(line.category).toBe("uncategorized");
    expect(line.lineTotal).toBe(37.5);
  });
});

describe("buildCheckoutReceipt", () => {
  it("builds a receipt for a mixed cart of catalog and loyalty items without throwing", () => {
    const receipt = buildCheckoutReceipt({
      items: [
        { sku: CATALOG_SKU, price: CATALOG[0]!.unitPrice, qty: 1 },
        {
          sku: "HD-PROXTRA-REWARD",
          name: "Pro Xtra Member Reward",
          price: 0,
          qty: 1,
        },
      ],
      region: "US",
    });

    expect(receipt.lineItems).toHaveLength(2);
    expect(receipt.lineItems[1]!.name).toBe("Pro Xtra Member Reward");
    expect(receipt.totals.currency).toBe("USD");
  });
});
