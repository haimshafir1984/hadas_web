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

// Hebrew names for the palette so colors can be typed in Excel ("שחור; שמנת").
export const COLOR_NAMES: Record<string, string> = {
  שמנת: "#F4EFE9",
  קרם: "#F4EFE9",
  שחור: "#2B2330",
  בז: "#D8C3B4",
  "בז'": "#D8C3B4",
  עור: "#D8C3B4",
  אפור: "#8E9AA8",
  "ורוד עתיק": "#C9A3AF",
  ורוד: "#C9A3AF",
  סגול: "#6D2E9E",
  ירוק: "#0E8F6F",
  אדום: "#E23A5E",
  כחול: "#243B6B",
  נייבי: "#243B6B",
  חרדל: "#B26A00",
  כתום: "#B26A00",
  לבן: "#FFFFFF",
  חום: "#7A4A22",
};

// Names shown to the owner (one canonical name per palette color).
export const PALETTE_NAMES: Record<string, string> = {
  "#F4EFE9": "שמנת",
  "#2B2330": "שחור",
  "#D8C3B4": "בז'",
  "#8E9AA8": "אפור",
  "#C9A3AF": "ורוד עתיק",
  "#6D2E9E": "סגול",
  "#0E8F6F": "ירוק",
  "#E23A5E": "אדום",
  "#243B6B": "כחול",
  "#B26A00": "חרדל",
  "#FFFFFF": "לבן",
  "#7A4A22": "חום",
};
