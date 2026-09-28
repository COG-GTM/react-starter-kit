/**
 * @file vehicle-order package entrypoint.
 *
 * Shared vehicle catalog, pricing, and build-sheet formatting for Ford
 * F-150 Lightning dealer orders.
 */

export {
  OPTIONS,
  OPTION_BY_CODE,
  TRIMS,
  TRIM_BY_CODE,
  DESTINATION_FEE,
  STATE_TAX_RATES,
} from "./catalog";
export type { VehicleOption, VehicleTrim } from "./catalog";

export { computeVehiclePrice } from "./pricing";
export type { VehicleTotals } from "./pricing";

export { buildOrderSummary, formatBuildSheet } from "./build-sheet";
export type {
  BuildSheetLine,
  OrderLine,
  VehicleOrder,
  VehicleOrderSummary,
} from "./build-sheet";
