import { describe, expect, it } from "vitest";

import { CATALOG } from "./catalog";
import type { CartItem } from "./receipt";
import { buildCheckoutReceipt, formatLineItems } from "./receipt";

const DRILL = CATALOG[0]; // HD-1001-DRILL, a real catalog product

describe("formatLineItems", () => {
  it("resolves name and category from the catalog for known SKUs", () => {
    const [line] = formatLineItems([
      { sku: DRILL.sku, price: DRILL.unitPrice, qty: 2 },
    ]);

    expect(line).toEqual({
      sku: DRILL.sku,
      name: DRILL.name,
      category: DRILL.category,
      qty: 2,
      lineTotal: Math.round(DRILL.unitPrice * 2 * 100) / 100,
    });
  });

  it("does not throw for a SKU missing from the catalog (regression: NODE-EXPRESS-25)", () => {
    // The Home Depot checkout injects the HD-PROXTRA-REWARD loyalty SKU, which
    // is not a catalog product. Previously the unguarded product.name access
    // threw "Cannot read properties of undefined (reading 'name')".
    const loyalty: CartItem = {
      sku: "HD-PROXTRA-REWARD",
      name: "Pro Xtra Member Reward",
      price: 0,
      qty: 1,
    };

    expect(() => formatLineItems([loyalty])).not.toThrow();

    const [line] = formatLineItems([loyalty]);
    expect(line.name).toBe("Pro Xtra Member Reward");
    expect(line.category).toBe("other");
    expect(line.lineTotal).toBe(0);
  });

  it("falls back to the SKU when neither catalog nor item provide a name", () => {
    const [line] = formatLineItems([
      { sku: "UNKNOWN-SKU-123", price: 9.99, qty: 3 },
    ]);

    expect(line.name).toBe("UNKNOWN-SKU-123");
    expect(line.category).toBe("other");
    expect(line.lineTotal).toBe(29.97);
  });
});

describe("buildCheckoutReceipt", () => {
  it("builds a receipt mixing catalog products and a non-catalog loyalty reward", () => {
    const { lineItems, totals } = buildCheckoutReceipt({
      items: [
        { sku: DRILL.sku, price: DRILL.unitPrice, qty: 1 },
        {
          sku: "HD-PROXTRA-REWARD",
          name: "Pro Xtra Member Reward",
          price: 0,
          qty: 1,
        },
      ],
      region: "US",
    });

    expect(lineItems).toHaveLength(2);
    expect(lineItems[1].name).toBe("Pro Xtra Member Reward");
    expect(totals.currency).toBe("USD");
  });
});
