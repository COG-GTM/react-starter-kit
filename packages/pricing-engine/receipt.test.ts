import { describe, expect, it } from "vitest";
import { CATALOG } from "./catalog";
import { buildCheckoutReceipt, formatLineItems } from "./receipt";

describe("formatLineItems", () => {
  it("resolves a catalog SKU to its display name and category", () => {
    const product = CATALOG[0];
    const [line] = formatLineItems([
      { sku: product.sku, price: product.unitPrice, qty: 2 },
    ]);

    expect(line).toEqual({
      sku: product.sku,
      name: product.name,
      category: product.category,
      qty: 2,
      lineTotal: Math.round(product.unitPrice * 2 * 100) / 100,
    });
  });

  it("renders a non-catalog SKU instead of throwing (regression: NODE-EXPRESS-25)", () => {
    // The Home Depot loyalty reward is intentionally not a catalog product.
    // Previously this dereferenced an undefined product and threw
    // "TypeError: Cannot read properties of undefined (reading 'name')".
    const loyaltyReward = {
      sku: "HD-PROXTRA-REWARD",
      price: 0,
      qty: 1,
    };

    expect(() => formatLineItems([loyaltyReward])).not.toThrow();

    const [line] = formatLineItems([loyaltyReward]);
    expect(line).toEqual({
      sku: "HD-PROXTRA-REWARD",
      name: "HD-PROXTRA-REWARD",
      category: "other",
      qty: 1,
      lineTotal: 0,
    });
  });
});

describe("buildCheckoutReceipt", () => {
  it("completes a checkout that mixes catalog items with a non-catalog loyalty reward", () => {
    const drill = CATALOG[0];

    const receipt = buildCheckoutReceipt({
      items: [
        { sku: drill.sku, price: drill.unitPrice, qty: 1 },
        { sku: "HD-PROXTRA-REWARD", price: 0, qty: 1 },
      ],
      region: "US",
    });

    expect(receipt.lineItems).toHaveLength(2);
    expect(receipt.lineItems[1]).toMatchObject({
      sku: "HD-PROXTRA-REWARD",
      name: "HD-PROXTRA-REWARD",
      category: "other",
    });
    expect(receipt.totals.currency).toBe("USD");
    expect(receipt.totals.total).toBeGreaterThan(0);
  });
});
