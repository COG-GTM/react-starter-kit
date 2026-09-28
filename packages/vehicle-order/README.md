# Vehicle Order Package

Shared vehicle catalog, order pricing, and build-sheet formatting for Ford
F-150 Lightning dealer orders.

## Usage

```ts
import { buildOrderSummary } from "@repo/vehicle-order";

const order = buildOrderSummary({
  trimCode: "F150L-LARIAT",
  lines: [{ code: "OPT-ER-BATTERY", price: 8500, qty: 1 }],
  state: "MI",
});
```

## API

| Export                                        | Description                                      |
| --------------------------------------------- | ------------------------------------------------ |
| `TRIMS` / `TRIM_BY_CODE`                      | Available vehicle trims and trim-code index.     |
| `OPTIONS` / `OPTION_BY_CODE`                  | Available vehicle options and option-code index. |
| `DESTINATION_FEE` / `STATE_TAX_RATES`         | Destination fee and state sales-tax rates.       |
| `computeVehiclePrice(trimCode, lines, state)` | Calculates vehicle price totals.                 |
| `formatBuildSheet(lines)`                     | Resolves order lines to build-sheet rows.        |
| `buildOrderSummary(order)`                    | Builds the vehicle build sheet and price totals. |
