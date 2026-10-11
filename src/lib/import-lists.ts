import { getSetting, setSetting } from "./site-texts";
import { BRA_SIZES, CLOTHING_SIZES } from "./format";

// The owner-managed option lists that feed the Excel template's dropdowns and the import validation.
export const LIST_DEFS = [
  { key: "brands", label: "מותגים" },
  { key: "fabrics", label: "הרכב בד" },
  { key: "attributes", label: "מאפיינים" },
  { key: "sizesEU", label: "מידות אירופאיות" },
  { key: "sizesUS", label: "מידות אמריקאיות" },
  { key: "sizesSML", label: "מידות SML" },
] as const;

export type ListKey = (typeof LIST_DEFS)[number]["key"];
export type Lists = Record<ListKey, string[]>;

export const SIZE_SYSTEMS = [
  { name: "אירופאיות", key: "sizesEU" as const, step: 5 },
  { name: "אמריקאיות", key: "sizesUS" as const, step: 2 },
  { name: "SML", key: "sizesSML" as const, step: 0 },
];

const US_SIZES = ["32", "34", "36", "38", "40"].flatMap((b) => ["A", "B", "C", "D", "DD"].map((c) => b + c));

export const DEFAULT_LISTS: Lists = {
  brands: [],
  fabrics: ["כותנה", "אלסטן", "פוליאמיד", "מיקרופייבר", "נילון", "תחרה"],
  attributes: ["ללא חישוק", "ריפוד עדין", "פושאפ", "הנקה", "ספורט", "ללא תפרים"],
  sizesEU: BRA_SIZES,
  sizesUS: US_SIZES,
  sizesSML: CLOTHING_SIZES,
};

export async function getLists(): Promise<Lists> {
  try {
    const saved = JSON.parse((await getSetting("import.lists")) || "{}");
    const out = { ...DEFAULT_LISTS };
    for (const d of LIST_DEFS) if (Array.isArray(saved[d.key])) out[d.key] = saved[d.key].map(String);
    return out;
  } catch {
    return DEFAULT_LISTS;
  }
}

export async function saveLists(lists: Partial<Lists>) {
  const clean: Partial<Lists> = {};
  for (const d of LIST_DEFS) {
    const v = lists[d.key];
    if (Array.isArray(v)) clean[d.key] = Array.from(new Set(v.map((x) => String(x).trim()).filter(Boolean)));
  }
  await setSetting("import.lists", JSON.stringify(clean));
}
