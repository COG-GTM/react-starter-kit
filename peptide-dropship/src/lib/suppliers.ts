import type { Supplier } from "./types";

export const suppliers: Supplier[] = [
  {
    id: "sup_helix",
    name: "Helix Biolabs",
    country: "USA",
    leadTimeDays: 2,
    rating: 4.8,
    specialties: ["research", "metabolic"],
  },
  {
    id: "sup_aminova",
    name: "Aminova Peptide Co.",
    country: "Germany",
    leadTimeDays: 5,
    rating: 4.6,
    specialties: ["research", "recovery", "blends"],
  },
  {
    id: "sup_dermapure",
    name: "DermaPure Labs",
    country: "South Korea",
    leadTimeDays: 6,
    rating: 4.7,
    specialties: ["cosmetic"],
  },
  {
    id: "sup_apex",
    name: "Apex Research Supply",
    country: "USA",
    leadTimeDays: 3,
    rating: 4.5,
    specialties: ["recovery", "metabolic", "blends"],
  },
];

const supplierMap = new Map(suppliers.map((s) => [s.id, s]));

export function getSupplier(id: string): Supplier | undefined {
  return supplierMap.get(id);
}
