import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrder } from "@/lib/order-store";
import { formatPrice } from "@/lib/products";
import { StatusBadge } from "@/components/StatusBadge";
import { FulfillmentTimeline } from "@/components/FulfillmentTimeline";

export const dynamic = "force-dynamic";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await getOrder(orderNumber);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-2xl bg-brand-50 p-6 text-center ring-1 ring-brand-100">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-2xl text-white">
          ✓
        </div>
        <h1 className="mt-4 text-2xl font-bold text-ink-900">
          Thanks, {order.customer.name.split(" ")[0] || "researcher"}!
        </h1>
        <p className="mt-1 text-slate-600">
          Order{" "}
          <span className="font-mono font-semibold">{order.orderNumber}</span>{" "}
          is confirmed.
        </p>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ink-900">Order status</h2>
        <StatusBadge status={order.status} />
      </div>

      <div className="mt-4 space-y-4">
        {order.fulfillments.map((f) => (
          <FulfillmentTimeline key={f.supplierId} fulfillment={f} />
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="font-semibold text-ink-900">Shipping to</h3>
          <address className="mt-2 text-sm not-italic leading-relaxed text-slate-600">
            {order.customer.name}
            <br />
            {order.customer.address}
            <br />
            {order.customer.city}
            {order.customer.state ? `, ${order.customer.state}` : ""}{" "}
            {order.customer.zip}
            <br />
            {order.customer.country}
            <br />
            {order.customer.email}
          </address>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="font-semibold text-ink-900">Payment summary</h3>
          <dl className="mt-2 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Subtotal</dt>
              <dd className="font-medium">{formatPrice(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Shipping</dt>
              <dd className="font-medium">{formatPrice(order.shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 text-base">
              <dt className="font-semibold text-ink-900">Total</dt>
              <dd className="font-bold text-ink-900">
                {formatPrice(order.total)}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={`/track?order=${order.orderNumber}`}
          className="rounded-xl bg-ink-900 px-6 py-3 font-semibold text-white hover:bg-ink-700"
        >
          Track this order
        </Link>
        <Link
          href="/products"
          className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
