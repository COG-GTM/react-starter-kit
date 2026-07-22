import type { FulfillmentStatus } from "@/lib/types";
import { STATUS_CLASS, STATUS_LABEL } from "@/lib/status";

export function StatusBadge({ status }: { status: FulfillmentStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${STATUS_CLASS[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
