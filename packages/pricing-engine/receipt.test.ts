import { describe, expect, it } from "vitest";
import { buildCheckoutReceipt, formatLineItems } from "./receipt";
import type { CartItem } from "./receipt";

describe("formatLineItems", () => {
  it("resolves catalog SKUs to their display name and category", () => {
    const items: CartItem[] = [{ sku: "HD-1001-DRILL", price: 159.0, qty: 2 }];

    expect(formatLineItems(items)).toEqual([
      {
        sku: "HD-1001-DRILL",
        name: "DEWALT 20V MAX Cordless Drill/Driver Kit",
        category: "tools",
        qty: 2,
        lineTotal: 318.0,
      },
    ]);
  });

  // Regression for NODE-EXPRESS-25: the Home Depot checkout appends the
  // HD-PROXTRA-REWARD loyalty line, which is not a catalog product. Resolving
  // it used to dereference `undefined.name` and throw a TypeError.
  it("does not throw on a SKU missing from the catalog", () => {
    const items: CartItem[] = [{ sku: "HD-PROXTRA-REWARD", price: 0, qty: 1 }];

    expect(() => formatLineItems(items)).not.toThrow();
  });

  it("falls back to the cart item's own data for non-catalog SKUs", () => {
    const items: CartItem[] = [{ sku: "HD-PROXTRA-REWARD", price: 0, qty: 1 }];

    expect(formatLineItems(items)).toEqual([
      {
        sku: "HD-PROXTRA-REWARD",
        name: "HD-PROXTRA-REWARD",
        category: "uncategorized",
        qty: 1,
        lineTotal: 0,
      },
    ]);
  });

  it("handles a mixed cart of catalog and non-catalog SKUs", () => {
    const items: CartItem[] = [
      { sku: "HD-1001-DRILL", price: 159.0, qty: 1 },
      { sku: "HD-PROXTRA-REWARD", price: 0, qty: 1 },
    ];

    const lines = formatLineItems(items);

    expect(lines).toHaveLength(2);
    expect(lines[0].name).toBe("DEWALT 20V MAX Cordless Drill/Driver Kit");
    expect(lines[1].name).toBe("HD-PROXTRA-REWARD");
    expect(lines[1].category).toBe("uncategorized");
  });
});

describe("buildCheckoutReceipt", () => {
  // End-to-end regression for NODE-EXPRESS-25 through the public entrypoint the
  // Home Depot checkout actually calls.
  it("builds a receipt for a cart containing a loyalty reward line", () => {
    const receipt = buildCheckoutReceipt({
      items: [
        { sku: "HD-1001-DRILL", price: 159.0, qty: 1 },
        { sku: "HD-PROXTRA-REWARD", price: 0, qty: 1 },
      ],
      region: "US",
    });

    expect(receipt.lineItems).toHaveLength(2);
    expect(receipt.totals.currency).toBe("USD");
    expect(receipt.totals.total).toBeGreaterThan(0);
  });
});
