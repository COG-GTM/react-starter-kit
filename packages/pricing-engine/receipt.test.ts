import { describe, expect, it } from "vitest";

import { buildCheckoutReceipt, formatLineItems } from "./receipt";

describe("pricing engine receipt formatting", () => {
  it("uses catalog details and calculates a catalog line total", () => {
    const [lineItem] = formatLineItems([
      { sku: "HD-1001-DRILL", price: 159, qty: 2 },
    ]);

    expect(lineItem).toEqual({
      sku: "HD-1001-DRILL",
      name: "DEWALT 20V MAX Cordless Drill/Driver Kit",
      category: "tools",
      qty: 2,
      lineTotal: 318,
    });
  });

  it("uses an unknown item's name and other category", () => {
    const [lineItem] = formatLineItems([
      {
        sku: "HD-PROXTRA-REWARD",
        name: "Pro Xtra Member Reward",
        price: 0,
        qty: 1,
      },
    ]);

    expect(lineItem).toEqual({
      sku: "HD-PROXTRA-REWARD",
      name: "Pro Xtra Member Reward",
      category: "other",
      qty: 1,
      lineTotal: 0,
    });
  });

  it("falls back to an unknown SKU when the item has no name", () => {
    const [lineItem] = formatLineItems([
      { sku: "HD-UNKNOWN", price: 12.5, qty: 2 },
    ]);

    expect(lineItem.name).toBe("HD-UNKNOWN");
    expect(lineItem.category).toBe("other");
  });

  it("totals only the priced item in a mixed cart", () => {
    const receipt = buildCheckoutReceipt({
      items: [
        { sku: "HD-1001-DRILL", price: 159, qty: 1 },
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
    expect(receipt.totals.subtotal).toBe(159);
  });

  it("returns no line items for an empty cart", () => {
    expect(formatLineItems([])).toEqual([]);
  });
});
