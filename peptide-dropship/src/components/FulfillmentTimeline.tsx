import type { OrderFulfillment } from "@/lib/types";
import { STATUS_LABEL, STATUS_STEPS } from "@/lib/status";
import { formatPrice } from "@/lib/products";

export function FulfillmentTimeline({
  fulfillment,
}: {
  fulfillment: OrderFulfillment;
}) {
  const cancelled = fulfillment.status === "CANCELLED";
  const currentIndex = STATUS_STEPS.indexOf(fulfillment.status);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-semibold text-ink-900">
            Shipment · {fulfillment.supplierName}
          </h3>
          <p className="text-sm text-slate-500">
            {fulfillment.items.length} item
            {fulfillment.items.length === 1 ? "" : "s"} · ETA ~
            {fulfillment.estimatedDeliveryDays} days
          </p>
        </div>
        {fulfillment.trackingNumber && (
          <div className="text-right">
            <p className="text-xs text-slate-400">{fulfillment.carrier}</p>
            <p className="font-mono text-sm font-semibold text-ink-900">
              {fulfillment.trackingNumber}
            </p>
          </div>
        )}
      </div>

      {cancelled ? (
        <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm font-medium text-rose-700">
          This shipment was cancelled.
        </p>
      ) : (
        <ol className="mt-6 flex items-center">
          {STATUS_STEPS.map((step, i) => {
            const done = i <= currentIndex;
            const active = i === currentIndex;
            return (
              <li
                key={step}
                className="flex flex-1 items-center last:flex-none"
              >
                <div className="flex flex-col items-center">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                      done
                        ? "bg-brand-600 text-white"
                        : "bg-slate-100 text-slate-400"
                    } ${active ? "ring-4 ring-brand-100" : ""}`}
                  >
                    {done ? "✓" : i + 1}
                  </span>
                  <span
                    className={`mt-2 w-20 text-center text-[11px] ${
                      done ? "text-ink-900" : "text-slate-400"
                    }`}
                  >
                    {STATUS_LABEL[step]}
                  </span>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 ${
                      i < currentIndex ? "bg-brand-600" : "bg-slate-200"
                    }`}
                  />
                )}
              </li>
            );
          })}
        </ol>
      )}

      <ul className="mt-6 divide-y divide-slate-100 border-t border-slate-100">
        {fulfillment.items.map((item) => (
          <li
            key={item.productId}
            className="flex justify-between py-2 text-sm"
          >
            <span className="text-slate-600">
              {item.name} × {item.quantity}
            </span>
            <span className="font-medium text-ink-900">
              {formatPrice(item.unitPrice * item.quantity)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
