import { describe, expect, it } from "vitest";

import { CATALOG } from "./catalog";
import { buildCheckoutReceipt, formatLineItems } from "./receipt";

const drill = CATALOG[0]!;

describe("formatLineItems", () => {
  it("resolves catalog SKUs to their canonical name and category", () => {
    const [line] = formatLineItems([
      { sku: drill.sku, price: drill.unitPrice, qty: 2 },
    ]);

    expect(line).toEqual({
      sku: drill.sku,
      name: drill.name,
      category: drill.category,
      qty: 2,
      lineTotal: Math.round(drill.unitPrice * 2 * 100) / 100,
    });
  });

  it("formats a non-catalog loyalty reward line instead of throwing", () => {
    const [line] = formatLineItems([
      {
        sku: "HD-PROXTRA-REWARD",
        name: "Pro Xtra Member Reward",
        price: 0,
        qty: 1,
      },
    ]);

    expect(line).toEqual({
      sku: "HD-PROXTRA-REWARD",
      name: "Pro Xtra Member Reward",
      category: "other",
      qty: 1,
      lineTotal: 0,
    });
  });

  it("falls back to the SKU when an unknown line carries no display name", () => {
    const [line] = formatLineItems([{ sku: "HD-UNKNOWN", price: 10, qty: 1 }]);

    expect(line.name).toBe("HD-UNKNOWN");
    expect(line.category).toBe("other");
  });
});

describe("buildCheckoutReceipt", () => {
  it("builds a receipt for a cart mixing merchandise and a loyalty reward", () => {
    const receipt = buildCheckoutReceipt({
      items: [
        { sku: drill.sku, price: drill.unitPrice, qty: 1 },
        {
          sku: "HD-PROXTRA-REWARD",
          name: "Pro Xtra Member Reward",
          price: 0,
          qty: 1,
        },
      ],
      region: "US",
    });

    expect(receipt.lineItems.map((line) => line.name)).toEqual([
      drill.name,
      "Pro Xtra Member Reward",
    ]);
    expect(receipt.totals.total).toBeGreaterThan(0);
  });
});
