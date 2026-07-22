import { NextResponse } from "next/server";
import { createOrder, listOrders } from "@/lib/order-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const orders = await listOrders();
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { customer, lines } = (body ?? {}) as {
    customer?: Record<string, unknown>;
    lines?: { productId?: string; quantity?: number }[];
  };

  if (
    !customer ||
    typeof customer.name !== "string" ||
    typeof customer.email !== "string" ||
    !Array.isArray(lines) ||
    lines.length === 0
  ) {
    return NextResponse.json(
      { error: "Missing customer details or cart items" },
      { status: 400 },
    );
  }

  const normalizedLines = lines
    .filter(
      (l): l is { productId: string; quantity: number } =>
        typeof l.productId === "string" && typeof l.quantity === "number",
    )
    .map((l) => ({ productId: l.productId, quantity: l.quantity }));

  try {
    const order = await createOrder({
      customer: {
        name: String(customer.name),
        email: String(customer.email),
        address: String(customer.address ?? ""),
        city: String(customer.city ?? ""),
        state: String(customer.state ?? ""),
        zip: String(customer.zip ?? ""),
        country: String(customer.country ?? ""),
      },
      lines: normalizedLines,
    });
    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create order";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
