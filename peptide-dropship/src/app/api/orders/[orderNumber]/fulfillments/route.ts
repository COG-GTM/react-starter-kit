import { NextResponse } from "next/server";
import { advanceFulfillment, setFulfillmentStatus } from "@/lib/order-store";
import type { FulfillmentStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const VALID_STATUSES: FulfillmentStatus[] = [
  "PENDING",
  "ROUTED_TO_SUPPLIER",
  "DISPATCHED",
  "IN_TRANSIT",
  "DELIVERED",
  "CANCELLED",
];

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderNumber: string }> },
) {
  const { orderNumber } = await params;
  let body: { supplierId?: string; action?: string; status?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.supplierId) {
    return NextResponse.json(
      { error: "supplierId is required" },
      { status: 400 },
    );
  }

  let order;
  if (body.action === "advance") {
    order = await advanceFulfillment(orderNumber, body.supplierId);
  } else if (
    body.status &&
    VALID_STATUSES.includes(body.status as FulfillmentStatus)
  ) {
    order = await setFulfillmentStatus(
      orderNumber,
      body.supplierId,
      body.status as FulfillmentStatus,
    );
  } else {
    return NextResponse.json(
      { error: "Provide action='advance' or a valid status" },
      { status: 400 },
    );
  }

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json({ order });
}
