/**
 * @file Canonical Home Depot product catalog and tax configuration.
 *
 * Shared source of truth used by every storefront and the checkout pricing
 * engine so that all consumer surfaces (web, mobile, in-store kiosk) price an
 * order identically. SKUs are keyed by their Home Depot internet number.
 */

export interface CatalogProduct {
  sku: string;
  name: string;
  category: string;
  unitPrice: number;
}

export const CATALOG: CatalogProduct[] = [
  {
    sku: "HD-1001-DRILL",
    name: "DEWALT 20V MAX Cordless Drill/Driver Kit",
    category: "tools",
    unitPrice: 159.0,
  },
  {
    sku: "HD-1002-SAW",
    name: "RYOBI ONE+ 18V Circular Saw",
    category: "tools",
    unitPrice: 99.0,
  },
  {
    sku: "HD-2001-PAINT",
    name: "BEHR Premium Plus Interior Paint (1 gal)",
    category: "paint",
    unitPrice: 34.98,
  },
  {
    sku: "HD-2002-PRIMER",
    name: "KILZ Original Multi-Surface Primer (1 gal)",
    category: "paint",
    unitPrice: 24.98,
  },
  {
    sku: "HD-3001-LUMBER",
    name: "2 in. x 4 in. x 8 ft. Prime Lumber",
    category: "lumber",
    unitPrice: 4.28,
  },
  {
    sku: "HD-3002-PLYWOOD",
    name: "Sandeply Plywood (1/2 in. x 4 ft. x 8 ft.)",
    category: "lumber",
    unitPrice: 48.97,
  },
  {
    sku: "HD-4001-WATER",
    name: "Rheem Performance 50 Gal. Electric Water Heater",
    category: "plumbing",
    unitPrice: 549.0,
  },
  {
    sku: "HD-4002-FAUCET",
    name: "MOEN Adler Single-Handle Kitchen Faucet",
    category: "plumbing",
    unitPrice: 89.0,
  },
  {
    sku: "HD-5001-LED",
    name: "Commercial Electric 6 in. LED Recessed Light (6-Pack)",
    category: "electrical",
    unitPrice: 49.97,
  },
  {
    sku: "HD-6001-MULCH",
    name: "Vigoro Brown Mulch (2 cu. ft.)",
    category: "garden",
    unitPrice: 4.97,
  },
];

/**
 * Catalog indexed by SKU for O(1) lookups during receipt formatting.
 */
export const CATALOG_BY_SKU: Record<string, CatalogProduct> =
  Object.fromEntries(CATALOG.map((product) => [product.sku, product]));

export interface TaxRegionConfig {
  taxRate: number;
  currency: string;
}

export const TAX_REGIONS: Record<string, TaxRegionConfig> = {
  US: { taxRate: 0.0825, currency: "USD" },
  CA: { taxRate: 0.13, currency: "CAD" },
  MX: { taxRate: 0.16, currency: "MXN" },
};
