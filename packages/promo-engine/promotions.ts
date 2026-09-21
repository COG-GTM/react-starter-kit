export type PromoType = "percent" | "fixed" | "shipping";

export interface PromoRule {
  code: string;
  type: PromoType;
  value: number;
  label: string;
  minSubtotal?: number;
  stackable: boolean;
}

export const PROMO_RULES: Record<string, PromoRule> = {
  GAP40: {
    code: "GAP40",
    type: "percent",
    value: 40,
    label: "40% off your purchase",
    stackable: false,
  },
  DENIM25: {
    code: "DENIM25",
    type: "percent",
    value: 25,
    label: "25% off denim",
    stackable: true,
  },
  SHIPFREE: {
    code: "SHIPFREE",
    type: "shipping",
    value: 0,
    label: "Free shipping",
    minSubtotal: 50,
    stackable: true,
  },
  WELCOME10: {
    code: "WELCOME10",
    type: "fixed",
    value: 10,
    label: "$10 off your first order",
    stackable: true,
  },
};

export interface AppliedPromo {
  code: string;
  label: string;
  amount: number;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Resolves each code against PROMO_RULES and computes its discount. Every code passed in is expected to exist in PROMO_RULES.
 */
export function applyPromoCodes(
  codes: string[],
  subtotal: number,
): AppliedPromo[] {
  return codes.map((code) => {
    const rule = PROMO_RULES[code];
    switch (rule.type) {
      case "percent":
        return {
          code,
          label: rule.label,
          amount: round((subtotal * rule.value) / 100),
        };
      case "fixed":
        return {
          code,
          label: rule.label,
          amount: Math.min(rule.value, subtotal),
        };
      case "shipping":
        return { code, label: rule.label, amount: 0 };
    }
  });
}
