import { describe, expect, it } from "vitest";

import { buildCheckoutReceipt, formatLineItems } from "./receipt";
import type { CartItem } from "./receipt";

describe("formatLineItems", () => {
  it("resolves known catalog SKUs to their product name and category", () => {
    const items: CartItem[] = [{ sku: "HD-1001-DRILL", price: 159.0, qty: 2 }];
    const result = formatLineItems(items);
    expect(result).toEqual([
      {
        sku: "HD-1001-DRILL",
        name: "DEWALT 20V MAX Cordless Drill/Driver Kit",
        category: "tools",
        qty: 2,
        lineTotal: 318.0,
      },
    ]);
  });

  it("falls back to SKU as name and 'other' as category for unknown SKUs", () => {
    const items: CartItem[] = [{ sku: "UNKNOWN-REWARD-SKU", price: 0, qty: 1 }];
    const result = formatLineItems(items);
    expect(result).toEqual([
      {
        sku: "UNKNOWN-REWARD-SKU",
        name: "UNKNOWN-REWARD-SKU",
        category: "other",
        qty: 1,
        lineTotal: 0,
      },
    ]);
  });

  it("handles a mix of known and unknown SKUs without throwing", () => {
    const items: CartItem[] = [
      { sku: "HD-1001-DRILL", price: 159.0, qty: 1 },
      { sku: "HD-PROXTRA-REWARD", price: 0, qty: 1 },
    ];
    const result = formatLineItems(items);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("DEWALT 20V MAX Cordless Drill/Driver Kit");
    expect(result[0].category).toBe("tools");
    expect(result[1].name).toBe("HD-PROXTRA-REWARD");
    expect(result[1].category).toBe("other");
  });

  it("returns an empty array for empty input", () => {
    expect(formatLineItems([])).toEqual([]);
  });
});

describe("buildCheckoutReceipt", () => {
  it("produces a receipt with line items and totals for a valid order", () => {
    const receipt = buildCheckoutReceipt({
      items: [{ sku: "HD-1001-DRILL", price: 159.0, qty: 1 }],
      region: "US",
    });
    expect(receipt.lineItems).toHaveLength(1);
    expect(receipt.totals.subtotal).toBe(159.0);
    expect(receipt.totals.currency).toBe("USD");
  });

  it("does not throw when items include an unknown SKU", () => {
    const receipt = buildCheckoutReceipt({
      items: [
        { sku: "HD-1001-DRILL", price: 159.0, qty: 1 },
        { sku: "HD-PROXTRA-REWARD", price: 0, qty: 1 },
      ],
      region: "US",
    });
    expect(receipt.lineItems).toHaveLength(2);
    expect(receipt.lineItems[1].name).toBe("HD-PROXTRA-REWARD");
    expect(receipt.lineItems[1].category).toBe("other");
  });
});
