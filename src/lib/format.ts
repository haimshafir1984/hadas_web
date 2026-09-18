export function nis(n: number): string {
  return "₪" + n.toLocaleString("he-IL");
}

export function discountPct(price: number, wasPrice?: number | null): number {
  if (!wasPrice) return 0;
  return Math.round((1 - price / wasPrice) * 100);
}

// Same gradient palette as the prototype's placeholder product images.
export const GRAD: [string, string][] = [
  ["#6D2E9E", "#B06BD8"],
  ["#243B6B", "#5E86C9"],
  ["#8C2F63", "#D177A8"],
  ["#1F6B5B", "#5FB79E"],
  ["#7A4A22", "#C79262"],
];

export function gradientFor(gradientIndex: number | null | undefined, seed: string): [string, string] {
  if (gradientIndex != null) return GRAD[gradientIndex % GRAD.length];
  let hash = 0;
  for (const ch of seed) hash += ch.charCodeAt(0);
  return GRAD[hash % GRAD.length];
}

export const PALETTE = [
  "#F4EFE9",
  "#2B2330",
  "#D8C3B4",
  "#8E9AA8",
  "#C9A3AF",
  "#6D2E9E",
  "#0E8F6F",
  "#E23A5E",
  "#243B6B",
  "#B26A00",
  "#FFFFFF",
  "#7A4A22",
];

const BAND = ["70", "75", "80", "85", "90", "95"];
const CUP = ["B", "C", "D", "DD"];
export const BRA_SIZES: string[] = BAND.flatMap((b) => CUP.map((c) => b + c));
export const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export const SIZE_KITS: Record<string, string> = {
  חזיות: BRA_SIZES.join(","),
  ביגוד: CLOTHING_SIZES.join(","),
  נערות: "XS,S,M,L",
  "מידה אחת": "מידה אחת",
};
