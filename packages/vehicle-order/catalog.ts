/**
 * @file Canonical Ford F-150 Lightning trim, option, and tax catalog.
 */

export interface VehicleTrim {
  code: string;
  name: string;
  msrp: number;
}

export interface VehicleOption {
  code: string;
  name: string;
  category: string;
  price: number;
}

export const TRIMS: VehicleTrim[] = [
  { code: "F150L-PRO", name: "F-150 Lightning Pro", msrp: 54780 },
  { code: "F150L-XLT", name: "F-150 Lightning XLT", msrp: 64995 },
  { code: "F150L-FLASH", name: "F-150 Lightning Flash", msrp: 69995 },
  { code: "F150L-LARIAT", name: "F-150 Lightning Lariat", msrp: 77495 },
  { code: "F150L-PLATINUM", name: "F-150 Lightning Platinum", msrp: 84995 },
];

export const TRIM_BY_CODE: Record<string, VehicleTrim> = Object.fromEntries(
  TRIMS.map((trim) => [trim.code, trim]),
);

export const OPTIONS: VehicleOption[] = [
  {
    code: "OPT-ER-BATTERY",
    name: "Extended Range Battery",
    category: "powertrain",
    price: 8500,
  },
  {
    code: "OPT-MAXTOW",
    name: "Max Trailer Tow Package",
    category: "towing",
    price: 1100,
  },
  {
    code: "OPT-BLUECRUISE",
    name: "BlueCruise 3-Year Plan",
    category: "technology",
    price: 2495,
  },
  {
    code: "OPT-CHARGE-PRO",
    name: "Ford Charge Station Pro (80A)",
    category: "charging",
    price: 1310,
  },
  {
    code: "OPT-SPRAY-LINER",
    name: "Spray-In Bedliner",
    category: "accessories",
    price: 595,
  },
  {
    code: "OPT-PAINT-AGATE",
    name: "Agate Black Metallic",
    category: "paint",
    price: 495,
  },
];

export const OPTION_BY_CODE: Record<string, VehicleOption> = Object.fromEntries(
  OPTIONS.map((option) => [option.code, option]),
);

export const DESTINATION_FEE = 2095;

export const STATE_TAX_RATES: Record<string, number> = {
  MI: 0.06,
  CA: 0.0725,
  TX: 0.0625,
  FL: 0.06,
  NY: 0.04,
  OH: 0.0575,
};
