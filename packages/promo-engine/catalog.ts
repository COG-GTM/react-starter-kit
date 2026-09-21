/**
 * @file Canonical Gap product catalog and tax configuration.
 *
 * Shared source of truth used by Gap storefront services so that all consumer
 * surfaces price an order identically.
 */

export interface Product {
  sku: string;
  name: string;
  category: string;
  unitPrice: number;
}

export const CATALOG: Product[] = [
  {
    sku: "GAP-1001-DENIM",
    name: "Men's 365Temp Slim Jeans",
    category: "men",
    unitPrice: 79.95,
  },
  {
    sku: "GAP-1002-TEE",
    name: "Vintage Soft Crewneck T-Shirt",
    category: "men",
    unitPrice: 24.95,
  },
  {
    sku: "GAP-1003-HOODIE",
    name: "Gap Arch Logo Hoodie",
    category: "men",
    unitPrice: 59.95,
  },
  {
    sku: "GAP-2001-WDENIM",
    name: "Women's High Rise Cheeky Straight Jeans",
    category: "women",
    unitPrice: 89.95,
  },
  {
    sku: "GAP-2002-DRESS",
    name: "Linen-Blend Midi Dress",
    category: "women",
    unitPrice: 79.95,
  },
  {
    sku: "GAP-3001-KIDS",
    name: "Kids Gap Logo Zip Hoodie",
    category: "kids",
    unitPrice: 39.95,
  },
  {
    sku: "GAP-3002-BABY",
    name: "Baby Brannan Bear Onesie",
    category: "baby",
    unitPrice: 24.95,
  },
  {
    sku: "GAP-4001-JACKET",
    name: "Icon Denim Jacket",
    category: "men",
    unitPrice: 98.0,
  },
  {
    sku: "GAP-4002-CAP",
    name: "Gap Logo Baseball Hat",
    category: "accessories",
    unitPrice: 19.95,
  },
  {
    sku: "GAP-5001-SOCKS",
    name: "Crew Socks (3-Pack)",
    category: "accessories",
    unitPrice: 14.95,
  },
];

export const CATALOG_BY_SKU: Record<string, Product> = Object.fromEntries(
  CATALOG.map((product) => [product.sku, product]),
);

export interface TaxRegionConfig {
  taxRate: number;
  currency: string;
}

export const TAX_REGIONS: Record<string, TaxRegionConfig> = {
  US: { taxRate: 0.0825, currency: "USD" },
  CA: { taxRate: 0.13, currency: "CAD" },
  UK: { taxRate: 0.2, currency: "GBP" },
};
