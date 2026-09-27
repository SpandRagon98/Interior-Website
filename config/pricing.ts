export type FinishLevel = "Essential" | "Premium" | "Luxury";

export const pricingConfig = {
  ratePerSqFt: { Essential: 1600, Premium: 2600, Luxury: 4200 } satisfies Record<FinishLevel, number>,
  cityMultiplier: { Kolkata: 0.95, Bengaluru: 1.08, Mumbai: 1.18, "Delhi NCR": 1.12, Pune: 1.04, Hyderabad: 1, Other: 1 },
  additions: { kitchen: 350000, wardrobe: 140000, furniture: 275000, falseCeiling: 115000, flooring: 220000 },
  range: { low: 0.9, high: 1.14 },
} as const;

export type EstimateInput = {
  city: string; propertyType: string; bhk: string; carpetArea: number; rooms: string[];
  kitchen: boolean; wardrobes: number; furniture: boolean; falseCeiling: boolean; flooring: boolean; finishLevel: FinishLevel;
};

export function calculateEstimate(input: EstimateInput) {
  const city = pricingConfig.cityMultiplier[input.city as keyof typeof pricingConfig.cityMultiplier] ?? pricingConfig.cityMultiplier.Other;
  const base = input.carpetArea * pricingConfig.ratePerSqFt[input.finishLevel] * city;
  const extras = (input.kitchen ? pricingConfig.additions.kitchen : 0) +
    input.wardrobes * pricingConfig.additions.wardrobe +
    (input.furniture ? pricingConfig.additions.furniture : 0) +
    (input.falseCeiling ? pricingConfig.additions.falseCeiling : 0) +
    (input.flooring ? pricingConfig.additions.flooring : 0);
  const total = base + extras;
  const round = (value: number) => Math.round(value / 50000) * 50000;
  return { low: round(total * pricingConfig.range.low), high: round(total * pricingConfig.range.high) };
}

export function formatInr(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}
