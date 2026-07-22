import type { Product, PeptideCategory } from "./types";

export const categories: {
  id: PeptideCategory;
  label: string;
  blurb: string;
}[] = [
  {
    id: "research",
    label: "Research Peptides",
    blurb: "High-purity lyophilized peptides for laboratory research use.",
  },
  {
    id: "cosmetic",
    label: "Cosmetic Peptides",
    blurb: "Topical actives for skincare formulation and study.",
  },
  {
    id: "metabolic",
    label: "Metabolic",
    blurb: "Metabolic-pathway research compounds.",
  },
  {
    id: "recovery",
    label: "Recovery & Repair",
    blurb: "Tissue-repair and recovery research peptides.",
  },
  {
    id: "blends",
    label: "Blends & Stacks",
    blurb: "Pre-formulated research blends for combined study.",
  },
];

export const products: Product[] = [
  {
    id: "pep_bpc157",
    slug: "bpc-157",
    name: "BPC-157",
    category: "recovery",
    sequence: "GEPPPGKPADDAGLV",
    shortDescription: "Body-protection compound studied for tissue repair.",
    description:
      "BPC-157 is a synthetic pentadecapeptide derived from a protein found in gastric juice. Widely used in preclinical research exploring tendon, ligament, and gut-lining repair pathways. Supplied as a lyophilized powder for reconstitution in a laboratory setting.",
    price: 5999,
    cost: 2100,
    sizeMg: 5,
    purity: "≥99%",
    stock: 140,
    supplierId: "sup_aminova",
    tags: ["repair", "popular"],
    accent: "#34d399",
    researchUseOnly: true,
  },
  {
    id: "pep_tb500",
    slug: "tb-500",
    name: "TB-500 (Thymosin β4)",
    category: "recovery",
    sequence: "Ac-SDKPDMAEIEKFDKSKLKKTETQ",
    shortDescription: "Thymosin beta-4 fragment for recovery research.",
    description:
      "TB-500 is a synthetic version of the naturally occurring peptide Thymosin Beta-4. Studied for its role in actin regulation, cell migration, and angiogenesis in wound-healing models. Lyophilized, for research use only.",
    price: 7499,
    cost: 3000,
    sizeMg: 5,
    purity: "≥99%",
    stock: 96,
    supplierId: "sup_apex",
    tags: ["repair"],
    accent: "#22d3ee",
    researchUseOnly: true,
  },
  {
    id: "pep_ghkcu",
    slug: "ghk-cu",
    name: "GHK-Cu (Copper Peptide)",
    category: "cosmetic",
    sequence: "GHK · Cu²⁺",
    shortDescription: "Copper tripeptide for skincare formulation research.",
    description:
      "GHK-Cu is a copper-binding tripeptide studied extensively for skin remodeling, collagen synthesis, and antioxidant activity. A staple active in cosmetic-science research and topical formulation development.",
    price: 4299,
    cost: 1400,
    sizeMg: 50,
    purity: "≥98%",
    stock: 210,
    supplierId: "sup_dermapure",
    tags: ["skincare", "popular"],
    accent: "#60a5fa",
    researchUseOnly: true,
  },
  {
    id: "pep_matrixyl",
    slug: "matrixyl-3000",
    name: "Matrixyl 3000",
    category: "cosmetic",
    sequence: "Pal-GHK + Pal-GQPR",
    shortDescription: "Palmitoyl peptide blend for anti-aging research.",
    description:
      "Matrixyl 3000 combines two matrikine peptides (palmitoyl tripeptide-1 and palmitoyl tetrapeptide-7) studied for their signaling role in extracellular-matrix repair. Popular in cosmetic-formulation research.",
    price: 3899,
    cost: 1250,
    sizeMg: 100,
    purity: "≥97%",
    stock: 175,
    supplierId: "sup_dermapure",
    tags: ["skincare"],
    accent: "#a78bfa",
    researchUseOnly: true,
  },
  {
    id: "pep_semax",
    slug: "semax",
    name: "Semax",
    category: "research",
    sequence: "MEHFPGP",
    shortDescription: "Heptapeptide studied for neuroprotection.",
    description:
      "Semax is a synthetic peptide analog of ACTH(4-10) investigated in cognitive and neuroprotection research models. Supplied lyophilized for laboratory reconstitution.",
    price: 6499,
    cost: 2400,
    sizeMg: 30,
    purity: "≥99%",
    stock: 82,
    supplierId: "sup_aminova",
    tags: ["nootropic"],
    accent: "#f472b6",
    researchUseOnly: true,
  },
  {
    id: "pep_selank",
    slug: "selank",
    name: "Selank",
    category: "research",
    sequence: "TKPRPGP",
    shortDescription: "Anxiolytic-pathway research peptide.",
    description:
      "Selank is a synthetic analog of the endogenous peptide tuftsin, studied for its effects on anxiety, immune modulation, and BDNF expression in research models.",
    price: 6199,
    cost: 2300,
    sizeMg: 30,
    purity: "≥99%",
    stock: 74,
    supplierId: "sup_aminova",
    tags: ["nootropic"],
    accent: "#fb923c",
    researchUseOnly: true,
  },
  {
    id: "pep_ipamorelin",
    slug: "ipamorelin",
    name: "Ipamorelin",
    category: "metabolic",
    sequence: "Aib-His-D-2-Nal-D-Phe-Lys-NH₂",
    shortDescription: "Selective GH-secretagogue research peptide.",
    description:
      "Ipamorelin is a pentapeptide studied as a selective growth-hormone secretagogue in metabolic and endocrine research. Known in the literature for its selectivity profile. Research use only.",
    price: 5499,
    cost: 1900,
    sizeMg: 5,
    purity: "≥99%",
    stock: 118,
    supplierId: "sup_helix",
    tags: ["metabolic", "popular"],
    accent: "#facc15",
    researchUseOnly: true,
  },
  {
    id: "pep_cjc1295",
    slug: "cjc-1295-dac",
    name: "CJC-1295 DAC",
    category: "metabolic",
    sequence: "Mod. GRF(1-29) + DAC",
    shortDescription: "Long-acting GHRH analog for research.",
    description:
      "CJC-1295 with DAC is a synthetic GHRH analog with an extended half-life, studied in endocrine-signaling and metabolic research. Lyophilized powder, research use only.",
    price: 6999,
    cost: 2600,
    sizeMg: 5,
    purity: "≥99%",
    stock: 90,
    supplierId: "sup_helix",
    tags: ["metabolic"],
    accent: "#f59e0b",
    researchUseOnly: true,
  },
  {
    id: "pep_glow",
    slug: "glow-blend",
    name: "GLOW Research Blend",
    category: "blends",
    sequence: "BPC-157 + TB-500 + GHK-Cu",
    shortDescription: "Combined repair & skin research stack.",
    description:
      "A pre-formulated research blend combining BPC-157, TB-500, and GHK-Cu, offered for combined tissue-repair and skin-remodeling study. Reconstitute in a laboratory setting; research use only.",
    price: 12999,
    cost: 5200,
    sizeMg: 60,
    purity: "≥99%",
    stock: 48,
    supplierId: "sup_apex",
    tags: ["blend", "popular"],
    accent: "#2dd4bf",
    researchUseOnly: true,
  },
  {
    id: "pep_wolverine",
    slug: "recovery-stack",
    name: "Recovery Research Stack",
    category: "blends",
    sequence: "BPC-157 + TB-500",
    shortDescription: "Dual repair-pathway research blend.",
    description:
      "The Recovery Research Stack pairs BPC-157 and TB-500 in a single vial for combined tissue-repair research. Lyophilized; research use only.",
    price: 10999,
    cost: 4300,
    sizeMg: 20,
    purity: "≥99%",
    stock: 60,
    supplierId: "sup_apex",
    tags: ["blend"],
    accent: "#4ade80",
    researchUseOnly: true,
  },
  {
    id: "pep_pt141",
    slug: "pt-141",
    name: "PT-141 (Bremelanotide)",
    category: "research",
    sequence: "Ac-Nle-cyclo(Asp-His-D-Phe-Arg-Trp-Lys)",
    shortDescription: "Melanocortin-pathway research peptide.",
    description:
      "PT-141 is a melanocortin-receptor agonist studied in neuroscience and physiology research. Supplied lyophilized for research use only.",
    price: 5799,
    cost: 2200,
    sizeMg: 10,
    purity: "≥99%",
    stock: 70,
    supplierId: "sup_helix",
    tags: ["research"],
    accent: "#e879f9",
    researchUseOnly: true,
  },
  {
    id: "pep_argireline",
    slug: "argireline",
    name: "Argireline (Acetyl Hexapeptide-8)",
    category: "cosmetic",
    sequence: "Ac-EEMQRR-NH₂",
    shortDescription: "Expression-line cosmetic research peptide.",
    description:
      "Argireline is an acetyl hexapeptide studied for its effect on catecholamine release and expression lines in cosmetic-science research. A widely used topical active in formulation studies.",
    price: 3599,
    cost: 1100,
    sizeMg: 100,
    purity: "≥98%",
    stock: 190,
    supplierId: "sup_dermapure",
    tags: ["skincare"],
    accent: "#38bdf8",
    researchUseOnly: true,
  },
];

const productBySlug = new Map(products.map((p) => [p.slug, p]));
const productById = new Map(products.map((p) => [p.id, p]));

export function getProductBySlug(slug: string): Product | undefined {
  return productBySlug.get(slug);
}

export function getProductById(id: string): Product | undefined {
  return productById.get(id);
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
