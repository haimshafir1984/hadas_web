import { CUSTOM_ICONS } from "@/lib/custom-icons.generated";

const PATHS: Record<string, string[]> = {
  wing: [
    "M24 12v26",
    "M24 19c-6-11-17-9-15 0s11 9 15 4",
    "M24 19c6-11 17-9 15 0s-11 9-15 4",
    "M22 12c-2-4-4-5-7-5",
    "M26 12c2-4 4-5 7-5",
  ],
  bra: [
    "M14 6c-1 6-2 10-4 14",
    "M34 6c1 6 2 10 4 14",
    "M10 20c0 10 6 15 14 12",
    "M38 20c0 10-6 15-14 12",
    "M10 20c5 3 9 3 14 0c5 3 9 3 14 0",
  ],
  brief: [
    "M7 14c11 4 23 4 34 0",
    "M7 14c2 11 8 19 17 21c9-2 15-10 17-21",
    "M20 35c2-4 6-4 8 0",
  ],
  camisole: [
    "M17 6c0 7 1 9-3 13c-2 2-2 6-1 10l-1 13h24l-1-13c1-4 1-8-1-10c-4-4-3-6-3-13",
    "M17 6c2 5 12 5 14 0",
  ],
  shape: [
    "M12 8h24",
    "M12 8c-2 10 3 14 3 21s-3 8-3 12h24c0-4-3-5-3-12s5-11 3-21",
    "M20 41c1-4 7-4 8 0",
  ],
  robe: [
    "M16 6l8 9 8-9",
    "M16 6L7 15v25h12V24",
    "M32 6l9 9v25H29V24",
    "M19 30h10",
  ],
  skirt: ["M15 8h18", "M15 8L8 40h32L33 8", "M24 8c-1 10-1 20 0 32"],
  blouse: [
    "M18 6L7 12l4 9 5-3v22h16V18l5 3 4-9L30 6c-1 4-3 6-6 6s-5-2-6-6",
  ],
  moon: ["M30 8a16 16 0 1 0 10 22 13 13 0 0 1-10-22z", "M36 8v6M33 11h6"],
  swim: [
    "M6 32c4-4 8-4 12 0s8 4 12 0 8-4 12 0",
    "M6 40c4-4 8-4 12 0s8 4 12 0 8-4 12 0",
    "M16 22a8 8 0 0 1 16 0",
    "M24 8v6",
  ],
  drop: ["M24 6c8 10 12 16 12 22a12 12 0 0 1-24 0c0-6 4-12 12-22z", "M18 30c0 4 3 6 6 6"],
  heart: ["M24 40C10 30 6 22 10 15c3-5 10-4 14 2c4-6 11-7 14-2c4 7 0 15-14 25z"],
  bolt: ["M28 6L14 26h10l-4 16 16-22H26z"],
  scarf: [
    "M10 34c0-14 6-22 14-22s14 8 14 22",
    "M10 34c6 6 22 6 28 0",
    "M24 12c-2-4-2-6 0-8",
  ],
  sparkle: ["M24 6l3 10 10 3-10 3-3 10-3-10-10-3 10-3z", "M38 32l1.5 4.5L44 38l-4.5 1.5L38 44l-1.5-4.5L32 38l4.5-1.5z"],
  sun: ["M24 16a8 8 0 1 0 0 16 8 8 0 0 0 0-16z", "M24 4v6M24 38v6M4 24h6M38 24h6M10 10l4 4M34 34l4 4M38 10l-4 4M14 34l-4 4"],
  book: ["M8 10c6-2 12-2 16 2v28c-4-4-10-4-16-2z", "M40 10c-6-2-12-2-16 2v28c4-4 10-4 16-2z"],
};

const KEYWORDS: [RegExp, string][] = [
  [/הנקה|לידה/, "heart"],
  [/חזי|בייסיק|מרופד|מינימייזר|פושאפ|מתחיל|סטים|אביזר/, "bra"],
  [/מחטב/, "shape"],
  [/תחתון|קומבניזון|תחתית/, "brief"],
  [/גופי|בייבידול|חולצ/, "camisole"],
  [/חלוק/, "robe"],
  [/חצאי/, "skirt"],
  [/כותונת|פיג/, "moon"],
  [/מחזור|כותנה|דורינה|ליליבלום/, "drop"],
  [/ים|בריכה|שלם/, "swim"],
  [/מגבות|מטפחת/, "scarf"],
  [/ספורט/, "bolt"],
  [/כלות|אירוע/, "sparkle"],
  [/גיל המעבר/, "sun"],
  [/נערות/, "wing"],
  [/מדריך/, "book"],
];

export function iconFor(name: string): string {
  for (const [re, icon] of KEYWORDS) if (re.test(name)) return icon;
  return "wing";
}

export default function LineIcon({ name, size = 48, iconUrl }: { name: string; size?: number; iconUrl?: string | null }) {
  const key = iconFor(name);
  // Priority: icon uploaded in admin for this subcategory > file in public/icons (exact name, then built-in key) > built-in drawing.
  const custom = iconUrl || CUSTOM_ICONS[name.normalize("NFC")] || CUSTOM_ICONS[key];
  if (custom) {
    // Shown with its own colors. mix-blend-mode: multiply makes a white background (e.g. a JPG) vanish.
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img className="line-icon-img" src={custom} alt="" width={size} height={size} aria-hidden="true" />
    );
  }
  const paths = PATHS[key] ?? PATHS.wing;
  return (
    <svg
      className="line-icon"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths.map((d, i) => (
        <path key={i} d={d} pathLength={1} style={{ animationDelay: `${i * 0.12}s` }} />
      ))}
    </svg>
  );
}
