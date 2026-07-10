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

  it("does not throw for a SKU absent from the catalog (loyalty reward regression)", () => {
    const loyaltyReward: CartItem = {
      sku: "HD-PROXTRA-REWARD",
      name: "Pro Xtra Member Reward",
      price: 0,
      qty: 1,
    };

    expect(() => formatLineItems([loyaltyReward])).not.toThrow();
    expect(formatLineItems([loyaltyReward])).toEqual([
      {
        sku: "HD-PROXTRA-REWARD",
        name: "Pro Xtra Member Reward",
        category: "other",
        qty: 1,
        lineTotal: 0,
      },
    ]);
  });

  it("falls back to the SKU and 'other' when a non-catalog item has no name/category", () => {
    const items: CartItem[] = [{ sku: "UNKNOWN-SKU", price: 10, qty: 3 }];

    expect(formatLineItems(items)).toEqual([
      {
        sku: "UNKNOWN-SKU",
        name: "UNKNOWN-SKU",
        category: "other",
        qty: 3,
        lineTotal: 30,
      },
    ]);
  });
});

describe("buildCheckoutReceipt", () => {
  it("builds a receipt for a cart mixing catalog products and a non-catalog loyalty reward", () => {
    const receipt = buildCheckoutReceipt({
      items: [
        { sku: "HD-1001-DRILL", price: 159.0, qty: 1 },
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
    expect(receipt.lineItems[1]).toMatchObject({
      sku: "HD-PROXTRA-REWARD",
      name: "Pro Xtra Member Reward",
      lineTotal: 0,
    });
    expect(receipt.totals.currency).toBe("USD");
  });
});
