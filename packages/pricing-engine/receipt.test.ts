import { describe, expect, it } from "vitest";

import { buildCheckoutReceipt, formatLineItems } from "./receipt";

const drill = {
  sku: "HD-1001-DRILL",
  price: 159,
  qty: 2,
};

const loyaltyReward = {
  sku: "HD-PROXTRA-REWARD",
  name: "Pro Xtra Member Reward",
  price: 0,
  qty: 1,
};

describe("formatLineItems", () => {
  it("uses catalog name and category for catalog SKUs", () => {
    expect(formatLineItems([drill])).toEqual([
      {
        sku: "HD-1001-DRILL",
        name: "DEWALT 20V MAX Cordless Drill/Driver Kit",
        category: "tools",
        qty: 2,
        lineTotal: 318,
      },
    ]);
  });

  it("uses line metadata for non-catalog SKUs", () => {
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

  it("does not treat inherited properties as catalog products", () => {
    expect(
      formatLineItems([
        {
          sku: "constructor",
          name: "Weird Promo",
          price: 0,
          qty: 1,
        },
      ]),
    ).toEqual([
      {
        sku: "constructor",
        name: "Weird Promo",
        category: "other",
        qty: 1,
        lineTotal: 0,
      },
    ]);
  });

  it("falls back to the SKU and other category without line metadata", () => {
    expect(
      formatLineItems([{ sku: "PROMO-UNKNOWN", price: 0, qty: 1 }]),
    ).toEqual([
      {
        sku: "PROMO-UNKNOWN",
        name: "PROMO-UNKNOWN",
        category: "other",
        qty: 1,
        lineTotal: 0,
      },
    ]);
  });
});

describe("buildCheckoutReceipt", () => {
  it("builds a receipt containing catalog and loyalty lines", () => {
    const receipt = buildCheckoutReceipt({
      items: [drill, loyaltyReward],
      region: "US",
    });

    expect(receipt.lineItems).toHaveLength(2);
    expect(receipt.lineItems[1]).toMatchObject({
      sku: "HD-PROXTRA-REWARD",
      name: "Pro Xtra Member Reward",
      category: "other",
    });
    expect(receipt.totals).toMatchObject({
      subtotal: 318,
      total: 344.24,
      currency: "USD",
    });
  });
});
