import Link from "next/link";
import { listOrders } from "@/lib/order-store";
import { formatPrice, products } from "@/lib/products";
import { suppliers } from "@/lib/suppliers";
import { StatusBadge } from "@/components/StatusBadge";
import { AdminFulfillmentActions } from "@/components/AdminFulfillmentActions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin — PeptixLabs",
};

export default async function AdminPage() {
  const orders = await listOrders();

  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  const cost = orders.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.unitCost * i.quantity, 0),
    0,
  );
  const pendingFulfillments = orders.reduce(
    (sum, o) =>
      sum +
      o.fulfillments.filter(
        (f) => f.status !== "DELIVERED" && f.status !== "CANCELLED",
      ).length,
    0,
  );
  const margin =
    revenue > 0 ? Math.round(((revenue - cost) / revenue) * 100) : 0;

  const stats = [
    { label: "Orders", value: String(orders.length) },
    { label: "Revenue", value: formatPrice(revenue) },
    { label: "Gross margin", value: `${margin}%` },
    { label: "Open shipments", value: String(pendingFulfillments) },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-ink-900">Admin dashboard</h1>
          <p className="mt-1 text-slate-500">
            Manage dropship orders, supplier fulfillment, and inventory.
          </p>
        </div>
        <Link
          href="/products"
          className="text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          View storefront →
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-ink-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Orders */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-ink-900">Orders</h2>
        {orders.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            No orders yet. Place one from the{" "}
            <Link href="/products" className="text-brand-600 underline">
              storefront
            </Link>{" "}
            to see it here.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <Link
                      href={`/order/${order.orderNumber}`}
                      className="font-mono font-semibold text-ink-900 hover:text-brand-600"
                    >
                      {order.orderNumber}
                    </Link>
                    <p className="text-sm text-slate-500">
                      {order.customer.name} · {order.customer.email} ·{" "}
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-ink-900">
                      {formatPrice(order.total)}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                </div>

                <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                  {order.fulfillments.map((f) => (
                    <div
                      key={f.supplierId}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-ink-900">
                          {f.supplierName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {f.items
                            .map((i) => `${i.name} ×${i.quantity}`)
                            .join(", ")}
                        </p>
                        {f.trackingNumber && (
                          <p className="mt-1 font-mono text-xs text-slate-500">
                            {f.carrier} · {f.trackingNumber}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={f.status} />
                        <AdminFulfillmentActions
                          orderNumber={order.orderNumber}
                          supplierId={f.supplierId}
                          status={f.status}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Inventory */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-ink-900">Inventory & margins</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Supplier</th>
                <th className="px-4 py-3">Cost</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Margin</th>
                <th className="px-4 py-3">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => {
                const supplier = suppliers.find((s) => s.id === p.supplierId);
                const m = Math.round(((p.price - p.cost) / p.price) * 100);
                return (
                  <tr key={p.id}>
                    <td className="px-4 py-3 font-medium text-ink-900">
                      {p.name}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {supplier?.name}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatPrice(p.cost)}
                    </td>
                    <td className="px-4 py-3 text-ink-900">
                      {formatPrice(p.price)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-emerald-600">
                        {m}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          p.stock < 60
                            ? "font-semibold text-amber-600"
                            : "text-slate-600"
                        }
                      >
                        {p.stock}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
