/**
 * @file Vehicle order price, incentive, and tax calculations.
 */

import { DESTINATION_FEE, STATE_TAX_RATES, TRIM_BY_CODE } from "./catalog";
import type { OrderLine } from "./build-sheet";

export interface VehicleTotals {
  msrp: number;
  options: number;
  incentives: number;
  destination: number;
  subtotal: number;
  tax: number;
  total: number;
  currency: "USD";
}

function round2(amount: number): number {
  return Math.round(amount * 100) / 100;
}

/**
 * Computes vehicle, option, incentive, destination, and state tax totals.
 */
export function computeVehiclePrice(
  trimCode: string,
  lines: OrderLine[],
  state: string,
): VehicleTotals {
  const trim = TRIM_BY_CODE[trimCode];
  if (!trim) {
    throw new Error(`Unknown trim code: ${trimCode}`);
  }

  const options = lines.reduce(
    (sum, line) => sum + (line.price > 0 ? line.price * line.qty : 0),
    0,
  );
  const incentives = lines.reduce(
    (sum, line) => sum + (line.price < 0 ? line.price * line.qty : 0),
    0,
  );
  const subtotal = round2(trim.msrp + options + incentives + DESTINATION_FEE);
  const taxRate = STATE_TAX_RATES[state] ?? 0.06;
  const tax = round2(subtotal * taxRate);

  return {
    msrp: trim.msrp,
    options: round2(options),
    incentives: round2(incentives),
    destination: DESTINATION_FEE,
    subtotal,
    tax,
    total: round2(subtotal + tax),
    currency: "USD",
  };
}
