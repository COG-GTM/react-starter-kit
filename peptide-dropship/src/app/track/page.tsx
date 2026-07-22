"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Order } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { FulfillmentTimeline } from "@/components/FulfillmentTimeline";

function TrackInner() {
  const searchParams = useSearchParams();
  const [value, setValue] = useState(() => searchParams.get("order") ?? "");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookup = useCallback(async (orderNumber: string) => {
    const trimmed = orderNumber.trim().toUpperCase();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setOrder(null);
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Order not found");
      setOrder(data.order as Order);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Order not found");
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-load when arriving via ?order=. State is only ever set inside the
  // async callbacks (never synchronously in the effect body).
  useEffect(() => {
    const initial = searchParams.get("order")?.trim().toUpperCase();
    if (!initial) return;
    let active = true;
    fetch(`/api/orders/${encodeURIComponent(initial)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!active) return;
        if (!res.ok) setError(data.error ?? "Order not found");
        else setOrder(data.order as Order);
      })
      .catch(() => {
        if (active) setError("Order not found");
      });
    return () => {
      active = false;
    };
  }, [searchParams]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink-900">Track your order</h1>
      <p className="mt-2 text-slate-500">
        Enter your order number (e.g.{" "}
        <span className="font-mono">PEP-123456</span>) to see live shipment
        status.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          lookup(value);
        }}
        className="mt-6 flex gap-3"
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="PEP-123456"
          className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-mono outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? "Looking…" : "Track"}
        </button>
      </form>

      {error && (
        <p className="mt-6 rounded-lg bg-rose-50 p-4 text-sm text-rose-700 ring-1 ring-rose-200">
          {error}
        </p>
      )}

      {order && (
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-ink-900">
                {order.orderNumber}
              </h2>
              <p className="text-sm text-slate-500">
                Placed {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <StatusBadge status={order.status} />
          </div>
          <div className="mt-4 space-y-4">
            {order.fulfillments.map((f) => (
              <FulfillmentTimeline key={f.supplierId} fulfillment={f} />
            ))}
          </div>
          <Link
            href={`/order/${order.orderNumber}`}
            className="mt-6 inline-block text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            View full order details →
          </Link>
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-12 text-slate-500">
          Loading…
        </div>
      }
    >
      <TrackInner />
    </Suspense>
  );
}
