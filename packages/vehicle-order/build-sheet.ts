/**
 * @file Dealer build-sheet formatting and order summary assembly.
 */

import { OPTION_BY_CODE, TRIM_BY_CODE } from "./catalog";
import { computeVehiclePrice } from "./pricing";

export interface OrderLine {
  code: string;
  price: number;
  qty: number;
}

export interface BuildSheetLine {
  code: string;
  name: string;
  category: string;
  qty: number;
  lineTotal: number;
}

/**
 * Expands each order line into a dealer build-sheet row using the shared
 * option catalog for its display name and category.
 *
 * Every code passed in is expected to be present in OPTION_BY_CODE.
 */
export function formatBuildSheet(lines: OrderLine[]): BuildSheetLine[] {
  return lines.map((line) => {
    const option = OPTION_BY_CODE[line.code];
    return {
      code: line.code,
      name: option.name,
      category: option.category,
      qty: line.qty,
      lineTotal: Math.round(line.price * line.qty * 100) / 100,
    };
  });
}

export interface VehicleOrder {
  trimCode: string;
  lines: OrderLine[];
  state: string;
}

export interface VehicleOrderSummary {
  trim: (typeof TRIM_BY_CODE)[string];
  buildSheet: BuildSheetLine[];
  totals: ReturnType<typeof computeVehiclePrice>;
}

/**
 * Builds a dealer order summary with a formatted build sheet and price totals.
 */
export function buildOrderSummary(order: VehicleOrder): VehicleOrderSummary {
  const totals = computeVehiclePrice(order.trimCode, order.lines, order.state);
  const trim = TRIM_BY_CODE[order.trimCode];
  const buildSheet = formatBuildSheet(order.lines);
  return { trim, buildSheet, totals };
}
