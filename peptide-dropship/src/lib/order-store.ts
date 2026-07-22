import { promises as fs } from "fs";
import path from "path";
import type {
  Order,
  OrderItem,
  OrderFulfillment,
  FulfillmentStatus,
} from "./types";
import { getProductById } from "./products";
import { getSupplier } from "./suppliers";

const DATA_DIR = path.join(process.cwd(), ".data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

const FLOW: FulfillmentStatus[] = [
  "PENDING",
  "ROUTED_TO_SUPPLIER",
  "DISPATCHED",
  "IN_TRANSIT",
  "DELIVERED",
];

const CARRIERS = ["DHL Express", "FedEx Intl", "UPS Worldwide"];

async function ensureFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(ORDERS_FILE);
  } catch {
    await fs.writeFile(ORDERS_FILE, "[]", "utf8");
  }
}

async function readAll(): Promise<Order[]> {
  await ensureFile();
  const raw = await fs.readFile(ORDERS_FILE, "utf8");
  try {
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

async function writeAll(orders: Order[]): Promise<void> {
  await ensureFile();
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");
}

export async function listOrders(): Promise<Order[]> {
  const orders = await readAll();
  return orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getOrder(orderNumber: string): Promise<Order | null> {
  const orders = await readAll();
  return orders.find((o) => o.orderNumber === orderNumber) ?? null;
}

function genOrderNumber(): string {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `PEP-${n}`;
}

function genTracking(): string {
  const s = Math.random().toString(36).slice(2, 12).toUpperCase();
  return `1Z${s}`;
}

export interface CreateOrderInput {
  customer: Order["customer"];
  lines: { productId: string; quantity: number }[];
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const items: OrderItem[] = [];
  for (const line of input.lines) {
    const product = getProductById(line.productId);
    if (!product || line.quantity <= 0) continue;
    const supplier = getSupplier(product.supplierId);
    items.push({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      quantity: line.quantity,
      unitPrice: product.price,
      unitCost: product.cost,
      supplierId: product.supplierId,
      supplierName: supplier?.name ?? "Unknown Supplier",
    });
  }

  if (items.length === 0) {
    throw new Error("No valid items in order");
  }

  // Split into per-supplier fulfillments (dropshipping model)
  const bySupplier = new Map<string, OrderItem[]>();
  for (const item of items) {
    const arr = bySupplier.get(item.supplierId) ?? [];
    arr.push(item);
    bySupplier.set(item.supplierId, arr);
  }

  const fulfillments: OrderFulfillment[] = [...bySupplier.entries()].map(
    ([supplierId, supplierItems]) => {
      const supplier = getSupplier(supplierId);
      return {
        supplierId,
        supplierName: supplier?.name ?? "Unknown Supplier",
        status: "PENDING",
        trackingNumber: null,
        carrier: null,
        estimatedDeliveryDays: (supplier?.leadTimeDays ?? 5) + 3,
        items: supplierItems,
      };
    },
  );

  const subtotal = items.reduce(
    (sum, it) => sum + it.unitPrice * it.quantity,
    0,
  );
  const shipping = fulfillments.length * 995;
  const now = new Date().toISOString();

  const order: Order = {
    id: `ord_${Date.now()}`,
    orderNumber: genOrderNumber(),
    createdAt: now,
    updatedAt: now,
    customer: input.customer,
    items,
    fulfillments,
    subtotal,
    shipping,
    total: subtotal + shipping,
    status: "PENDING",
  };

  const orders = await readAll();
  orders.push(order);
  await writeAll(orders);
  return order;
}

function nextStatus(status: FulfillmentStatus): FulfillmentStatus {
  const idx = FLOW.indexOf(status);
  if (idx === -1 || idx >= FLOW.length - 1) return status;
  return FLOW[idx + 1];
}

function rollupStatus(fulfillments: OrderFulfillment[]): FulfillmentStatus {
  if (fulfillments.every((f) => f.status === "DELIVERED")) return "DELIVERED";
  if (fulfillments.every((f) => f.status === "CANCELLED")) return "CANCELLED";
  const active = fulfillments.filter((f) => f.status !== "CANCELLED");
  if (active.length === 0) return "CANCELLED";
  // lowest progress among active fulfillments
  let min = FLOW.length - 1;
  for (const f of active) {
    const idx = FLOW.indexOf(f.status);
    if (idx !== -1 && idx < min) min = idx;
  }
  return FLOW[min];
}

export async function advanceFulfillment(
  orderNumber: string,
  supplierId: string,
): Promise<Order | null> {
  const orders = await readAll();
  const order = orders.find((o) => o.orderNumber === orderNumber);
  if (!order) return null;
  const f = order.fulfillments.find((x) => x.supplierId === supplierId);
  if (!f || f.status === "CANCELLED") return order;

  const upcoming = nextStatus(f.status);
  f.status = upcoming;
  if (upcoming === "DISPATCHED" && !f.trackingNumber) {
    f.trackingNumber = genTracking();
    f.carrier = CARRIERS[Math.floor(Math.random() * CARRIERS.length)];
  }
  order.status = rollupStatus(order.fulfillments);
  order.updatedAt = new Date().toISOString();
  await writeAll(orders);
  return order;
}

export async function setFulfillmentStatus(
  orderNumber: string,
  supplierId: string,
  status: FulfillmentStatus,
): Promise<Order | null> {
  const orders = await readAll();
  const order = orders.find((o) => o.orderNumber === orderNumber);
  if (!order) return null;
  const f = order.fulfillments.find((x) => x.supplierId === supplierId);
  if (!f) return order;
  f.status = status;
  if (
    (status === "DISPATCHED" || status === "IN_TRANSIT") &&
    !f.trackingNumber
  ) {
    f.trackingNumber = genTracking();
    f.carrier = CARRIERS[Math.floor(Math.random() * CARRIERS.length)];
  }
  order.status = rollupStatus(order.fulfillments);
  order.updatedAt = new Date().toISOString();
  await writeAll(orders);
  return order;
}
