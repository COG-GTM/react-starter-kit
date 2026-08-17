import { describe, expect, it } from "vitest";

import { buildCheckoutReceipt, formatLineItems } from "./receipt";

const LOYALTY_REWARD = {
  sku: "HD-PROXTRA-REWARD",
  name: "Pro Xtra Member Reward",
  price: 0,
  qty: 1,
};

describe("formatLineItems", () => {
  it("resolves catalog SKUs from the shared catalog", () => {
    expect(
      formatLineItems([{ sku: "HD-1001-DRILL", price: 159, qty: 2 }]),
    ).toEqual([
      {
        sku: "HD-1001-DRILL",
        name: "DEWALT 20V MAX Cordless Drill/Driver Kit",
        category: "tools",
        qty: 2,
        lineTotal: 318,
      },
    ]);
  });

  it("formats non-catalog loyalty reward lines using the item's own name", () => {
    expect(formatLineItems([LOYALTY_REWARD])).toEqual([
      {
        sku: "HD-PROXTRA-REWARD",
        name: "Pro Xtra Member Reward",
        category: "other",
        qty: 1,
        lineTotal: 0,
      },
    ]);
  });

  it("falls back to the SKU when an unknown item carries no name", () => {
    expect(
      formatLineItems([{ sku: "HD-UNKNOWN-9999", price: 10, qty: 3 }]),
    ).toEqual([
      {
        sku: "HD-UNKNOWN-9999",
        name: "HD-UNKNOWN-9999",
        category: "other",
        qty: 3,
        lineTotal: 30,
      },
    ]);
  });
});

describe("buildCheckoutReceipt", () => {
  it("builds a receipt for a cart mixing catalog products and a loyalty reward", () => {
    const receipt = buildCheckoutReceipt({
      items: [{ sku: "HD-2001-PAINT", price: 34.98, qty: 2 }, LOYALTY_REWARD],
      region: "US",
    });

    expect(receipt.lineItems.map((line) => line.name)).toEqual([
      "BEHR Premium Plus Interior Paint (1 gal)",
      "Pro Xtra Member Reward",
    ]);
    expect(receipt.totals.currency).toBe("USD");
    expect(receipt.totals.total).toBeGreaterThan(0);
  });
});
