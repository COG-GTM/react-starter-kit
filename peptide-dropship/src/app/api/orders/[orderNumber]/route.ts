import { NextResponse } from "next/server";
import { getOrder } from "@/lib/order-store";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderNumber: string }> },
) {
  const { orderNumber } = await params;
  const order = await getOrder(orderNumber);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json({ order });
}
