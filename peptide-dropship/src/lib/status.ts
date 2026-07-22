import type { FulfillmentStatus } from "./types";

export const STATUS_LABEL: Record<FulfillmentStatus, string> = {
  PENDING: "Pending",
  ROUTED_TO_SUPPLIER: "Routed to Supplier",
  DISPATCHED: "Dispatched",
  IN_TRANSIT: "In Transit",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const STATUS_CLASS: Record<FulfillmentStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800 ring-amber-200",
  ROUTED_TO_SUPPLIER: "bg-sky-100 text-sky-800 ring-sky-200",
  DISPATCHED: "bg-indigo-100 text-indigo-800 ring-indigo-200",
  IN_TRANSIT: "bg-violet-100 text-violet-800 ring-violet-200",
  DELIVERED: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  CANCELLED: "bg-rose-100 text-rose-800 ring-rose-200",
};

export const STATUS_STEPS: FulfillmentStatus[] = [
  "PENDING",
  "ROUTED_TO_SUPPLIER",
  "DISPATCHED",
  "IN_TRANSIT",
  "DELIVERED",
];
