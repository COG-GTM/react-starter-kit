export type PeptideCategory =
  | "research"
  | "cosmetic"
  | "metabolic"
  | "recovery"
  | "blends";

export interface Supplier {
  id: string;
  name: string;
  country: string;
  leadTimeDays: number;
  rating: number;
  specialties: PeptideCategory[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: PeptideCategory;
  sequence: string;
  shortDescription: string;
  description: string;
  /** price in USD cents */
  price: number;
  /** wholesale cost from supplier in USD cents */
  cost: number;
  sizeMg: number;
  purity: string;
  stock: number;
  supplierId: string;
  tags: string[];
  accent: string;
  researchUseOnly: boolean;
}

export interface CartLine {
  productId: string;
  quantity: number;
}

export type FulfillmentStatus =
  | "PENDING"
  | "ROUTED_TO_SUPPLIER"
  | "DISPATCHED"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  quantity: number;
  unitPrice: number;
  unitCost: number;
  supplierId: string;
  supplierName: string;
}

export interface OrderFulfillment {
  supplierId: string;
  supplierName: string;
  status: FulfillmentStatus;
  trackingNumber: string | null;
  carrier: string | null;
  estimatedDeliveryDays: number;
  items: OrderItem[];
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
  customer: {
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  items: OrderItem[];
  fulfillments: OrderFulfillment[];
  subtotal: number;
  shipping: number;
  total: number;
  status: FulfillmentStatus;
}
