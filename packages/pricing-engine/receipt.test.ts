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

  // Regression: NODE-EXPRESS-25 — a non-catalog loyalty SKU injected by the
  // Home Depot checkout (HD-PROXTRA-REWARD) used to throw
  // "TypeError: Cannot read properties of undefined (reading 'name')".
  it("falls back to the item's own name for a non-catalog SKU instead of throwing", () => {
    const items: CartItem[] = [
      { sku: "HD-1001-DRILL", price: 159.0, qty: 1 },
      {
        sku: "HD-PROXTRA-REWARD",
        name: "Pro Xtra Member Reward",
        price: 0,
        qty: 1,
      },
    ];

    expect(() => formatLineItems(items)).not.toThrow();

    const lines = formatLineItems(items);
    expect(lines[1]).toEqual({
      sku: "HD-PROXTRA-REWARD",
      name: "Pro Xtra Member Reward",
      category: "other",
      qty: 1,
      lineTotal: 0,
    });
  });

  it("uses 'Unknown item' when an unknown SKU has no name", () => {
    const items: CartItem[] = [{ sku: "HD-DOES-NOT-EXIST", price: 5, qty: 3 }];

    expect(formatLineItems(items)[0]).toEqual({
      sku: "HD-DOES-NOT-EXIST",
      name: "Unknown item",
      category: "other",
      qty: 3,
      lineTotal: 15,
    });
  });
});

describe("buildCheckoutReceipt", () => {
  // Regression: the full checkout path that surfaced the bug — a catalog item
  // plus the injected loyalty reward — must complete without throwing.
  it("builds a receipt for a cart that includes a non-catalog loyalty reward", () => {
    const { lineItems, totals } = buildCheckoutReceipt({
      region: "US",
      items: [
        { sku: "HD-1001-DRILL", price: 159.0, qty: 1 },
        {
          sku: "HD-PROXTRA-REWARD",
          name: "Pro Xtra Member Reward",
          price: 0,
          qty: 1,
        },
      ],
    });

    expect(lineItems).toHaveLength(2);
    expect(lineItems[1]?.name).toBe("Pro Xtra Member Reward");
    expect(totals.currency).toBe("USD");
  });
});
