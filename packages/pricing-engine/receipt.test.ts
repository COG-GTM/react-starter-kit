import { describe, expect, it } from "bun:test";
import { buildCheckoutReceipt, type CartItem } from "./receipt";

describe("pricing-engine receipt formatting", () => {
  it("resolves catalog SKU name and category from the catalog", () => {
    const receipt = buildCheckoutReceipt({
      items: [{ sku: "HD-1001-DRILL", price: 159, qty: 1 }],
      region: "US",
    });

    expect(receipt.lineItems[0]).toEqual({
      sku: "HD-1001-DRILL",
      name: "DEWALT 20V MAX Cordless Drill/Driver Kit",
      category: "tools",
      qty: 1,
      lineTotal: 159,
    });
  });

  it("formats non-catalog loyalty rewards without throwing", () => {
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

    expect(receipt.lineItems[1]).toEqual({
      sku: "HD-PROXTRA-REWARD",
      name: "Pro Xtra Member Reward",
      category: "other",
      qty: 1,
      lineTotal: 0,
    });
    expect(receipt.totals.total).toBe(172.12);
  });

  it("falls back to the SKU for an unknown line without a name", () => {
    const receipt = buildCheckoutReceipt({
      items: [{ sku: "UNKNOWN-SKU", price: 12.5, qty: 2 }],
      region: "US",
    });

    expect(receipt.lineItems[0]).toEqual({
      sku: "UNKNOWN-SKU",
      name: "UNKNOWN-SKU",
      category: "other",
      qty: 2,
      lineTotal: 25,
    });
  });

  it("returns an empty receipt for undefined items", () => {
    const receipt = buildCheckoutReceipt({
      items: undefined as unknown as CartItem[],
      region: "US",
    });

    expect(receipt.lineItems).toEqual([]);
    expect(receipt.totals.total).toBe(0);
  });
});
