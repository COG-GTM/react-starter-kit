import { describe, expect, it } from "vitest";

import { buildCheckoutReceipt, formatLineItems } from "./receipt";

describe("pricing-engine receipt formatting", () => {
  it("formats a checkout with a non-catalog loyalty SKU", () => {
    const receipt = buildCheckoutReceipt({
      region: "US",
      items: [
        { sku: "HD-1001-DRILL", price: 159, qty: 1 },
        {
          sku: "HD-PROXTRA-REWARD",
          name: "Pro Xtra Member Reward",
          price: 0,
          qty: 1,
        },
      ],
    });

    expect(receipt.lineItems[1]).toMatchObject({
      name: "Pro Xtra Member Reward",
      category: "other",
      lineTotal: 0,
    });
    expect(receipt.totals.total).toBe(172.12);
  });

  it("uses catalog metadata over cart line metadata", () => {
    const [line] = formatLineItems([
      {
        sku: "HD-1001-DRILL",
        name: "Different cart name",
        category: "different-category",
        price: 159,
        qty: 1,
      },
    ]);

    expect(line).toMatchObject({
      name: "DEWALT 20V MAX Cordless Drill/Driver Kit",
      category: "tools",
    });
  });

  it("throws a typed error for an unknown SKU without a display name", () => {
    expect(() => formatLineItems([{ sku: "NOPE", price: 1, qty: 1 }])).toThrow(
      /NOPE/,
    );

    try {
      formatLineItems([{ sku: "NOPE", price: 1, qty: 1 }]);
    } catch (error) {
      expect(error).not.toBeInstanceOf(TypeError);
      expect(error).toMatchObject({ code: "UNKNOWN_SKU" });
    }
  });
});
