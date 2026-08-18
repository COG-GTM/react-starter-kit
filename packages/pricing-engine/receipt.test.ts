import { describe, expect, it } from "vitest";

import { buildCheckoutReceipt, formatLineItems } from "./receipt";

describe("formatLineItems", () => {
  it("resolves catalog SKUs to their catalog name and category", () => {
    expect(
      formatLineItems([{ sku: "HD-1001-DRILL", price: 159.0, qty: 2 }]),
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

  it("falls back to the line's own metadata for non-catalog SKUs", () => {
    expect(
      formatLineItems([
        {
          sku: "HD-PROXTRA-REWARD",
          name: "Pro Xtra Member Reward",
          price: 0,
          qty: 1,
        },
      ]),
    ).toEqual([
      {
        sku: "HD-PROXTRA-REWARD",
        name: "Pro Xtra Member Reward",
        category: "other",
        qty: 1,
        lineTotal: 0,
      },
    ]);
  });

  it("falls back to the SKU when a non-catalog line has no name", () => {
    expect(formatLineItems([{ sku: "HD-UNKNOWN", price: 10, qty: 1 }])).toEqual(
      [
        {
          sku: "HD-UNKNOWN",
          name: "HD-UNKNOWN",
          category: "other",
          qty: 1,
          lineTotal: 10,
        },
      ],
    );
  });
});

describe("buildCheckoutReceipt", () => {
  it("completes a checkout mixing catalog products with a loyalty reward", () => {
    const receipt = buildCheckoutReceipt({
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

    expect(receipt.lineItems.map((line) => line.name)).toEqual([
      "DEWALT 20V MAX Cordless Drill/Driver Kit",
      "Pro Xtra Member Reward",
    ]);
    expect(receipt.totals.subtotal).toBe(159);
    expect(receipt.totals.currency).toBe("USD");
  });
});
