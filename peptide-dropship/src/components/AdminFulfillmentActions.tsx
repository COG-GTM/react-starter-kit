"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FulfillmentStatus } from "@/lib/types";

interface Props {
  orderNumber: string;
  supplierId: string;
  status: FulfillmentStatus;
}

export function AdminFulfillmentActions({
  orderNumber,
  supplierId,
  status,
}: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const terminal = status === "DELIVERED" || status === "CANCELLED";

  async function send(body: Record<string, unknown>) {
    setBusy(true);
    try {
      await fetch(`/api/orders/${orderNumber}/fulfillments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supplierId, ...body }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        disabled={busy || terminal}
        onClick={() => send({ action: "advance" })}
        className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-40"
      >
        Advance status
      </button>
      <button
        type="button"
        disabled={busy || status === "CANCELLED"}
        onClick={() => send({ status: "CANCELLED" })}
        className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-40"
      >
        Cancel
      </button>
    </div>
  );
}
