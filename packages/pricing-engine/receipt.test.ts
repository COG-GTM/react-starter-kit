import { describe, expect, it } from "vitest";
import {
  buildCheckoutReceipt,
  formatLineItems,
  NON_CATALOG_CATEGORY,
} from "./receipt";

const DRILL = {
  sku: "HD-1001-DRILL",
  price: 159.0,
  qty: 2,
};

const LOYALTY_REWARD = {
  sku: "HD-PROXTRA-REWARD",
  name: "Pro Xtra Member Reward",
  price: 0,
  qty: 1,
};

describe("formatLineItems", () => {
  it("resolves catalog SKUs to their catalog name and category", () => {
    expect(formatLineItems([DRILL])).toEqual([
      {
        sku: "HD-1001-DRILL",
        name: "DEWALT 20V MAX Cordless Drill/Driver Kit",
        category: "tools",
        qty: 2,
        lineTotal: 318,
      },
    ]);
  });

  it("formats the loyalty reward SKU that is absent from the catalog", () => {
    expect(formatLineItems([DRILL, LOYALTY_REWARD])[1]).toEqual({
      sku: "HD-PROXTRA-REWARD",
      name: "Pro Xtra Member Reward",
      category: NON_CATALOG_CATEGORY,
      qty: 1,
      lineTotal: 0,
    });
  });

  it("falls back to the SKU when an unknown line carries no name", () => {
    expect(
      formatLineItems([{ sku: "HD-UNKNOWN-9999", price: 10, qty: 3 }]),
    ).toEqual([
      {
        sku: "HD-UNKNOWN-9999",
        name: "HD-UNKNOWN-9999",
        category: NON_CATALOG_CATEGORY,
        qty: 3,
        lineTotal: 30,
      },
    ]);
  });
});

describe("buildCheckoutReceipt", () => {
  it("builds a receipt for a cart containing the loyalty reward", () => {
    const receipt = buildCheckoutReceipt({
      items: [DRILL, LOYALTY_REWARD],
      region: "US",
    });

    expect(receipt.lineItems).toHaveLength(2);
    expect(receipt.totals.subtotal).toBe(318);
    expect(receipt.totals.currency).toBe("USD");
  });

  it("returns empty line items for an order with no items", () => {
    const receipt = buildCheckoutReceipt({ items: [], region: "US" });
    expect(receipt.lineItems).toEqual([]);
    expect(receipt.totals.total).toBe(0);
  });
});
